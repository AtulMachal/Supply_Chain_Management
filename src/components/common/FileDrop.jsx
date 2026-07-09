import React, { useRef } from "react";
import { FileUp } from "lucide-react";

export default function FileDrop({ label, onFile, fileName }) {
  const ref = useRef(null);
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-600">{label}</label>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="flex w-full items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2.5 text-left text-xs text-slate-500 hover:border-indigo-400 hover:bg-indigo-50/40"
      >
        <FileUp className="h-4 w-4 shrink-0 text-slate-400" />
        {fileName ? <span className="truncate font-medium text-slate-700">{fileName}</span> : "Upload photo or PDF of quotation"}
      </button>
      <input
        ref={ref}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => e.target.files[0] && onFile(e.target.files[0].name)}
      />
    </div>
  );
}
