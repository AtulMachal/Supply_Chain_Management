import React, { useState } from "react";
import {
  LayoutDashboard, ClipboardList, FileText, ShoppingCart, Truck, PackageCheck,
  Wallet, Boxes, ShieldCheck,
} from "lucide-react";

import {
  PERMISSIONS,
  initialRequirements,
  initialQuotations,
  initialPOs,
  initialStock,
} from "./data/mockData";

import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import Locked from "./components/common/Locked";

import Dashboard from "./pages/Dashboard";
import RequirementsPage from "./pages/RequirementsPage";
import QuotationsPage from "./pages/QuotationsPage";
import POPage from "./pages/POPage";
import DispatchPage from "./pages/DispatchPage";
import ReceivingPage from "./pages/ReceivingPage";
import PaymentsPage from "./pages/PaymentsPage";
import StockPage from "./pages/StockPage";
import AccessPage from "./pages/AccessPage";

export default function App() {
  const [role, setRole] = useState("Admin");
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [requirements, setRequirements] = useState(initialRequirements);
  const [quotations, setQuotations] = useState(initialQuotations);
  const [pos, setPOs] = useState(initialPOs);
  const [stock] = useState(initialStock);
  const [siteFilter, setSiteFilter] = useState("ALL");

  const perms = PERMISSIONS[role];

  const NAV = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, always: true },
    { key: "requirements", label: "Material Requirements", icon: ClipboardList, on: perms.requirements },
    { key: "quotations", label: "Quotations & Rate Comparison", icon: FileText, on: perms.quotations },
    { key: "po", label: "Purchase Orders", icon: ShoppingCart, on: perms.poCreate || perms.poApprove },
    { key: "dispatch", label: "Vendor Dispatch Tracking", icon: Truck, on: perms.vendorDispatch },
    { key: "receiving", label: "Site Receiving", icon: PackageCheck, on: perms.siteReceive },
    { key: "payments", label: "Payments & Invoices", icon: Wallet, on: perms.payments },
    { key: "stock", label: "Stock & Shortage", icon: Boxes, on: perms.stock },
    { key: "access", label: "Access Control", icon: ShieldCheck, on: perms.access },
  ];

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-slate-50 text-slate-800" style={{ fontFamily: "Inter, ui-sans-serif, system-ui" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-slate-900/50 md:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} page={page} setPage={setPage} role={role} NAV={NAV} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Topbar
          setSidebarOpen={setSidebarOpen}
          siteFilter={siteFilter}
          setSiteFilter={setSiteFilter}
          role={role}
          setRole={setRole}
        />

        <main className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-5">
          {page === "dashboard" && <Dashboard requirements={requirements} pos={pos} stock={stock} siteFilter={siteFilter} setPage={setPage} />}
          {page === "requirements" && (perms.requirements ? (
            <RequirementsPage requirements={requirements} setRequirements={setRequirements} siteFilter={siteFilter} />
          ) : <Locked />)}
          {page === "quotations" && (perms.quotations ? (
            <QuotationsPage requirements={requirements} quotations={quotations} setQuotations={setQuotations} setPOs={setPOs} setRequirements={setRequirements} />
          ) : <Locked />)}
          {page === "po" && ((perms.poCreate || perms.poApprove) ? (
            <POPage pos={pos} setPOs={setPOs} perms={perms} />
          ) : <Locked />)}
          {page === "dispatch" && (perms.vendorDispatch ? <DispatchPage pos={pos} setPOs={setPOs} /> : <Locked />)}
          {page === "receiving" && (perms.siteReceive ? <ReceivingPage pos={pos} setPOs={setPOs} /> : <Locked />)}
          {page === "payments" && (perms.payments ? <PaymentsPage pos={pos} setPOs={setPOs} /> : <Locked />)}
          {page === "stock" && (perms.stock ? <StockPage stock={stock} siteFilter={siteFilter} /> : <Locked />)}
          {page === "access" && (perms.access ? <AccessPage /> : <Locked />)}
        </main>
      </div>
    </div>
  );
}
