import { SITES, ITEMS, VENDORS } from "../data/mockData";

export const siteName = (id) => SITES.find((s) => s.id === id)?.name || id;
export const itemName = (id) => ITEMS.find((i) => i.id === id)?.name || id;
export const itemUnit = (id) => ITEMS.find((i) => i.id === id)?.unit || "";
export const vendorName = (id) => VENDORS.find((v) => v.id === id)?.name || id;
export const inr = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

export const STATUS_STYLES = {
  "Draft": "bg-slate-100 text-slate-600 ring-slate-300",
  "Sent to Vendor": "bg-sky-50 text-sky-700 ring-sky-300",
  "Quoted": "bg-violet-50 text-violet-700 ring-violet-300",
  "PO Created": "bg-indigo-50 text-indigo-700 ring-indigo-300",
  "Pending Approval": "bg-amber-50 text-amber-700 ring-amber-300",
  "Approved": "bg-emerald-50 text-emerald-700 ring-emerald-300",
  "Rejected": "bg-rose-50 text-rose-700 ring-rose-300",
  "Available to Load": "bg-emerald-50 text-emerald-700 ring-emerald-300",
  "Partially Available": "bg-amber-50 text-amber-700 ring-amber-300",
  "Pending": "bg-rose-50 text-rose-700 ring-rose-300",
  "Not Paid": "bg-rose-50 text-rose-700 ring-rose-300",
  "Partially Paid": "bg-amber-50 text-amber-700 ring-amber-300",
  "Paid": "bg-emerald-50 text-emerald-700 ring-emerald-300",
};
