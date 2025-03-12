import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { testUser } from './fixtures';

export async function createAuthToken(
  app: INestApplication,
  role: 'ADMIN' | 'STYLIST' | 'CLIENT' = 'STYLIST',
): Promise<string> {
  let email: string;
  
  switch (role) {
    case 'ADMIN':
      email = 'admin@example.com';
      break;
    case 'STYLIST':
      email = 'stylist@example.com';
      break;
    case 'CLIENT':
      email = 'client@example.com';
      break;
    default:
      email = 'stylist@example.com';
  }
  
  const response = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email, password: 'password123' });
  
  return response.body.accessToken;
}
