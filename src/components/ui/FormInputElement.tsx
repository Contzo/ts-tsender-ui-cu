"use client";
import { useId } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
interface FormRowProps {
  label: string;
  register: UseFormRegisterReturn;
  error?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  orientation?: "horizontal" | "vertical";
}
export default function FormInputElement({
  label,
  register,
  error,
  type = "text",
  placeholder,
  disabled,
  orientation = "vertical",
}: FormRowProps) {
  const id = useId();
  const flexBoxOrientation =
    orientation === "horizontal" ? "flex-row" : "flex-col";
  return (
    <div className={`flex ${flexBoxOrientation} gap-1.5`}>
      <label htmlFor={id} className="text-zinc-600 font-medium text-sm">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-200 disabled:text-gray-500"
        {...register}
      />
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}
