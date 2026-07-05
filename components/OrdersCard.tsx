import Image from "next/image";
import Link from "next/link";

const orders = [
  { id: 1, name: "Gelang Manik Bintang", price: "Rp 28.000",  status: "Processing", quantity: "2", image: "/assets/img/popular-img1.jpg" },
  { id: 2, name: "Vas Bunga Rotan",      price: "Rp 108.000", status: "Processing", quantity: "1", image: "/assets/img/popular-img2.jpg" },
  { id: 3, name: "Boneka Rajut",         price: "Rp 79.000",  status: "Pending",    quantity: "1", image: "/assets/img/popular-img3.jpg" },
  { id: 4, name: "Gelang Manik Bintang", price: "Rp 28.000",  status: "Delivered",  quantity: "1", image: "/assets/img/popular-img1.jpg" },
  { id: 5, name: "Gelang Manik Bintang", price: "Rp 28.000",  status: "Delivered",  quantity: "1", image: "/assets/img/popular-img1.jpg" },
];

// Tulis full class string agar Tailwind scanner tidak strip dark: variant
const statusClass: Record<string, string> = {
  Delivered:  "bg-green-100  text-green-700  dark:bg-green-950/50  dark:text-green-400",
  Processing: "bg-blue-100   text-blue-700   dark:bg-blue-950/50   dark:text-blue-400",
  Pending:    "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400",
};

export default function OrdersCard() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold
                       text-neutral-900 dark:text-neutral-100">
          Orders
        </h2>
        <Link
          href="/orders/history"
          className="text-sm font-medium
                     text-[#0022FF] dark:text-[#4d6bff]"
        >
          See All
        </Link>
      </div>

      {/* List */}
      <div className="space-y-4 rounded-2xl border p-4 transition-colors
                      bg-white dark:bg-neutral-950
                      border-neutral-200 dark:border-neutral-800">
        {orders.map((order) => (
          <div key={order.id} className="flex gap-3">

            {/* Thumbnail */}
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border
                            border-neutral-200 dark:border-neutral-700">
              <Image
                src={order.image}
                alt={order.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate
                             text-neutral-900 dark:text-neutral-100">
                {order.name}
              </h3>
              <p className="text-sm mt-1
                            text-neutral-500 dark:text-neutral-400">
                {order.price} x {order.quantity}
              </p>
            </div>

            {/* Status Badge */}
            <span className={`h-fit px-3 py-1 rounded-full text-xs font-medium ${statusClass[order.status]}`}>
              {order.status}
            </span>

          </div>
        ))}
      </div>
    </div>
  );
}