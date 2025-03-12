import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { setupApp } from '../utils/test-setup';
import { teardownApp } from '../utils/test-teardown';
import { createAuthToken } from '../utils/auth-helper';
import { testAppointment, testClient, testPayment, testSalon, testService } from '../utils/fixtures';

describe('Refunds Controller (e2e)', () => {
  let app: INestApplication;
  let stylistToken: string;
  let adminToken: string;
  let salonId: string;
  let serviceId: string;
  let clientId: string;
  let appointmentId: string;
  let paymentId: string;
  let refundId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await setupApp(app);
    await app.init();
    
    stylistToken = await createAuthToken(app, 'STYLIST');
    adminToken = await createAuthToken(app, 'ADMIN');
    
    // Create test salon, service, client, appointment, payment
    const salonResponse = await request(app.getHttpServer())
      .post('/salons')
      .set('Authorization', `Bearer ${stylistToken}`)
      .send(testSalon);
    
    salonId = salonResponse.body.id;
    
    const serviceResponse = await request(app.getHttpServer())
      .post(`/salons/${salonId}/services`)
      .set('Authorization', `Bearer ${stylistToken}`)
      .send({...testService, salonId});
    
    serviceId = serviceResponse.body.id;
    
    const clientResponse = await request(app.getHttpServer())
      .post('/clients')
      .set('Authorization', `Bearer ${stylistToken}`)
      .send(testClient);
    
    clientId = clientResponse.body.id;
    
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
    
    const paymentResponse = await request(app.getHttpServer())
      .post('/payments')
      .set('Authorization', `Bearer ${stylistToken}`)
      .send({
        ...testPayment,
        status: 'COMPLETED',
        appointmentId
      });
    
    paymentId = paymentResponse.body.id;
    
    // Request a refund
    const refundResponse = await request(app.getHttpServer())
      .post('/refunds')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        paymentId,
        amount: testPayment.amount / 2,
        reason: 'Customer dissatisfaction'
      });
    
    refundId = refundResponse.body.id;
  });

  afterAll(async () => {
    await teardownApp(app);
    await app.close();
  });

  it('/refunds (GET) - should get all refunds', () => {
    return request(app.getHttpServer())
      .get('/refunds')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('amount');
        expect(res.body[0]).toHaveProperty('status');
        expect(res.body[0]).toHaveProperty('paymentId');
      });
  });

  it('/refunds/:id (GET) - should get refund by id', () => {
    return request(app.getHttpServer())
      .get(`/refunds/${refundId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', refundId);
        expect(res.body).toHaveProperty('amount');
        expect(res.body).toHaveProperty('reason', 'Customer dissatisfaction');
        expect(res.body).toHaveProperty('paymentId', paymentId);
      });
  });

  it('/refunds/payment/:paymentId (GET) - should get refunds by payment id', () => {
    return request(app.getHttpServer())
      .get(`/refunds/payment/${paymentId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('paymentId', paymentId);
      });
  });

  it('/refunds/:id/approve (PATCH) - should approve refund', () => {
    return request(app.getHttpServer())
      .patch(`/refunds/${refundId}/approve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', refundId);
        expect(res.body).toHaveProperty('status', 'APPROVED');
      });
  });

  it('/refunds/:id/process (PATCH) - should process refund', () => {
    return request(app.getHttpServer())
      .patch(`/refunds/${refundId}/process`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        transactionId: 'ref_123456789'
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', refundId);
        expect(res.body).toHaveProperty('status', 'PROCESSED');
        expect(res.body).toHaveProperty('transactionId', 'ref_123456789');
      });
  });

  it('/refunds/:id/deny (PATCH) - should deny refund', () => {
    // Create another refund to deny
    return request(app.getHttpServer())
      .post('/refunds')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        paymentId,
        amount: 10,
        reason: 'Testing denial'
      })
      .then(response => {
        const newRefundId = response.body.id;
        
        return request(app.getHttpServer())
          .patch(`/refunds/${newRefundId}/deny`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            denialReason: 'Not eligible for refund'
          })
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('id', newRefundId);
            expect(res.body).toHaveProperty('status', 'DENIED');
            expect(res.body).toHaveProperty('denialReason', 'Not eligible for refund');
          });
      });
  });
});
