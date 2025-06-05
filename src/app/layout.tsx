import type { Metadata } from "next";
import "./globals.css";
import { type ReactNode } from "react"
import { Providers } from "./provider"
import Header from "@/_components/Header";
import { Toaster } from "react-hot-toast";

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
          <Toaster
            position="top-center"
            gutter={12}
            containerStyle={{ margin: "8px" }}
            toastOptions={{
              success: {
                duration: 3000,
              },
              error: {
                duration: 5000,
              },
              style: {
                fontSize: "16px",
                maxWidth: "500px",
                padding: "16px 24px",
                backgroundColor: "var(--color-grey-0)",
                color: "var(--color-grey-700)",
              },
            }}
          />
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
