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
      <main className="flex-1 h-screen overflow-auto p-8">
        {/* content wrapper gives a clear card that stands out from the gray page bg */}
        <div className="max-w-full mx-auto">
          <div className="bg-transparent">
            {/* card that holds page content — ensures contrast even if inner pages
                themselves use white blocks; this makes hierarchy clear */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="bg-white rounded-2xl shadow-md p-6">
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
