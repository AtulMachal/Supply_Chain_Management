import React, { useState } from "react";
import { ClipboardList, ShoppingCart, Wallet, Boxes, AlertTriangle, MapPin, Eye } from "lucide-react";
import { PIPELINE_STAGES } from "../data/mockData";
import { siteName, itemName, itemUnit, vendorName, inr } from "../utils/helpers";
import { getStageFromRequirement, getStageFromPO } from "../utils/pipelineLogic";
import Badge from "../components/common/Badge";
import Card from "../components/common/Card";
import PipelineTracker from "../components/common/PipelineTracker";
import Kpi from "../components/common/Kpi";
import Modal from "../components/common/Modal";

export default function Dashboard({ requirements, pos, stock, siteFilter, setPage, sites }) {
  const [selectedStage, setSelectedStage] = useState(null);

  const reqs = requirements.filter((r) => siteFilter === "ALL" || r.site === siteFilter);
  const filteredPOs = pos.filter((p) => siteFilter === "ALL" || p.site === siteFilter);

  const pendingApproval = pos.filter((p) => p.status === "Pending Approval").length;
  const shortage = stock.filter((s) => s.qty < s.min);
  const pendingPayments = pos.filter((p) => p.paymentStatus !== "Paid").length;
  const openReqs = reqs.filter((r) => r.status !== "PO Created").length;

  // Calculate pipeline stages
  const stageCounts = new Array(PIPELINE_STAGES.length).fill(0);
  let maxStage = 0;

  reqs.forEach((r) => {
    const stage = getStageFromRequirement(r);
    stageCounts[stage]++;
    if (stage > maxStage) maxStage = stage;
  });

  filteredPOs.forEach((p) => {
    const stage = getStageFromPO(p);
    stageCounts[stage]++;
    if (stage > maxStage) maxStage = stage;
  });

  // Items for modal
  const itemsInSelectedStage = selectedStage !== null ? [
    ...reqs.filter((r) => getStageFromRequirement(r) === selectedStage).map(r => ({ ...r, type: 'Requirement' })),
    ...filteredPOs.filter((p) => getStageFromPO(p) === selectedStage).map(p => ({ ...p, type: 'PO' }))
  ] : [];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-bold text-slate-800">Supply Chain Overview</h1>
        <p className="text-xs text-slate-500">Live status across requirements, procurement, dispatch and site stock.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi onClick={() => setPage("requirements")} icon={ClipboardList} label="Open Requirements" value={openReqs} hint="Not yet converted to PO" tone="indigo" />
        <Kpi onClick={() => setPage("po")} icon={ShoppingCart} label="POs Pending Approval" value={pendingApproval} hint="Awaiting admin sign-off" tone="amber" />
        <Kpi onClick={() => setPage("payments")} icon={Wallet} label="Payments Pending" value={pendingPayments} hint="Across active purchase orders" tone="rose" />
        <Kpi onClick={() => setPage("stock")} icon={Boxes} label="Shortage Items" value={shortage.length} hint="Below minimum stock level" tone="emerald" />
      </div>

      <Card title="Procurement pipeline" subtitle="Where the most advanced order in the system currently stands. Click a stage to view items.">
        <PipelineTracker 
          activeIndex={maxStage} 
          stageCounts={stageCounts}
          onStageClick={(i) => setSelectedStage(i)} 
        />
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card title="Requirements by site" className="lg:col-span-1">
          <div className="space-y-3">
            {sites.map((s) => {
              const count = requirements.filter((r) => r.site === s.id).length;
              const max = Math.max(...sites.map((x) => requirements.filter((r) => r.site === x.id).length), 1);
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
              <div key={p.id} className="flex flex-col sm:flex-row sm:items-center items-start justify-between gap-2 sm:gap-0 py-2.5 text-xs">
                <div>
                  <p className="font-semibold text-slate-700">{p.id} · {vendorName(p.vendor)}</p>
                  <p className="text-slate-400">{siteName(p.site, sites)}</p>
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
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0 rounded-lg border border-rose-100 bg-rose-50/60 px-3 py-2.5">
                <div>
                  <p className="text-xs font-semibold text-slate-700">{itemName(s.item)}</p>
                  <p className="text-[11px] text-slate-500">{siteName(s.site, sites)}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs font-bold text-rose-600">{s.qty} {itemUnit(s.item)}</p>
                  <p className="text-[10px] text-slate-400">min {s.min}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Modal open={selectedStage !== null} onClose={() => setSelectedStage(null)} title={selectedStage !== null ? PIPELINE_STAGES[selectedStage] : ""} wide>
        <div className="space-y-4">
          <p className="text-sm text-slate-500">Items currently at this stage of the procurement pipeline:</p>
          {itemsInSelectedStage.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 py-8 text-center text-sm text-slate-500">
              No items currently at this stage.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white shadow-sm">
              {itemsInSelectedStage.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center items-start justify-between gap-3 sm:gap-0 p-4 text-sm">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-700">{item.id}</p>
                      <Badge tone={item.type === "PO" ? "indigo" : "emerald"}>{item.type}</Badge>
                      <Badge>{item.status}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      <MapPin className="mb-0.5 inline h-3 w-3" /> {siteName(item.site, sites)}
                      {item.vendor && ` · Vendor: ${vendorName(item.vendor)}`}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    {item.type === 'Requirement' ? (
                      <p className="font-semibold text-slate-700">{item.qty} {itemUnit(item.item)} {itemName(item.item)}</p>
                    ) : (
                      <p className="font-semibold text-slate-700">{item.items?.length} Items · {inr(item.amountPaid)}</p>
                    )}
                    <p className="text-[11px] text-slate-400">Created: {item.createdOn}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
