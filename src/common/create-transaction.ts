export interface Transaction {
  acceptance_token: string;
  amount_in_cents: number;
  currency: string;
  customer_email: string;
  payment_method: PaymentMethod;
  reference?: string;
}

export interface PaymentMethod {
  type: string;
  token: string;
  installments: number;
}
