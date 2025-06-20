import React from "react";
import Spinner from "./Spinner";

interface SendButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  isSubmitting: boolean;
}

export default function SendButton({
  onClick,
  disabled,
  isSubmitting,
}: SendButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="cursor-pointer flex items-center justify-center w-full py-3 rounded-[9px] text-white transition-colors font-semibold gap-4 border bg-blue-500 hover:bg-blue-600 border-blue-500 "
    >
      {isSubmitting && <Spinner />}
      {isSubmitting ? "Submitting" : "Send Tokens"}
    </button>
  );
}
