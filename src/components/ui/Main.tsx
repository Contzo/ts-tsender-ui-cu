"use client";
import { ReactNode } from "react";

export default function Main(props: { children: ReactNode }) {
  const { children } = props;
  return (
    <main className="w-ful flex items-center justify-center p-4 md:p-6 xl:p-8">
      {children}
    </main>
  );
}
