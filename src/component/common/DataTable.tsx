import React from "react";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import Link from "next/link";

interface Column {
  key: string;
  label: string;
  className?: string;
  render?: (value: any, item: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  editRoute?: string | ((id: string | number) => void);
  onDelete?: (id: string | number) => void;
  viewRoute?: (item: any) => string | null;
  mounted?: boolean;
}

const DataTable = ({ columns, data, editRoute, onDelete, viewRoute, mounted = true }: DataTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={`app-table-cell text-left text-xs font-medium uppercase tracking-wider ${column.className || ""}`}>
                {column.label}
              </th>
            ))}
            {(editRoute || onDelete || viewRoute) && <th className="app-table-cell text-left text-xs font-medium uppercase tracking-wider">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id} className="hover:bg-earth-sand/30 smooth-transition">
              {columns.map((column) => (
                <td key={column.key} className={`app-table-cell ${column.className || ""}`}>
                  {column.render ? column.render(item[column.key], item) : item[column.key]}
                </td>
              ))}
              {(editRoute || onDelete || viewRoute) && (
                <td className="app-table-cell whitespace-nowrap text-xs">
                  <div className="flex gap-1">
                    {viewRoute && viewRoute(item) && (
                      <Link href={viewRoute(item)!} target="_blank" rel="noopener noreferrer">
                        <button className="p-1.5 rounded smooth-transition hover-lift" style={{ color: "var(--success)" }}>
                          <FiEye size={14} />
                        </button>
                      </Link>
                    )}
                    {editRoute &&
                      (typeof editRoute === "string" ? (
                        <Link href={`${editRoute}?id=${item.id}`}>
                          <button className="p-1.5 rounded smooth-transition hover-lift" style={{ color: "var(--primary)" }}>
                            <FiEdit size={14} />
                          </button>
                        </Link>
                      ) : (
                        <button onClick={() => editRoute(item.id)} className="p-1.5 rounded smooth-transition hover-lift" style={{ color: "var(--primary)" }}>
                          <FiEdit size={14} />
                        </button>
                      ))}
                    {onDelete && (
                      <button onClick={() => onDelete(item.id)} className="p-1.5 rounded smooth-transition hover-lift" style={{ color: "var(--error)" }}>
                        <FiTrash2 size={14} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
