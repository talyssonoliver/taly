import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../../api/src/app.module';
import { PrismaService } from '../../../api/src/database/prisma.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);
    app.get<JwtService>(JwtService);
    
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    
    await app.init();
    
    // Clear test database before tests
    await prisma.cleanDatabase();
  });

  afterAll(async () => {
    await prisma.cleanDatabase();
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user with valid data', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'Password123!',
          firstName: 'New',
          lastName: 'User',
        })
        .expect(201)
        .expect((res: request.Response) => {
          expect(res.body.data).toHaveProperty('accessToken');
          expect(res.body.data.user).toHaveProperty('email', 'newuser@example.com');
          expect(res.body.data.user).toHaveProperty('firstName', 'New');
          expect(res.body.data.user).not.toHaveProperty('password');
        });
    });

    it('should reject registration with invalid data', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: 'short',
        })
        .expect(400)
        .expect((res: request.Response) => {
          expect(res.body).toHaveProperty('error', 'Bad Request');
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toEqual(expect.arrayContaining([
            expect.stringContaining('email'),
            expect.stringContaining('password'),
            expect.stringContaining('firstName'),
          ]));
        });
    });
  });

  
});