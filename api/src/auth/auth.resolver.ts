import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation('register')
  async register(@Args('input') registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Mutation('login')
  async login(@Args('input') loginDto: LoginDto, @Context() context) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Query('me')
  getProfile(@CurrentUser() user) {
    return user;
  }

  @Public()
  @Mutation('forgotPassword')
  async forgotPassword(@Args('input') forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Public()
  @Mutation('resetPassword')
  async resetPassword(
    @Args('token') token: string,
    @Args('input') resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(token, resetPasswordDto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation('changePassword')
  async changePassword(
    @CurrentUser() user,
    @Args('input') changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(
      user.id,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Mutation('logout')
  async logout(@CurrentUser() user) {
    return this.authService.logout(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation('refreshToken')
  async refreshToken(@CurrentUser() user) {
    return this.authService.refreshToken(user.id);
  }
}
