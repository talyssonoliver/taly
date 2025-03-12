import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { setupApp } from '../utils/test-setup';
import { teardownApp } from '../utils/test-teardown';
import { createAuthToken } from '../utils/auth-helper';
import { testClient, testSubscription } from '../utils/fixtures';

describe('Subscriptions Controller (e2e)', () => {
  let app: INestApplication;
  let stylistToken: string;
  let adminToken: string;
  let clientId: string;
  let subscriptionId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await setupApp(app);
    await app.init();
    
    stylistToken = await createAuthToken(app, 'STYLIST');
    adminToken = await createAuthToken(app, 'ADMIN');
    
    // Create test client
    const clientResponse = await request(app.getHttpServer())
      .post('/clients')
      .set('Authorization', `Bearer ${stylistToken}`)
      .send(testClient);
    
    clientId = clientResponse.body.id;
    
    // Create test subscription
    const subscriptionResponse = await request(app.getHttpServer())
      .post('/subscriptions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        ...testSubscription,
        clientId
      });
    
    subscriptionId = subscriptionResponse.body.id;
  });

  afterAll(async () => {
    await teardownApp(app);
    await app.close();
  });

  it('/subscriptions (GET) - should get all subscriptions', () => {
    return request(app.getHttpServer())
      .get('/subscriptions')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('planName');
        expect(res.body[0]).toHaveProperty('status');
      });
  });

  it('/subscriptions/:id (GET) - should get subscription by id', () => {
    return request(app.getHttpServer())
      .get(`/subscriptions/${subscriptionId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', subscriptionId);
        expect(res.body).toHaveProperty('planName', testSubscription.planName);
        expect(res.body).toHaveProperty('price', testSubscription.price);
        expect(res.body).toHaveProperty('status');
        expect(res.body).toHaveProperty('clientId', clientId);
      });
  });

  it('/subscriptions/client/:clientId (GET) - should get subscriptions by client id', () => {
    return request(app.getHttpServer())
      .get(`/subscriptions/client/${clientId}`)
      .set('Authorization', `Bearer ${stylistToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('clientId', clientId);
      });
  });

  it('/subscriptions/:id/status (PATCH) - should update subscription status', () => {
    return request(app.getHttpServer())
      .patch(`/subscriptions/${subscriptionId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'ACTIVE'
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', subscriptionId);
        expect(res.body).toHaveProperty('status', 'ACTIVE');
      });
  });

  it('/subscriptions/:id (PATCH) - should update subscription details', () => {
    return request(app.getHttpServer())
      .patch(`/subscriptions/${subscriptionId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        planName: 'Premium Annual',
        price: 499.99,
        features: ['Unlimited services', 'Priority booking', 'Free products']
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', subscriptionId);
        expect(res.body).toHaveProperty('planName', 'Premium Annual');
        expect(res.body).toHaveProperty('price', 499.99);
        expect(res.body.features).toContain('Unlimited services');
      });
  });

  it('/subscriptions/:id/cancel (PATCH) - should cancel subscription', () => {
    return request(app.getHttpServer())
      .patch(`/subscriptions/${subscriptionId}/cancel`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        cancellationReason: 'Customer request'
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', subscriptionId);
        expect(res.body).toHaveProperty('status', 'CANCELLED');
        expect(res.body).toHaveProperty('cancellationReason', 'Customer request');
      });
  });
});
