import { DomainStatus, DnsRecordDto } from '../dto/custom-domain.dto';

export interface ICustomDomain {
  id: string;
  websiteId: string;
  domain: string;
  status: DomainStatus;
  sslEnabled: boolean;
  dnsRecords: DnsRecordDto[];
  verifiedAt?: Date;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICustomDomainWithWebsite extends ICustomDomain {
  website: {
    id: string;
    name: string;
    url: string;
  };
}
