import { registerAs } from '@nestjs/config';

export const awsConfig = registerAs('aws', () => ({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'your-key-id',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'your-secret-key',
  s3: {
    bucketName: process.env.AWS_S3_BUCKET_NAME || 'your-bucket-name',
  },
}));
