import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tamashi | פרחים",
  description: "Tamashi Flower Shop – Fresh bouquets, custom orders, pickup in store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="ltr" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
