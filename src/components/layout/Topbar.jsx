import React from "react";
import { Menu, Search, Bell, User } from "lucide-react";
import { SITES, ROLES } from "../../data/mockData";

export default function Topbar({ setSidebarOpen, siteFilter, setSiteFilter, role, setRole }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4">
      <button onClick={() => setSidebarOpen((s) => !s)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
        <Menu className="h-4 w-4" />
      </button>
      <div className="relative hidden max-w-xs flex-1 sm:block">
        <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
        <input placeholder="Search PO, requirement, vendor…" className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs outline-none focus:border-indigo-400 focus:bg-white focus:ring-1 focus:ring-indigo-400" />
      </div>
      <div className="ml-auto flex items-center gap-3">
        <select
          value={siteFilter}
          onChange={(e) => setSiteFilter(e.target.value)}
          className="hidden rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600 outline-none focus:border-indigo-400 md:block"
        >
          <option value="ALL">All Sites</option>
          {SITES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <button className="relative rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-rose-500" />
        </button>
        <div className="h-6 w-px bg-slate-200" />
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-slate-400" />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-indigo-400"
          >
            {ROLES.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
      </div>
    </header>
  );
}
