import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  HttpCode,
  HttpStatus,
  Patch,
  Param,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { OAuthGuard } from './guards/oauth.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    this.logger.log(Registration attempt for email: );
    return this.authService.register(registerDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    this.logger.log(Login attempt for email: );
    return this.authService.login(req.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@CurrentUser() user) {
    return user;
  }

  @Public()
  @Get('facebook')
  @ApiOperation({ summary: 'Initiate Facebook authentication' })
  @UseGuards(OAuthGuard)
  facebookLogin() {
    return { message: 'Facebook authentication initiated' };
  }

  @Public()
  @Get('facebook/callback')
  @ApiOperation({ summary: 'Facebook authentication callback' })
  @UseGuards(OAuthGuard)
  facebookLoginCallback(@Req() req: Request) {
    return this.authService.oauthLogin(req.user);
  }

  @Public()
  @Get('google')
  @ApiOperation({ summary: 'Initiate Google authentication' })
  @UseGuards(OAuthGuard)
  googleLogin() {
    return { message: 'Google authentication initiated' };
  }

  @Public()
  @Get('google/callback')
  @ApiOperation({ summary: 'Google authentication callback' })
  @UseGuards(OAuthGuard)
  googleLoginCallback(@Req() req: Request) {
    return this.authService.oauthLogin(req.user);
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    this.logger.log(Password reset request for email: );
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Public()
  @Post('reset-password/:token')
  @ApiOperation({ summary: 'Reset password with token' })
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    this.logger.log('Password reset attempt with token');
    return this.authService.resetPassword(token, resetPasswordDto.password);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  @ApiOperation({ summary: 'Change current user password' })
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentUser() user,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    this.logger.log(Password change attempt for user ID: );
    return this.authService.changePassword(
      user.id,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Logout current user' })
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user) {
    this.logger.log(Logout for user ID: );
    return this.authService.logout(user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh authentication token' })
  @HttpCode(HttpStatus.OK)
  async refreshToken(@CurrentUser() user) {
    this.logger.log(Token refresh for user ID: );
    return this.authService.refreshToken(user.id);
  }
}
