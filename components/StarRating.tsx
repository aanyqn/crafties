import { Star } from "lucide-react";

type StarRatingProps = {
  rating: number;
  max?: number;
  size?: number;
  showValue?: boolean;
  className?: string;
};

export default function StarRating({
  rating,
  max = 5,
  size = 14,
  showValue = false,
  className = "",
}: StarRatingProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 ${className}`}
      aria-label={`Rating: ${rating} out of ${max}`}
    >
      {Array.from({ length: max }, (_, i) => {
        const full = i + 1 <= Math.floor(rating);
        const half = !full && i < rating && i + 1 > rating;

        if (half) {
          return (
            // Teknik overlay: empty star di bawah, filled star di-clip 50% di atas
            <span
              key={i}
              className="relative inline-flex flex-shrink-0"
              style={{ width: size, height: size }}
              aria-hidden="true"
            >
              {/* Background: empty */}
              <Star
                width={size}
                height={size}
                fill="var(--color-star-empty)"
                stroke="var(--color-star-empty-stroke)"
                strokeWidth={1.5}
              />
              {/* Foreground: filled, clip kiri 50% */}
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: "50%" }}
              >
                <Star
                  width={size}
                  height={size}
                  fill="var(--color-star-filled)"
                  stroke="var(--color-star-filled)"
                  strokeWidth={1.5}
                />
              </span>
            </span>
          );
        }

        return (
          <Star
            key={i}
            width={size}
            height={size}
            fill={full ? "var(--color-star-filled)" : "var(--color-star-empty)"}
            stroke={full ? "var(--color-star-filled)" : "var(--color-star-empty-stroke)"}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        );
      })}

      {showValue && (
        <span className="text-xs font-semibold ml-0.5 text-neutral-700 dark:text-neutral-300">
          {rating.toFixed(1)}
        </span>
      )}
    </span>
  );
}