import React, { useState } from "react";
import { Send, Mail, MessageCircle, X, CheckCircle2, Eye, MapPin } from "lucide-react";
import { siteName, itemName, itemUnit, vendorName, inr } from "../utils/helpers";
import Badge from "../components/common/Badge";
import Card from "../components/common/Card";
import PipelineTracker from "../components/common/PipelineTracker";
import Modal from "../components/common/Modal";

export default function POPage({ pos, setPOs, perms, sites }) {
  const [detail, setDetail] = useState(null);
  const [sendModal, setSendModal] = useState(null);

  const updateStatus = (id, status) => setPOs((ps) => ps.map((p) => (p.id === id ? { ...p, status, approvedBy: status === "Approved" ? "Admin" : p.approvedBy } : p)));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-bold text-slate-800">Purchase Orders</h1>
        <p className="text-xs text-slate-500">Review, approve and dispatch purchase orders generated from the rate comparison sheet.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {pos.map((p) => (
          <Card key={p.id} className="!p-0">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-sm font-bold text-slate-800">{p.id} <span className="ml-1 font-normal text-slate-400">· {vendorName(p.vendor)}</span></p>
                <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="h-3 w-3" />{siteName(p.site, sites)} · created {p.createdOn}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge>{p.status}</Badge>
                <Badge>{p.paymentStatus}</Badge>
              </div>
            </div>
            <div className="p-5">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-slate-400">
                    <th className="pb-2 font-medium">Item</th>
                    <th className="pb-2 font-medium">Qty</th>
                    <th className="pb-2 font-medium">Rate</th>
                    <th className="pb-2 font-medium">Amount</th>
                    <th className="pb-2 font-medium">Vendor Availability</th>
                  </tr>
                </thead>
                <tbody>
                  {p.items.map((it, i) => (
                    <tr key={i} className="border-t border-slate-50">
                      <td className="py-2 font-medium text-slate-700">{itemName(it.item)}</td>
                      <td className="py-2 text-slate-600">{it.qty} {itemUnit(it.item)}</td>
                      <td className="py-2 text-slate-600">{inr(it.rate)}</td>
                      <td className="py-2 font-semibold text-slate-700">{inr(it.qty * it.rate)}</td>
                      <td className="py-2"><Badge>{it.availability}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {perms.poApprove && p.status === "Pending Approval" && (
                  <>
                    <button onClick={() => updateStatus(p.id, "Approved")} className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                    </button>
                    <button onClick={() => updateStatus(p.id, "Rejected")} className="flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 ring-1 ring-inset ring-rose-200 hover:bg-rose-100">
                      <X className="h-3.5 w-3.5" /> Reject
                    </button>
                  </>
                )}
                {perms.poCreate && p.status === "Draft" && (
                  <button onClick={() => updateStatus(p.id, "Pending Approval")} className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700">
                    <Send className="h-3.5 w-3.5" /> Submit for Approval
                  </button>
                )}
                {p.status === "Approved" && (
                  <button onClick={() => setSendModal(p)} className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700">
                    <Send className="h-3.5 w-3.5" /> Send PO to Vendor
                  </button>
                )}
                {p.status === "Rejected" && <span className="text-xs text-rose-500">Rejected — revise rate comparison and re-create.</span>}
                <button onClick={() => setDetail(p)} className="ml-auto flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline">
                  <Eye className="h-3.5 w-3.5" /> View pipeline
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={!!detail} onClose={() => setDetail(null)} title={`${detail?.id} — order pipeline`} wide>
        {detail && (
          <div className="space-y-5">
            <PipelineTracker activeIndex={
              { "Draft": 3, "Pending Approval": 3, "Approved": 4, "Sent to Vendor": 5, "Rejected": 3 }[detail.status] ?? 3
            } />
            <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
              <div className="rounded-lg bg-slate-50 p-3"><p className="text-slate-400">Vendor</p><p className="font-semibold text-slate-700">{vendorName(detail.vendor)}</p></div>
              <div className="rounded-lg bg-slate-50 p-3"><p className="text-slate-400">Site</p><p className="font-semibold text-slate-700">{siteName(detail.site, sites)}</p></div>
              <div className="rounded-lg bg-slate-50 p-3"><p className="text-slate-400">Approved By</p><p className="font-semibold text-slate-700">{detail.approvedBy || "—"}</p></div>
              <div className="rounded-lg bg-slate-50 p-3"><p className="text-slate-400">Invoice</p><p className="font-semibold text-slate-700">{detail.invoiceReceived ? detail.invoiceNo : "Not received"}</p></div>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!sendModal} onClose={() => setSendModal(null)} title={`Send ${sendModal?.id} to ${sendModal ? vendorName(sendModal.vendor) : ""}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button onClick={() => { updateStatus(sendModal.id, "Sent to Vendor"); setSendModal(null); }} className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </button>
          <button onClick={() => { updateStatus(sendModal.id, "Sent to Vendor"); setSendModal(null); }} className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
            <Mail className="h-4 w-4" /> Email
          </button>
        </div>
      </Modal>
    </div>
  );
}
