import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MOE — Mother On Earth | Connect with NGOs, Make a Difference",
  description:
    "MOE — Mother On Earth connects passionate individuals with NGOs. Volunteer, donate, mentor, or offer your skills to organizations making real change in communities worldwide.",
  keywords: [
    "NGO",
    "volunteer",
    "donate",
    "social impact",
    "nonprofit",
    "community",
    "charity",
    "MOE",
    "Mother On Earth",
  ],
  openGraph: {
    title: "MOE — Mother On Earth | Connect with NGOs, Make a Difference",
    description:
      "Mother On Earth — bridging the gap between those who want to help and organizations that need it.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
