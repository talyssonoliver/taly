import { Injectable, Logger, Inject } from '@nestjs/common';
import type { PaymentProvider } from '../interfaces/payment-provider.interface';
import { PaymentProvider as PaymentProviderEnum } from '../entities/payment.entity';

@Injectable()
export class PaymentFactory {
  private readonly logger = new Logger(PaymentFactory.name);

  constructor(
    @Inject('PAYMENT_PROVIDERS') private readonly providers: Record<string, PaymentProvider>,
  ) {}

  createProvider(providerType: string): PaymentProvider {
    this.logger.log(Creating payment provider for type: );
    
    switch (providerType.toUpperCase()) {
      case PaymentProviderEnum.STRIPE:
        return this.providers.stripe;
      
      case PaymentProviderEnum.PAYPAL:
        return this.providers.paypal;
      
      case PaymentProviderEnum.CASH:
        // Cash doesn't need a provider, but we need to return something
        return this.createCashProvider();
      
      default:
        this.logger.warn(Unknown provider type: , defaulting to Stripe);
        return this.providers.stripe;
    }
  }

  private createCashProvider(): PaymentProvider {
    return {
      processPaymentWithToken: async (paymentId, amount, token, description) => {
        return {
          transactionId: CASH-,
          status: 'SUCCESS',
          response: JSON.stringify({ message: 'Cash payment processed' }),
        };
      },
      
      processPaymentWithCard: async (paymentId, amount, cardDetails, description) => {
        throw new Error('Cash provider does not support card payments');
      },
      
      processPaymentWithSavedMethod: async (paymentId, amount, paymentMethodId, description) => {
        throw new Error('Cash provider does not support saved payment methods');
      },
      
      refundPayment: async (transactionId, amount, reason) => {
        return {
          transactionId: CASH-REFUND-,
          status: 'SUCCESS',
          response: JSON.stringify({ message: 'Cash payment refunded' }),
        };
      },
      
      validateToken: async (token) => {
        return {
          lastFour: 'CASH',
          expiryMonth: 'N/A',
          expiryYear: 'N/A',
          cardBrand: 'CASH',
        };
      },
      
      createCustomer: async (email, name) => {
        return 'CASH-CUSTOMER';
      },
      
      createPaymentMethod: async (customerId, cardDetails) => {
        throw new Error('Cash provider does not support creating payment methods');
      },
    };
  }
}
