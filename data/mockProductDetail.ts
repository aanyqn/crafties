import { MOCK_PRODUCTS } from "./mockProducts";
import { getTotalStock, ProductDetail } from "@/types/productDetail";
import { MOCK_SELLERS } from "./mockSellers";

export const MOCK_PRODUCT_DETAILS: ProductDetail[] = MOCK_PRODUCTS.map(
    (product) => {
        const seller =
            MOCK_SELLERS.find((s) => s.name === product.badge)!;
        const variants = [
            {
                id: "1",
                label: "Warna",
                options: [
                    { id:1, name: "Natural", stock: 3 },
                    { id:2, name: "Putih", stock: 2 },
                    { id:3, name: "Hitam", stock: 1 },
                ],
            },
            {
                id: "2",
                label: "Ukuran",
                options: [
                    { id:4, name: "S", stock: 2 },
                    { id:5, name: "M", stock: 3 },
                    { id:6, name: "L", stock: 4 },
                ],
            },
        ];
        const total_stock = variants.reduce((totalStock, variantLabel) => {
            const labelStock = variantLabel.options.reduce((sum, option) => sum + (option.stock || 0), 0);
            return totalStock + labelStock;
        }, 0);

        return {
            id: product.id,
            product: product,

            images: [
                product.image,
                product.image,
                product.image,
                product.image,
            ],

            variants: variants,
            total_stock: total_stock,

            description: `${product.name} merupakan produk handmade berkualitas yang dibuat langsung oleh pengrajin lokal Indonesia menggunakan material pilihan. Cocok digunakan sebagai koleksi pribadi maupun hadiah untuk orang tersayang. Setiap produk dibuat dengan teliti sehingga memiliki karakter unik dan nilai seni yang tinggi.`,

            seller,

            ratingDist: {
                5: Math.floor(product.reviewCount * 0.68),
                4: Math.floor(product.reviewCount * 0.20),
                3: Math.floor(product.reviewCount * 0.08),
                2: Math.floor(product.reviewCount * 0.03),
                1: Math.floor(product.reviewCount * 0.01),
            },

            reviews: [
                {
                    id: "1",
                    author: "Andi Pratama",
                    avatar: "/assets/img/avatar-1.png",
                    rating: 5,
                    date: "12 June 2026",
                    text: "Produknya sangat rapi dan sesuai foto. Pengiriman cepat dan penjual sangat responsif.",
                },
                {
                    id: "2",
                    author: "Siti Rahma",
                    avatar: "/assets/img/avatar-2.png",
                    rating: 4,
                    date: "8 June 2026",
                    text: "Kualitas bagus, packaging aman. Akan beli lagi nanti.",
                },
                {
                    id: "3",
                    author: "Budi Santoso",
                    avatar: "/assets/img/avatar-3.png",
                    rating: 5,
                    date: "2 June 2026",
                    text: "Handmade tetapi finishing sangat profesional. Sangat direkomendasikan.",
                },
            ],

            similar: MOCK_PRODUCTS.filter(
                (p) => p.category === product.category && p.id !== product.id
            ).slice(0, 4),
        }
    });