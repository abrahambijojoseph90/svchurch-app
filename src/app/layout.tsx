import type { Metadata } from "next";
import { Gilda_Display, Inter, Cinzel } from "next/font/google";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";

const gildaDisplay = Gilda_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-gilda",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://svchurch.co.uk"),
  title: "Spring Valley Church | The Valley of New Birth",
  description:
    "Spring Valley Church is a vibrant, welcoming community of believers in Luton, committed to worship, spiritual growth, and service. Join us as we journey together in faith.",
  openGraph: {
    title: "Spring Valley Church | The Valley of New Birth",
    description:
      "A vibrant, welcoming community of believers in Luton, committed to worship, spiritual growth, and service.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Spring Valley Church",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${gildaDisplay.variable} ${inter.variable} ${cinzel.variable} font-sans antialiased`}
      >
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
