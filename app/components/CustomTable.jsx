// // components/CustomTable.jsx
// "use client";

// import React from "react";

// /**
//  * CustomTable - a reusable table component.
//  *
//  * Props:
//  * - columns: array of { key, label, className?, render? }
//  * - data: array of objects
//  * - rowKey: string (unique key from data)
//  * - actions?: (row) => ReactNode (optional)
//  * - actionsHeader?: string (optional)
//  * - className?: string
//  * - tableClassName?: string
//  * - theadClassName?: string
//  * - tbodyClassName?: string
//  * - actionsAlign?: 'center' | 'right' (default: 'center')
//  */
// export default function CustomTable({
//   columns = [],
//   data = [],
//   rowKey = "id",
//   actions,
//   actionsHeader,
//   className = "",
//   tableClassName = "min-w-full divide-y divide-gray-200",
//   theadClassName = "bg-gray-50",
//   tbodyClassName = "bg-white divide-y divide-gray-200",
//   actionsAlign = "center",
// }) {
//   return (
//     <div className={`overflow-x-auto w-full ${className}`}>
//       <table className={`${tableClassName}`}>
//         <thead className={theadClassName}>
//           <tr>
//             {columns.map((col) => (
//               <th
//                 key={col.key}
//                 className={`px-5 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap ${
//                   col.className || ""
//                 }`}
//               >
//                 {col.label}
//               </th>
//             ))}
//             {actionsHeader && (
//               <th
//                 className={`px-5 py-3 text-${actionsAlign} text-sm font-semibold text-gray-900 whitespace-nowrap`}
//               >
//                 {actionsHeader}
//               </th>
//             )}
//           </tr>
//         </thead>
//         <tbody className={tbodyClassName}>
//           {data.length > 0 ? (
//             data.map((row) => (
//               <tr
//                 key={row[rowKey]}
//                 className="hover:bg-gray-50 transition-colors select-none"
//               >
//                 {columns.map((col) => (
//                   <td
//                     key={col.key}
//                     className={`px-5 py-3 text-sm text-gray-700 whitespace-nowrap ${
//                       col.className || ""
//                     }`}
//                   >
//                     {col.render ? col.render(row) : row[col.key]}
//                   </td>
//                 ))}
//                 {actions && (
//                   <td
//                     className={`px-5 py-3 text-${actionsAlign} whitespace-nowrap`}
//                   >
//                     {actions(row)}
//                   </td>
//                 )}
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td
//                 colSpan={columns.length + (actions ? 1 : 0)}
//                 className="px-5 py-10 text-center text-gray-500 text-sm"
//               >
//                 No records found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }


// components/CustomTable.jsx
"use client";

import React from "react";

/**
 * CustomTable - a reusable table component with sticky header and hidden scrollbar.
 *
 * Props:
 * - columns: array of { key, label, className?, render? }
 * - data: array of objects
 * - rowKey: string (unique key from data)
 * - actions?: (row) => ReactNode (optional)
 * - actionsHeader?: string (optional)
 * - className?: string
 * - tableClassName?: string
 * - theadClassName?: string
 * - tbodyClassName?: string
 * - actionsAlign?: 'center' | 'right' (default: 'center')
 * - maxHeight?: string (e.g. "60vh" or "400px") - controls when vertical scroll appears
 */
export default function CustomTable({
  columns = [],
  data = [],
  rowKey = "id",
  actions,
  actionsHeader,
  className = "",
  tableClassName = "min-w-full divide-y divide-gray-200",
  theadClassName = "bg-gray-50",
  tbodyClassName = "bg-white divide-y divide-gray-200",
  actionsAlign = "center",
  maxHeight = "60vh",
}) {
  return (
    <div
      className={`relative w-full ${className}`}
      // container handles both x and y overflow; y scroll hidden visually
      style={{
        maxHeight,
        overflowX: "auto",
        overflowY: "auto",
        msOverflowStyle: "none", // IE/Edge
        scrollbarWidth: "none", // Firefox
      }}
    >
      {/* hide webkit scrollbar */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        /* make the header sticky */
        thead th {
          position: sticky;
          top: 0;
          z-index: 10;
        }

        /* in case background isn't set, ensure header has solid background */
        thead tr {
          background: var(--thead-bg, #f9fafb);
        }
      `}</style>

      <table className={`${tableClassName} table-auto`}>
        <thead className={theadClassName}>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-5 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap ${
                  col.className || ""
                }`}
                // The background is applied inline to ensure sticky header covers rows under it
                style={{ background: "inherit" }}
              >
                {col.label}
              </th>
            ))}
            {actionsHeader && (
              <th
                className={`px-5 py-3 text-${actionsAlign} text-sm font-semibold text-gray-900 whitespace-nowrap`}
                style={{ background: "inherit" }}
              >
                {actionsHeader}
              </th>
            )}
          </tr>
        </thead>

        <tbody className={tbodyClassName}>
          {data.length > 0 ? (
            data.map((row) => (
              <tr
                key={row[rowKey]}
                className="hover:bg-gray-50 transition-colors select-none"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-5 py-3 text-sm text-gray-700 whitespace-nowrap ${
                      col.className || ""
                    }`}
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                {actions && (
                  <td
                    className={`px-5 py-3 text-${actionsAlign} whitespace-nowrap`}
                  >
                    {actions(row)}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="px-5 py-10 text-center text-gray-500 text-sm"
              >
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
