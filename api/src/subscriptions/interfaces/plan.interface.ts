import { BillingPeriod } from '../constants/subscription.constants';
import { IFeature } from './feature.interface';

export interface IPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  billingPeriod: BillingPeriod;
  isActive: boolean;
  isPublic: boolean;
  trialDays: number;
  tier?: number;
  features: IFeature[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
