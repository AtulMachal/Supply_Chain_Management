import React, { useState } from "react";
import { PackageCheck, CheckCircle2, TrendingDown } from "lucide-react";
import { siteName, itemName, itemUnit, vendorName } from "../utils/helpers";
import Card from "../components/common/Card";
import EmptyState from "../components/common/EmptyState";

export default function ReceivingPage({ pos, setPOs }) {
  const arriving = pos.filter((p) => p.status === "Sent to Vendor" || p.status === "Approved");

  const updateReceipt = (poId, idx, patch) => {
    setPOs((ps) => ps.map((p) => {
      if (p.id !== poId) return p;
      const items = p.items.map((it, i) => (i === idx ? { ...it, ...patch } : it));
      return { ...p, items };
    }));
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-bold text-slate-800">Site Receiving</h1>
        <p className="text-xs text-slate-500">Site supervisor confirms what's actually been collected at site and flags any shortfall against the PO.</p>
      </div>

      {arriving.length === 0 && <EmptyState icon={PackageCheck} text="No incoming deliveries to confirm right now." />}

      {arriving.map((p) => (
        <Card key={p.id} title={`${p.id} — ${vendorName(p.vendor)}`} subtitle={`Delivering to ${siteName(p.site)}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-slate-400">
                  <th className="pb-2 font-medium">Item</th>
                  <th className="pb-2 font-medium">Ordered</th>
                  <th className="pb-2 font-medium">Dispatched by Vendor</th>
                  <th className="pb-2 font-medium">Received at Site</th>
                  <th className="pb-2 font-medium">Shortfall</th>
                </tr>
              </thead>
              <tbody>
                {p.items.map((it, idx) => {
                  const shortfall = it.collected - (it.received ?? 0);
                  return (
                    <tr key={idx} className="border-t border-slate-50">
                      <td className="py-2.5 font-medium text-slate-700">{itemName(it.item)}</td>
                      <td className="py-2.5 text-slate-600">{it.qty} {itemUnit(it.item)}</td>
                      <td className="py-2.5 text-slate-600">{it.collected} {itemUnit(it.item)}</td>
                      <td className="py-2.5">
                        <input
                          type="number"
                          value={it.received ?? ""}
                          placeholder="0"
                          onChange={(e) => updateReceipt(p.id, idx, { received: Number(e.target.value) })}
                          className="w-24 rounded-lg border border-slate-200 px-2 py-1 text-xs outline-none focus:border-indigo-400"
                        />
                      </td>
                      <td className="py-2.5">
                        {shortfall > 0 ? (
                          <span className="inline-flex items-center gap-1 text-rose-600 font-medium"><TrendingDown className="h-3 w-3" />{shortfall} short</span>
                        ) : it.received ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-medium"><CheckCircle2 className="h-3 w-3" />Matched</span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ))}
    </div>
  );
}
