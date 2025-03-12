import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { setupApp } from '../utils/test-setup';
import { teardownApp } from '../utils/test-teardown';
import { createAuthToken } from '../utils/auth-helper';
import { testAppointment, testClient, testSalon, testService, testUser } from '../utils/fixtures';

describe('Appointments Controller (e2e)', () => {
  let app: INestApplication;
  let stylistToken: string;
  let clientToken: string;
  let adminToken: string;
  let salonId: string;
  let serviceId: string;
  let clientId: string;
  let appointmentId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await setupApp(app);
    await app.init();
    
    stylistToken = await createAuthToken(app, 'STYLIST');
    clientToken = await createAuthToken(app, 'CLIENT');
    adminToken = await createAuthToken(app, 'ADMIN');

    // Create test salon
    const salonResponse = await request(app.getHttpServer())
      .post('/salons')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(testSalon);
    
    salonId = salonResponse.body.id;
    
    // Create test service
    const serviceResponse = await request(app.getHttpServer())
      .post(`/salons/${salonId}/services`)
      .set('Authorization', `Bearer ${adminToken}`)
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
  });

  afterAll(async () => {
    await teardownApp(app);
    await app.close();
  });

  it('/appointments (GET) - should get all appointments', () => {
    return request(app.getHttpServer())
      .get('/appointments')
      .set('Authorization', `Bearer ${stylistToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('date');
        expect(res.body[0]).toHaveProperty('status');
      });
  });

  it('/appointments/:id (GET) - should get appointment by id', () => {
    return request(app.getHttpServer())
      .get(`/appointments/${appointmentId}`)
      .set('Authorization', `Bearer ${stylistToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', appointmentId);
        expect(res.body).toHaveProperty('date');
        expect(res.body).toHaveProperty('salonId', salonId);
        expect(res.body).toHaveProperty('serviceId', serviceId);
        expect(res.body).toHaveProperty('clientId', clientId);
      });
  });

  it('/appointments/:id/status (PATCH) - should update appointment status', () => {
    return request(app.getHttpServer())
      .patch(`/appointments/${appointmentId}/status`)
      .set('Authorization', `Bearer ${stylistToken}`)
      .send({
        status: 'CONFIRMED'
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', appointmentId);
        expect(res.body).toHaveProperty('status', 'CONFIRMED');
      });
  });

  it('/appointments/:id (DELETE) - should cancel appointment', () => {
    return request(app.getHttpServer())
      .delete(`/appointments/${appointmentId}`)
      .set('Authorization', `Bearer ${clientToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', appointmentId);
        expect(res.body).toHaveProperty('status', 'CANCELLED');
      });
  });

  it('/appointments/salon/:salonId (GET) - should get all appointments for salon', () => {
    return request(app.getHttpServer())
      .get(`/appointments/salon/${salonId}`)
      .set('Authorization', `Bearer ${stylistToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('salonId', salonId);
      });
  });
});
