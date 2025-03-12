import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { setupApp } from '../utils/test-setup';
import { teardownApp } from '../utils/test-teardown';
import { generateRandomEmail } from '../utils/fixtures';

describe('Register (e2e)', () => {
  let app: INestApplication;
  const newUser = {
    email: generateRandomEmail(),
    password: 'Password123!',
    firstName: 'Test',
    lastName: 'User',
    role: 'STYLIST'
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await setupApp(app);
    await app.init();
  });

  afterAll(async () => {
    await teardownApp(app);
    await app.close();
  });

  it('/auth/register (POST) - should register new user', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(newUser)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('email', newUser.email);
        expect(res.body).toHaveProperty('firstName', newUser.firstName);
        expect(res.body).toHaveProperty('lastName', newUser.lastName);
        expect(res.body).toHaveProperty('role', newUser.role);
        expect(res.body).not.toHaveProperty('password');
      });
  });

  it('/auth/register (POST) - should fail with duplicate email', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(newUser)
      .expect(409)
      .expect((res) => {
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toContain('already exists');
      });
  });

  it('/auth/register (POST) - should fail with invalid password', () => {
    const invalidUser = {...newUser, email: generateRandomEmail(), password: 'weak'};
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(invalidUser)
      .expect(400)
      .expect((res) => {
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toContain('password');
      });
  });
});
