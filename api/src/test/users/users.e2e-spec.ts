import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { setupApp } from '../utils/test-setup';
import { teardownApp } from '../utils/test-teardown';
import { createAuthToken } from '../utils/auth-helper';
import { generateRandomEmail } from '../utils/fixtures';

describe('Users Controller (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let adminToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await setupApp(app);
    await app.init();
    
    authToken = await createAuthToken(app);
    adminToken = await createAuthToken(app, 'ADMIN');

    // Create a test user
    const response = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: generateRandomEmail(),
        firstName: 'Test',
        lastName: 'User',
        role: 'STYLIST',
        password: 'Password123!'
      });
    
    userId = response.body.id;
  });

  afterAll(async () => {
    await teardownApp(app);
    await app.close();
  });

  it('/users (GET) - should get all users with admin token', () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('email');
      });
  });

  it('/users (GET) - should return 403 with non-admin token', () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(403);
  });

  it('/users/:id (GET) - should get user by id', () => {
    return request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', userId);
        expect(res.body).toHaveProperty('email');
        expect(res.body).toHaveProperty('firstName');
        expect(res.body).toHaveProperty('lastName');
        expect(res.body).toHaveProperty('role');
      });
  });

  it('/users/:id (PATCH) - should update user', () => {
    return request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'Updated',
        lastName: 'Name'
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', userId);
        expect(res.body).toHaveProperty('firstName', 'Updated');
        expect(res.body).toHaveProperty('lastName', 'Name');
      });
  });

  it('/users/:id (DELETE) - should delete user', () => {
    return request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(204);
  });
});
