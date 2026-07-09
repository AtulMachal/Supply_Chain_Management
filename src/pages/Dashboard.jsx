import React from "react";
import { ClipboardList, ShoppingCart, Wallet, Boxes, AlertTriangle, MapPin } from "lucide-react";
import { SITES } from "../data/mockData";
import { siteName, itemName, itemUnit, vendorName } from "../utils/helpers";
import Badge from "../components/common/Badge";
import Card from "../components/common/Card";
import PipelineTracker from "../components/common/PipelineTracker";
import Kpi from "../components/common/Kpi";

export default function Dashboard({ requirements, pos, stock, siteFilter }) {
  const reqs = requirements.filter((r) => siteFilter === "ALL" || r.site === siteFilter);
  const pendingApproval = pos.filter((p) => p.status === "Pending Approval").length;
  const shortage = stock.filter((s) => s.qty < s.min);
  const pendingPayments = pos.filter((p) => p.paymentStatus !== "Paid").length;
  const openReqs = reqs.filter((r) => r.status !== "PO Created").length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-bold text-slate-800">Supply Chain Overview</h1>
        <p className="text-xs text-slate-500">Live status across requirements, procurement, dispatch and site stock.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi icon={ClipboardList} label="Open Requirements" value={openReqs} hint="Not yet converted to PO" tone="indigo" />
        <Kpi icon={ShoppingCart} label="POs Pending Approval" value={pendingApproval} hint="Awaiting admin sign-off" tone="amber" />
        <Kpi icon={Wallet} label="Payments Pending" value={pendingPayments} hint="Across active purchase orders" tone="rose" />
        <Kpi icon={Boxes} label="Shortage Items" value={shortage.length} hint="Below minimum stock level" tone="emerald" />
      </div>

      <Card title="Procurement pipeline" subtitle="Where the most advanced order in the system currently stands">
        <PipelineTracker activeIndex={5} />
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card title="Requirements by site" className="lg:col-span-1">
          <div className="space-y-3">
            {SITES.map((s) => {
              const count = requirements.filter((r) => r.site === s.id).length;
              const max = Math.max(...SITES.map((x) => requirements.filter((r) => r.site === x.id).length), 1);
              return (
                <div key={s.id}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-slate-600"><MapPin className="h-3 w-3 text-slate-400" />{s.name}</span>
                    <span className="font-semibold text-slate-700">{count}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100">
                    <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${(count / max) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card title="Active purchase orders" className="lg:col-span-2">
          <div className="divide-y divide-slate-100">
            {pos.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2.5 text-xs">
                <div>
                  <p className="font-semibold text-slate-700">{p.id} · {vendorName(p.vendor)}</p>
                  <p className="text-slate-400">{siteName(p.site)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>{p.status}</Badge>
                  <Badge>{p.paymentStatus}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {shortage.length > 0 && (
        <Card title="Shortage alerts" right={<AlertTriangle className="h-4 w-4 text-rose-500" />}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {shortage.map((s, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-rose-100 bg-rose-50/60 px-3 py-2.5">
                <div>
                  <p className="text-xs font-semibold text-slate-700">{itemName(s.item)}</p>
                  <p className="text-[11px] text-slate-500">{siteName(s.site)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-rose-600">{s.qty} {itemUnit(s.item)}</p>
                  <p className="text-[10px] text-slate-400">min {s.min}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
