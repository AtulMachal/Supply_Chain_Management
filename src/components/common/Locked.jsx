import React from "react";
import { Lock } from "lucide-react";

export default function Locked({ children }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
      <Lock className="mb-3 h-8 w-8 text-slate-400" />
      <p className="text-sm font-medium text-slate-600">Restricted for this role</p>
      <p className="mt-1 max-w-sm text-xs text-slate-400">
        Your current role doesn't have access to this module. Switch roles from the top bar (admin-controlled) to preview it.
      </p>
    </div>
  );
}
