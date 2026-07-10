export const SITES = [
  { id: "S1", name: "Site A — Riverside Tower", address: "Plot 42, Riverside, North Block", manager: "Ravi Kumar", status: "Active" },
  { id: "S2", name: "Site B — Orchid Residency", address: "Phase 2, Orchid Lane, East Sector", manager: "Anita Desai", status: "Active" },
  { id: "S3", name: "Site C — Industrial Warehouse", address: "Sector 18, MIDC Industrial Area", manager: "Vikram Singh", status: "Completed" },
];

export const ITEMS = [
  { id: "I1", name: "Cement OPC 53 Grade", unit: "Bags" },
  { id: "I2", name: "TMT Bar 12mm", unit: "Ton" },
  { id: "I3", name: "TMT Bar 16mm", unit: "Ton" },
  { id: "I4", name: "River Sand", unit: "Brass" },
  { id: "I5", name: "Aggregate 20mm", unit: "Brass" },
  { id: "I6", name: "AAC Blocks", unit: "Nos" },
  { id: "I7", name: "Shuttering Plywood", unit: "Sheets" },
  { id: "I8", name: "Binding Wire", unit: "Kg" },
];

export const VENDORS = [
  { id: "V1", name: "UltraTech Distributors", contact: "+91 98200 11223", email: "sales@ultratechdist.com" },
  { id: "V2", name: "JSW Steel Traders", contact: "+91 98330 44556", email: "orders@jswtraders.com" },
  { id: "V3", name: "Ambuja Building Materials", contact: "+91 90040 77889", email: "quotes@ambujabm.com" },
  { id: "V4", name: "BuildMart Hardware Co.", contact: "+91 87650 99110", email: "vendor@buildmart.in" },
];

export const ROLES = ["Admin", "Procurement Officer", "Vendor Desk", "Site Supervisor", "Store Keeper"];

export const PERMISSIONS = {
  "Admin": { requirements: true, quotations: true, poCreate: true, poApprove: true, vendorDispatch: true, siteReceive: true, payments: true, stock: true, access: true, sites: true },
  "Procurement Officer": { requirements: true, quotations: true, poCreate: true, poApprove: false, vendorDispatch: false, siteReceive: false, payments: true, stock: false, access: false, sites: false },
  "Vendor Desk": { requirements: false, quotations: true, poCreate: false, poApprove: false, vendorDispatch: true, siteReceive: false, payments: false, stock: false, access: false, sites: false },
  "Site Supervisor": { requirements: true, quotations: false, poCreate: false, poApprove: false, vendorDispatch: false, siteReceive: true, payments: false, stock: true, access: false, sites: false },
  "Store Keeper": { requirements: false, quotations: false, poCreate: false, poApprove: false, vendorDispatch: false, siteReceive: false, payments: false, stock: true, access: false, sites: false },
};

export const initialRequirements = [
  { id: "REQ-1041", site: "S1", item: "I1", qty: 500, status: "Sent to Vendor", requiredBy: "2026-07-18", createdOn: "2026-07-05" },
  { id: "REQ-1042", site: "S1", item: "I2", qty: 8, status: "Quoted", requiredBy: "2026-07-20", createdOn: "2026-07-05" },
  { id: "REQ-1043", site: "S2", item: "I4", qty: 40, status: "PO Created", requiredBy: "2026-07-15", createdOn: "2026-07-02" },
  { id: "REQ-1044", site: "S2", item: "I6", qty: 3000, status: "Draft", requiredBy: "2026-07-25", createdOn: "2026-07-08" },
  { id: "REQ-1045", site: "S3", item: "I7", qty: 120, status: "Quoted", requiredBy: "2026-07-19", createdOn: "2026-07-06" },
  { id: "REQ-1046", site: "S3", item: "I5", qty: 60, status: "Sent to Vendor", requiredBy: "2026-07-22", createdOn: "2026-07-07" },
];

export const initialQuotations = [
  { id: "Q1", reqId: "REQ-1042", item: "I2", vendor: "V2", rate: 62500, date: "2026-07-06", file: "TMT_12mm_JSW.pdf" },
  { id: "Q2", reqId: "REQ-1042", item: "I2", vendor: "V3", rate: 63200, date: "2026-07-06", file: "quote_ambuja.jpg" },
  { id: "Q3", reqId: "REQ-1042", item: "I2", vendor: "V4", rate: 61800, date: "2026-07-07", file: "buildmart_rfq_resp.pdf" },
  { id: "Q4", reqId: "REQ-1045", item: "I7", vendor: "V1", rate: 850, date: "2026-07-07", file: "ply_ultratech.pdf" },
  { id: "Q5", reqId: "REQ-1045", item: "I7", vendor: "V4", rate: 810, date: "2026-07-08", file: "ply_buildmart.jpg" },
  { id: "Q6", reqId: "REQ-1041", item: "I1", vendor: "V1", rate: 392, date: "2026-07-06", file: "cement_ultratech.pdf" },
  { id: "Q7", reqId: "REQ-1041", item: "I1", vendor: "V3", rate: 388, date: "2026-07-06", file: "cement_ambuja.pdf" },
];

export const initialPOs = [
  {
    id: "PO-3301", vendor: "V3", site: "S2", status: "Sent to Vendor", createdOn: "2026-07-03", approvedBy: "Admin",
    items: [{ item: "I4", qty: 40, rate: 2650, availability: "Available to Load", expected: "2026-07-11", collected: 40 }],
    paymentStatus: "Partially Paid", amountPaid: 60000, invoiceReceived: true, invoiceNo: "AMB/INV/2291",
  },
  {
    id: "PO-3302", vendor: "V4", site: "S1", status: "Pending Approval", createdOn: "2026-07-08",
    items: [
      { item: "I1", qty: 500, rate: 388, availability: "Pending", expected: "2026-07-14", collected: 0 },
    ],
    paymentStatus: "Not Paid", amountPaid: 0, invoiceReceived: false, invoiceNo: "",
  },
  {
    id: "PO-3298", vendor: "V1", site: "S3", status: "Approved", createdOn: "2026-06-29", approvedBy: "Admin",
    items: [
      { item: "I7", qty: 120, rate: 810, availability: "Partially Available", expected: "2026-07-12", collected: 70 },
    ],
    paymentStatus: "Paid", amountPaid: 97200, invoiceReceived: true, invoiceNo: "UTD/2026/5510",
  },
];

export const initialStock = [
  { site: "S1", item: "I1", qty: 120, min: 200 },
  { site: "S1", item: "I8", qty: 340, min: 100 },
  { site: "S2", item: "I4", qty: 15, min: 30 },
  { site: "S2", item: "I6", qty: 900, min: 500 },
  { site: "S3", item: "I7", qty: 70, min: 150 },
  { site: "S3", item: "I5", qty: 55, min: 40 },
];

export const PIPELINE_STAGES = [
  "Requirement Raised", "RFQ Sent", "Quotation Received", "PO Created",
  "PO Approved", "Dispatched by Vendor", "Received at Site", "Payment Settled",
];
