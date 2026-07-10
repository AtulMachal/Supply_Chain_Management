import React, { useState, useMemo } from "react";
import { ClipboardList, Send, Mail, MessageCircle, Plus } from "lucide-react";
import { SITES, ITEMS, VENDORS } from "../data/mockData";
import { siteName, itemName, itemUnit } from "../utils/helpers";
import Badge from "../components/common/Badge";
import Card from "../components/common/Card";
import Modal from "../components/common/Modal";
import EmptyState from "../components/common/EmptyState";

export default function RequirementsPage({ requirements, setRequirements, siteFilter }) {
  const [showNew, setShowNew] = useState(false);
  const [sendModal, setSendModal] = useState(null);
  const [form, setForm] = useState({ site: "S1", item: "I1", qty: "", requiredBy: "" });

  const grouped = SITES.map((s) => ({
    site: s,
    reqs: requirements.filter((r) => r.site === s.id && (siteFilter === "ALL" || r.site === siteFilter)),
  })).filter((g) => siteFilter === "ALL" || g.site.id === siteFilter);

  const addRequirement = () => {
    if (!form.qty) return;
    const id = "REQ-" + Math.floor(1000 + Math.random() * 9000);
    setRequirements((r) => [{ id, site: form.site, item: form.item, qty: Number(form.qty), status: "Draft", requiredBy: form.requiredBy || "TBD", createdOn: new Date().toISOString().slice(0, 10) }, ...r]);
    setShowNew(false);
    setForm({ site: "S1", item: "I1", qty: "", requiredBy: "" });
  };

  const sendToVendor = (channel) => {
    setRequirements((rs) => rs.map((r) => (r.id === sendModal.id ? { ...r, status: "Sent to Vendor" } : r)));
    setSendModal(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-lg font-bold text-slate-800">Material Requirements — Site-wise</h1>
          <p className="text-xs text-slate-500">Raise site material needs and dispatch RFQs to vendors.</p>
        </div>
        <button onClick={() => setShowNew(true)} className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-700">
          <Plus className="h-3.5 w-3.5" /> New Requirement
        </button>
      </div>

      {grouped.map((g) => (
        <Card key={g.site.id} title={g.site.name} subtitle={`${g.reqs.length} requirement(s)`}>
          {g.reqs.length === 0 ? (
            <EmptyState icon={ClipboardList} text="No requirements raised for this site yet." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">ID</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Item</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Qty</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Required By</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {g.reqs.map((r) => (
                    <tr key={r.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                      <td className="px-3 py-2.5 font-medium text-slate-700">{r.id}</td>
                      <td className="px-3 py-2.5 text-slate-600">{itemName(r.item)}</td>
                      <td className="px-3 py-2.5 text-slate-600">{r.qty} {itemUnit(r.item)}</td>
                      <td className="px-3 py-2.5 text-slate-500">{r.requiredBy}</td>
                      <td className="px-3 py-2.5"><Badge>{r.status}</Badge></td>
                      <td className="px-3 py-2.5 text-right">
                        {r.status === "Draft" ? (
                          <button onClick={() => setSendModal(r)} className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100">
                            <Send className="h-3 w-3" /> Send to Vendor
                          </button>
                        ) : (
                          <span className="text-xs text-slate-300">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      ))}

      <Modal open={showNew} onClose={() => setShowNew(false)} title="Raise material requirement">
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Site</label>
            <select value={form.site} onChange={(e) => setForm({ ...form, site: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400">
              {SITES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Material</label>
            <select value={form.item} onChange={(e) => setForm({ ...form, item: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400">
              {ITEMS.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Quantity ({itemUnit(form.item)})</label>
              <input type="number" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" placeholder="0" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Required By</label>
              <input type="date" value={form.requiredBy} onChange={(e) => setForm({ ...form, requiredBy: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" />
            </div>
          </div>
          <button onClick={addRequirement} className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Save as Draft</button>
        </div>
      </Modal>

      <Modal open={!!sendModal} onClose={() => setSendModal(null)} title={`Send ${sendModal?.id} to vendors`}>
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            {sendModal && `${sendModal.qty} ${itemUnit(sendModal.item)} of ${itemName(sendModal.item)} for ${siteName(sendModal.site)}`}
          </p>
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="mb-2 text-xs font-medium text-slate-600">Choose vendors</p>
            <div className="space-y-1.5">
              {VENDORS.map((v) => (
                <label key={v.id} className="flex items-center gap-2 text-xs text-slate-600">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-400" />
                  {v.name}
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button onClick={() => sendToVendor("whatsapp")} className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
              <MessageCircle className="h-4 w-4" /> Send via WhatsApp
            </button>
            <button onClick={() => sendToVendor("email")} className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
              <Mail className="h-4 w-4" /> Send via Email
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
