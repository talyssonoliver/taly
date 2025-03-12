import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { setupApp } from '../utils/test-setup';
import { teardownApp } from '../utils/test-teardown';
import { createAuthToken } from '../utils/auth-helper';
import { testSalon } from '../utils/fixtures';

describe('Salons Controller (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let adminToken: string;
  let salonId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await setupApp(app);
    await app.init();
    
    authToken = await createAuthToken(app);
    adminToken = await createAuthToken(app, 'ADMIN');

    // Create a test salon
    const response = await request(app.getHttpServer())
      .post('/salons')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(testSalon);
    
    salonId = response.body.id;
  });

  afterAll(async () => {
    await teardownApp(app);
    await app.close();
  });

  it('/salons (GET) - should get all salons', () => {
    return request(app.getHttpServer())
      .get('/salons')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('name');
      });
  });

  it('/salons/:id (GET) - should get salon by id', () => {
    return request(app.getHttpServer())
      .get(`/salons/${salonId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', salonId);
        expect(res.body).toHaveProperty('name', testSalon.name);
        expect(res.body).toHaveProperty('address');
        expect(res.body).toHaveProperty('phone');
      });
  });

  it('/salons/:id (PATCH) - should update salon', () => {
    return request(app.getHttpServer())
      .patch(`/salons/${salonId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Updated Salon Name',
        phone: '+1-555-123-4567'
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', salonId);
        expect(res.body).toHaveProperty('name', 'Updated Salon Name');
        expect(res.body).toHaveProperty('phone', '+1-555-123-4567');
      });
  });

  it('/salons/:id (DELETE) - should delete salon with admin token', () => {
    return request(app.getHttpServer())
      .delete(`/salons/${salonId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(204);
  });

  it('/salons/:id (DELETE) - should return 403 with non-admin token', () => {
    return request(app.getHttpServer())
      .delete(`/salons/${salonId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(403);
  });
});
