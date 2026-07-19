import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FirebaseInit from "@/component/FirebaseInit";
import { AuthProvider } from "@/contexts/AuthContext";
import { StorageProvider } from "@/contexts/StorageContext";
import { MockDataProvider } from "@/contexts/MockDataContext";
import DynamicMetadata from "@/component/common/DynamicMetadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata default tanpa favicon (akan di-set oleh DynamicMetadata)
export const metadata: Metadata = {
  title: {
    default: "Desa Template",
    template: "%s | Desa Template",
  },
  description: "Website resmi desa modern dengan fitur lengkap.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}>
        <DynamicMetadata />
        <MockDataProvider>
          <AuthProvider>
            <StorageProvider>
              <FirebaseInit />
              {children}
            </StorageProvider>
          </AuthProvider>
        </MockDataProvider>
      </body>
    </html>
  );
}
