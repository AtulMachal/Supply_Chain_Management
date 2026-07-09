import React, { useState } from "react";
import { Truck } from "lucide-react";
import { siteName, itemName, itemUnit, vendorName } from "../utils/helpers";
import Card from "../components/common/Card";
import EmptyState from "../components/common/EmptyState";

export default function DispatchPage({ pos, setPOs }) {
  const dispatchable = pos.filter((p) => p.status === "Sent to Vendor" || p.status === "Approved");

  const updateItem = (poId, idx, patch) => {
    setPOs((ps) => ps.map((p) => {
      if (p.id !== poId) return p;
      const items = p.items.map((it, i) => (i === idx ? { ...it, ...patch } : it));
      return { ...p, items };
    }));
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-bold text-slate-800">Vendor Dispatch Tracking</h1>
        <p className="text-xs text-slate-500">Updated by the receiving person at the vendor's office when collecting items — mark what's ready to load vs. still pending, and give an expected date.</p>
      </div>

      {dispatchable.length === 0 && <EmptyState icon={Truck} text="No purchase orders currently out with vendors." />}

      {dispatchable.map((p) => (
        <Card key={p.id} title={`${p.id} — ${vendorName(p.vendor)}`} subtitle={siteName(p.site)}>
          <div className="space-y-3">
            {p.items.map((it, idx) => (
              <div key={idx} className="grid grid-cols-1 items-center gap-3 rounded-lg border border-slate-200 p-3 sm:grid-cols-5">
                <div className="sm:col-span-2">
                  <p className="text-sm font-medium text-slate-700">{itemName(it.item)}</p>
                  <p className="text-xs text-slate-400">Ordered: {it.qty} {itemUnit(it.item)}</p>
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-medium uppercase text-slate-400">Availability</label>
                  <select
                    value={it.availability}
                    onChange={(e) => updateItem(p.id, idx, { availability: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs outline-none focus:border-indigo-400"
                  >
                    <option>Available to Load</option>
                    <option>Partially Available</option>
                    <option>Pending</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-medium uppercase text-slate-400">Qty ready to load</label>
                  <input
                    type="number" value={it.collected}
                    onChange={(e) => updateItem(p.id, idx, { collected: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs outline-none focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-medium uppercase text-slate-400">Expected date</label>
                  <input
                    type="date" value={it.expected}
                    onChange={(e) => updateItem(p.id, idx, { expected: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs outline-none focus:border-indigo-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
