export type OrderStatus =
  | "Unpaid"
  | "Process"
  | "On Delivery"
  | "Done"
  | "Returned"
  | "Canceled";

export interface Order {
  id: string;

  productId: string;

  productName: string;

  productImage: string;

  seller: string;

  variant?: string;

  quantity: number;

  price: number;

  total: number;

  status: OrderStatus;

  createdAt: string;

  trackingNumber?: string;
}