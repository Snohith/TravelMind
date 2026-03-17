import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/auth-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TravelMind | Design the Perfect Trip",
  description: "AI-Powered Destination-Based Trip Planner for selecting and organizing complex itineraries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Tell Dark Reader the page is already dark so it won't inject inline styles */}
        <meta name="color-scheme" content="dark" />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen overflow-x-hidden flex flex-col`}
      >
        <AuthProvider>
          <Navbar />
          <main className="relative z-0 flex-grow">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
