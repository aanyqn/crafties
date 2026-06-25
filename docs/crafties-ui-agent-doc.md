# Crafties — UI Build Documentation for Agents

> **Project:** Crafties — Web Marketplace untuk UMKM Kerajinan Tangan  
> **Stack:** Next.js (App Router) · Tailwind CSS  
> **Target:** Agent reference for building all UI pages/screens

---

## 1. Project Overview

Crafties is an e-commerce + community platform for handcraft (kerajinan tangan) SMEs. It unifies three user roles in one ecosystem:

| Role | Description |
|---|---|
| **Buyer (Pembeli)** | Browses, orders, and reviews handcraft products |
| **Seller / Craftsman (Pengrajin)** | Manages their shop, products, and fulfills orders |
| **Administrator** | Oversees the entire platform — users, shops, transactions, categories, disputes |

---

## 2. Tech Stack Constraints

- **Framework:** Next.js with App Router (`/app` directory)
- **Styling:** Tailwind CSS v4
- **Routing:** File-based under `/app/(auth)/`, `/app/(buyer)/`, `/app/(seller)/`, `/app/(admin)/`
- **Components:** Reusable components in `/components/`
- **Images:** Use `next/image` with `fill` layout where applicable
- **Auth:** Route groups to separate authenticated vs public pages

---

## 3. User Roles & Access Matrix

| Page / Feature | Buyer | Seller | Admin | Guest |
|---|---|---|---|---|
| Landing Page | ✅ | ✅ | ✅ | ✅ |
| Article Archive / Detail | ✅ | ✅ | ✅ | ✅ |
| Product Catalog / Detail | ✅ | ✅ | ✅ | ✅ |
| Register / Login | ✅ | ✅ | ✅ | ✅ |
| Cart & Checkout | ✅ | — | — | — |
| Payment | ✅ | — | — | — |
| Transaction History | ✅ | — | — | — |
| Order Tracking | ✅ | — | — | — |
| Write Review | ✅ | — | — | — |
| Profile & Account Settings | ✅ | ✅ | — | — |
| Seller Dashboard & Analytics | — | ✅ | — | — |
| Manage Products | — | ✅ | — | — |
| Manage Stock | — | ✅ | — | — |
| Process Incoming Orders | — | ✅ | — | — |
| Shop Registration Form | — | ✅ | — | — |
| Admin — Manage Users | — | — | ✅ | — |
| Admin — Verify Shops | — | — | ✅ | — |
| Admin — Manage Categories | — | — | ✅ | — |
| Admin — Monitor Transactions | — | — | ✅ | — |
| Admin — Handle Reports/Disputes | — | — | ✅ | — |
| Admin — Manage Articles | — | — | ✅ | — |

---

## 4. Pages to Build

Each section below describes one page: its route, purpose, key UI elements, and relevant use cases.

---

### 4.1 Landing Page

**Route:** `/`  
**Access:** Public  
**Use Cases:** Entry point for all users  

**UI Elements:**
- Navbar with logo, navigation links, login/register CTA
- Hero section with headline and primary CTA button ("Mulai Belanja" / "Daftarkan Toko")
- Featured product categories (grid of category cards with icons)
- Highlighted/trending products section
- Platform value proposition section (3–4 feature highlights)
- Footer with links and social media

---

### 4.2 Article Archive

**Route:** `/articles`  
**Access:** Public  
**Use Cases:** UC-22 (Melihat Artikel)  

**UI Elements:**
- Page header with title "Artikel Kerajinan"
- Search bar to filter articles
- Article card grid (thumbnail, title, excerpt, date, category tag)
- Pagination or infinite scroll

---

### 4.3 Article Detail

**Route:** `/articles/[slug]`  
**Access:** Public  
**Use Cases:** UC-22  

**UI Elements:**
- Full article header (title, author, published date, category)
- Article body (rich text / MDX rendered content)
- Related articles sidebar or section at bottom

---

### 4.4 Product Catalog

**Route:** `/products`  
**Access:** Public (Guest + Buyer)  
**Use Cases:** UC-04 (Mencari Produk)  

**UI Elements:**
- Search bar (keyword input)
- Filter sidebar or top bar: category, price range, seller location, rating
- Sort options (terlaris, terbaru, harga terendah/tertinggi)
- Product card grid: thumbnail, name, price, rating, seller name
- Empty state: "Produk tidak ditemukan" + suggestion text
- Pagination

---

### 4.5 Product Detail

**Route:** `/products/[id]`  
**Access:** Public (Guest can view; adding to cart requires login)  
**Use Cases:** UC-05 (Melihat Detail Produk), UC-06 (Menambahkan ke Keranjang)  

**UI Elements:**
- Image gallery (main image + thumbnails)
- Product name, price, stock indicator
- Variant selector (size/color if applicable)
- Quantity input
- "Tambah ke Keranjang" button (disabled if out of stock or not logged in)
- Seller info card (shop name, rating, location, "Kunjungi Toko" link)
- Product description tab
- Reviews section: overall rating stars, individual review cards (reviewer name, rating, text, optional photo)
- Error/unavailable state if product has been deleted

---

### 4.6 Shopping Cart

**Route:** `/cart`  
**Access:** Buyer (authenticated)  
**Use Cases:** UC-06, UC-07 (Melakukan Pemesanan)  

**UI Elements:**
- List of cart items: thumbnail, name, variant, unit price, quantity stepper, subtotal, remove button
- Order summary sidebar: subtotal, shipping estimate, total
- "Checkout" button
- Empty cart state with CTA back to catalog

---

### 4.7 Checkout / Order

**Route:** `/checkout`  
**Access:** Buyer (authenticated)  
**Use Cases:** UC-07 (Melakukan Pemesanan)  

**UI Elements:**
- Order items summary (read-only)
- Shipping address selector (dropdown of saved addresses + "Tambah Alamat Baru" button)
  - Modal/inline form for new address entry
- Courier/shipping method selector with cost display
- Automatically computed total (product price + shipping)
- "Buat Pesanan" button
- Order confirmation state after submission (invoice number displayed)

---

### 4.8 Payment

**Route:** `/orders/[orderId]/pay`  
**Access:** Buyer (authenticated)  
**Use Cases:** UC-08 (Melakukan Pembayaran)  

**UI Elements:**
- Invoice summary (order number, items, total amount)
- Payment method selector: Virtual Account, E-Wallet, etc.
- Payment instructions / countdown timer (24-hour deadline display)
- Status feedback: processing → confirmed → "Dibayar"
- Timeout/cancellation notice if deadline exceeded

---

### 4.9 Transaction History

**Route:** `/orders`  
**Access:** Buyer (authenticated)  
**Use Cases:** UC-09, UC-10  

**UI Elements:**
- Tab navigation: Semua / Menunggu Pembayaran / Diproses / Dikirim / Selesai / Dibatalkan
- Order cards: order number, date, product thumbnail, total, status badge
- "Lacak Pesanan" button (appears on "Dikirim" tab)
- "Beri Ulasan" button (appears on "Selesai" tab)
- "Bayar Sekarang" button (appears on "Menunggu Pembayaran" tab)

---

### 4.10 Order Tracking

**Route:** `/orders/[orderId]/track`  
**Access:** Buyer (authenticated)  
**Use Cases:** UC-09 (Melacak Pesanan)  

**UI Elements:**
- Order header (invoice number, product name, recipient address)
- Shipping status timeline (from "Pesanan Dibuat" to "Paket Diterima")
- Courier name, tracking/resi number (copyable)
- "Konfirmasi Diterima" button (shown when package has arrived)
- Error/fallback state: "Gagal memuat histori pelacakan" + resi copy option

---

### 4.11 Write Review

**Route:** Modal or `/orders/[orderId]/review`  
**Access:** Buyer (authenticated, order status = Selesai)  
**Use Cases:** UC-10 (Memberikan Ulasan)  

**UI Elements:**
- Product name + thumbnail (read-only context)
- Star rating selector (1–5 stars, interactive)
- Review text textarea
- Optional photo upload
- "Kirim Ulasan" button
- Success toast: "Terima kasih atas ulasan Anda"

---

### 4.12 Authentication — Register & Login

**Route:** `/register`, `/login`  
**Access:** Guest only (redirect authenticated users)  
**Use Cases:** UC-01 (Registrasi Akun), UC-02 (Login)  

**Register UI Elements:**
- Full name, email, password, confirm password inputs
- Role selector: Pembeli / Pengrajin
- "Daftar" button
- Inline validation errors (email taken, weak password, etc.)
- Email verification notice after submission

**Login UI Elements:**
- Email + password inputs
- "Masuk" button
- Error states: wrong credentials, suspended account ("Akun Anda telah dinonaktifkan oleh administrator")
- Link to registration

---

### 4.13 Profile & Account Settings

**Route:** `/profile`  
**Access:** Buyer & Seller (authenticated)  
**Use Cases:** UC-03 (Mengelola Profil)  

**UI Elements:**
- Avatar/photo upload (click to replace)
- Editable fields: full name, phone number, address
- Password change section (current password, new password, confirm)
- "Simpan Perubahan" button
- Success notification on save
- Validation error messages for invalid inputs

---

### 4.14 Seller Dashboard & Analytics

**Route:** `/seller/dashboard`  
**Access:** Seller (authenticated, verified shop)  
**Use Cases:** UC-15 (Melihat Dashboard Analitik)  

**UI Elements:**
- Summary cards: total revenue, total orders, total products, store visitors
- Revenue chart (line/bar chart by day or month, period selector)
- Best-selling products list (rank, product name, units sold, revenue)
- Recent orders table (preview of latest 5 orders with status)
- Quick action buttons: "Kelola Produk", "Daftar Pesanan"

---

### 4.15 Manage Products (Seller)

**Route:** `/seller/products`  
**Access:** Seller (authenticated, verified shop)  
**Use Cases:** UC-12 (Mengelola Produk)  

**UI Elements:**
- Product data table: thumbnail, name, category, price, stock, status, actions
- "Tambah Produk Baru" button
- Edit and Delete action buttons per row
- Delete confirmation modal
- Product form (Add/Edit) — modal or separate page:
  - Name, description (rich text/textarea), category dropdown, price, dimensions, variant inputs
  - Photo upload (max 5MB, supported formats only)
  - "Simpan" button + validation errors

---

### 4.16 Manage Stock (Seller)

**Route:** `/seller/stock`  
**Access:** Seller (authenticated, verified shop)  
**Use Cases:** UC-13 (Mengelola Stok)  

**UI Elements:**
- Table: product name, current stock (editable inline number input)
- "Perbarui Semua Stok" button (bulk save)
- Success toast on update

---

### 4.17 Process Incoming Orders (Seller)

**Route:** `/seller/orders`  
**Access:** Seller (authenticated, verified shop)  
**Use Cases:** UC-14 (Memproses Pesanan)  

**UI Elements:**
- Tab navigation: Baru / Diproses / Dikirim / Selesai / Dibatalkan
- Order cards: buyer name, items, total, order date, status
- "Terima Pesanan" button → changes status to "Diproses"
- "Tolak Pesanan" button → opens modal with reason input (triggers refund)
- Resi input field + "Konfirmasi Pengiriman" button (on "Diproses" orders)

---

### 4.18 Shop Registration Form (Seller)

**Route:** `/seller/register-shop`  
**Access:** Seller account without an existing shop  
**Use Cases:** UC-11 (Mendaftarkan Toko)  

**UI Elements:**
- Shop name, short description, full address, location coordinates input (or map picker)
- KTP photo upload
- Shop/product portfolio photo upload
- "Ajukan Pendaftaran Toko" button
- Pending status screen: "Pengajuan Anda sedang menunggu verifikasi admin (maks. 2×24 jam)"
- Validation: duplicate shop name error

---

### 4.19 Admin — Manage Users

**Route:** `/admin/users`  
**Access:** Admin  
**Use Cases:** UC-16 (Mengelola Pengguna)  

**UI Elements:**
- User data table: ID, name, email, role, registered date, status badge (Aktif / Nonaktif)
- Search and filter bar (by role, status)
- Row action: "Nonaktifkan Akun" → confirmation modal → status update
- Status badge color: green (Aktif), red (Nonaktif)

---

### 4.20 Admin — Verify Shops

**Route:** `/admin/shops`  
**Access:** Admin  
**Use Cases:** UC-17 (Verifikasi Toko Pengrajin)  

**UI Elements:**
- Pending shop list: shop name, applicant name, submitted date, status = "Menunggu Verifikasi"
- Detail view: shop name, KTP photo (lightbox), address, product portfolio images
- "Setujui Toko" button (green) → activates shop, sends email notification
- "Tolak Pengajuan" button (red) → opens modal with rejection reason text input → sends email to seller

---

### 4.21 Admin — Manage Categories

**Route:** `/admin/categories`  
**Access:** Admin  
**Use Cases:** UC-18 (Mengelola Kategori Produk)  

**UI Elements:**
- Category tree list: icon, name, description, actions
- "Tambah Kategori" button → inline form or modal:
  - Name, description, icon image upload
  - "Simpan" button
- Duplicate name validation error
- Edit and Delete per category row

---

### 4.22 Admin — Monitor Transactions

**Route:** `/admin/transactions`  
**Access:** Admin  
**Use Cases:** UC-19 (Memantau Transaksi)  

**UI Elements:**
- Global transaction log table: invoice number, buyer, seller, amount, payment method, status, date
- Filter by status, date range, seller
- Real-time status indicators (paid, pending, cancelled, refunded)
- Withdrawal/disbursement status view for sellers
- "Unduh Laporan" button (export to Excel/PDF)

---

### 4.23 Admin — Handle Disputes/Reports

**Route:** `/admin/reports`  
**Access:** Admin  
**Use Cases:** UC-20 (Menangani Laporan)  

**UI Elements:**
- Report ticket list: ticket ID, reporter name, issue type, status (Open / Resolved), date
- Ticket detail view: issue description, attached evidence (photos/videos/chat logs)
- Admin response textarea
- Decision: "Kembalikan Dana ke Pembeli" or "Teruskan Dana ke Pengrajin"
- "Selesaikan Tiket" button → closes ticket, sends resolution emails to both parties

---

### 4.24 Admin — Manage Articles

**Route:** `/admin/articles`  
**Access:** Admin  
**Use Cases:** UC-21 (Mengelola Artikel)  

**UI Elements:**
- Article list table: title, category, published date, status (Published / Draft), actions
- "Tambah Artikel" button → article editor (title, slug, category, rich text body, thumbnail upload, publish/draft toggle)
- Edit and Delete per article row
- Publish confirmation

---

## 5. Shared / Reusable Components

| Component | Description |
|---|---|
| `Navbar` | Top navigation bar. Varies by auth state and role. |
| `Footer` | Site-wide footer with links. |
| `ProductCard` | Used in catalog, search results, and seller dashboard. |
| `ArticleCard` | Used in article archive. |
| `OrderCard` | Used in buyer transaction history and seller order list. |
| `RatingStars` | Interactive (for review form) and read-only (for product display). |
| `StatusBadge` | Color-coded status tag (e.g., Aktif, Nonaktif, Menunggu, Dikirim). |
| `Modal` | Generic confirmation modal (delete, suspend, reject). |
| `Toast / Notification` | Inline success/error notifications. |
| `Pagination` | Page controls for lists and tables. |
| `Sidebar` | Navigation for seller and admin dashboards. |
| `FileUpload` | Drag-and-drop or click-to-upload for images (with size/type validation). |
| `DataTable` | Generic sortable table used in admin pages. |

---

## 6. Key Business Rules & Validation

| Rule | Detail |
|---|---|
| Cart requires login | Guest users must log in before adding to cart |
| Stock check on add to cart | Block if requested quantity > available stock |
| Payment deadline | Orders auto-cancel after 24 hours without payment; stock is restored |
| Review unlock | Buyer can only review after order status = "Selesai" |
| Seller must be verified | Seller cannot add products until shop is approved by admin |
| Unique shop name | Duplicate shop names are rejected on registration |
| Unique email | Duplicate email on registration shows an inline error |
| Suspended account | Suspended users cannot log in; show specific error message |
| Seller rejection can resubmit | Rejected shops can edit and reapply |
| Product unavailable redirect | If a product is deleted, product detail page redirects to homepage |

---

## 7. Page-to-Use Case Reference

| Page | Use Case IDs |
|---|---|
| Register | UC-01 |
| Login | UC-02 |
| Profile Settings | UC-03 |
| Product Catalog | UC-04 |
| Product Detail | UC-05 |
| Cart | UC-06 |
| Checkout | UC-07 |
| Payment | UC-08 |
| Order Tracking | UC-09 |
| Write Review | UC-10 |
| Shop Registration (Seller) | UC-11 |
| Manage Products (Seller) | UC-12 |
| Manage Stock (Seller) | UC-13 |
| Process Orders (Seller) | UC-14 |
| Seller Analytics Dashboard | UC-15 |
| Admin — Manage Users | UC-16 |
| Admin — Verify Shops | UC-17 |
| Admin — Manage Categories | UC-18 |
| Admin — Monitor Transactions | UC-19 |
| Admin — Handle Disputes | UC-20 |
| Admin — Manage Articles | UC-21 |
| Article Archive & Detail | UC-22 |
