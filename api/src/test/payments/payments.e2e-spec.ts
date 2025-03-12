import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { setupApp } from '../utils/test-setup';
import { teardownApp } from '../utils/test-teardown';
import { createAuthToken } from '../utils/auth-helper';
import { testAppointment, testClient, testPayment, testSalon, testService } from '../utils/fixtures';

describe('Payments Controller (e2e)', () => {
  let app: INestApplication;
  let stylistToken: string;
  let clientToken: string;
  let salonId: string;
  let serviceId: string;
  let clientId: string;
  let appointmentId: string;
  let paymentId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await setupApp(app);
    await app.init();
    
    stylistToken = await createAuthToken(app, 'STYLIST');
    clientToken = await createAuthToken(app, 'CLIENT');
    
    // Create test salon
    const salonResponse = await request(app.getHttpServer())
      .post('/salons')
      .set('Authorization', `Bearer ${stylistToken}`)
      .send(testSalon);
    
    salonId = salonResponse.body.id;
    
    // Create test service
    const serviceResponse = await request(app.getHttpServer())
      .post(`/salons/${salonId}/services`)
      .set('Authorization', `Bearer ${stylistToken}`)
      .send({...testService, salonId});
    
    serviceId = serviceResponse.body.id;
    
    // Create test client
    const clientResponse = await request(app.getHttpServer())
      .post('/clients')
      .set('Authorization', `Bearer ${stylistToken}`)
      .send(testClient);
    
    clientId = clientResponse.body.id;
    
    // Create test appointment
    const appointmentResponse = await request(app.getHttpServer())
      .post('/appointments')
      .set('Authorization', `Bearer ${stylistToken}`)
      .send({
        ...testAppointment,
        salonId,
        serviceId,
        clientId
      });
    
    appointmentId = appointmentResponse.body.id;
    
    // Create test payment
    const paymentResponse = await request(app.getHttpServer())
      .post('/payments')
      .set('Authorization', `Bearer ${stylistToken}`)
      .send({
        ...testPayment,
        appointmentId
      });
    
    paymentId = paymentResponse.body.id;
  });

  afterAll(async () => {
    await teardownApp(app);
    await app.close();
  });

  it('/payments (GET) - should get all payments', () => {
    return request(app.getHttpServer())
      .get('/payments')
      .set('Authorization', `Bearer ${stylistToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('amount');
        expect(res.body[0]).toHaveProperty('status');
      });
  });

  it('/payments/:id (GET) - should get payment by id', () => {
    return request(app.getHttpServer())
      .get(`/payments/${paymentId}`)
      .set('Authorization', `Bearer ${stylistToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', paymentId);
        expect(res.body).toHaveProperty('amount', testPayment.amount);
        expect(res.body).toHaveProperty('status');
        expect(res.body).toHaveProperty('appointmentId', appointmentId);
      });
  });

  it('/payments/appointment/:appointmentId (GET) - should get payment by appointment id', () => {
    return request(app.getHttpServer())
      .get(`/payments/appointment/${appointmentId}`)
      .set('Authorization', `Bearer ${stylistToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('appointmentId', appointmentId);
      });
  });

  it('/payments/:id/status (PATCH) - should update payment status', () => {
    return request(app.getHttpServer())
      .patch(`/payments/${paymentId}/status`)
      .set('Authorization', `Bearer ${stylistToken}`)
      .send({
        status: 'COMPLETED'
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', paymentId);
        expect(res.body).toHaveProperty('status', 'COMPLETED');
      });
  });

  it('/payments/:id (PATCH) - should update payment details', () => {
    return request(app.getHttpServer())
      .patch(`/payments/${paymentId}`)
      .set('Authorization', `Bearer ${stylistToken}`)
      .send({
        tipAmount: 20,
        notes: 'Added a tip'
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', paymentId);
        expect(res.body).toHaveProperty('tipAmount', 20);
        expect(res.body).toHaveProperty('notes', 'Added a tip');
      });
  });
});
