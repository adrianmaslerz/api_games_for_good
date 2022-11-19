import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ErrorMessages } from '../../core/enums/error-messages.enum';
import { InputLoginDto } from '../../modules/auth/dto/input.login.dto';
import { InputRefreshTokenDto } from './dto/input.refresh-token.dto';
import { RefreshTokenEntity } from '../../modules/auth/entity/refresh-token.entity';
import { UserEntity } from '../../modules/user/entity/user.entity';
import { hashPassword } from '../../core/utils/utils';
import { InputRegisterDto } from './dto/input.register.dto';
import { InputEmailDto } from './dto/input.email.dto';
import { InputSetPasswordDto } from './dto/input.set-password.dto';
import { PasswordTokenEntity } from './entity/password-token.entity';
import { IEnvironments } from '../../config/environments';
import { ConfigService } from '@nestjs/config';
import * as ms from 'ms';
import { addMilliseconds } from 'date-fns';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InputTokenDto } from '../../core/dto/input.token.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import { Roles } from '../../core/enums/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: EntityRepository<RefreshTokenEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,
    @InjectRepository(PasswordTokenEntity)
    private readonly passwordTokenRepository: EntityRepository<PasswordTokenEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<IEnvironments>,
    private readonly http: HttpService,
  ) {}

  public async isRegistered(data: InputEmailDto): Promise<boolean> {
    const user = await this.userRepository.findOne({
      email: data.email,
      password: { $ne: null },
    });
    if (!user) {
      await this.userRepository
        .persistAndFlush(this.userRepository.create(data))
        .catch((err) => {});
    }
    return !!user;
  }

  public async login(data: InputLoginDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      email: data.email,
      password: hashPassword(data.password),
    });
    if (!user) {
      throw new BadRequestException(ErrorMessages.BAD_CREDENTIALS);
    }
    return user;
  }

  public async register(data: InputRegisterDto): Promise<UserEntity> {
    let user = await this.userRepository
      .createQueryBuilder('user')
      .where({ email: data.email })
      .getSingleResult();
    if (user && user.password) {
      throw new BadRequestException(ErrorMessages.USER_EXISTS);
    }
    if (user) {
      user.password = data.password;
    } else {
      user = this.userRepository.create(data);
      this.userRepository.persist(user);
    }
    await this.userRepository.flush();
    return user;
  }

  public async loginGoogle(data: InputTokenDto): Promise<UserEntity> {
    const email = await this.getGoogleAuthData(data.token);
    let user = await this.userRepository
      .createQueryBuilder('user')
      .where({ email })
      .getSingleResult();
    if (user) {
      return user;
    }
    user = this.userRepository.create({ email, role: Roles.USER });
    this.userRepository.persist(user);
    await this.userRepository.flush();
    return user;
  }

  public async getGoogleAuthData(token: string) {
    return firstValueFrom(
      this.http
        .get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`)
        .pipe(map((res) => res.data.email)),
    );
  }

  public async createRefreshToken(user: UserEntity): Promise<string> {
    const refreshToken = this.refreshTokenRepository.create(
      new RefreshTokenEntity({
        user,
        token: this.jwtService.sign(
          { id: user.id },
          { expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME') },
        ),
      }),
    );
    await this.refreshTokenRepository.persistAndFlush(refreshToken);
    return refreshToken.token;
  }

  public async refreshToken(
    data: InputRefreshTokenDto,
    validate = true,
  ): Promise<UserEntity> {
    if (validate) {
      try {
        this.jwtService.verify(data.refreshToken);
      } catch (err) {
        throw new BadRequestException(ErrorMessages.TOKEN_EXPIRED);
      }
    }
    const decoded: any = this.jwtService.decode(data.refreshToken);
    const refreshToken = await this.refreshTokenRepository.findOne({
      user: { id: decoded.id },
      token: data.refreshToken,
    });
    if (!refreshToken) {
      throw new BadRequestException(ErrorMessages.TOKEN_NOT_FOUND);
    }
    this.refreshTokenRepository.removeAndFlush(refreshToken);
    return refreshToken.user;
  }

  public async forgotPassword(data: InputEmailDto): Promise<boolean> {
    const user = await this.userRepository.findOne({ email: data.email });
    if (user) {
      await this.passwordTokenRepository.nativeDelete({
        user: { id: user.id },
      });
      const token = this.jwtService.sign(
        { id: user.id },
        { expiresIn: '1 day' },
      );
      await this.passwordTokenRepository.persistAndFlush(
        new PasswordTokenEntity({ user, token }),
      );
      // await this.emailService.resetPassword(user.email, { 'reset-link': this.configService.get('FORGOT_PASSWORD_URL') + token });
    }
    return true;
  }

  public async setPassword(data: InputSetPasswordDto): Promise<boolean> {
    try {
      this.jwtService.verify(data.token);
    } catch (err) {
      throw new BadRequestException(
        ErrorMessages.FORGOT_PASSWORD_TOKEN_EXPIRED,
      );
    }
    const passwordToken = await this.passwordTokenRepository.findOne(
      { token: data.token },
      { populate: ['user'] },
    );
    if (!passwordToken) {
      throw new BadRequestException(
        ErrorMessages.FORGOT_PASSWORD_TOKEN_NOT_FOUND,
      );
    }
    await this.passwordTokenRepository.nativeDelete({
      user: passwordToken.user,
    });
    passwordToken.user.password = data.password;
    await this.userRepository.persistAndFlush(passwordToken.user);
    return true;
  }

  public async logout(data: InputRefreshTokenDto): Promise<boolean> {
    const token = await this.refreshTokenRepository.findOne({
      token: data.refreshToken,
    });
    if (token) {
      this.refreshTokenRepository.removeAndFlush(token);
    }
    return true;
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  public async removeStaleTokens() {
    await this.refreshTokenRepository.nativeDelete({
      createdAt: {
        $lt: addMilliseconds(
          new Date(),
          -ms(this.configService.get('JWT_REFRESH_EXPIRATION_TIME')),
        ),
      },
    });
  }
}
