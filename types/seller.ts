import { MOCK_PRODUCTS } from "@/data/mockProducts";
import { SellerPromo } from "./sellerPromo";

export interface Seller {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  location: string;
  totalProducts: number;
  joinedAt: string;
  bannerImage: string;
  promo?: SellerPromo;
}

export function getSellerTotalProduct(sellerId: string): number {
  return MOCK_PRODUCTS.filter((product) => product.sellerId === sellerId).length;
}