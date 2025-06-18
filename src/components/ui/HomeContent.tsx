import AirDropForm from "./AirDropForm";
import dynamic from "next/dynamic";
import { useAccount } from "wagmi";

const SafeAirDropForm = dynamic(() => import("@/components/ui/AirDropForm"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});
export default function HomeContent() {
  const { isConnected } = useAccount();
  return (
    <>{!isConnected ? <div>Please connect a wallet</div> : <AirDropForm />}</>
  );
}
