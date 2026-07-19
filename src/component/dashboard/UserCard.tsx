"use client";

import { UserListItem } from "@/lib/userService";
import { FiUser, FiMail, FiCalendar, FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import { formatDate } from "@/utils/dateUtils";

interface UserCardProps {
  user: UserListItem;
  onUpdateRole: (userId: string, newRole: "admin" | "pending") => void;
  onDeleteUser: (userId: string) => void;
  loading: boolean;
  currentUserId?: string;
}

const UserCard = ({ user, onUpdateRole, onDeleteUser, loading, currentUserId }: UserCardProps) => {
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

  const isCurrentUser = currentUserId === user.id;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md smooth-transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-[#1B3A6D] rounded-full flex items-center justify-center">
            <FiUser className="w-6 h-6 text-white" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-gray-900">
              {user.name}
              {isCurrentUser && <span className="text-sm text-gray-500 ml-2">(Anda)</span>}
            </h3>
            <div className="flex items-center text-sm text-gray-600">
              <FiMail className="w-4 h-4 mr-1" />
              {user.email}
            </div>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
          {getRoleLabel(user.role)}
        </span>
      </div>

      <div className="text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <FiCalendar className="w-4 h-4 mr-2" />
          <span>Terdaftar: {formatDate(user.createdAt)}</span>
        </div>
        {user.updatedAt && (
          <div className="flex items-center mt-1">
            <FiEdit2 className="w-4 h-4 mr-2" />
            <span>Diperbarui: {formatDate(user.updatedAt)}</span>
          </div>
        )}
      </div>

      {!isCurrentUser && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Ubah Role:</span>
            <select
              value={user.role}
              onChange={(e) => onUpdateRole(user.id, e.target.value as "admin" | "pending")}
              disabled={loading}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent disabled:opacity-50"
            >
              <option value="pending">Menunggu Persetujuan</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <button
            onClick={() => onDeleteUser(user.id)}
            disabled={loading}
            className="flex items-center text-red-600 hover:text-red-700 text-sm font-medium hover:scale-105 active:scale-95 smooth-transition disabled:opacity-50"
          >
            <FiTrash2 className="w-4 h-4 mr-1" />
            Hapus
          </button>
        </div>
      )}
    </div>
  );
};

export default UserCard;
