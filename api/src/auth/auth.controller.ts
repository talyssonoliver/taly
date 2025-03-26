import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Request as NestRequest,
  UnauthorizedException,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
} from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { HttpExceptionFilter } from "../common/filters/http-exception.filter";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { TransformInterceptor } from "../common/interceptors/transform.interceptor";
import { UserRequest } from "../common/interfaces/user-request.interface";
import { AuthService } from "./auth.service";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { RegisterDto } from "./dto/register.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { Public } from "../common/decorators/public.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { User } from "../users/interfaces/user.interface";
import { LocalAuthGuard } from "./guards/local-auth.guard";

@ApiTags("Authentication")
@Controller("auth")
@UseFilters(HttpExceptionFilter)
@UseInterceptors(TransformInterceptor)
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully registered',
    schema: {
      example: {
        data: {
          user: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            email: 'user@example.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'USER'
          },
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        },
        success: true,
        timestamp: '2023-01-01T00:00:00.000Z',
      }
    }
  })
  @ApiBadRequestResponse({ description: 'Bad Request - Invalid input data' })
  @ApiConflictResponse({ description: 'Conflict - Email already in use' })
  async register(@Body() registerDto: RegisterDto) {
    this.logger.log(`Registration attempt for email: ${registerDto.email}`);
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 200, 
    description: 'User successfully logged in',
    schema: {
      example: {
        data: {
          user: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            email: 'user@example.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'USER'
          },
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        },
        success: true,
        timestamp: '2023-01-01T00:00:00.000Z',
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized - Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    this.logger.log(`Login attempt for email: ${loginDto.email}`);
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @Public()
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 requests per minute
  @ApiOperation({ summary: 'Refresh authentication tokens' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Tokens successfully refreshed',
    schema: {
      example: {
        data: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        },
        success: true,
        timestamp: '2023-01-01T00:00:00.000Z',
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized - Invalid refresh token' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    this.logger.log('Token refresh attempt');
    return this.authService.refreshTokens(refreshTokenDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ 
    status: 200, 
    description: 'User successfully logged out',
    schema: {
      example: {
        data: { success: true },
        success: true,
        timestamp: '2023-01-01T00:00:00.000Z',
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized - Invalid or missing token' })
  async logout(@CurrentUser() user: User) {
    if (!user || !user.id) {
      this.logger.error('Logout attempt failed: Invalid user in request');
      throw new UnauthorizedException('Invalid authentication token');
    }
    
    this.logger.log(`Logout attempt for user ID: ${user.id}`);
    return this.authService.logout(user.id);
  }

  @Post('forgot-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @ApiOperation({ summary: 'Request password reset' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Password reset email sent if email exists',
    schema: {
      example: {
        data: { success: true },
        success: true,
        timestamp: '2023-01-01T00:00:00.000Z',
      }
    }
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    this.logger.log(`Password reset requested for email: ${forgotPasswordDto.email}`);
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Password successfully reset',
    schema: {
      example: {
        data: { 
          success: true,
          message: 'Password has been reset successfully'
        },
        success: true,
        timestamp: '2023-01-01T00:00:00.000Z',
      }
    }
  })
  @ApiBadRequestResponse({ description: 'Bad Request - Invalid or expired token' })
  async resetPassword(
    @Body('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    this.logger.log('Password reset attempt with token');
    
    // Check if passwords match
    if (resetPasswordDto.password !== resetPasswordDto.passwordConfirmation) {
      throw new UnauthorizedException('Passwords do not match');
    }
    
    return this.authService.resetPassword(token, resetPasswordDto.password);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user password' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Password successfully changed',
    schema: {
      example: {
        data: { success: true },
        success: true,
        timestamp: '2023-01-01T00:00:00.000Z',
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized - Invalid credentials or token' })
  async changePassword(
    @CurrentUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    this.logger.log(`Password change attempt for user ID: ${user.id}`);
    return this.authService.changePassword(
      user.id,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ 
    status: 200, 
    description: 'User profile retrieved successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized - Invalid or missing token' })
  async getProfile(@CurrentUser() user: User) {
    this.logger.log(`Profile request for user ID: ${user.id}`);
    return user;
  }
}
