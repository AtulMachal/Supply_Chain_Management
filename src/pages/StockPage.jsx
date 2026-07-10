import React, { useState, useMemo } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { siteName, itemName, itemUnit } from "../utils/helpers";
import Card from "../components/common/Card";
import SortableTh from "../components/common/SortableTh";

export default function StockPage({ stock, siteFilter }) {
  const [sort, setSort] = useState({ key: "item", dir: "asc" });
  const rows = useMemo(() => {
    let arr = stock.filter((s) => siteFilter === "ALL" || s.site === siteFilter);
    arr = [...arr].sort((a, b) => {
      const av = sort.key === "item" ? itemName(a.item) : sort.key === "qty" ? a.qty : itemName(a.item);
      const bv = sort.key === "item" ? itemName(b.item) : sort.key === "qty" ? b.qty : itemName(b.item);
      if (typeof av === "string") return sort.dir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      return sort.dir === "asc" ? av - bv : bv - av;
    });
    return arr;
  }, [stock, siteFilter, sort]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-bold text-slate-800">Stock & Shortage Tracking</h1>
        <p className="text-xs text-slate-500">Live inventory position across sites, sortable by item or quantity.</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <SortableTh label="Item" sortKey="item" sort={sort} setSort={setSort} />
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Site</th>
                <SortableTh label="Available Qty" sortKey="qty" sort={sort} setSort={setSort} />
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Minimum Level</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s, i) => {
                const low = s.qty < s.min;
                return (
                  <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-medium text-slate-700">{itemName(s.item)}</td>
                    <td className="px-4 py-3 text-slate-600">{siteName(s.site)}</td>
                    <td className="px-4 py-3 text-slate-600">{s.qty} {itemUnit(s.item)}</td>
                    <td className="px-4 py-3 text-slate-400">{s.min} {itemUnit(s.item)}</td>
                    <td className="px-4 py-3">
                      {low ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-300"><TrendingDown className="h-3 w-3" />Shortage</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-300"><TrendingUp className="h-3 w-3" />Adequate</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
