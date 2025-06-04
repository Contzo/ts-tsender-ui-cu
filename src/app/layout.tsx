import type { Metadata } from "next";
import "./globals.css";
import { type ReactNode } from "react"
import { Providers } from "./provider"
import Header from "@/_components/Header";

export const metadata: Metadata = {
  title: "Tsender",
  description: "My own clone of Tsender",
};

export default function RootLayout(props: { children: ReactNode }) {
  const { children } = props;
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
