import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { Providers } from "@/components/providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RefurbTech - Certified Refurbished Laptops",
  description: "Shop certified refurbished laptops with warranty. Quality checked, affordable prices, eco-friendly. Free shipping on orders over $500.",
  keywords: ["refurbished laptops", "certified laptops", "used laptops", "refurbished computers", "laptop deals"],
  openGraph: {
    title: "RefurbTech - Certified Refurbished Laptops",
    description: "Shop certified refurbished laptops with warranty. Quality checked, affordable prices.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} h-full font-sans antialiased bg-white text-slate-900 flex flex-col`}>
        <Providers>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1e293b',
                color: '#fff',
                borderRadius: '12px',
                padding: '16px',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}