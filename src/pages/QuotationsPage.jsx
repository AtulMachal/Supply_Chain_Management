import React, { useState, useMemo } from "react";
import { FileText, ShoppingCart, Upload, Clock, Paperclip, Edit2, Trash2 } from "lucide-react";
import { VENDORS } from "../data/mockData";
import { siteName, itemName, itemUnit, inr } from "../utils/helpers";
import Card from "../components/common/Card";
import SortableTh from "../components/common/SortableTh";
import Modal from "../components/common/Modal";
import FileDrop from "../components/common/FileDrop";
import EmptyState from "../components/common/EmptyState";

export default function QuotationsPage({ requirements, quotations, setQuotations, setPOs, setRequirements }) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [sort, setSort] = useState({ key: "item", dir: "asc" });
  const [uForm, setUForm] = useState({ id: null, reqId: requirements[0]?.id, vendor: "V1", rate: "", file: "" });
  const [poBuilder, setPoBuilder] = useState({}); // itemId -> {vendor, rate, checked}

  const quotedReqs = requirements.filter((r) => quotations.some((q) => q.reqId === r.id));

  // build item-wise rows: item -> vendor -> rate
  const rows = useMemo(() => {
    const byItem = {};
    quotations.forEach((q) => {
      if (!byItem[q.item]) byItem[q.item] = { item: q.item, rates: {} };
      byItem[q.item].rates[q.vendor] = { id: q.id, rate: q.rate, file: q.file, date: q.date, reqId: q.reqId };
    });
    let arr = Object.values(byItem);
    arr.sort((a, b) => {
      if (sort.key === "item") return sort.dir === "asc" ? itemName(a.item).localeCompare(itemName(b.item)) : itemName(b.item).localeCompare(itemName(a.item));
      if (sort.key === "lowest") {
        const la = Math.min(...Object.values(a.rates).map((r) => r.rate));
        const lb = Math.min(...Object.values(b.rates).map((r) => r.rate));
        return sort.dir === "asc" ? la - lb : lb - la;
      }
      return 0;
    });
    return arr;
  }, [quotations, sort]);

  const addQuotation = () => {
    if (!uForm.rate) return;
    if (uForm.id) {
      setQuotations((qs) => qs.map((q) => q.id === uForm.id ? { ...q, vendor: uForm.vendor, rate: Number(uForm.rate), file: uForm.file || q.file } : q));
    } else {
      const req = requirements.find((r) => r.id === uForm.reqId);
      const id = "Q" + Math.floor(Math.random() * 10000);
      setQuotations((qs) => [...qs, { id, reqId: uForm.reqId, item: req.item, vendor: uForm.vendor, rate: Number(uForm.rate), date: new Date().toISOString().slice(0, 10), file: uForm.file || "quotation.pdf" }]);
      setRequirements((rs) => rs.map((r) => (r.id === uForm.reqId ? { ...r, status: "Quoted" } : r)));
    }
    setUploadOpen(false);
    setUForm({ id: null, reqId: requirements[0]?.id, vendor: "V1", rate: "", file: "" });
  };

  const deleteQuotation = (id) => {
    if (window.confirm("Are you sure you want to delete this quotation?")) {
      setQuotations((qs) => qs.filter((q) => q.id !== id));
    }
  };

  const openUploadModal = () => {
    setUForm({ id: null, reqId: requirements[0]?.id, vendor: "V1", rate: "", file: "" });
    setUploadOpen(true);
  };

  const selectVendorForItem = (itemId, vendorId, rate) => {
    setPoBuilder((b) => ({ ...b, [itemId]: b[itemId]?.vendor === vendorId ? undefined : { vendor: vendorId, rate } }));
  };

  const createPOFromComparison = () => {
    const selected = Object.entries(poBuilder).filter(([, v]) => v);
    if (selected.length === 0) return;
    // group by vendor
    const byVendor = {};
    selected.forEach(([itemId, v]) => {
      if (!byVendor[v.vendor]) byVendor[v.vendor] = [];
      const req = requirements.find((r) => quotations.some((q) => q.item === itemId && q.vendor === v.vendor));
      byVendor[v.vendor].push({ item: itemId, qty: req?.qty || 10, rate: v.rate, availability: "Pending", expected: "", collected: 0 });
    });
    const newPOs = Object.entries(byVendor).map(([vendor, items]) => ({
      id: "PO-" + Math.floor(3000 + Math.random() * 999),
      vendor, site: requirements[0]?.site || "S1", status: "Draft", createdOn: new Date().toISOString().slice(0, 10),
      items, paymentStatus: "Not Paid", amountPaid: 0, invoiceReceived: false, invoiceNo: "",
    }));
    setPOs((p) => [...newPOs, ...p]);
    setRequirements((rs) => rs.map((r) => (selected.some(([iid]) => iid === r.item) ? { ...r, status: "PO Created" } : r)));
    setPoBuilder({});
    alert(`${newPOs.length} purchase order(s) created from the rate comparison sheet. Check the Purchase Orders tab.`);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-lg font-bold text-slate-800">Quotations & Rate Comparison</h1>
          <p className="text-xs text-slate-500">Upload vendor quotations and compare rates item-wise before creating a PO.</p>
        </div>
        <button onClick={openUploadModal} className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-700">
          <Upload className="h-3.5 w-3.5" /> Upload Quotation
        </button>
      </div>

      <Card title="Rate comparison sheet" subtitle="Click a vendor's rate to mark as selected, then generate a PO" right={
        <button onClick={createPOFromComparison} className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">
          <ShoppingCart className="h-3.5 w-3.5" /> Create PO from Selection
        </button>
      }>
        {rows.length === 0 ? (
          <EmptyState icon={FileText} text="No quotations uploaded yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <SortableTh label="Item" sortKey="item" sort={sort} setSort={setSort} />
                  {VENDORS.map((v) => (
                    <th key={v.id} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{v.name}</th>
                  ))}
                  <SortableTh label="Lowest Rate" sortKey="lowest" sort={sort} setSort={setSort} />
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const rateVals = Object.values(row.rates).map((r) => r.rate);
                  const lowest = Math.min(...rateVals);
                  return (
                    <tr key={row.item} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                      <td className="px-4 py-3 font-medium text-slate-700">{itemName(row.item)} <span className="text-[10px] text-slate-400">/{itemUnit(row.item)}</span></td>
                      {VENDORS.map((v) => {
                        const cell = row.rates[v.id];
                        const isLowest = cell && cell.rate === lowest;
                        const selected = poBuilder[row.item]?.vendor === v.id;
                        return (
                          <td key={v.id} className="px-4 py-3">
                            {cell ? (
                              <div
                                onClick={() => selectVendorForItem(row.item, v.id, cell.rate)}
                                className={`group relative flex flex-col items-start rounded-lg border px-2.5 py-1.5 text-xs transition-colors cursor-pointer
                                ${selected ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-400" : isLowest ? "border-emerald-300 bg-emerald-50" : "border-slate-200 hover:border-indigo-300"}`}
                              >
                                <span className={`font-semibold ${isLowest ? "text-emerald-700" : "text-slate-700"}`}>{inr(cell.rate)}</span>
                                <span className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-400"><Paperclip className="h-2.5 w-2.5" />{cell.file}</span>
                                
                                <div className="absolute -right-2 -top-2 hidden items-center gap-1 rounded-md border border-slate-200 bg-white p-1 shadow-sm group-hover:flex">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setUForm({ id: cell.id, reqId: cell.reqId, vendor: v.id, rate: cell.rate, file: cell.file }); setUploadOpen(true); }}
                                    className="text-slate-400 hover:text-indigo-600"
                                  >
                                    <Edit2 className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); deleteQuotation(cell.id); }}
                                    className="text-slate-400 hover:text-rose-600"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <span className="text-[11px] italic text-red-500">Unavailable</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="px-4 py-3 text-sm font-bold text-emerald-600">{inr(lowest)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card title="Requirements awaiting quotation">
        <div className="flex flex-wrap gap-2">
          {requirements.filter((r) => r.status === "Sent to Vendor").map((r) => (
            <span key={r.id} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600">
              <Clock className="h-3 w-3 text-amber-500" /> {r.id} · {itemName(r.item)} · {siteName(r.site)}
            </span>
          ))}
          {requirements.filter((r) => r.status === "Sent to Vendor").length === 0 && <p className="text-xs text-slate-400">Nothing pending — all sent requirements have quotations.</p>}
        </div>
      </Card>

      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title={uForm.id ? "Edit quotation" : "Upload vendor quotation"}>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Requirement</label>
            <select disabled={!!uForm.id} value={uForm.reqId} onChange={(e) => setUForm({ ...uForm, reqId: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 disabled:opacity-60">
              {requirements.map((r) => <option key={r.id} value={r.id}>{r.id} — {itemName(r.item)} ({siteName(r.site)})</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Vendor</label>
            <select disabled={!!uForm.id} value={uForm.vendor} onChange={(e) => setUForm({ ...uForm, vendor: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 disabled:opacity-60">
              {VENDORS.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Quoted Rate (₹)</label>
            <input type="number" value={uForm.rate} onChange={(e) => setUForm({ ...uForm, rate: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" placeholder="0" />
          </div>
          <FileDrop label="Quotation Document" fileName={uForm.file} onFile={(name) => setUForm({ ...uForm, file: name })} />
          <button onClick={addQuotation} className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">{uForm.id ? "Update Quotation" : "Save Quotation"}</button>
        </div>
      </Modal>
    </div>
  );
}
