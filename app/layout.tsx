// app/layout.tsx
import type { Metadata } from "next";
import "../styles/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CartProvider } from "@/contexts/CartContext";

export const metadata: Metadata = {
  title: "Crafties",
  description: "Crafties — Find best local crafts in Indonesia",
  icons: [
      {
        url: '/assets/img/tes.png',
        sizes: '10'
      },
    ],
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