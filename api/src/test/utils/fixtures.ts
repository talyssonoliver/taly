import { v4 as uuidv4 } from 'uuid';

// User fixtures
export const testUser = {
  email: 'test@example.com',
  password: 'Password123!',
  firstName: 'Test',
  lastName: 'User',
  role: 'STYLIST'
};

// Salon fixtures
export const testSalon = {
  name: 'Beautiful Hair Salon',
  address: '456 Salon St, Hairtown, HT 54321',
  phone: '+1-555-456-7890',
  email: 'info@beautifulhair.com',
  website: 'https://www.beautifulhair.com',
  description: 'Premier hair salon offering a wide range of services.',
  businessHours: [
    { day: 'MONDAY', open: '09:00', close: '18:00' },
    { day: 'TUESDAY', open: '09:00', close: '18:00' },
    { day: 'WEDNESDAY', open: '09:00', close: '18:00' },
    { day: 'THURSDAY', open: '09:00', close: '18:00' },
    { day: 'FRIDAY', open: '09:00', close: '18:00' },
    { day: 'SATURDAY', open: '10:00', close: '16:00' }
  ]
};

// Service fixtures
export const testService = {
  name: 'Premium Haircut',
  description: 'Luxury haircut and styling service',
  price: 75.0,
  duration: 60, // minutes
  category: 'HAIRCUT',
  imageUrl: 'https://example.com/premium-haircut.jpg'
};

// Client fixtures
export const testClient = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@example.com',
  phone: '+1-555-789-0123',
  notes: 'Prefers morning appointments'
};

// Appointment fixtures
export const testAppointment = {
  date: (() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(10, 0, 0, 0);
    return date.toISOString();
  })(),
  status: 'PENDING',
  notes: 'First time client'
};

// Payment fixtures
export const testPayment = {
  amount: 75.0,
  status: 'PENDING',
  paymentMethod: 'CREDIT_CARD',
  tipAmount: 15.0
};

// Subscription fixtures
export const testSubscription = {
  planName: 'Monthly Premium',
  price: 29.99,
  billingCycle: 'MONTHLY',
  status: 'PENDING',
  features: ['Discounted services', 'Free monthly consultation']
};

// Helper function to generate random email
export function generateRandomEmail(): string {
  return `test-${uuidv4().substring(0, 8)}@example.com`;
}
