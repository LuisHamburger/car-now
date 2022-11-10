export interface PaymentCreation {
  data: Data;
  meta: null;
}

export interface Data {
  id: number;
  public_data: PublicData;
  token: string;
  type: string;
  status: string;
  customer_email: string;
}

export interface PublicData {
  bin: string;
  last_four: string;
  exp_month: string;
  exp_year: string;
  card_holder: string;
  validity_ends_at: Date;
  type: string;
}
