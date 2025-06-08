import { useId } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface textAreaProps {
    label: string;
    register: UseFormRegisterReturn;
    error?: string;
    placeholder?: string;
    orientation?: "horizontal" | "vertical";
}

export default function TextAreaElement({ label, register, error, placeholder, orientation = "vertical" }: textAreaProps) {
    const flexBoxOrientation = orientation === 'horizontal' ? 'flex-row' : 'flex-col'
    const id = useId();
    return (
        <div className={`flex ${flexBoxOrientation} gap-1.5`}>
            <label htmlFor={id} className="text-zinc-600 font-medium text-sm">{label}</label>
            <textarea {...register} id={id} className="bg-white py-2 px-3 border border-zinc-300 placeholder:text-zinc-500 text-zinc-900 shadow-xs rounded-lg focus:ring-[4px] focus:ring-zinc-400/15 focus:outline-none h-24 align-text-top" placeholder={placeholder} />
            {error && (<span className="text-sm text-red-600">{error}</span>)}
        </div>
    )
}
