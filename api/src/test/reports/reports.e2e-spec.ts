import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { setupApp } from '../utils/test-setup';
import { teardownApp } from '../utils/test-teardown';
import { createAuthToken } from '../utils/auth-helper';

describe('Reports Controller (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let stylistToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await setupApp(app);
    await app.init();
    
    adminToken = await createAuthToken(app, 'ADMIN');
    stylistToken = await createAuthToken(app, 'STYLIST');
  });

  afterAll(async () => {
    await teardownApp(app);
    await app.close();
  });

  it('/reports/sales (GET) - should get sales report', () => {
    return request(app.getHttpServer())
      .get('/reports/sales')
      .query({
        startDate: '2023-01-01',
        endDate: '2023-12-31'
      })
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('totalSales');
        expect(res.body).toHaveProperty('salesByMonth');
        expect(res.body).toHaveProperty('salesByService');
        expect(res.body).toHaveProperty('topServices');
        expect(res.body).toHaveProperty('averageTicket');
      });
  });

  it('/reports/appointments (GET) - should get appointments report', () => {
    return request(app.getHttpServer())
      .get('/reports/appointments')
      .query({
        startDate: '2023-01-01',
        endDate: '2023-12-31'
      })
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('totalAppointments');
        expect(res.body).toHaveProperty('appointmentsByStatus');
        expect(res.body).toHaveProperty('appointmentsByMonth');
        expect(res.body).toHaveProperty('averageDuration');
        expect(res.body).toHaveProperty('appointmentsByDayOfWeek');
      });
  });

  it('/reports/clients (GET) - should get clients report', () => {
    return request(app.getHttpServer())
      .get('/reports/clients')
      .query({
        startDate: '2023-01-01',
        endDate: '2023-12-31'
      })
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('totalClients');
        expect(res.body).toHaveProperty('newClients');
        expect(res.body).toHaveProperty('returningClients');
        expect(res.body).toHaveProperty('topClients');
        expect(res.body).toHaveProperty('averageVisitsPerClient');
      });
  });

  it('/reports/stylists (GET) - should get stylists performance report', () => {
    return request(app.getHttpServer())
      .get('/reports/stylists')
      .query({
        startDate: '2023-01-01',
        endDate: '2023-12-31'
      })
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('stylistPerformance');
        expect(res.body.stylistPerformance[0]).toHaveProperty('stylistId');
        expect(res.body.stylistPerformance[0]).toHaveProperty('name');
        expect(res.body.stylistPerformance[0]).toHaveProperty('appointmentsCount');
        expect(res.body.stylistPerformance[0]).toHaveProperty('revenue');
        expect(res.body.stylistPerformance[0]).toHaveProperty('clientRetentionRate');
      });
  });

  it('/reports/stylist/:stylistId (GET) - should get individual stylist report', () => {
    // First get a stylist ID
    return request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${stylistToken}`)
      .then(profileRes => {
        const stylistId = profileRes.body.id;
        
        return request(app.getHttpServer())
          .get(`/reports/stylist/${stylistId}`)
          .query({
            startDate: '2023-01-01',
            endDate: '2023-12-31'
          })
          .set('Authorization', `Bearer ${stylistToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('stylistId', stylistId);
            expect(res.body).toHaveProperty('appointmentsCount');
            expect(res.body).toHaveProperty('revenue');
            expect(res.body).toHaveProperty('topServices');
            expect(res.body).toHaveProperty('clientRetentionRate');
            expect(res.body).toHaveProperty('bookingRate');
          });
      });
  });

  it('/reports/export (POST) - should export report to CSV', () => {
    return request(app.getHttpServer())
      .post('/reports/export')
      .send({
        reportType: 'sales',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        format: 'csv'
      })
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect('Content-Type', /text\/csv/)
      .expect((res) => {
        expect(res.text).toBeTruthy();
        expect(res.text).toContain('Date,Revenue');
      });
  });
});
