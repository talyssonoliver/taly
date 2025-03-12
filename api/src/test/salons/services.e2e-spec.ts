import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { setupApp } from '../utils/test-setup';
import { teardownApp } from '../utils/test-teardown';
import { createAuthToken } from '../utils/auth-helper';
import { testSalon, testService } from '../utils/fixtures';

describe('Services Controller (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let adminToken: string;
  let salonId: string;
  let serviceId: string;

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
    const salonResponse = await request(app.getHttpServer())
      .post('/salons')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(testSalon);
    
    salonId = salonResponse.body.id;
    
    // Create a test service
    const serviceResponse = await request(app.getHttpServer())
      .post(`/salons/${salonId}/services`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({...testService, salonId});
    
    serviceId = serviceResponse.body.id;
  });

  afterAll(async () => {
    await teardownApp(app);
    await app.close();
  });

  it('/salons/:salonId/services (GET) - should get all services for salon', () => {
    return request(app.getHttpServer())
      .get(`/salons/${salonId}/services`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('name');
        expect(res.body[0]).toHaveProperty('price');
        expect(res.body[0]).toHaveProperty('duration');
      });
  });

  it('/salons/:salonId/services/:serviceId (GET) - should get service by id', () => {
    return request(app.getHttpServer())
      .get(`/salons/${salonId}/services/${serviceId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', serviceId);
        expect(res.body).toHaveProperty('name', testService.name);
        expect(res.body).toHaveProperty('price', testService.price);
        expect(res.body).toHaveProperty('duration', testService.duration);
      });
  });

  it('/salons/:salonId/services/:serviceId (PATCH) - should update service', () => {
    return request(app.getHttpServer())
      .patch(`/salons/${salonId}/services/${serviceId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Updated Service Name',
        price: 99.99
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', serviceId);
        expect(res.body).toHaveProperty('name', 'Updated Service Name');
        expect(res.body).toHaveProperty('price', 99.99);
      });
  });

  it('/salons/:salonId/services/:serviceId (DELETE) - should delete service', () => {
    return request(app.getHttpServer())
      .delete(`/salons/${salonId}/services/${serviceId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(204);
  });
});
