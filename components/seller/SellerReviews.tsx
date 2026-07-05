import { MOCK_PRODUCT_DETAILS } from "@/data/mockProductDetail";
import { Star, MessageSquare } from "lucide-react";

interface Props {
  sellerId: string;
}

function StarDisplay({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={12}
          className={
            i < Math.round(rating)
              ? "fill-amber-400 stroke-amber-400"
              : "fill-neutral-200 stroke-neutral-200 dark:fill-neutral-700 dark:stroke-neutral-700"
          }
        />
      ))}
    </div>
  );
}

export default function SellerReviews({ sellerId }: Props) {
  const reviews = MOCK_PRODUCT_DETAILS
    .filter((p) => p.seller.id === sellerId)
    .flatMap((p) => p.reviews);

  if (!reviews.length) {
    return (
      <div className="rounded-2xl border py-16 px-6 text-center
                      bg-white dark:bg-neutral-950
                      border-neutral-200 dark:border-neutral-800">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4
                        bg-neutral-100 dark:bg-neutral-800">
          <MessageSquare size={22} className="text-neutral-400 dark:text-neutral-500" />
        </div>
        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
          Belum ada ulasan untuk seller ini.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="rounded-xl border p-4 sm:p-5 transition-colors
                     bg-white dark:bg-neutral-950
                     border-neutral-200 dark:border-neutral-800"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              {/* Avatar placeholder */}
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold
                              bg-[#0022FF]/10 dark:bg-[#4d6bff]/20
                              text-[#0022FF] dark:text-[#4d6bff]">
                {review.author.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="text-sm font-semibold
                               text-neutral-900 dark:text-neutral-100">
                  {review.author}
                </h4>
                {review.rating !== undefined && (
                  <StarDisplay rating={review.rating} />
                )}
              </div>
            </div>

            {review.date && (
              <span className="text-xs flex-shrink-0
                               text-neutral-400 dark:text-neutral-500">
                {review.date}
              </span>
            )}
          </div>

          {/* Review text */}
          <p className="text-sm leading-relaxed
                        text-neutral-600 dark:text-neutral-400">
            {review.text}
          </p>
        </div>
      ))}
    </div>
  );
}