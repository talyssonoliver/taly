import { Body, Controller, Post } from '@nestjs/common';
import { SignupSchema, type SignupDto } from '../dto/signup.dto';
import type { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: SignupDto): Promise<{ message: string; }> {
    const signupDto: SignupDto = SignupSchema.parse(body); 
    await this.authService.signup(signupDto);
    return { message: 'User registered successfully. Please verify your email.' };
  }
}
