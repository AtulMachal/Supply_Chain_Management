import React from "react";
import { Lock } from "lucide-react";

export default function Sidebar({ sidebarOpen, page, setPage, role, NAV }) {
  return (
    <aside className={`${sidebarOpen ? "w-64" : "w-16"} shrink-0 bg-slate-900 transition-all duration-200 relative z-20`}>
      <div className="flex h-14 items-center gap-2 border-b border-slate-800 px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">SC</div>
        {sidebarOpen && <span className="truncate text-sm font-semibold text-white">SupplyLine</span>}
      </div>
      <nav className="mt-3 space-y-0.5 px-2">
        {NAV.filter((n) => n.always || n.on).map((n) => {
          const Icon = n.icon;
          const active = page === n.key;
          return (
            <button
              key={n.key}
              onClick={() => setPage(n.key)}
              className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors
                ${active ? "bg-indigo-600/15 text-white ring-1 ring-inset ring-indigo-500/40" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"}`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${active ? "text-indigo-400" : ""}`} />
              {sidebarOpen && <span className="truncate">{n.label}</span>}
              {!sidebarOpen && (
                <div className="absolute left-full ml-2 hidden rounded bg-slate-800 px-2 py-1 text-xs text-white group-hover:block z-50 whitespace-nowrap shadow-lg">
                  {n.label}
                </div>
              )}
            </button>
          );
        })}
        {NAV.filter((n) => !n.always && !n.on).length > 0 && sidebarOpen && (
          <p className="px-3 pt-3 text-[10px] uppercase tracking-wide text-slate-600">Locked for {role}</p>
        )}
        {NAV.filter((n) => !n.always && !n.on).map((n) => {
          const Icon = n.icon;
          const active = page === n.key;
          return (
            <button
              key={n.key}
              onClick={() => setPage(n.key)}
              className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors
                ${active ? "bg-indigo-600/15 text-slate-400 ring-1 ring-inset ring-indigo-500/40" : "text-slate-600 hover:bg-slate-800/50 hover:text-slate-400"}`}
            >
              <Icon className="h-4 w-4 shrink-0" /> 
              {sidebarOpen && (
                <>
                  <span className="truncate">{n.label}</span>
                  <Lock className="ml-auto h-3 w-3" />
                </>
              )}
              {!sidebarOpen && (
                <div className="absolute left-full ml-2 hidden rounded bg-slate-800 px-2 py-1 text-xs text-slate-300 group-hover:flex items-center gap-1 z-50 whitespace-nowrap shadow-lg">
                  {n.label} <Lock className="h-3 w-3" />
                </div>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
