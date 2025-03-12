import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { setupApp } from '../utils/test-setup';
import { teardownApp } from '../utils/test-teardown';
import { createAuthToken } from '../utils/auth-helper';
import { testSalon, testUser } from '../utils/fixtures';

describe('Availability Controller (e2e)', () => {
  let app: INestApplication;
  let stylistToken: string;
  let clientToken: string;
  let salonId: string;
  let stylistId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await setupApp(app);
    await app.init();
    
    stylistToken = await createAuthToken(app, 'STYLIST');
    clientToken = await createAuthToken(app, 'CLIENT');
    
    // Get stylist ID from token
    const profileResponse = await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${stylistToken}`);
    
    stylistId = profileResponse.body.id;
    
    // Create test salon
    const salonResponse = await request(app.getHttpServer())
      .post('/salons')
      .set('Authorization', `Bearer ${stylistToken}`)
      .send(testSalon);
    
    salonId = salonResponse.body.id;
  });

  afterAll(async () => {
    await teardownApp(app);
    await app.close();
  });

  it('/availability/stylist/:stylistId (GET) - should get stylist availability', () => {
    return request(app.getHttpServer())
      .get(`/availability/stylist/${stylistId}`)
      .set('Authorization', `Bearer ${clientToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('day');
        expect(res.body[0]).toHaveProperty('startTime');
        expect(res.body[0]).toHaveProperty('endTime');
      });
  });

  it('/availability/salon/:salonId (GET) - should get salon availability', () => {
    return request(app.getHttpServer())
      .get(`/availability/salon/${salonId}`)
      .set('Authorization', `Bearer ${clientToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('businessHours');
        expect(Array.isArray(res.body.businessHours)).toBeTruthy();
        expect(res.body).toHaveProperty('stylists');
        expect(Array.isArray(res.body.stylists)).toBeTruthy();
      });
  });

  it('/availability/stylist/:stylistId (POST) - should set stylist availability', () => {
    const availability = [
      {
        day: 'MONDAY',
        startTime: '09:00',
        endTime: '17:00'
      },
      {
        day: 'TUESDAY',
        startTime: '09:00',
        endTime: '17:00'
      },
      {
        day: 'WEDNESDAY',
        startTime: '09:00',
        endTime: '17:00'
      },
      {
        day: 'THURSDAY',
        startTime: '09:00',
        endTime: '17:00'
      },
      {
        day: 'FRIDAY',
        startTime: '09:00',
        endTime: '17:00'
      }
    ];

    return request(app.getHttpServer())
      .post(`/availability/stylist/${stylistId}`)
      .set('Authorization', `Bearer ${stylistToken}`)
      .send(availability)
      .expect(201)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBe(5);
        expect(res.body[0]).toHaveProperty('day', 'MONDAY');
      });
  });

  it('/availability/slots (GET) - should get available slots', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    return request(app.getHttpServer())
      .get('/availability/slots')
      .query({
        salonId,
        serviceId: 'service123',
        date: dateStr
      })
      .set('Authorization', `Bearer ${clientToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body[0]).toHaveProperty('time');
        expect(res.body[0]).toHaveProperty('available');
        expect(res.body[0]).toHaveProperty('stylistId');
      });
  });
});
