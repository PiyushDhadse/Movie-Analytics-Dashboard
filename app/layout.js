import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CineLytics | Movie Analytics Dashboard",
  description: "Modern Movie Analytics Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex h-screen overflow-hidden bg-background text-foreground`}
      >
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top header could go here if needed later */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
