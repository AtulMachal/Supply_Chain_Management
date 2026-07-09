import React from "react";
import { X, CheckCircle2 } from "lucide-react";
import { ROLES, PERMISSIONS } from "../data/mockData";
import Card from "../components/common/Card";

export default function AccessPage() {
  const modules = [
    { key: "requirements", label: "Material Requirements" },
    { key: "quotations", label: "Quotations & Rate Comparison" },
    { key: "poCreate", label: "Create Purchase Order" },
    { key: "poApprove", label: "Approve Purchase Order" },
    { key: "vendorDispatch", label: "Vendor Dispatch Update" },
    { key: "siteReceive", label: "Site Receiving Update" },
    { key: "payments", label: "Payments & Invoices" },
    { key: "stock", label: "Stock & Shortage" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-bold text-slate-800">Access Control</h1>
        <p className="text-xs text-slate-500">Admin-defined permissions — controls which role can view or update each stage of the workflow.</p>
      </div>

      <Card title="Role permission matrix">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Module</th>
                {ROLES.map((r) => (
                  <th key={r} className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">{r}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modules.map((m) => (
                <tr key={m.key} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-700">{m.label}</td>
                  {ROLES.map((r) => (
                    <td key={r} className="px-4 py-3 text-center">
                      {PERMISSIONS[r][m.key] ? (
                        <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-500" />
                      ) : (
                        <X className="mx-auto h-4 w-4 text-slate-200" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="About this view" subtitle="Frontend preview only">
        <p className="text-xs text-slate-500">
          In production, this matrix would be editable by the Admin and enforced server-side. This build is UI/UX only —
          toggle the role selector in the top bar to preview how each screen looks and behaves for that role.
        </p>
      </Card>
    </div>
  );
}
