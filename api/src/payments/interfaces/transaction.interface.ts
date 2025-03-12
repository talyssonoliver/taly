export enum TransactionType {
  PAYMENT = 'payment',
  REFUND = 'refund',
  CAPTURE = 'capture',
  AUTHORIZATION = 'authorization',
  VOID = 'void',
  DISPUTE = 'dispute',
  PAYOUT = 'payout',
  FEE = 'fee',
  ADJUSTMENT = 'adjustment',
}

export enum TransactionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  CANCELED = 'canceled',
}

export interface ITransaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  paymentId?: string;
  refundId?: string;
  externalId?: string;
  provider?: string;
  errorMessage?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ITransactionWithPayment extends ITransaction {
  payment?: {
    id: string;
    amount: number;
    status: string;
    description: string;
    userId: string;
  };
}

export interface ITransactionSummary {
  totalPayments: number;
  totalRefunds: number;
  netAmount: number;
  currency: string;
  paymentCount: number;
  refundCount: number;
  failedCount: number;
  disputeCount: number;
}

export interface ITransactionAnalytics {
  daily: {
    date: string;
    paymentsAmount: number;
    refundsAmount: number;
    netAmount: number;
    count: number;
  }[];
  weekly: {
    week: string;
    paymentsAmount: number;
    refundsAmount: number;
    netAmount: number;
    count: number;
  }[];
  monthly: {
    month: string;
    paymentsAmount: number;
    refundsAmount: number;
    netAmount: number;
    count: number;
  }[];
}
