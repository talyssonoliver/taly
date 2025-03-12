import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Stripe from 'stripe';
import { PaymentProvider as IPaymentProvider } from '../interfaces/payment-provider.interface';
import { CardDetails } from '../interfaces/payment-provider.interface';

@Injectable()
export class StripeProvider implements IPaymentProvider {
  private readonly logger = new Logger(StripeProvider.name);
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2022-11-15',
    });
  }

  async processPaymentWithToken(
    paymentId: string,
    amount: number,
    token: string,
    description: string,
  ): Promise<any> {
    try {
      this.logger.log(Processing Stripe payment with token for payment );
      
      // Create a payment intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe requires amount in cents
        currency: 'usd',
        payment_method: token,
        confirm: true,
        description,
        metadata: {
          paymentId,
        },
      });
      
      return {
        transactionId: paymentIntent.id,
        status: paymentIntent.status,
        response: JSON.stringify(paymentIntent),
      };
    } catch (error) {
      this.logger.error(Stripe payment processing error: );
      throw error;
    }
  }

  async processPaymentWithCard(
    paymentId: string,
    amount: number,
    cardDetails: CardDetails,
    description: string,
  ): Promise<any> {
    try {
      this.logger.log(Processing Stripe payment with card for payment );
      
      // Create a payment method
      const paymentMethod = await this.stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: cardDetails.number,
          exp_month: parseInt(cardDetails.expiryMonth, 10),
          exp_year: parseInt(cardDetails.expiryYear, 10),
          cvc: cardDetails.cvc,
        },
      });
      
      // Create a payment intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe requires amount in cents
        currency: 'usd',
        payment_method: paymentMethod.id,
        confirm: true,
        description,
        metadata: {
          paymentId,
        },
      });
      
      return {
        transactionId: paymentIntent.id,
        status: paymentIntent.status,
        response: JSON.stringify(paymentIntent),
      };
    } catch (error) {
      this.logger.error(Stripe payment processing error: );
      throw error;
    }
  }

  async processPaymentWithSavedMethod(
    paymentId: string,
    amount: number,
    paymentMethodId: string,
    description: string,
  ): Promise<any> {
    try {
      this.logger.log(Processing Stripe payment with saved method for payment );
      
      // Create a payment intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe requires amount in cents
        currency: 'usd',
        payment_method: paymentMethodId,
        confirm: true,
        description,
        metadata: {
          paymentId,
        },
      });
      
      return {
        transactionId: paymentIntent.id,
        status: paymentIntent.status,
        response: JSON.stringify(paymentIntent),
      };
    } catch (error) {
      this.logger.error(Stripe payment processing error: );
      throw error;
    }
  }

  async refundPayment(
    transactionId: string,
    amount: number,
    reason?: string,
  ): Promise<any> {
    try {
      this.logger.log(Processing Stripe refund for transaction );
      
      const refund = await this.stripe.refunds.create({
        payment_intent: transactionId,
        amount: Math.round(amount * 100), // Stripe requires amount in cents
        reason: this.mapRefundReason(reason),
      });
      
      return {
        transactionId: refund.id,
        status: refund.status,
        response: JSON.stringify(refund),
      };
    } catch (error) {
      this.logger.error(Stripe refund processing error: );
      throw error;
    }
  }

  async validateToken(token: string): Promise<any> {
    try {
      this.logger.log('Validating Stripe token');
      
      // Get payment method details
      const paymentMethod = await this.stripe.paymentMethods.retrieve(token);
      
      if (!paymentMethod || !paymentMethod.card) {
        throw new Error('Invalid payment method');
      }
      
      return {
        lastFour: paymentMethod.card.last4,
        expiryMonth: paymentMethod.card.exp_month.toString(),
        expiryYear: paymentMethod.card.exp_year.toString(),
        cardBrand: paymentMethod.card.brand,
      };
    } catch (error) {
      this.logger.error(Stripe token validation error: );
      throw error;
    }
  }

  async createCustomer(email: string, name: string): Promise<string> {
    try {
      this.logger.log(Creating Stripe customer for );
      
      const customer = await this.stripe.customers.create({
        email,
        name,
      });
      
      return customer.id;
    } catch (error) {
      this.logger.error(Stripe customer creation error: );
      throw error;
    }
  }

  async createPaymentMethod(
    customerId: string,
    cardDetails: CardDetails,
  ): Promise<string> {
    try {
      this.logger.log(Creating Stripe payment method for customer );
      
      // Create a payment method
      const paymentMethod = await this.stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: cardDetails.number,
          exp_month: parseInt(cardDetails.expiryMonth, 10),
          exp_year: parseInt(cardDetails.expiryYear, 10),
          cvc: cardDetails.cvc,
        },
      });
      
      // Attach payment method to customer
      await this.stripe.paymentMethods.attach(paymentMethod.id, {
        customer: customerId,
      });
      
      return paymentMethod.id;
    } catch (error) {
      this.logger.error(Stripe payment method creation error: );
      throw error;
    }
  }

  private mapRefundReason(reason?: string): Stripe.RefundCreateParams.Reason | undefined {
    if (!reason) return undefined;
    
    if (reason.toLowerCase().includes('fraud') || reason.toLowerCase().includes('suspicious')) {
      return 'fraudulent';
    }
    
    if (reason.toLowerCase().includes('duplicate')) {
      return 'duplicate';
    }
    
    if (reason.toLowerCase().includes('request') || reason.toLowerCase().includes('asked')) {
      return 'requested_by_customer';
    }
    
    return undefined;
  }
}
