"use client";

import { useState, useEffect } from "react";
import { getAllUsers, getUsersByRole, updateUserRole, deleteUser, getUserStats, UserListItem } from "@/lib/userService";

export const useUsers = () => {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersList = await getAllUsers();
      setUsers(usersList);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const refetch = () => {
    fetchUsers();
  };

  return {
    users,
    loading,
    error,
    refetch,
  };
};

export const useUsersByRole = (role: "admin" | "pending") => {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersList = await getUsersByRole(role);
      setUsers(usersList);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [role]);

  const refetch = () => {
    fetchUsers();
  };

  return {
    users,
    loading,
    error,
    refetch,
  };
};

export const useUserActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateRole = async (userId: string, newRole: "admin" | "pending") => {
    try {
      setLoading(true);
      setError(null);
      await updateUserRole(userId, newRole);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user role");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeUser = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteUser(userId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    updateRole,
    removeUser,
    loading,
    error,
    clearError,
  };
};

export const useUserStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    adminUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const userStats = await getUserStats();
      setStats(userStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch user stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const refetch = () => {
    fetchStats();
  };

  return {
    stats,
    loading,
    error,
    refetch,
  };
};
