import Image from "next/image";
import Link from "next/link";

const orders = [
  {
    id: 1,
    name: "Gelang Manik Bintang",
    price: "Rp 28.000",
    status: "Delivered",
    image: "/assets/img/popular-img1.jpg",
  },
  {
    id: 2,
    name: "Vas Bunga Rotan",
    price: "Rp 108.000",
    status: "Processing",
    image: "/assets/img/popular-img2.jpg",
  },
  {
    id: 3,
    name: "Boneka Rajut",
    price: "Rp 79.000",
    status: "Pending",
    image: "/assets/img/popular-img3.jpg",
  },
  {
    id: 4,
    name: "Gelang Manik Bintang",
    price: "Rp 28.000",
    status: "Delivered",
    image: "/assets/img/popular-img1.jpg",
  },
  {
    id: 5,
    name: "Gelang Manik Bintang",
    price: "Rp 28.000",
    status: "Delivered",
    image: "/assets/img/popular-img1.jpg",
  },
];

const statusClass: Record<string, string> = {
  Delivered: "bg-green-100 text-green-700",
  Processing: "bg-blue-100 text-blue-700",
  Pending: "bg-yellow-100 text-yellow-700",
};

export default function OrdersCard() {
  return (
    <div className="">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold">
          Orders
        </h2>

        <Link
          href="/orders"
          className="text-[#0022FF] text-sm font-medium"
        >
          See All
        </Link>
      </div>

      <div className="space-y-4 rounded-2xl border p-4 transition-colors border-neutral-200 bg-white">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex gap-3"
          >
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-neutral-200 flex-shrink-0">
              <Image
                src={order.image}
                alt={order.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">
                {order.name}
              </h3>

              <p className="text-sm text-neutral-500 mt-1">
                {order.price}
              </p>
            </div>

            <span
              className={`h-fit px-3 py-1 rounded-full text-xs font-medium ${statusClass[order.status]}`}
            >
              {order.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}