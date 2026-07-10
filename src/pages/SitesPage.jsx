import React, { useState } from "react";
import { MapPin, Plus, CheckCircle2 } from "lucide-react";
import Card from "../components/common/Card";
import Modal from "../components/common/Modal";

export default function SitesPage({ sites, setSites }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [newSite, setNewSite] = useState({ id: "", name: "", address: "", manager: "", status: "Active" });

  const handleAddSite = () => {
    if (!newSite.id || !newSite.name) return;
    setSites([...sites, { ...newSite }]);
    setModalOpen(false);
    setNewSite({ id: "", name: "", address: "", manager: "", status: "Active" });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-800">Sites Management</h1>
          <p className="text-xs text-slate-500">Manage site details, addresses, and project managers.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700">
          <Plus className="h-4 w-4" /> Add New Site
        </button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Site ID</th>
                <th className="px-4 py-3">Site Name</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Manager</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {sites.map((s) => (
                <tr key={s.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-medium text-slate-700">{s.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-700">{s.name}</td>
                  <td className="px-4 py-3 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" /> {s.address || "—"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{s.manager || "—"}</td>
                  <td className="px-4 py-3">
                    {s.status === "Active" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-300"><CheckCircle2 className="h-3 w-3" />Active</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-300">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add New Site">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Site ID</label>
              <input value={newSite.id} onChange={(e) => setNewSite({ ...newSite, id: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" placeholder="e.g. S4" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Site Name</label>
              <input value={newSite.name} onChange={(e) => setNewSite({ ...newSite, name: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" placeholder="e.g. Site D" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Address</label>
            <input value={newSite.address} onChange={(e) => setNewSite({ ...newSite, address: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" placeholder="Full address" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Site Manager</label>
              <input value={newSite.manager} onChange={(e) => setNewSite({ ...newSite, manager: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" placeholder="Manager Name" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Status</label>
              <select value={newSite.status} onChange={(e) => setNewSite({ ...newSite, status: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400">
                <option>Active</option>
                <option>Completed</option>
              </select>
            </div>
          </div>
          <button onClick={handleAddSite} className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 mt-2">
            Save Site
          </button>
        </div>
      </Modal>
    </div>
  );
}
