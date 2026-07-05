// app/layout.tsx
import type { Metadata } from "next";
import "../styles/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CartProvider } from "@/contexts/CartContext";

export const metadata: Metadata = {
  title: "Crafties — Handcraft Marketplace",
  description: "Crafties — Find best local crafts in Indonesia",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        <ThemeProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}