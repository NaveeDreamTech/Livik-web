// app/dashboard/layout.jsx
import Sidebar from "./Sidebar";

export const metadata = {
  title: "Dashboard",
};

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen w-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
        <Sidebar />
      </aside>

      {/* Main area */}
      <main className="flex-1 h-screen overflow-auto p-4">
        <div className="max-w-full mx-auto">
          <div className="bg-transparent">
            
              <div className="bg-gray-300 rounded-2xl shadow-md p-6">
                {children}
              </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
