"use client";

import Main from "@/components/ui/Main";
import dynamic from "next/dynamic";

const SafeAirDropForm = dynamic(() => import("@/components/ui/AirDropForm"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});
export default function Home() {
  return (
    <Main>
      <SafeAirDropForm />
    </Main>
  );
}
