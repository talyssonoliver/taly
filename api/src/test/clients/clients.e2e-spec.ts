import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { setupApp } from '../utils/test-setup';
import { teardownApp } from '../utils/test-teardown';
import { createAuthToken } from '../utils/auth-helper';
import { testClient } from '../utils/fixtures';

describe('Clients Controller (e2e)', () => {
  let app: INestApplication;
  let stylistToken: string;
  let clientToken: string;
  let clientId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await setupApp(app);
    await app.init();
    
    stylistToken = await createAuthToken(app, 'STYLIST');
    clientToken = await createAuthToken(app, 'CLIENT');
    
    // Create test client
    const response = await request(app.getHttpServer())
      .post('/clients')
      .set('Authorization', `Bearer ${stylistToken}`)
      .send(testClient);
    
    clientId = response.body.id;
  });

  afterAll(async () => {
    await teardownApp(app);
    await app.close();
  });

  it('/clients (GET) - should get all clients', () => {
    return request(app.getHttpServer())
      .get('/clients')
      .set('Authorization', `Bearer ${stylistToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('email');
        expect(res.body[0]).toHaveProperty('firstName');
      });
  });

  it('/clients/:id (GET) - should get client by id', () => {
    return request(app.getHttpServer())
      .get(`/clients/${clientId}`)
      .set('Authorization', `Bearer ${stylistToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', clientId);
        expect(res.body).toHaveProperty('email', testClient.email);
        expect(res.body).toHaveProperty('firstName', testClient.firstName);
        expect(res.body).toHaveProperty('lastName', testClient.lastName);
        expect(res.body).toHaveProperty('phone', testClient.phone);
      });
  });

  it('/clients/:id (PATCH) - should update client', () => {
    return request(app.getHttpServer())
      .patch(`/clients/${clientId}`)
      .set('Authorization', `Bearer ${stylistToken}`)
      .send({
        firstName: 'Updated',
        lastName: 'Client',
        notes: 'New client notes'
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', clientId);
        expect(res.body).toHaveProperty('firstName', 'Updated');
        expect(res.body).toHaveProperty('lastName', 'Client');
        expect(res.body).toHaveProperty('notes', 'New client notes');
      });
  });

  it('/clients/:id/history (GET) - should get client appointment history', () => {
    return request(app.getHttpServer())
      .get(`/clients/${clientId}/history`)
      .set('Authorization', `Bearer ${stylistToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body[0]).toHaveProperty('clientId', clientId);
      });
  });

  it('/clients/:id (DELETE) - should delete client', () => {
    return request(app.getHttpServer())
      .delete(`/clients/${clientId}`)
      .set('Authorization', `Bearer ${stylistToken}`)
      .expect(204);
  });
});
