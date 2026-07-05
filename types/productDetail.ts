import { Product, ProductCategory, ProductStatus } from "./product";
import { Review } from "./review";
import { Variant } from "./variant";
import { Seller } from "./seller";
import { MOCK_PRODUCT_DETAILS } from "@/data/mockProductDetail";
import { Summary } from "lucide-react";

export interface ProductDetail {
  id: string;
  product: Product;

  images: string[];

  variants: VariantGroup[];

  description: string;

  seller: Seller;

  ratingDist: Record<1 | 2 | 3 | 4 | 5, number>;

  reviews: Review[];

  similar: Product[];
  total_stock : number;
}

export interface VariantGroup {
  id: string;
  label: string;
  options: Variant[];
}

export function getProductDetail(id: string): ProductDetail | undefined {
  return MOCK_PRODUCT_DETAILS.find((product) => product.id === id);
}
export function getTotalStock(id: string): number {
  const product = MOCK_PRODUCT_DETAILS.find((p) => p.id === id);
  if (!product) return 0;
  return product.variants.reduce((totalStock, variantLabel) => {
    const labelStock = variantLabel.options.reduce((sum, option) => sum + (option.stock || 0), 0);
    return totalStock + labelStock;
  }, 0);
}


