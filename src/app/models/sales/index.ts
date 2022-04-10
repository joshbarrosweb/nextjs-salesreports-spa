import { Client } from "../clients"
import { Product } from "../products"

export interface Sales {
  client?: Client;
  items?: Array<SaleItem>;
  paymentForm?: string;
  total: number;
}

export interface SaleItem {
  product: Product;
  quantity: number;
}
