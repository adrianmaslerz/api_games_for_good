import { Controller, Post, Body } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserEntity } from '../../modules/user/entity/user.entity';
import { InputLoginDto } from '../../modules/auth/dto/input.login.dto';
import { InputRefreshTokenDto } from '../../modules/auth/dto/input.refresh-token.dto';
import { OutputAuthTokensDto } from '../../modules/auth/dto/output.auth-token.dto';
import { InputRegisterDto } from './dto/input.register.dto';
import { InputEmailDto } from './dto/input.email.dto';
import { InputSetPasswordDto } from './dto/input.set-password.dto';
import { InputTokenDto } from 'src/core/dto/input.token.dto';
import { OutputUserDto } from '../user/dto/output.user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly jwtService: JwtService, private readonly authService: AuthService) {}

  private async generateAuthTokenResponse(user: UserEntity): Promise<OutputAuthTokensDto> {
    const token: string = this.jwtService.sign(user.toPlain());
    const refreshToken: string = await this.authService.createRefreshToken(user);
    return { user: user.toPlain() as any, token, refreshToken };
  }

  @Post('is-registered')
  @ApiOperation({ description: 'Checks if user exists, saves email in the database' })
  @ApiCreatedResponse({ description: 'Result', type: Boolean })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  public async isRegistered(@Body() data: InputEmailDto): Promise<boolean> {
    return this.authService.isRegistered(data);
  }

  @Post('login')
  @ApiOperation({ description: 'Login' })
  @ApiCreatedResponse({ description: 'Object returned.', type: OutputAuthTokensDto })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  public async login(@Body() data: InputLoginDto): Promise<OutputAuthTokensDto> {
    const user: UserEntity = await this.authService.login(data);
    return this.generateAuthTokenResponse(user);
  }

  @Post('logout')
  @ApiOperation({ description: 'Logout' })
  @ApiCreatedResponse({ description: 'Object returned.', type: Boolean })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  public async logout(@Body() data: InputRefreshTokenDto): Promise<boolean> {
    await this.authService.logout(data);
    return true;
  }

  @Post('register')
  @ApiOperation({ description: 'Register' })
  @ApiCreatedResponse({
    description: 'Object returned.',
    type: OutputAuthTokensDto,
  })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  public async register(@Body() data: InputRegisterDto): Promise<OutputAuthTokensDto> {
    const user = await this.authService.register(data);
    return this.generateAuthTokenResponse(user);
  }

  @Post('login/google')
  @ApiOperation({ description: 'Register' })
  @ApiCreatedResponse({
    description: 'Object returned.',
    type: OutputAuthTokensDto,
  })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  public async loginGoogle(@Body() data: InputTokenDto): Promise<OutputAuthTokensDto> {
    const user = await this.authService.loginGoogle(data);
    return this.generateAuthTokenResponse(user);
  }

  @Post('refresh-token')
  @ApiCreatedResponse({ description: 'Refresh token' })
  @ApiOkResponse({
    description: 'Object returned.',
    type: OutputAuthTokensDto,
  })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  public async refreshToken(@Body() data: InputRefreshTokenDto): Promise<OutputAuthTokensDto> {
    const user: UserEntity = await this.authService.refreshToken(data);
    return this.generateAuthTokenResponse(user);
  }

  @Post('forgot-password')
  @ApiOperation({ description: 'Forgot password' })
  @ApiCreatedResponse({ description: 'Object created.', type: Boolean })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  public async forgotPassword(@Body() data: InputEmailDto): Promise<boolean> {
    return this.authService.forgotPassword(data);
  }

  @Post('set-password')
  @ApiOperation({ description: 'Set password' })
  @ApiCreatedResponse({ description: 'Password updated.', type: Boolean })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  public async setPassword(@Body() data: InputSetPasswordDto): Promise<boolean> {
    return this.authService.setPassword(data);
  }
}
