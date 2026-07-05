import { MOCK_PRODUCTS } from "@/data/mockProducts";
import { ProductDetail } from "./productDetail";

export interface Product {
  id: string;
  sellerId: string;
  name: string;
  price: number;
  badge: string;
  rating: number;
  image: string;
  reviewCount: number;
  sold: number;
  category?: ProductCategory;
  dimensions: ProductDimensions;
  detail?: ProductDetail;
  isFeatured: boolean;
  isNew: boolean;
  status: ProductStatus;
  dateAdded: string;
  discount?: number;
}

export type ProductStatus = "Active" | "Inactive";

export type ProductCategory =
  | "Accessories"
  | "Decorations"
  | "Toys"
  | "Gifts"

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "Accessories",
  "Decorations",
  "Toys",
  "Gifts",
];

export interface ProductDimensions {
  length: number; // cm
  width: number; // cm
  height: number; // cm
  weight: number; // grams
}