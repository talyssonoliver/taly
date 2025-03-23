// biome-ignore: This file contains NestJS decorators which Biome can't parse correctly
import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Logger,
	Request as NestRequest,
	Post,
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
} from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { HttpExceptionFilter } from "../common/filters/http-exception.filter";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { TransformInterceptor } from "../common/interceptors/transform.interceptor";
import { UserRequest } from "../common/interfaces/user-request.interface";
import type { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { RegisterDto } from "./dto/register.dto";

@ApiTags("Authentication")
@Controller("auth")
@UseFilters(HttpExceptionFilter)
@UseInterceptors(TransformInterceptor)
export class AuthController {
	private readonly logger = new Logger(AuthController.name);

	constructor(private readonly authService: AuthService) {}

	@Post('register')
  @HttpCode(HttpStatus.CREATED)
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
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data' })
  @ApiResponse({ status: 409, description: 'Conflict - Email already in use' })
  async register(@Body() registerDto: RegisterDto) {
    this.logger.log(`Registration attempt for email: ${registerDto.email}`);
    return this.authService.register(registerDto);
  }

	@Post('login')
  @HttpCode(HttpStatus.OK)
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
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    this.logger.log(`Login attempt for email: ${loginDto.email}`);
    return this.authService.login(loginDto);
  }

	@Post('refresh')
  @HttpCode(HttpStatus.OK)
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
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid refresh token' })
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
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  async logout(@NestRequest() req: UserRequest) {
    if (!req.user || !req.user.sub) {
      this.logger.error('Logout attempt failed: Invalid user in request');
      throw new UnauthorizedException('Invalid authentication token');
    }
    
    this.logger.log(`Logout attempt for user ID: ${req.user.sub}`);
    return this.authService.logout(req.user.sub);
  }
}
