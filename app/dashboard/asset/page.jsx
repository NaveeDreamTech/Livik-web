// app/dashboard/asset/page.jsx
"use client";

import { useMemo, useState } from "react";

/**
 * Simple Asset Tracking UI
 * - All Assets tab shows table + Add Asset
 * - Add Asset modal supports dynamic fields per type (Laptop includes username/password)
 * - Click row to open detail drawer
 *
 * This is intentionally local state only. Replace handlers with API calls later.
 */

const sampleAssets = [
  {
    id: "ASSET-001",
    assetTag: "LT-2024-001",
    type: "Laptop",
    modelName: "Dell XPS 13",
    modelNo: "XPS9310",
    serialNo: "SN12345678",
    username: "asha.ra",
    password: "password123",
    assignedTo: { empId: "E001", name: "Asha Rao" },
    location: "Mumbai Office - 3rd Floor",
    purchaseDate: "2024-02-12",
    warrantyUntil: "2026-02-12",
    status: "Active",
    notes: "SSD 1TB",
    history: [
      {
        date: "2024-02-15",
        action: "Assigned",
        by: "IT Admin",
        notes: "Assigned to Asha Rao (E001)",
      },
    ],
  },
  {
    id: "ASSET-002",
    assetTag: "PH-2024-004",
    type: "Mobile",
    modelName: "iPhone 13",
    modelNo: "A2483",
    serialNo: "SN987654321",
    username: "",
    password: "",
    assignedTo: null,
    location: "Spare (Mumbai)",
    purchaseDate: "2023-11-01",
    warrantyUntil: "2025-11-01",
    status: "Available",
    notes: "",
    history: [],
  },
  {
    id: "ASSET-003",
    assetTag: "PR-2023-002",
    type: "Printer",
    modelName: "HP LaserJet MFP",
    modelNo: "M227fdw",
    serialNo: "SN555444333",
    username: "",
    password: "",
    assignedTo: { empId: "E004", name: "Arjun Kumar" },
    location: "Finance Dept - 2nd Floor",
    purchaseDate: "2023-06-20",
    warrantyUntil: "2025-06-20",
    status: "In Repair",
    notes: "Paper jam issue",
    history: [
      {
        date: "2024-04-10",
        action: "Reported",
        by: "Arjun Kumar",
        notes: "Paper jam",
      },
    ],
  },
];

const assetTypes = ["Laptop", "Mobile", "Tablet", "Printer", "Other"];
const statusOptions = ["Active", "Available", "In Repair", "Lost", "Retired"];

export default function AssetPage() {
  const [assets, setAssets] = useState(sampleAssets);
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [activeTab, setActiveTab] = useState("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [detailAsset, setDetailAsset] = useState(null);

  // form state for add asset
  const [form, setForm] = useState({
    assetTag: "",
    type: "Laptop",
    modelName: "",
    modelNo: "",
    serialNo: "",
    username: "",
    password: "",
    assignedEmpId: "",
    assignedEmpName: "",
    location: "",
    purchaseDate: "",
    warrantyUntil: "",
    status: "Active",
    notes: "",
  });

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      const matchesQuery =
        !query ||
        a.assetTag.toLowerCase().includes(query.toLowerCase()) ||
        (a.serialNo || "").toLowerCase().includes(query.toLowerCase()) ||
        (a.modelName || "").toLowerCase().includes(query.toLowerCase()) ||
        (a.assignedTo?.name || "")
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        (a.assignedTo?.empId || "").toLowerCase().includes(query.toLowerCase());

      const matchesType = filterType === "All" || a.type === filterType;
      return matchesQuery && matchesType;
    });
  }, [assets, query, filterType]);

  // handlers
  const openAdd = () => {
    setForm({
      assetTag: "",
      type: "Laptop",
      modelName: "",
      modelNo: "",
      serialNo: "",
      username: "",
      password: "",
      assignedEmpId: "",
      assignedEmpName: "",
      location: "",
      purchaseDate: "",
      warrantyUntil: "",
      status: "Active",
      notes: "",
    });
    setIsAddOpen(true);
  };
  const closeAdd = () => setIsAddOpen(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newAsset = {
      id: `ASSET-${String(Date.now()).slice(-6)}`,
      assetTag: form.assetTag || `TAG-${Math.floor(Math.random() * 10000)}`,
      type: form.type,
      modelName: form.modelName,
      modelNo: form.modelNo,
      serialNo: form.serialNo,
      username: form.username,
      password: form.password,
      assignedTo:
        form.assignedEmpId && form.assignedEmpName
          ? { empId: form.assignedEmpId, name: form.assignedEmpName }
          : null,
      location: form.location,
      purchaseDate: form.purchaseDate,
      warrantyUntil: form.warrantyUntil,
      status: form.status,
      notes: form.notes,
      history: [
        {
          date: new Date().toISOString().slice(0, 10),
          action: "Created",
          by: "You",
          notes: "",
        },
      ],
    };
    setAssets((p) => [newAsset, ...p]);
    setIsAddOpen(false);
  };

  const handleDelete = (id) => {
    if (!confirm("Delete asset? This cannot be undone.")) return;
    setAssets((p) => p.filter((a) => a.id !== id));
    setDetailAsset(null);
  };

  const handleAssign = (id, empId, name) => {
    setAssets((p) =>
      p.map((a) =>
        a.id === id
          ? {
              ...a,
              assignedTo: empId && name ? { empId, name } : null,
              history: [
                {
                  date: new Date().toISOString().slice(0, 10),
                  action: empId ? "Assigned" : "Unassigned",
                  by: "You",
                  notes: empId ? `Assigned to ${name}` : "Returned",
                },
                ...(a.history || []),
              ],
            }
          : a
      )
    );
  };

  return (
    <div className="text-left">
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Asset Tracking</h1>
          <p className="text-sm text-gray-600 mt-1">
            Track company hardware and electronic devices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">Total</div>
          <div className="bg-white px-3 py-1 rounded-full shadow text-sm font-medium">
            {assets.length}
          </div>
          <button
            onClick={openAdd}
            className="ml-4 bg-[#1E90FF] text-white px-4 py-2 rounded-md hover:bg-[#1873cc]"
          >
            + Add Asset
          </button>
        </div>
      </div>

      {/* card */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        {/* toolbar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by asset tag, model, serial or employee..."
              className="px-3 py-2 border rounded-md text-sm outline-none w-[320px]"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option>All</option>
              {assetTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">Tab:</div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1 rounded-md text-sm ${
                  activeTab === "all"
                    ? "bg-[#1E90FF] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                All Assets
              </button>
              <button
                onClick={() => setActiveTab("assignments")}
                className={`px-3 py-1 rounded-md text-sm ${
                  activeTab === "assignments"
                    ? "bg-[#1E90FF] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Assignments
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`px-3 py-1 rounded-md text-sm ${
                  activeTab === "reports"
                    ? "bg-[#1E90FF] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Reports
              </button>
            </div>
          </div>
        </div>

        {/* content */}
        <div>
          {activeTab === "all" && (
            <div>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr className="text-left text-sm text-gray-600">
                      <th className="px-4 py-3">Asset Tag</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Model</th>
                      <th className="px-4 py-3">Serial</th>
                      <th className="px-4 py-3">Assigned To</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((a) => (
                      <tr
                        key={a.id}
                        className="border-t last:border-b hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                          {a.assetTag}
                        </td>
                        <td className="px-4 py-3 text-sm">{a.type}</td>
                        <td className="px-4 py-3 text-sm">{a.modelName}</td>
                        <td className="px-4 py-3 text-sm">{a.serialNo}</td>
                        <td className="px-4 py-3 text-sm">
                          {a.assignedTo
                            ? `${a.assignedTo.name} (${a.assignedTo.empId})`
                            : "—"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              a.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : a.status === "Available"
                                ? "bg-gray-100 text-gray-800"
                                : a.status === "In Repair"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {a.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setDetailAsset(a)}
                              className="text-sm text-[#1E90FF] hover:underline"
                            >
                              View
                            </button>
                            <button
                              onClick={() => {
                                // quick assign/unassign toggle for demo
                                if (a.assignedTo) {
                                  handleAssign(a.id, "", "");
                                } else {
                                  const empId = prompt(
                                    "Assign to employee ID (e.g. E005):"
                                  );
                                  const name = empId
                                    ? prompt("Employee name:")
                                    : null;
                                  if (empId && name)
                                    handleAssign(a.id, empId, name);
                                }
                              }}
                              className="text-sm text-gray-700 hover:underline"
                            >
                              {a.assignedTo ? "Unassign" : "Assign"}
                            </button>
                            <button
                              onClick={() => handleDelete(a.id)}
                              className="text-sm text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filtered.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 py-8 text-center text-sm text-gray-500"
                        >
                          No assets found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "assignments" && (
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Current Assignments
              </h3>
              <div className="space-y-3">
                {assets.filter((a) => a.assignedTo).length === 0 && (
                  <div className="text-sm text-gray-500">
                    No current assignments.
                  </div>
                )}
                {assets
                  .filter((a) => a.assignedTo)
                  .map((a) => (
                    <div
                      key={a.id}
                      className="p-4 border rounded-md flex items-center justify-between"
                    >
                      <div>
                        <div className="text-sm font-medium">
                          {a.assetTag} — {a.modelName}
                        </div>
                        <div className="text-xs text-gray-500">
                          Assigned to {a.assignedTo.name} ({a.assignedTo.empId})
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setDetailAsset(a)}
                          className="text-sm text-[#1E90FF] hover:underline"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleAssign(a.id, "", "")}
                          className="text-sm text-red-600 hover:underline"
                        >
                          Unassign
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === "reports" && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Reports (static)</h3>
              <p className="text-sm text-gray-500">
                Export inventory or view basic asset reports here. (Implement as
                needed.)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Detail drawer */}
      {detailAsset && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDetailAsset(null)}
          />
          <aside className="relative ml-auto w-full max-w-xl bg-white h-full overflow-auto p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">
                  {detailAsset.assetTag} — {detailAsset.modelName}
                </h2>
                <div className="text-sm text-gray-500">
                  {detailAsset.type} • {detailAsset.modelNo}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDetailAsset(null)}
                  className="text-gray-500"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-gray-500">Serial No</div>
                <div className="font-medium">{detailAsset.serialNo}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Status</div>
                <div className="font-medium">{detailAsset.status}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Assigned To</div>
                <div className="font-medium">
                  {detailAsset.assignedTo
                    ? `${detailAsset.assignedTo.name} (${detailAsset.assignedTo.empId})`
                    : "—"}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Location</div>
                <div className="font-medium">{detailAsset.location}</div>
              </div>

              {detailAsset.username !== undefined && (
                <div>
                  <div className="text-xs text-gray-500">Username</div>
                  <div className="font-medium">
                    {detailAsset.username || "—"}
                  </div>
                </div>
              )}

              {detailAsset.password !== undefined && (
                <div>
                  <div className="text-xs text-gray-500">Password</div>
                  <div className="font-medium">
                    {detailAsset.password ? "●●●●●●●" : "—"}
                  </div>
                </div>
              )}

              <div>
                <div className="text-xs text-gray-500">Purchase Date</div>
                <div className="font-medium">
                  {detailAsset.purchaseDate || "—"}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Warranty Until</div>
                <div className="font-medium">
                  {detailAsset.warrantyUntil || "—"}
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="text-xs text-gray-500">Notes</div>
                <div className="font-medium whitespace-pre-wrap">
                  {detailAsset.notes || "—"}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-2">History</h3>
              <div className="space-y-2">
                {detailAsset.history && detailAsset.history.length > 0 ? (
                  detailAsset.history.map((h, idx) => (
                    <div
                      key={idx}
                      className="text-sm text-gray-700 border p-3 rounded-md"
                    >
                      <div className="text-xs text-gray-500">
                        {h.date} — {h.by}
                      </div>
                      <div className="font-medium">{h.action}</div>
                      <div className="text-xs text-gray-600">{h.notes}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">
                    No history available.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => {
                  const empId = prompt("Assign to employee ID (e.g. E010):");
                  const name = empId ? prompt("Employee name:") : null;
                  if (empId && name) {
                    handleAssign(detailAsset.id, empId, name);
                    setDetailAsset((d) => ({
                      ...d,
                      assignedTo: { empId, name },
                    }));
                  }
                }}
                className="px-3 py-2 rounded-md bg-[#1E90FF] text-white"
              >
                Assign
              </button>

              <button
                onClick={() => {
                  if (!confirm("Mark as Lost?")) return;
                  setAssets((p) =>
                    p.map((a) =>
                      a.id === detailAsset.id ? { ...a, status: "Lost" } : a
                    )
                  );
                  setDetailAsset((d) => ({ ...d, status: "Lost" }));
                }}
                className="px-3 py-2 rounded-md bg-red-600 text-white"
              >
                Mark Lost
              </button>

              <button
                onClick={() => {
                  if (!confirm("Delete this asset?")) return;
                  handleDelete(detailAsset.id);
                }}
                className="px-3 py-2 rounded-md border text-red-600"
              >
                Delete
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Add Asset Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeAdd} />

          <form
            onSubmit={handleAddSubmit}
            className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add Asset</h2>
              <button
                type="button"
                onClick={closeAdd}
                className="text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="text-xs text-gray-600">
                Asset Tag
                <input
                  name="assetTag"
                  value={form.assetTag}
                  onChange={handleFormChange}
                  className="mt-1 w-full px-3 py-2 border rounded-md text-sm outline-none"
                  placeholder="TAG-001"
                />
              </label>

              <label className="text-xs text-gray-600">
                Type
                <select
                  name="type"
                  value={form.type}
                  onChange={handleFormChange}
                  className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
                >
                  {assetTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-xs text-gray-600">
                Model Name
                <input
                  name="modelName"
                  value={form.modelName}
                  onChange={handleFormChange}
                  className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
                />
              </label>

              <label className="text-xs text-gray-600">
                Model No
                <input
                  name="modelNo"
                  value={form.modelNo}
                  onChange={handleFormChange}
                  className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
                />
              </label>

              <label className="text-xs text-gray-600">
                Serial No
                <input
                  name="serialNo"
                  value={form.serialNo}
                  onChange={handleFormChange}
                  className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
                />
              </label>

              {/* dynamic: show username/password for laptops */}
              {form.type === "Laptop" && (
                <>
                  <label className="text-xs text-gray-600">
                    Username
                    <input
                      name="username"
                      value={form.username}
                      onChange={handleFormChange}
                      className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
                    />
                  </label>

                  <label className="text-xs text-gray-600">
                    Password
                    <input
                      name="password"
                      value={form.password}
                      onChange={handleFormChange}
                      className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
                    />
                  </label>
                </>
              )}

              <label className="text-xs text-gray-600">
                Assigned Employee ID
                <input
                  name="assignedEmpId"
                  value={form.assignedEmpId}
                  onChange={handleFormChange}
                  className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
                  placeholder="E005"
                />
              </label>

              <label className="text-xs text-gray-600">
                Assigned Employee Name
                <input
                  name="assignedEmpName"
                  value={form.assignedEmpName}
                  onChange={handleFormChange}
                  className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
                  placeholder="Full name"
                />
              </label>

              <label className="text-xs text-gray-600">
                Location
                <input
                  name="location"
                  value={form.location}
                  onChange={handleFormChange}
                  className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
                />
              </label>

              <label className="text-xs text-gray-600">
                Purchase Date
                <input
                  name="purchaseDate"
                  value={form.purchaseDate}
                  onChange={handleFormChange}
                  type="date"
                  className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
                />
              </label>

              <label className="text-xs text-gray-600">
                Warranty Until
                <input
                  name="warrantyUntil"
                  value={form.warrantyUntil}
                  onChange={handleFormChange}
                  type="date"
                  className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
                />
              </label>

              <label className="text-xs text-gray-600">
                Status
                <select
                  name="status"
                  value={form.status}
                  onChange={handleFormChange}
                  className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-xs text-gray-600 md:col-span-2">
                Notes
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleFormChange}
                  className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
                  rows={3}
                />
              </label>
            </div>

            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeAdd}
                className="px-4 py-2 rounded-md text-sm border"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-[#1E90FF] text-white"
              >
                Add Asset
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
