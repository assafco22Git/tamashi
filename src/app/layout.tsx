import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tamashi | פרחים",
  description: "חנות פרחים Tamashi – זרים עבודת יד, הזמנה לאיסוף עצמי",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className="h-full">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#F4B19B" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
