import React from "react";
import { ArrowUpDown } from "lucide-react";

export default function SortableTh({ label, sortKey, sort, setSort }) {
  const active = sort.key === sortKey;
  return (
    <th
      onClick={() => setSort({ key: sortKey, dir: active && sort.dir === "asc" ? "desc" : "asc" })}
      className="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-700"
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <ArrowUpDown className={`h-3 w-3 ${active ? "text-indigo-600" : "text-slate-300"}`} />
      </span>
    </th>
  );
}
