import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../../app.module';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runSeeder() {
  const logger = new Logger('SeedRunner');
  logger.log('Starting seed runner...');

  try {
    const app = await NestFactory.create(AppModule);
    
    logger.log('Running database seed...');
    const { stdout, stderr } = await execAsync('ts-node -r tsconfig-paths/register src/database/seeds/seed.ts');
    
    if (stdout) {
      logger.log(Seed output: );
    }
    
    if (stderr) {
      logger.warn(Seed warnings: );
    }
    
    await app.close();
    logger.log('Seed process completed');
    process.exit(0);
  } catch (error) {
    logger.error(Seed runner failed: , error.stack);
    process.exit(1);
  }
}

runSeeder();
