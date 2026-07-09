import React from "react";
export default function EmptyState({ icon: Icon, text }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <Icon className="mb-2 h-7 w-7 text-slate-300" />
      <p className="text-xs text-slate-400">{text}</p>
    </div>
  );
}
