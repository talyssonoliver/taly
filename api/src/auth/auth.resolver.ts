import { Logger, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from "../users/interfaces/user.interface";
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Resolver('Auth')
export class AuthResolver {
  private readonly logger = new Logger(AuthResolver.name);

  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation('register')
  async register(@Args('input') registerDto: RegisterDto) {
    this.logger.log(`Registration attempt for email: ${registerDto.email}`);
    return this.authService.register(registerDto);
  }

  @Public()
  @Mutation('login')
  async login(@Args('input') loginDto: LoginDto) {
    this.logger.log(`Login attempt for email: ${loginDto.email}`);
    
    // First validate the user
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    
    if (!user) {
      this.logger.warn(`Login failed: Invalid credentials for email: ${loginDto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Then perform login
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Query('me')
  getProfile(@CurrentUser() user: User) {
    this.logger.log(`Profile request for user ID: ${user.id}`);
    return user;
  }

  @Public()
  @Mutation('forgotPassword')
  async forgotPassword(@Args('input') forgotPasswordDto: ForgotPasswordDto) {
    this.logger.log(`Password reset requested for email: ${forgotPasswordDto.email}`);
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Public()
  @Mutation('resetPassword')
  async resetPassword(
    @Args('token') token: string,
    @Args('input') resetPasswordDto: ResetPasswordDto,
  ) {
    this.logger.log('Password reset attempt with token');
    
    // Check if passwords match
    if (resetPasswordDto.password !== resetPasswordDto.passwordConfirmation) {
      throw new UnauthorizedException('Passwords do not match');
    }
    
    return this.authService.resetPassword(token, resetPasswordDto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation('changePassword')
  async changePassword(
    @CurrentUser() user: User,
    @Args('input') changePasswordDto: ChangePasswordDto,
  ) {
    this.logger.log(`Password change attempt for user ID: ${user.id}`);
    return this.authService.changePassword(
      user.id,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Mutation('logout')
  async logout(@CurrentUser() user: User) {
    this.logger.log(`Logout attempt for user ID: ${user.id}`);
    return this.authService.logout(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation('refreshToken')
  async refreshToken(@Args('input') refreshTokenDto: RefreshTokenDto) {
    this.logger.log('Token refresh attempt');
    return this.authService.refreshTokens(refreshTokenDto);
  }
}
