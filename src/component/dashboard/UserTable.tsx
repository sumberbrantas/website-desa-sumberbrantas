"use client";

import { UserListItem } from "@/lib/userService";
import { FiEdit2, FiTrash2, FiUser, FiCalendar } from "react-icons/fi";
import { formatDate } from "@/utils/dateUtils";

interface UserTableProps {
  users: UserListItem[];
  onUpdateRole: (userId: string, newRole: "admin" | "pending") => void;
  onDeleteUser: (userId: string) => void;
  loading: boolean;
  currentUserId?: string;
}

const UserTable = ({ users, onUpdateRole, onDeleteUser, loading, currentUserId }: UserTableProps) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "pending":
        return "Menunggu Persetujuan";
      default:
        return "Tidak Diketahui";
    }
  };

  const columns = [
    { key: "user", label: "Pengguna", sortable: false },
    { key: "role", label: "Role", sortable: true },
    { key: "createdAt", label: "Terdaftar", sortable: true },
    { key: "actions", label: "Aksi", sortable: false }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => {
              const isCurrentUser = currentUserId === user.id;
              return (
                <tr key={user.id} className="hover:bg-gray-50 smooth-transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10">
                        <div className="w-10 h-10 bg-[#1B3A6D] rounded-full flex items-center justify-center">
                          <FiUser className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                          {isCurrentUser && (
                            <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              Anda
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <FiCalendar className="w-4 h-4 mr-2 text-gray-400" />
                      {formatDate(user.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {!isCurrentUser && (
                      <div className="flex items-center space-x-3">
                        <select
                          value={user.role}
                          onChange={(e) => onUpdateRole(user.id, e.target.value as "admin" | "pending")}
                          disabled={loading}
                          className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent disabled:opacity-50"
                        >
                          <option value="pending">Menunggu Persetujuan</option>
                          <option value="admin">Administrator</option>
                        </select>
                        <button
                          onClick={() => onDeleteUser(user.id)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-700 hover:scale-110 active:scale-95 smooth-transition disabled:opacity-50"
                          title="Hapus pengguna"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
