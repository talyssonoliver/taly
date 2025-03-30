import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { PrismaClient } from '@prisma/client/extension';
import { setupTestDatabase, teardownTestDatabase } from './setup-test-db';

// Mock PrismaClient
jest.mock('@prisma/client/extension', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      $executeRawUnsafe: jest.fn().mockResolvedValue(undefined),
      $executeRaw: jest.fn().mockResolvedValue(undefined),
      $disconnect: jest.fn().mockResolvedValue(undefined)
    }))
  };
});

describe('Test Database Setup', () => {
  const originalEnv = process.env;
  
  beforeAll(() => {
    process.env.DATABASE_URL = 'postgres://user:password@localhost:5432/maindb';
  });

  afterAll(() => {
    process.env = originalEnv;
  });
  
  it('should create a test database successfully', async () => {
    const mockPrisma = new PrismaClient();
    const testDbName = await setupTestDatabase(mockPrisma);
    expect(testDbName).toMatch(/^test_[0-9a-f_]+$/);
    expect(process.env.DATABASE_URL).toContain(`/${testDbName}`);
  });

  it('should tear down a test database successfully', async () => {
    const mockPrisma = new PrismaClient();
    const testDbName = 'test_mock_db';
    
    // Pass the PrismaClient instance to teardownTestDatabase
    await teardownTestDatabase(testDbName, mockPrisma);
    
    expect(mockPrisma.$executeRawUnsafe).toHaveBeenCalledTimes(2);
    expect(mockPrisma.$disconnect).toHaveBeenCalled();
  });
  it('should throw an error when DATABASE_URL is not defined', async () => {
    delete process.env.DATABASE_URL;
    const mockPrisma = new PrismaClient();
    await expect(setupTestDatabase(mockPrisma)).rejects.toThrow('DATABASE_URL is not defined');
    process.env.DATABASE_URL = 'postgres://user:password@localhost:5432/maindb';
  });
  it('should handle database creation errors', async () => {
    const mockPrisma = new PrismaClient();
    (mockPrisma.$executeRawUnsafe as jest.MockedFunction<any>).mockRejectedValueOnce(new Error('DB creation failed'));
    
    await expect(setupTestDatabase(mockPrisma)).rejects.toThrow('DB creation failed');
  });
  
  it('should handle errors without providing PrismaClient', async () => {
    await expect(setupTestDatabase()).rejects.toThrow('DB creation failed');
  });
});


