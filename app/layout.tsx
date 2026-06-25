import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Crafties — Handcraft Marketplace",
  description: "Crafties — Temukan kerajinan tangan terbaik dari para pengrajin lokal Indonesia.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
