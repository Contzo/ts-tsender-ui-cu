import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tsender",
  description: "My own clone of Tsender",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
