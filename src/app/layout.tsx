import type { Metadata } from "next";
import "./globals.css";
import {type ReactNode} from "react"
import {Providers} from "./provider"

export const metadata: Metadata = {
  title: "Tsender",
  description: "My own clone of Tsender",
};

export default function RootLayout(props: {children: ReactNode}) {
  const { children } = props; 
  return (
    <html lang="en">
      <body>
        Hi from layout 
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
