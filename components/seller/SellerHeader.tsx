import Image from "next/image";
import { Seller } from "@/types/seller";
import { MapPin, Star, Package, CalendarDays } from "lucide-react";

interface Props {
  seller: Seller;
}

export default function SellerHeader({ seller }: Props) {
  return (
    <section className="rounded-2xl overflow-hidden border
                        border-neutral-200 dark:border-neutral-800
                        bg-white dark:bg-neutral-950">

      {/* Banner */}
      <div className="h-40 sm:h-52
                      bg-neutral-100 dark:bg-neutral-900" />

      {/* Profile */}
      <div className="px-5 sm:px-8 pb-6 sm:pb-8">

        {/* Avatar */}
        <Image
          src={seller.avatar}
          alt={seller.name}
          width={110}
          height={110}
          className="-mt-12 sm:-mt-14 rounded-full object-cover
                     border-4 border-white dark:border-neutral-950
                     w-[88px] h-[88px] sm:w-[110px] sm:h-[110px]"
        />

        {/* Info */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight
                           text-neutral-900 dark:text-neutral-100">
              {seller.name}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2">
              <span className="flex items-center gap-1.5 text-sm
                               text-neutral-500 dark:text-neutral-400">
                <MapPin size={13} className="flex-shrink-0" />
                {seller.location}
              </span>

              <span className="flex items-center gap-1.5 text-sm
                               text-neutral-500 dark:text-neutral-400">
                <Star
                  size={13}
                  className="flex-shrink-0 fill-amber-400 stroke-amber-400"
                />
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                  {seller.rating}
                </span>
              </span>
            </div>
          </div>

          {/* Stats pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                            bg-neutral-100 dark:bg-neutral-900
                            border border-neutral-200 dark:border-neutral-800
                            text-neutral-600 dark:text-neutral-400">
              <Package size={12} />
              {seller.totalProducts} Products
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                            bg-neutral-100 dark:bg-neutral-900
                            border border-neutral-200 dark:border-neutral-800
                            text-neutral-600 dark:text-neutral-400">
              <CalendarDays size={12} />
              Joined at {seller.joinedAt}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}