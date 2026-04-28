import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/components/layout/AuthProvider";

export const metadata: Metadata = {
  title: "AI Life Manager",
  description: "Smart daily planning powered by your energy levels",
  manifest: "/manifest.json",
  themeColor: "#4a7c59",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="app-container bg-white dark:bg-gray-950 shadow-xl min-h-svh">
            {children}
          </div>
        </AuthProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#1a202c",
              color: "#fff",
              fontSize: "14px",
              borderRadius: "10px",
              maxWidth: "340px",
            },
          }}
        />
      </body>
    </html>
  );
}
