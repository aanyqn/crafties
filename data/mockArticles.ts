export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  image: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    role: string;
  };
  publishedAt: string;
  readTime: number;
  likes: number;
  dislikes: number;
  isFeatured?: boolean;
};

export const ARTICLES: Article[] = [
  {
    id: "1",
    slug: "seni-rajut-tradisional-indonesia-mendunia",
    title: "Seni Rajut Tradisional Indonesia yang Kini Mendunia",
    excerpt:
      "Pengrajin lokal Indonesia berhasil membawa seni rajut tradisional ke panggung internasional, menarik perhatian pasar Eropa dan Amerika.",
    content: [
      "Kerajinan rajut Indonesia memiliki sejarah panjang yang berakar kuat dalam budaya Nusantara. Dari Jawa hingga Sulawesi, setiap daerah memiliki motif dan teknik rajut yang khas, mencerminkan kekayaan warisan budaya yang tak ternilai. Kini, keindahan tersebut mulai dikenal luas di luar negeri, berkat usaha keras para pengrajin lokal yang terus berinovasi dan beradaptasi dengan selera pasar global.",
      "Salah satu kelompok pengrajin yang berhasil menembus pasar internasional adalah komunitas rajut di Yogyakarta. Dengan menggabungkan teknik rajut tradisional dengan desain kontemporer, mereka berhasil menciptakan produk yang diminati pembeli dari berbagai negara. Amigurumi — boneka rajut berbentuk binatang lucu — menjadi salah satu produk unggulan yang paling banyak dipesan dari mancanegara, mencerminkan perpaduan unik antara warisan lokal dan tren global.",
      "Keberhasilan ini tidak datang begitu saja. Para pengrajin harus melewati proses panjang dalam meningkatkan kualitas produk, memahami selera pasar internasional, dan membangun sistem distribusi yang handal. Platform marketplace digital memainkan peran penting dalam menghubungkan pengrajin lokal dengan pembeli global, memangkas jarak yang selama ini menjadi hambatan utama dalam menjangkau pasar ekspor.",
      "Ke depan, potensi ekspor kerajinan rajut Indonesia diprediksi akan terus meningkat seiring dengan meningkatnya kesadaran konsumen global terhadap produk-produk artisan yang berkelanjutan dan ramah lingkungan. Pemerintah pun mulai memberikan dukungan melalui program pelatihan dan akses pembiayaan bagi para pengrajin yang ingin mengembangkan bisnis mereka ke skala internasional.",
    ],
    image: "/assets/img/popular-img3.jpg",
    category: "Kerajinan",
    tags: ["rajut", "tradisional", "ekspor", "amigurumi"],
    author: { name: "Sari Dewi", role: "Editor Kerajinan" },
    publishedAt: "2025-01-15",
    readTime: 5,
    likes: 142,
    dislikes: 8,
    isFeatured: true,
  },
  {
    id: "2",
    slug: "anyaman-rotan-warisan-budaya-relevan",
    title: "Anyaman Rotan: Warisan Budaya yang Tetap Relevan di Era Modern",
    excerpt:
      "Di tengah gempuran produk sintetis, anyaman rotan kembali populer sebagai pilihan furnitur dan dekorasi ramah lingkungan yang bernilai seni tinggi.",
    content: [
      "Anyaman rotan telah menjadi bagian tak terpisahkan dari kehidupan masyarakat Indonesia selama berabad-abad. Dari keranjang belanja hingga furnitur mewah, rotan menawarkan keindahan alami yang tidak tertandingi oleh material sintetis manapun. Kini, di era kesadaran lingkungan yang semakin tinggi, anyaman rotan kembali mendapat perhatian sebagai alternatif berkelanjutan yang stylish dan bernilai estetika tinggi.",
      "Kabupaten Cirebon di Jawa Barat dikenal sebagai pusat industri furnitur rotan terbesar di Indonesia, bahkan di dunia. Ribuan pengrajin di sini menghasilkan berbagai produk mulai dari kursi santai, meja, hingga aksesori dekorasi rumah yang diekspor ke berbagai penjuru dunia. Keahlian mereka diwariskan turun-temurun, namun kini dipadukan dengan desain yang mengikuti tren global agar tetap relevan di pasar internasional.",
      "Tantangan terbesar dalam industri rotan adalah mempertahankan pasokan bahan baku yang berkelanjutan. Beberapa inisiatif telah dilakukan untuk membudidayakan tanaman rotan secara sistematis, sehingga industri ini dapat terus berkembang tanpa merusak ekosistem hutan. Kolaborasi antara pengrajin, peneliti, dan pemerintah menjadi kunci keberhasilan upaya pelestarian ini.",
      "Tren desain interior global yang menyukai sentuhan natural dan organik menjadi angin segar bagi industri rotan Indonesia. Desainer ternama dari berbagai negara semakin banyak yang melirik produk rotan Indonesia untuk melengkapi karya-karya mereka, membuka peluang baru yang menjanjikan bagi para pengrajin dan produsen lokal di seluruh Nusantara.",
    ],
    image: "/assets/img/popular-img2.jpg",
    category: "Dekorasi",
    tags: ["rotan", "anyaman", "dekorasi", "ekspor", "furnitur"],
    author: { name: "Budi Santoso", role: "Kontributor" },
    publishedAt: "2025-02-20",
    readTime: 4,
    likes: 98,
    dislikes: 5,
    isFeatured: true,
  },
  {
    id: "3",
    slug: "gelang-manik-aksesori-tradisional-tren-modern",
    title: "Gelang Manik: Aksesori Tradisional yang Jadi Tren Fashion Modern",
    excerpt:
      "Generasi muda Indonesia menghidupkan kembali tradisi membuat gelang manik, mengubahnya menjadi bisnis fashion yang diminati kaum milenial dan Gen Z.",
    content: [
      "Gelang manik bukan sekadar perhiasan. Bagi banyak suku di Indonesia, gelang manik memiliki makna ritual dan simbolik yang dalam, melambangkan status sosial, identitas budaya, hingga pesan spiritual. Kini, makna tersebut bertransformasi menjadi ekspresi personal yang digemari oleh anak muda dari berbagai latar belakang sebagai bentuk self-expression yang autentik dan bermakna.",
      "Kebangkitan tren gelang manik di kalangan milenial dan Gen Z tidak terlepas dari pengaruh media sosial. Platform seperti Instagram dan TikTok menjadi arena pamer koleksi gelang manik yang unik, mendorong lebih banyak anak muda untuk mencoba membuat sendiri atau membeli dari pengrajin lokal. Tutorial cara merangkai manik-manik menjadi konten yang sangat populer dan viral di berbagai platform digital.",
      "Yang menarik, tren ini justru mendorong eksplorasi lebih dalam terhadap motif dan warna tradisional. Banyak pengrajin muda yang terinspirasi dari pakaian adat daerah masing-masing untuk menciptakan desain gelang yang unik dan bernilai budaya. Kolaborasi antara pengrajin tradisional dan desainer muda menghasilkan produk yang kaya nilai estetika sekaligus melestarikan warisan budaya.",
      "Dari sisi bisnis, gelang manik terbukti menjadi produk yang menguntungkan dengan modal yang relatif terjangkau. Bahan-bahan seperti manik kaca, manik kristal, dan benang elastis mudah didapat dengan harga yang bersahabat. Dengan kreativitas dan ketekunan, seorang pengrajin pemula bisa menghasilkan pendapatan tambahan yang cukup signifikan hanya dari rumah.",
    ],
    image: "/assets/img/popular-img1.jpg",
    category: "Aksesori",
    tags: ["gelang", "manik", "fashion", "milenial", "DIY"],
    author: { name: "Putri Rahayu", role: "Fashion Writer" },
    publishedAt: "2025-03-10",
    readTime: 4,
    likes: 215,
    dislikes: 12,
    isFeatured: true,
  },
  {
    id: "4",
    slug: "hamper-kado-kerajinan-lokal-semua-momen",
    title: "Kado Kreatif: Kenapa Hamper Kerajinan Lokal Makin Diminati",
    excerpt:
      "Dari pernikahan hingga ulang tahun, hamper berisi produk kerajinan lokal menjadi pilihan kado yang semakin populer karena nilai estetika dan makna budayanya.",
    content: [
      "Tren pemberian kado berupa hamper produk kerajinan lokal terus meningkat dalam beberapa tahun terakhir. Berbeda dari hamper konvensional yang biasanya berisi makanan atau produk impor, hamper kerajinan lokal menawarkan sesuatu yang lebih bermakna: karya tangan yang dibuat dengan penuh cinta oleh pengrajin Indonesia dan mengandung nilai budaya yang tak ternilai harganya.",
      "Apa yang membuat hamper kerajinan lokal begitu istimewa? Pertama, setiap produk di dalamnya adalah unik — tidak ada dua buah kerajinan tangan yang persis sama. Kedua, ada cerita di balik setiap produk, tentang pengrajin yang membuatnya, teknik yang digunakan, dan budaya yang menginspirasinya. Ketiga, dengan membeli produk kerajinan lokal, pembeli turut berkontribusi langsung pada kesejahteraan pengrajin Indonesia.",
      "Dari sisi kreator, bisnis hamper kerajinan menawarkan peluang yang menarik. Dengan mengkurasi produk-produk dari berbagai pengrajin lokal, seseorang bisa membangun bisnis yang tidak memerlukan produksi sendiri namun tetap memberikan nilai tambah yang signifikan. Kemampuan dalam desain packaging dan storytelling menjadi kunci sukses dalam bisnis ini yang semakin kompetitif.",
      "Beberapa rekomendasi isi hamper kerajinan yang populer antara lain: set aksesori manik-manik, dekorasi rumah dari rotan atau kayu, lilin aromaterapi buatan tangan, produk perawatan berbahan alami, dan tekstil bermotif batik atau tenun. Kombinasikan produk-produk ini dengan packaging yang menarik untuk menciptakan hamper yang berkesan dan tak terlupakan.",
    ],
    image: "/assets/img/category-4.png",
    category: "Kado",
    tags: ["hamper", "kado", "kerajinan", "hadiah", "lokal"],
    author: { name: "Maya Kartika", role: "Lifestyle Writer" },
    publishedAt: "2025-05-28",
    readTime: 3,
    likes: 76,
    dislikes: 3,
  },
  {
    id: "5",
    slug: "panduan-memulai-bisnis-kerajinan-dari-rumah",
    title: "Panduan Lengkap Memulai Bisnis Kerajinan Tangan dari Rumah",
    excerpt:
      "Dengan modal minimal dan kreativitas yang tepat, bisnis kerajinan tangan dari rumah bisa menjadi sumber penghasilan yang menjanjikan. Berikut panduan langkah demi langkahnya.",
    content: [
      "Bisnis kerajinan tangan dari rumah semakin populer seiring meningkatnya permintaan terhadap produk handmade yang personal dan unik. Dengan memanfaatkan keahlian yang dimiliki dan platform digital yang tersedia, siapapun bisa memulai bisnis ini dengan modal yang relatif kecil. Yang terpenting adalah memiliki produk berkualitas, konsistensi dalam berkarya, dan strategi pemasaran yang tepat sasaran.",
      "Langkah pertama adalah menentukan jenis kerajinan yang akan dibuat. Pilih bidang yang sesuai dengan keahlian dan minat, karena passion akan menentukan kualitas dan keberlanjutan bisnis jangka panjang. Lakukan riset pasar untuk mengetahui produk apa yang sedang diminati, berapa harga yang bersaing, dan siapa target pembeli yang tepat. Jangan terburu-buru — luangkan waktu untuk memahami lanskap pasar sebelum mulai berjualan secara serius.",
      "Untuk pemasaran, media sosial adalah kuncinya. Buat akun Instagram, TikTok, dan Facebook khusus untuk bisnis, kemudian konsisten dalam mengunggah konten berkualitas. Tunjukkan proses pembuatan produk — behind-the-scenes selalu menarik perhatian di media sosial. Daftarkan juga produk di marketplace terpercaya untuk menjangkau lebih banyak pembeli potensial dari seluruh Indonesia.",
      "Manajemen keuangan dan operasional sama pentingnya dengan aspek kreatif. Catat setiap pengeluaran dan pendapatan dengan teliti, tetapkan harga yang tidak hanya menutup biaya bahan tapi juga menghargai waktu dan keahlian yang dicurahkan. Seiring berkembangnya bisnis, pertimbangkan untuk bergabung dengan komunitas pengrajin lokal untuk berbagi pengalaman, mendapat dukungan, dan memperluas jaringan.",
    ],
    image: "/assets/img/category-1.png",
    category: "Bisnis",
    tags: ["bisnis", "kerajinan", "panduan", "wirausaha", "rumahan"],
    author: { name: "Andri Kusuma", role: "Business Writer" },
    publishedAt: "2025-06-01",
    readTime: 6,
    likes: 189,
    dislikes: 7,
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

export const getFeaturedArticles = () =>
  ARTICLES.filter((a) => a.isFeatured).slice(0, 3);

export const getNewArticles = () =>
  [...ARTICLES]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);

export const getArticleBySlug = (slug: string) =>
  ARTICLES.find((a) => a.slug === slug);