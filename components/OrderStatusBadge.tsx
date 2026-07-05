import { OrderStatus } from "@/types/order";

interface Props {
  status: OrderStatus;
}

const statusStyles: Record<OrderStatus, string> = {
  Unpaid:
    "bg-red-100 text-red-700 border border-red-200",

  Process:
    "bg-blue-100 text-blue-700 border border-blue-200",

  "On Delivery":
    "bg-orange-100 text-orange-700 border border-orange-200",

  Done:
    "bg-green-100 text-green-700 border border-green-200",

  Returned:
    "bg-purple-100 text-purple-700 border border-purple-200",

  Canceled:
    "bg-neutral-100 text-neutral-600 border border-neutral-200",
};

export default function OrderStatusBadge({
  status,
}: Props) {
  return (
    <span
      className={`
        inline-flex
        items-center
        justify-center
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        whitespace-nowrap
        ${statusStyles[status]}
      `}
    >
      {status}
    </span>
  );
}