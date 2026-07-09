import React from "react";
import { STATUS_STYLES } from "../../utils/helpers";

export default function Badge({ children }) {
  const cls = STATUS_STYLES[children] || "bg-slate-100 text-slate-600 ring-slate-300";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${cls}`}>
      {children}
    </span>
  );
}
