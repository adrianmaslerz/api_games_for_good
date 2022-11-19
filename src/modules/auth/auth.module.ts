import { Module, OnModuleInit } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IEnvironments } from '../../config/environments';
import { RefreshTokenEntity } from './entity/refresh-token.entity';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '../../modules/auth/auth.controller';
import { AuthService } from '../../modules/auth/auth.service';
import { UserModule } from '../../modules/user/user.module';
import { PasswordTokenEntity } from './entity/password-token.entity';
// import { EmailService } from '../../core/services/email.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserEntity } from '../user/entity/user.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    MikroOrmModule.forFeature([
      RefreshTokenEntity,
      UserEntity,
      PasswordTokenEntity,
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<IEnvironments>) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION_TIME'),
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
