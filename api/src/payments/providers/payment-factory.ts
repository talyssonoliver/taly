import { Injectable, Logger, Inject, NotFoundException } from '@nestjs/common';
import type { PaymentProvider } from '../interfaces/payment-provider.interface';
import { PaymentProvider as PaymentProviderEnum } from '../entities/payment.entity';
import type { PaymentResponse } from '../interfaces/payment-response.interface';
import type { CardDetails } from '../interfaces/card-details.interface';

// Constants for cash provider
const CASH_STATUS = {
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
};

const CASH_PREFIX = {
  TRANSACTION: 'CASH-',
  REFUND: 'CASH-REFUND-',
  CUSTOMER: 'CASH-CUSTOMER-',
};

@Injectable()
export class PaymentFactory {
  private readonly logger = new Logger(PaymentFactory.name);

  constructor(
    @Inject('PAYMENT_PROVIDERS') private readonly providers: Record<string, PaymentProvider>,
  ) {}

  /**
   * Creates a payment provider based on the provider type
   * @param providerType The type of provider to create
   * @returns A payment provider implementation
   */
  createProvider(providerType: string): PaymentProvider {
    this.logger.log(`Creating payment provider for type: ${providerType}`);
    
    const normalizedType = providerType?.toUpperCase();
    
    switch (normalizedType) {
      case PaymentProviderEnum.STRIPE:
        return this.providers.stripe;
      
      case PaymentProviderEnum.PAYPAL:
        return this.providers.paypal;
      
      case PaymentProviderEnum.CASH:
        return this.createCashProvider();
      
      default:
        this.logger.warn(`Unknown provider type: ${providerType}, defaulting to Stripe`);
        return this.providers.stripe;
    }
  }

  /**
   * Creates a basic cash payment provider implementation
   * @returns A cash payment provider
   */
  private createCashProvider(): PaymentProvider {
    return {
      processPaymentWithToken: async (
        paymentId: string, 
        amount: number, 
        token: string, 
        description: string
      ): Promise<PaymentResponse> => {
        this.logger.log(`Processing cash payment for ID: ${paymentId}, amount: ${amount}`);
        
        return {
          transactionId: `${CASH_PREFIX.TRANSACTION}${paymentId}`,
          status: CASH_STATUS.SUCCESS,
          response: JSON.stringify({ 
            message: 'Cash payment processed',
            amount,
            description 
          }),
        };
      },
      
      processPaymentWithCard: async (): Promise<PaymentResponse> => {
        throw new Error('Cash provider does not support card payments');
      },
      
      processPaymentWithSavedMethod: async (): Promise<PaymentResponse> => {
        throw new Error('Cash provider does not support saved payment methods');
      },
      
      refundPayment: async (
        transactionId: string, 
        amount: number, 
        reason: string
      ): Promise<PaymentResponse> => {
        this.logger.log(`Processing cash refund for transaction: ${transactionId}, amount: ${amount}`);
        
        return {
          transactionId: `${CASH_PREFIX.REFUND}${transactionId}`,
          status: CASH_STATUS.SUCCESS,
          response: JSON.stringify({ 
            message: 'Cash payment refunded',
            amount,
            reason 
          }),
        };
      },
      
      validateToken: async (token: string): Promise<{
        lastFour: string;
        expiryMonth: string;
        expiryYear: string;
        cardBrand: string;
      }> => {
        return {
          lastFour: 'CASH',
          expiryMonth: 'N/A',
          expiryYear: 'N/A',
          cardBrand: 'CASH',
        };
      },
      
      createCustomer: async (email: string, name: string): Promise<string> => {
        return `${CASH_PREFIX.CUSTOMER}${name.replace(/\s+/g, '-')}`;
      },
      
      createPaymentMethod: async (): Promise<string> => {
        throw new Error('Cash provider does not support creating payment methods');
      },
    };
  }
}