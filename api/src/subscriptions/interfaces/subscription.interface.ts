import { SubscriptionStatus, BillingPeriod } from '../constants/subscription.constants';
import { IPlan } from './plan.interface';

export interface ISubscription {
  id: string;
  userId: string;
  plan: IPlan;
  status: SubscriptionStatus;
  startDate: Date;
  endDate?: Date;
  renewalDate?: Date;
  cancelledAt?: Date;
  isAutoRenew: boolean;
  price: number;
  currency: string;
  billingPeriod: BillingPeriod;
  paymentMethodId?: string;
  nextInvoiceId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
