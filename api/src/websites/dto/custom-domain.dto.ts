import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsEnum, IsBoolean, IsArray, IsDate, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum DomainStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  FAILED = 'failed',
  VERIFYING = 'verifying',
}

export class DnsRecordDto {
  @ApiProperty({ description: 'DNS record type', example: 'CNAME' })
  @IsString()
  type: string;

  @ApiProperty({ description: 'DNS record name', example: 'www' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'DNS record value', example: 'example.com' })
  @IsString()
  value: string;

  @ApiProperty({ description: 'DNS record TTL', example: 3600 })
  ttl: number;
}

export class CustomDomainDto {
  @ApiProperty({ description: 'Custom domain ID' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Domain name', example: 'example.com' })
  @IsString()
  domain: string;

  @ApiProperty({ description: 'Domain status', enum: DomainStatus })
  @IsEnum(DomainStatus)
  status: DomainStatus;

  @ApiProperty({ description: 'Is SSL enabled', default: true })
  @IsBoolean()
  sslEnabled: boolean;

  @ApiProperty({ description: 'Required DNS records to verify domain ownership', type: [DnsRecordDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DnsRecordDto)
  dnsRecords: DnsRecordDto[];

  @ApiPropertyOptional({ description: 'When the domain was verified' })
  @IsOptional()
  @IsDate()
  verifiedAt?: Date;

  @ApiPropertyOptional({ description: 'Error message if verification failed' })
  @IsOptional()
  @IsString()
  errorMessage?: string;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}
