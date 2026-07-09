import React, { useState } from "react";
import { Clock, ReceiptText } from "lucide-react";
import { vendorName, inr } from "../utils/helpers";
import Card from "../components/common/Card";
import Modal from "../components/common/Modal";
import FileDrop from "../components/common/FileDrop";

export default function PaymentsPage({ pos, setPOs }) {
  const [invModal, setInvModal] = useState(null);
  const [invNo, setInvNo] = useState("");
  const [invFile, setInvFile] = useState("");

  const setPayment = (id, status, paid) => setPOs((ps) => ps.map((p) => (p.id === id ? { ...p, paymentStatus: status, amountPaid: paid } : p)));
  const saveInvoice = () => {
    setPOs((ps) => ps.map((p) => (p.id === invModal.id ? { ...p, invoiceReceived: true, invoiceNo: invNo || p.invoiceNo, invoiceFile: invFile } : p)));
    setInvModal(null); setInvNo(""); setInvFile("");
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-bold text-slate-800">Payments & Tax Invoices</h1>
        <p className="text-xs text-slate-500">Track vendor payment status against each PO and log the tax invoice once received.</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-3 py-3">PO</th>
                <th className="px-3 py-3">Vendor</th>
                <th className="px-3 py-3">Order Value</th>
                <th className="px-3 py-3">Paid</th>
                <th className="px-3 py-3">Payment Status</th>
                <th className="px-3 py-3">Tax Invoice</th>
                <th className="px-3 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {pos.map((p) => {
                const total = p.items.reduce((s, it) => s + it.qty * it.rate, 0);
                return (
                  <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                    <td className="px-3 py-3 font-medium text-slate-700">{p.id}</td>
                    <td className="px-3 py-3 text-slate-600">{vendorName(p.vendor)}</td>
                    <td className="px-3 py-3 text-slate-600">{inr(total)}</td>
                    <td className="px-3 py-3 text-slate-600">{inr(p.amountPaid)}</td>
                    <td className="px-3 py-3">
                      <select
                        value={p.paymentStatus}
                        onChange={(e) => setPayment(p.id, e.target.value, e.target.value === "Paid" ? total : p.amountPaid)}
                        className="rounded-lg border border-slate-200 px-2 py-1 text-xs outline-none focus:border-indigo-400"
                      >
                        <option>Not Paid</option>
                        <option>Partially Paid</option>
                        <option>Paid</option>
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      {p.invoiceReceived ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600"><ReceiptText className="h-3.5 w-3.5" />{p.invoiceNo}</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-400"><Clock className="h-3.5 w-3.5" />Pending</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right">
                      {!p.invoiceReceived && (
                        <button onClick={() => setInvModal(p)} className="rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100">
                          Log Invoice
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={!!invModal} onClose={() => setInvModal(null)} title={`Log tax invoice — ${invModal?.id}`}>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Invoice Number</label>
            <input value={invNo} onChange={(e) => setInvNo(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" placeholder="e.g. UTD/2026/5511" />
          </div>
          <FileDrop label="Tax Invoice (PDF/photo)" fileName={invFile} onFile={setInvFile} />
          <button onClick={saveInvoice} className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Save Invoice</button>
        </div>
      </Modal>
    </div>
  );
}
