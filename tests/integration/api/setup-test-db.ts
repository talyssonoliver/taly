import { PrismaClient } from '@prisma/client/extension';
import { randomBytes } from 'crypto';

/**
 * Sets up a test database by creating a new database with a random name
 * and updating the DATABASE_URL environment variable
 * @returns The name of the created test database
 */
export async function setupTestDatabase(): Promise<string> {
  const prisma = new PrismaClient();
  
  try {
    // Generate a unique database name
    const testDbName = `test_${randomBytes(8).toString('hex').replace(/-/g, '_')}`;
    
    // Create the test database
    await prisma.$executeRawUnsafe(`CREATE DATABASE ${testDbName};`);
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined in environment variables');
    }
    
    process.env.DATABASE_URL = process.env.DATABASE_URL.replace(
      /\/([^\/\?]+)(\?|$)/,
      `/${testDbName}$2`
    );
    
    // Run migrations
    await prisma.$executeRaw`npx prisma migrate deploy`;
    
    console.log(`Test database "${testDbName}" created and migrated`);
    return testDbName;
  } catch (error) {
    console.error('Error setting up test database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Tears down the test database after tests complete
 */
async function teardownTestDatabase(testDbName: string, prismaClient?: PrismaClient) {
  const prisma = prismaClient || new PrismaClient();
  
  try {
    // Disconnect all connections
    await prisma.$executeRawUnsafe(`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = '${testDbName}'
    `);
    
    // Drop the test database
    await prisma.$executeRawUnsafe(`DROP DATABASE IF EXISTS ${testDbName};`);
    
    console.log(`Test database "${testDbName}" dropped`);
  } catch (error) {
    console.error('Error tearing down test database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
  
export { teardownTestDatabase };

