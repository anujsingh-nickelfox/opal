import type { Metadata } from "next";
import { Share_Tech, Titillium_Web } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const shareTech = Share_Tech({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-primary",
});

const titilliumWeb = Titillium_Web({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-secondary",
});

export const metadata: Metadata = {
  title: "Opal — Dashboard",
  description: "Opal task-tracker and team productivity dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${shareTech.variable} ${titilliumWeb.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-black text-white font-sans" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
