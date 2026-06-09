/** @format */

"use client";

import { ReactNode } from "react";

export default function Button({
  label,
  rounded = false,
  type = "default",
  icon,
  onClick = () => {},
}: {
  label: string;
  rounded?: boolean;
  type?: "primary" | "default" | "disable";
  icon?: ReactNode;
  onClick?: () => void;
}) {
  const bgColor = {
    primary: "bg-brand-dark",
    default: "bg-white",
    disable: "bg-slate-300",
  };

  const textColor = {
    primary: "text-white",
    default: "text-brand-dark",
    disable: "text-slate-500",
  };

  return (
    <button
      onClick={() => onClick()}
      className={`${textColor[type]} ${bgColor[type]} px-6 py-2.5 font-semibold ${
        rounded ? "rounded-full" : "rounded-md"
      } flex items-center gap-2 ${
        type === "disable" ? "cursor-not-allowed" : "cursor-pointer"
      } hover:opacity-90 transition-opacity`}
      type="button"
      disabled={type === "disable"}
    >
      {label}
      {icon && icon}
    </button>
  );
}
