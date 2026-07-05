import { Seller } from "@/types/seller";
import { getSellerTotalProduct } from "@/types/seller";

const RAW_SELLERS = [
  {
    id: "seller-1",
    name: "Haruna Craft",
    avatar: "/assets/img/hero-image1.png",
    rating: 4.8,
    location: "Bandung, Jawa Barat",
    joinedAt: "2022-03-15",
    bannerImage: "/assets/img/hero-image3.jpg",   // ← banner toko
    promo: {
      id: "promo-1",
      image: "/assets/img/popular-img1.jpg",       // ← promo/diskon image
      title: "Diskon Akhir Tahun 30%",
      description: "Semua produk aksesori rajut pilihan harga spesial. Penawaran terbatas!",
      relatedProductIds: ["1", "2"],               // ← id produk terkait promo
    },
  },
  {
    id: "seller-2",
    name: "Gamora Studio",
    avatar: "/assets/img/hero-image1.png",
    rating: 4.7,
    location: "Yogyakarta",
    joinedAt: "2021-10-08",
    bannerImage: "/assets/img/hero-image3.jpg",   // ← banner toko
    promo: {
      id: "promo-1",
      image: "/assets/img/popular-img1.jpg",       // ← promo/diskon image
      title: "Diskon Akhir Tahun 30%",
      description: "Semua produk aksesori rajut pilihan harga spesial. Penawaran terbatas!",
      relatedProductIds: ["1", "2"],               // ← id produk terkait promo
    },
  },
  {
    id: "seller-3",
    name: "Arcane Knit",
    avatar: "/assets/img/hero-image1.png",
    rating: 4.9,
    location: "Malang",
    joinedAt: "2023-01-10",
    bannerImage: "/assets/img/hero-image3.jpg",   // ← banner toko
    promo: {
      id: "promo-1",
      image: "/assets/img/popular-img1.jpg",       // ← promo/diskon image
      title: "Diskon Akhir Tahun 30%",
      description: "Semua produk aksesori rajut pilihan harga spesial. Penawaran terbatas!",
      relatedProductIds: ["1", "2"],               // ← id produk terkait promo
    },
  },
  {
    id: "seller-4",
    name: "Blossom Beads",
    avatar: "/assets/img/hero-image1.png",
    rating: 4.6,
    location: "Surabaya",
    joinedAt: "2022-07-18",
    bannerImage: "/assets/img/hero-image3.jpg",   // ← banner toko
    promo: {
      id: "promo-1",
      image: "/assets/img/popular-img1.jpg",       // ← promo/diskon image
      title: "Diskon Akhir Tahun 30%",
      description: "Semua produk aksesori rajut pilihan harga spesial. Penawaran terbatas!",
      relatedProductIds: ["1", "2"],               // ← id produk terkait promo
    },
  },
  {
    id: "seller-5",
    name: "Gifted Box",
    avatar: "/assets/img/hero-image1.png",
    rating: 4.8,
    location: "Jakarta",
    joinedAt: "2021-06-22",
    bannerImage: "/assets/img/hero-image3.jpg",   // ← banner toko
    promo: {
      id: "promo-1",
      image: "/assets/img/popular-img1.jpg",       // ← promo/diskon image
      title: "Diskon Akhir Tahun 30%",
      description: "Semua produk aksesori rajut pilihan harga spesial. Penawaran terbatas!",
      relatedProductIds: ["1", "2"],               // ← id produk terkait promo
    },
  },
  {
    id: "seller-6",
    name: "WoodArt Studio",
    avatar: "/assets/img/hero-image1.png",
    rating: 4.9,
    location: "Bali",
    joinedAt: "2020-11-11",
    bannerImage: "/assets/img/hero-image3.jpg",   // ← banner toko
    promo: {
      id: "promo-1",
      image: "/assets/img/popular-img1.jpg",       // ← promo/diskon image
      title: "Diskon Akhir Tahun 30%",
      description: "Semua produk aksesori rajut pilihan harga spesial. Penawaran terbatas!",
      relatedProductIds: ["1", "2"],               // ← id produk terkait promo
    },
  },
  {
    id: "seller-7",
    name: "Leather Works",
    avatar: "/assets/img/hero-image1.png",
    rating: 4.1,
    location: "Pasuruan",
    joinedAt: "2020-01-21",
    bannerImage: "/assets/img/hero-image3.jpg",   // ← banner toko
    promo: {
      id: "promo-1",
      image: "/assets/img/popular-img1.jpg",       // ← promo/diskon image
      title: "Diskon Akhir Tahun 30%",
      description: "Semua produk aksesori rajut pilihan harga spesial. Penawaran terbatas!",
      relatedProductIds: ["1", "2"],               // ← id produk terkait promo
    },
  },
];

export const MOCK_SELLERS: Seller[] = RAW_SELLERS.map((seller) => ({
  ...seller,
  totalProducts: getSellerTotalProduct(seller.id),
  // ID dikirim secara dinamis di sini
}));