// // app/dashboard/hr/page.jsx
// "use client";

// import { useMemo, useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import CustomTable from "../../components/CustomTable";
// import CustomModalForm from "../../components/CustomModalForm";
// import EmployeeForm from "../../components/EmployeeForm/EmployeeForm";
// import Header from "../../components/Header";
// import EmployeeActions from "../../components/EmployeeActions";
// import ApprovalCard from "../../components/ApprovalCard";
// import { initialApprovals } from "../../sampleData";

// import {
//   fetchEmployees,
//   addEmployee,
//   updateEmployee as updateEmployeeAction,
//   deleteEmployee as deleteEmployeeAction,
//   selectEmployeesItems,
//   selectEmployeesStatus,
// } from "../../../store/slices/employeesSlice";

// const tabs = [
//   { id: "all", label: "All Employees" },
//   { id: "approvals", label: "Approvals" },
// ];

// export default function HRPage() {
//   const dispatch = useDispatch();

//   // tabs + animation
//   const [activeTab, setActiveTab] = useState("all");
//   const [animating, setAnimating] = useState(false);
//   const [pendingTab, setPendingTab] = useState(null);

//   // approvals local
//   const [approvals, setApprovals] = useState(initialApprovals);

//   // modal control
//   // modalMode: "add" | "edit" | "view"
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalMode, setModalMode] = useState("add");
//   const [modalData, setModalData] = useState(null);

//   // employees from redux
//   const employees = useSelector(selectEmployeesItems);
//   const employeesStatus = useSelector(selectEmployeesStatus);

//   // fetch employees once
//   useEffect(() => {
//     if (employeesStatus === "idle") {
//       dispatch(fetchEmployees());
//     }
//   }, [dispatch, employeesStatus]);

//   // modal handlers
//   const openAdd = () => {
//     setModalMode("add");
//     setModalData(null);
//     setModalOpen(true);
//   };
//   const openView = (raw) => {
//     setModalMode("view");
//     setModalData(raw);
//     setModalOpen(true);
//   };
//   const openEdit = (raw) => {
//     setModalMode("edit");
//     setModalData(raw);
//     setModalOpen(true);
//   };
//   const closeModal = () => {
//     setModalOpen(false);
//     setModalData(null);
//   };

//   // handle create
//   const handleCreate = async (payload) => {
//     try {
//       const res = await fetch("/api/employees", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       if (!res.ok) {
//         const txt = await res.text().catch(() => null);
//         throw new Error(txt || "Failed to create employee");
//       }

//       const created = await res.json();
//       const id = created.empId ?? created.id;
//       const name = `${created.firstName ?? ""} ${
//         created.lastName ?? ""
//       }`.trim();

//       const uiRow = {
//         id,
//         name,
//         email: created.email ?? "",
//         role: created.designation ?? "",
//         status: created.status ?? "Active",
//         __raw: created,
//       };

//       dispatch(addEmployee(uiRow));
//       closeModal();
//     } catch (err) {
//       alert("Create failed: " + (err?.message || err));
//       throw err;
//     }
//   };

//   // handle edit
//   const handleEditSubmit = async (payload) => {
//     try {
//       const targetId = modalData?.__raw?.id ?? modalData?.id;
//       if (!targetId) throw new Error("Missing employee id for update");

//       const res = await fetch(`/api/employees/${targetId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       if (!res.ok) {
//         const txt = await res.text().catch(() => null);
//         throw new Error(txt || "Failed to update employee");
//       }

//       const updated = await res.json();
//       const id = updated.empId ?? updated.id;
//       const name = `${updated.firstName ?? ""} ${
//         updated.lastName ?? ""
//       }`.trim();

//       const uiRow = {
//         id,
//         name,
//         email: updated.email ?? "",
//         role: updated.designation ?? "",
//         status: updated.status ?? "Active",
//         __raw: updated,
//       };

//       dispatch(updateEmployeeAction(uiRow));
//       closeModal();
//     } catch (err) {
//       alert("Update failed: " + (err?.message || err));
//       throw err;
//     }
//   };

//   // delete handler
//   const handleDeleteEmployee = async (id) => {
//     if (!confirm("Delete employee " + id + "?")) return;
//     try {
//       const row = employees.find((r) => r.id === id);
//       const serverId = row?.__raw?.id ?? id;
//       await fetch(`/api/employees/${serverId}`, { method: "DELETE" });
//     } catch (err) {
//       console.warn("Server delete failed:", err);
//     } finally {
//       dispatch(deleteEmployeeAction(id));
//     }
//   };

//   // approvals handlers
//   const handleApprove = (id) =>
//     setApprovals((p) =>
//       p.map((a) => (a.id === id ? { ...a, status: "Approved" } : a))
//     );
//   const handleReject = (id) =>
//     setApprovals((p) =>
//       p.map((a) => (a.id === id ? { ...a, status: "Rejected" } : a))
//     );

//   // counts
//   const pendingCount = useMemo(
//     () => approvals.filter((a) => a.status === "Pending").length,
//     [approvals]
//   );
//   const employeeCount = employees.length;

//   // tab switch
//   const handleTabSwitch = (tabId) => {
//     if (tabId === activeTab) return;
//     setAnimating(true);
//     setPendingTab(tabId);
//     setTimeout(() => {
//       setActiveTab(tabId);
//       setAnimating(false);
//     }, 400);
//   };

//   // columns
//   const employeeColumns = [
//     {
//       key: "id",
//       label: "EmpID",
//       render: (row) => {
//         const empId =
//           row.id ??
//           row.empId ??
//           (row.__raw && (row.__raw.empId ?? row.__raw.id)) ??
//           "";
//         return (
//           <button
//             type="button"
//             onClick={() => openView(row.__raw ?? row)}
//             className="text-blue-600 hover:underline text-sm font-medium"
//             title="View employee details"
//           >
//             {empId}
//           </button>
//         );
//       },
//     },
//     { key: "name", label: "Name" },
//     { key: "role", label: "Role" },
//     { key: "email", label: "Email" },
//     { key: "mobile", label: "Mobile" },
//   ];

//   // map modalMode to EmployeeForm's expected mode
//   const mapToFormMode = (m) => {
//     if (m === "add") return "create";
//     if (m === "edit") return "edit";
//     if (m === "view") return "view";
//     return m;
//   };

//   return (
//     <div className="h-[93vh]">
//       <Header employeeCount={employeeCount} onAdd={openAdd} />

//       <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-4">
//         <nav
//           role="tablist"
//           aria-label="HR tabs"
//           className="flex space-x-1 border-b border-gray-300 mb-6 px-2 bg-transparent"
//         >
//           {tabs.map((t) => {
//             const active = activeTab === t.id && !animating;
//             return (
//               <button
//                 key={t.id}
//                 role="tab"
//                 aria-selected={active}
//                 onClick={() => handleTabSwitch(t.id)}
//                 className={`relative flex items-center gap-2 px-5 py-2 font-semibold text-base transition rounded-t-xl ${
//                   active
//                     ? "bg-[#e7f0fa] text-[#173469] border-b-4 border-[#173469]"
//                     : "bg-transparent text-gray-500 border-b-4 border-transparent hover:text-[#173469] hover:bg-[#e7f0fa]"
//                 }`}
//                 disabled={animating}
//                 style={{ outline: "none", boxShadow: "none" }}
//               >
//                 {t.label}
//                 {t.id === "approvals" && pendingCount > 0 && (
//                   <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-[#ffd6db] text-[#9b303d] font-bold text-xs">
//                     {pendingCount}
//                   </span>
//                 )}
//               </button>
//             );
//           })}
//         </nav>

//         <div
//           className={`transition-all duration-400 ease-out ${
//             animating ? "opacity-50 scale-95" : "opacity-100 scale-100"
//           }`}
//           style={{
//             transitionProperty: "opacity, transform",
//             overflow: "hidden",
//           }}
//         >
//           {activeTab === "all" && (
//             <section className="overflow-hidden rounded-xl border border-gray-200 shadow-inner">
//               <div className="overflow-y-auto">
//                 <CustomTable
//                   maxHeight="60vh"
//                   columns={[...employeeColumns]}
//                   data={employees}
//                   rowKey="id"
//                   actions={(row) => (
//                     <EmployeeActions
//                       row={row}
//                       onView={() => openView(row.__raw ?? row)}
//                       onEdit={() => openEdit(row.__raw ?? row)}
//                       onDelete={(id) => handleDeleteEmployee(id)}
//                     />
//                   )}
//                   actionsHeader="Actions"
//                   actionsAlign="center"
//                 />
//               </div>
//             </section>
//           )}

//           {activeTab === "approvals" && (
//             <section className="space-y-6">
//               {approvals.length === 0 ? (
//                 <div className="text-center text-gray-500 text-sm py-10 select-none">
//                   No approvals found.
//                 </div>
//               ) : (
//                 approvals.map((a) => (
//                   <ApprovalCard
//                     key={a.id}
//                     approval={a}
//                     onApprove={handleApprove}
//                     onReject={handleReject}
//                   />
//                 ))
//               )}
//             </section>
//           )}
//         </div>
//       </div>

//       {/* Employee Modal */}
//       <CustomModalForm
//         open={modalOpen}
//         onCancel={closeModal}
//         title={
//           modalMode === "add"
//             ? "Add Employee"
//             : modalMode === "edit"
//             ? "Edit Employee"
//             : "View Employee"
//         }
//         widthClass="max-w-4xl"
//       >
//         <EmployeeForm
//           mode={mapToFormMode(modalMode)}
//           initialData={modalData?.__raw ?? modalData ?? {}}
//           onCancel={closeModal}
//           onSubmit={async (payload) => {
//             if (modalMode === "add") {
//               await handleCreate(payload);
//             } else if (modalMode === "edit") {
//               await handleEditSubmit(payload);
//             } else {
//               closeModal();
//             }
//           }}
//         />
//       </CustomModalForm>
//     </div>
//   );
// }


// // app/dashboard/hr/page.jsx
// "use client";

// import { useMemo, useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import CustomTable from "../../components/CustomTable";
// import CustomModalForm from "../../components/CustomModalForm";
// import EmployeeForm from "../../components/EmployeeForm/EmployeeForm";
// import Header from "../../components/Header";
// import EmployeeActions from "../../components/EmployeeActions";
// import ApprovalCard from "../../components/ApprovalCard";
// import ConfirmDialog from "../../components/ConfirmDialog";
// import { initialApprovals } from "../../sampleData";

// import {
//   fetchEmployees,
//   addEmployee,
//   updateEmployee as updateEmployeeAction,
//   deleteEmployee as deleteEmployeeAction,
//   selectEmployeesItems,
//   selectEmployeesStatus,
// } from "../../../store/slices/employeesSlice";

// const tabs = [
//   { id: "all", label: "All Employees" },
//   { id: "approvals", label: "Approvals" },
// ];

// export default function HRPage() {
//   const dispatch = useDispatch();

//   // tabs + animation
//   const [activeTab, setActiveTab] = useState("all");
//   const [animating, setAnimating] = useState(false);
//   const [pendingTab, setPendingTab] = useState(null);

//   // approvals local
//   const [approvals, setApprovals] = useState(initialApprovals);

//   // modal control
//   // modalMode: "add" | "edit" | "view"
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalMode, setModalMode] = useState("add");
//   const [modalData, setModalData] = useState(null);

//   // confirm dialog control
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [confirmTargetId, setConfirmTargetId] = useState(null);
//   const [confirmMessage, setConfirmMessage] = useState("");

//   // employees from redux
//   const employees = useSelector(selectEmployeesItems);
//   const employeesStatus = useSelector(selectEmployeesStatus);

//   // fetch employees once
//   useEffect(() => {
//     if (employeesStatus === "idle") {
//       dispatch(fetchEmployees());
//     }
//   }, [dispatch, employeesStatus]);

//   // modal handlers
//   const openAdd = () => {
//     setModalMode("add");
//     setModalData(null);
//     setModalOpen(true);
//   };
//   const openView = (raw) => {
//     setModalMode("view");
//     setModalData(raw);
//     setModalOpen(true);
//   };
//   const openEdit = (raw) => {
//     setModalMode("edit");
//     setModalData(raw);
//     setModalOpen(true);
//   };
//   const closeModal = () => {
//     setModalOpen(false);
//     setModalData(null);
//   };

//   // handle create
//   const handleCreate = async (payload) => {
//     try {
//       const res = await fetch("/api/employees", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       if (!res.ok) {
//         const txt = await res.text().catch(() => null);
//         throw new Error(txt || "Failed to create employee");
//       }

//       const created = await res.json();
//       const id = created.empId ?? created.id;
//       const name = `${created.firstName ?? ""} ${created.lastName ?? ""}`.trim();

//       const uiRow = {
//         id,
//         name,
//         email: created.email ?? "",
//         role: created.designation ?? "",
//         status: created.status ?? "Active",
//         __raw: created,
//       };

//       dispatch(addEmployee(uiRow));
//       closeModal();
//     } catch (err) {
//       alert("Create failed: " + (err?.message || err));
//       throw err;
//     }
//   };

//   // handle edit
//   const handleEditSubmit = async (payload) => {
//     try {
//       const targetId = modalData?.__raw?.id ?? modalData?.id;
//       if (!targetId) throw new Error("Missing employee id for update");

//       const res = await fetch(`/api/employees/${targetId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       if (!res.ok) {
//         const txt = await res.text().catch(() => null);
//         throw new Error(txt || "Failed to update employee");
//       }

//       const updated = await res.json();
//       const id = updated.empId ?? updated.id;
//       const name = `${updated.firstName ?? ""} ${updated.lastName ?? ""}`.trim();

//       const uiRow = {
//         id,
//         name,
//         email: updated.email ?? "",
//         role: updated.designation ?? "",
//         status: updated.status ?? "Active",
//         __raw: updated,
//       };

//       dispatch(updateEmployeeAction(uiRow));
//       closeModal();
//     } catch (err) {
//       alert("Update failed: " + (err?.message || err));
//       throw err;
//     }
//   };

//   // --- delete flow: open confirm dialog first, then perform delete on confirm ---

//   // called by EmployeeActions when user clicks delete; opens confirm dialog
//   const handleDeleteEmployee = (id) => {
//     const row = employees.find((r) => r.id === id);
//     const displayName =
//       (row?.name ??
//         `${row?.__raw?.firstName ?? ""} ${
//           row?.__raw?.lastName ?? ""
//         }`.trim()) ||
//       id;

//     setConfirmMessage(`Delete employee ${displayName} (${id})? This action cannot be undone.`);
//     setConfirmTargetId(id);
//     setConfirmOpen(true);
//   };

//   // called when user confirms in ConfirmDialog
//   const performDeleteEmployee = async () => {
//     const id = confirmTargetId;
//     // close the confirm dialog immediately (optimistic)
//     setConfirmOpen(false);

//     if (!id) {
//       setConfirmTargetId(null);
//       return;
//     }

//     try {
//       const row = employees.find((r) => r.id === id);
//       const serverId = row?.__raw?.id ?? id;
//       const res = await fetch(`/api/employees/${serverId}`, { method: "DELETE" });
//       if (!res.ok) {
//         const txt = await res.text().catch(() => null);
//         console.warn("Server delete returned non-OK:", txt);
//       }
//     } catch (err) {
//       console.warn("Server delete failed:", err);
//     } finally {
//       // update UI store (keeps previous behavior)
//       dispatch(deleteEmployeeAction(id));
//       setConfirmTargetId(null);
//     }
//   };

//   // approvals handlers
//   const handleApprove = (id) =>
//     setApprovals((p) => p.map((a) => (a.id === id ? { ...a, status: "Approved" } : a)));
//   const handleReject = (id) =>
//     setApprovals((p) => p.map((a) => (a.id === id ? { ...a, status: "Rejected" } : a)));

//   // counts
//   const pendingCount = useMemo(() => approvals.filter((a) => a.status === "Pending").length, [approvals]);
//   const employeeCount = employees.length;

//   // tab switch
//   const handleTabSwitch = (tabId) => {
//     if (tabId === activeTab) return;
//     setAnimating(true);
//     setPendingTab(tabId);
//     setTimeout(() => {
//       setActiveTab(tabId);
//       setAnimating(false);
//     }, 400);
//   };

//   // columns - fixed empId extraction (avoid mixed ?? and ||)
//   const employeeColumns = [
//     {
//       key: "id",
//       label: "EmpID",
//       render: (row) => {
//         // safe, JS-friendly extraction without mixing ?? and ||
//         const empId =
//           (row && (row.id ?? row.empId)) ??
//           (row && row.__raw ? (row.__raw.empId ?? row.__raw.id) : "") ??
//           "";

//         return (
//           <button
//             type="button"
//             onClick={() => openView(row.__raw ?? row)}
//             className="text-blue-600 hover:underline text-sm font-medium"
//             title="View employee details"
//           >
//             {empId}
//           </button>
//         );
//       },
//     },
//     { key: "name", label: "Name" },
//     { key: "role", label: "Role" },
//     { key: "email", label: "Email" },
//     { key: "mobile", label: "Mobile" },
//   ];

//   // map modalMode to EmployeeForm's expected mode
//   const mapToFormMode = (m) => {
//     if (m === "add") return "create";
//     if (m === "edit") return "edit";
//     if (m === "view") return "view";
//     return m;
//   };

//   return (
//     <div className="h-[93vh]">
//       <Header employeeCount={employeeCount} onAdd={openAdd} />

//       <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-4">
//         <nav
//           role="tablist"
//           aria-label="HR tabs"
//           className="flex space-x-1 border-b border-gray-300 mb-6 px-2 bg-transparent"
//         >
//           {tabs.map((t) => {
//             const active = activeTab === t.id && !animating;
//             return (
//               <button
//                 key={t.id}
//                 role="tab"
//                 aria-selected={active}
//                 onClick={() => handleTabSwitch(t.id)}
//                 className={`relative flex items-center gap-2 px-5 py-2 font-semibold text-base transition rounded-t-xl ${
//                   active
//                     ? "bg-[#e7f0fa] text-[#173469] border-b-4 border-[#173469]"
//                     : "bg-transparent text-gray-500 border-b-4 border-transparent hover:text-[#173469] hover:bg-[#e7f0fa]"
//                 }`}
//                 disabled={animating}
//                 style={{ outline: "none", boxShadow: "none" }}
//               >
//                 {t.label}
//                 {t.id === "approvals" && pendingCount > 0 && (
//                   <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-[#ffd6db] text-[#9b303d] font-bold text-xs">
//                     {pendingCount}
//                   </span>
//                 )}
//               </button>
//             );
//           })}
//         </nav>

//         <div
//           className={`transition-all duration-400 ease-out ${
//             animating ? "opacity-50 scale-95" : "opacity-100 scale-100"
//           }`}
//           style={{
//             transitionProperty: "opacity, transform",
//             overflow: "hidden",
//           }}
//         >
//           {activeTab === "all" && (
//             <section className="overflow-hidden rounded-xl border border-gray-200 shadow-inner">
//               <div className="overflow-y-auto">
//                 <CustomTable
//                   maxHeight="60vh"
//                   columns={[...employeeColumns]}
//                   data={employees}
//                   rowKey="id"
//                   actions={(row) => (
//                     <EmployeeActions
//                       row={row}
//                       onView={() => openView(row.__raw ?? row)}
//                       onEdit={() => openEdit(row.__raw ?? row)}
//                       onDelete={(id) => handleDeleteEmployee(id)}
//                     />
//                   )}
//                   actionsHeader="Actions"
//                   actionsAlign="center"
//                 />
//               </div>
//             </section>
//           )}

//           {activeTab === "approvals" && (
//             <section className="space-y-6">
//               {approvals.length === 0 ? (
//                 <div className="text-center text-gray-500 text-sm py-10 select-none">No approvals found.</div>
//               ) : (
//                 approvals.map((a) => (
//                   <ApprovalCard key={a.id} approval={a} onApprove={handleApprove} onReject={handleReject} />
//                 ))
//               )}
//             </section>
//           )}
//         </div>
//       </div>

//       {/* Employee Modal */}
//       <CustomModalForm
//         open={modalOpen}
//         onCancel={closeModal}
//         title={
//           modalMode === "add" ? "Add Employee" : modalMode === "edit" ? "Edit Employee" : "View Employee"
//         }
//         widthClass="max-w-4xl"
//       >
//         <EmployeeForm
//           mode={mapToFormMode(modalMode)}
//           initialData={modalData?.__raw ?? modalData ?? {}}
//           onCancel={closeModal}
//           onSubmit={async (payload) => {
//             if (modalMode === "add") {
//               await handleCreate(payload);
//             } else if (modalMode === "edit") {
//               await handleEditSubmit(payload);
//             } else {
//               closeModal();
//             }
//           }}
//         />
//       </CustomModalForm>

//       {/* Confirm delete dialog */}
//       <ConfirmDialog
//         open={confirmOpen}
//         title="Delete employee"
//         description={<span className="block">{confirmMessage}</span>}
//         confirmLabel="Delete"
//         cancelLabel="Cancel"
//         destructive={true}
//         onConfirm={performDeleteEmployee}
//         onCancel={() => {
//           setConfirmOpen(false);
//           setConfirmTargetId(null);
//         }}
//       />
//     </div>
//   );
// }


// app/dashboard/hr/page.jsx
"use client";

import { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomTable from "../../components/CustomTable";
import CustomModalForm from "../../components/CustomModalForm";
import EmployeeForm from "../../components/EmployeeForm/EmployeeForm";
import Header from "../../components/Header";
import EmployeeActions from "../../components/EmployeeActions";
import ApprovalCard from "../../components/ApprovalCard";
import ConfirmDialog from "../../components/ConfirmDialog";
import { initialApprovals } from "../../sampleData";

import {
  fetchEmployees,
  addEmployee,
  updateEmployee as updateEmployeeAction,
  deleteEmployee as deleteEmployeeAction,
  selectEmployeesItems,
  selectEmployeesStatus,
} from "../../../store/slices/employeesSlice";

const tabs = [
  { id: "all", label: "All Employees" },
  { id: "approvals", label: "Approvals" },
];

export default function HRPage() {
  const dispatch = useDispatch();

  // tabs + animation
  const [activeTab, setActiveTab] = useState("all");
  const [animating, setAnimating] = useState(false);
  const [pendingTab, setPendingTab] = useState(null);

  // approvals local
  const [approvals, setApprovals] = useState(initialApprovals);

  // modal control
  // modalMode: "add" | "edit" | "view"
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [modalData, setModalData] = useState(null);

  // confirm dialog control
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTargetId, setConfirmTargetId] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");

  // employees from redux
  const employees = useSelector(selectEmployeesItems);
  const employeesStatus = useSelector(selectEmployeesStatus);

  // fetch employees once
  useEffect(() => {
    if (employeesStatus === "idle") {
      dispatch(fetchEmployees());
    }
  }, [dispatch, employeesStatus]);

  // modal handlers
  const openAdd = () => {
    setModalMode("add");
    setModalData(null);
    setModalOpen(true);
  };
  const openView = (raw) => {
    setModalMode("view");
    setModalData(raw);
    setModalOpen(true);
  };
  const openEdit = (raw) => {
    setModalMode("edit");
    setModalData(raw);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setModalData(null);
  };

  // handle create
  const handleCreate = async (payload) => {
    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => null);
        throw new Error(txt || "Failed to create employee");
      }

      const created = await res.json();
      const id = created.empId ?? created.id;
      const name = `${created.firstName ?? ""} ${created.lastName ?? ""}`.trim();

      const uiRow = {
        id,
        name,
        email: created.email ?? "",
        role: created.designation ?? "",
        status: created.status ?? "Active",
        __raw: created,
      };

      dispatch(addEmployee(uiRow));
      closeModal();
    } catch (err) {
      alert("Create failed: " + (err?.message || err));
      throw err;
    }
  };

  // handle edit
  const handleEditSubmit = async (payload) => {
    try {
      const targetId = modalData?.__raw?.id ?? modalData?.id;
      if (!targetId) throw new Error("Missing employee id for update");

      const res = await fetch(`/api/employees/${targetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => null);
        throw new Error(txt || "Failed to update employee");
      }

      const updated = await res.json();
      const id = updated.empId ?? updated.id;
      const name = `${updated.firstName ?? ""} ${updated.lastName ?? ""}`.trim();

      const uiRow = {
        id,
        name,
        email: updated.email ?? "",
        role: updated.designation ?? "",
        status: updated.status ?? "Active",
        __raw: updated,
      };

      dispatch(updateEmployeeAction(uiRow));
      closeModal();
    } catch (err) {
      alert("Update failed: " + (err?.message || err));
      throw err;
    }
  };

  // --- delete flow: open confirm dialog first, then perform delete on confirm ---

  // called by EmployeeActions when user clicks delete; opens confirm dialog
  const handleDeleteEmployee = (id) => {
    const row = employees.find((r) => r.id === id);
    const displayName =
      (row?.name ??
        `${row?.__raw?.firstName ?? ""} ${
          row?.__raw?.lastName ?? ""
        }`.trim()) ||
      id;

    setConfirmMessage(`Delete employee ${displayName} (${id})? This action cannot be undone.`);
    setConfirmTargetId(id);
    setConfirmOpen(true);
  };

  // called when user confirms in ConfirmDialog
  const performDeleteEmployee = async () => {
    const id = confirmTargetId;
    // close the confirm dialog immediately (optimistic)
    setConfirmOpen(false);

    if (!id) {
      setConfirmTargetId(null);
      return;
    }

    try {
      const row = employees.find((r) => r.id === id);
      const serverId = row?.__raw?.id ?? id;
      const res = await fetch(`/api/employees/${serverId}`, { method: "DELETE" });
      if (!res.ok) {
        const txt = await res.text().catch(() => null);
        console.warn("Server delete returned non-OK:", txt);
      }
    } catch (err) {
      console.warn("Server delete failed:", err);
    } finally {
      // update UI store (keeps previous behavior)
      dispatch(deleteEmployeeAction(id));
      setConfirmTargetId(null);
    }
  };

  // approvals handlers
  const handleApprove = (id) =>
    setApprovals((p) => p.map((a) => (a.id === id ? { ...a, status: "Approved" } : a)));
  const handleReject = (id) =>
    setApprovals((p) => p.map((a) => (a.id === id ? { ...a, status: "Rejected" } : a)));

  // counts
  const pendingCount = useMemo(() => approvals.filter((a) => a.status === "Pending").length, [approvals]);
  const employeeCount = employees.length;

  // tab switch
  const handleTabSwitch = (tabId) => {
    if (tabId === activeTab) return;
    setAnimating(true);
    setPendingTab(tabId);
    setTimeout(() => {
      setActiveTab(tabId);
      setAnimating(false);
    }, 400);
  };

  // columns - fixed empId extraction (avoid mixed ?? and ||)
  const employeeColumns = [
    {
      key: "id",
      label: "EmpID",
      render: (row) => {
        // safe, JS-friendly extraction without mixing ?? and ||
        const empId =
          (row && (row.id ?? row.empId)) ??
          (row && row.__raw ? (row.__raw.empId ?? row.__raw.id) : "") ??
          "";

        return (
          <button
            type="button"
            onClick={() => openView(row.__raw ?? row)}
            className="text-blue-600 hover:underline text-sm font-medium"
            title="View employee details"
          >
            {empId}
          </button>
        );
      },
    },
    { key: "name", label: "Name" },
    { key: "role", label: "Role" },
    { key: "email", label: "Email" },
    { key: "mobile", label: "Mobile" },
  ];

  // map modalMode to EmployeeForm's expected mode
  const mapToFormMode = (m) => {
    if (m === "add") return "create";
    if (m === "edit") return "edit";
    if (m === "view") return "view";
    return m;
  };

  return (
    <div className="h-[93vh]">
      <Header employeeCount={employeeCount} onAdd={openAdd} />

      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-4">
        <nav
          role="tablist"
          aria-label="HR tabs"
          className="flex space-x-1 border-b border-gray-300 mb-6 px-2 bg-transparent"
        >
          {tabs.map((t) => {
            const active = activeTab === t.id && !animating;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                onClick={() => handleTabSwitch(t.id)}
                className={`relative flex items-center gap-2 px-5 py-2 font-semibold text-base transition rounded-t-xl ${
                  active
                    ? "bg-[#e7f0fa] text-[#173469] border-b-4 border-[#173469]"
                    : "bg-transparent text-gray-500 border-b-4 border-transparent hover:text-[#173469] hover:bg-[#e7f0fa]"
                }`}
                disabled={animating}
                style={{ outline: "none", boxShadow: "none" }}
              >
                {t.label}
                {t.id === "approvals" && pendingCount > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-[#ffd6db] text-[#9b303d] font-bold text-xs">
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div
          className={`transition-all duration-400 ease-out ${
            animating ? "opacity-50 scale-95" : "opacity-100 scale-100"
          }`}
          style={{
            transitionProperty: "opacity, transform",
            overflow: "hidden",
          }}
        >
          {activeTab === "all" && (
            <section className="overflow-hidden rounded-xl border border-gray-200 shadow-inner">
              <div className="overflow-y-auto">
                <CustomTable
                  maxHeight="60vh"
                  columns={[...employeeColumns]}
                  data={employees}
                  rowKey="id"
                  actions={(row) => (
                    <EmployeeActions
                      row={row}
                      onView={() => openView(row.__raw ?? row)}
                      onEdit={() => openEdit(row.__raw ?? row)}
                      onDelete={(id) => handleDeleteEmployee(id)}
                    />
                  )}
                  actionsHeader="Actions"
                  actionsAlign="center"
                />
              </div>
            </section>
          )}

          {activeTab === "approvals" && (
            <section className="space-y-6">
              {approvals.length === 0 ? (
                <div className="text-center text-gray-500 text-sm py-10 select-none">No approvals found.</div>
              ) : (
                approvals.map((a) => (
                  <ApprovalCard key={a.id} approval={a} onApprove={handleApprove} onReject={handleReject} />
                ))
              )}
            </section>
          )}
        </div>
      </div>

      {/* Employee Modal */}
      <CustomModalForm
        open={modalOpen}
        onCancel={closeModal}
        title={
          modalMode === "add" ? "Add Employee" : modalMode === "edit" ? "Edit Employee" : "View Employee"
        }
        widthClass="max-w-4xl"
      >
        <EmployeeForm
          mode={mapToFormMode(modalMode)}
          initialData={modalData?.__raw ?? modalData ?? {}}
          onCancel={closeModal}
          onSubmit={async (payload) => {
            if (modalMode === "add") {
              await handleCreate(payload);
            } else if (modalMode === "edit") {
              await handleEditSubmit(payload);
            } else {
              closeModal();
            }
          }}
        />
      </CustomModalForm>

      {/* Confirm delete dialog */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete employee"
        description={<span className="block">{confirmMessage}</span>}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive={true}
        onConfirm={performDeleteEmployee}
        onCancel={() => {
          setConfirmOpen(false);
          setConfirmTargetId(null);
        }}
      />
    </div>
  );
}
