import { collection, query, getDocs, doc, updateDoc, deleteDoc, orderBy, where, getDoc } from "firebase/firestore";
import { db, useMockData } from "./firebase";
import { UserProfile } from "./auth";

export interface UserListItem extends UserProfile {
  id: string;
}

// Mock users data
const mockUsers: UserListItem[] = [
  {
    uid: "mock-uid-123",
    id: "mock-uid-123",
    email: "admin@desa.test",
    name: "Admin Desa",
    role: "admin",
    createdAt: new Date("2025-01-01"),
  },
  {
    uid: "mock-uid-456",
    id: "mock-uid-456",
    email: "editor@desa.test",
    name: "Editor Desa",
    role: "pending",
    createdAt: new Date("2025-01-15"),
  },
];

export const getAllUsers = async (): Promise<UserListItem[]> => {
  if (useMockData) {
    return [...mockUsers];
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    const usersRef = collection(db, "users");
    const q = query(usersRef);
    const querySnapshot = await getDocs(q);

    const users: UserListItem[] = [];
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data(),
      } as UserListItem);
    });

    users.sort((a, b) => {
      const aDate = a.createdAt && typeof a.createdAt === "object" && "toDate" in a.createdAt ? (a.createdAt as any).toDate() : new Date(a.createdAt || 0);
      const bDate = b.createdAt && typeof b.createdAt === "object" && "toDate" in b.createdAt ? (b.createdAt as any).toDate() : new Date(b.createdAt || 0);
      return bDate.getTime() - aDate.getTime();
    });

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
};

export const getUsersByRole = async (role: "admin" | "pending"): Promise<UserListItem[]> => {
  if (useMockData) {
    return mockUsers.filter(u => u.role === role);
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("role", "==", role));
    const querySnapshot = await getDocs(q);

    const users: UserListItem[] = [];
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data(),
      } as UserListItem);
    });

    return users;
  } catch (error) {
    console.error("Error fetching users by role:", error);
    throw new Error("Failed to fetch users by role");
  }
};

export const updateUserRole = async (userId: string, newRole: "admin" | "pending"): Promise<void> => {
  if (useMockData) {
    const user = mockUsers.find(u => u.id === userId);
    if (user) user.role = newRole;
    return;
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      role: newRole,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    throw new Error("Failed to update user role");
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  if (useMockData) {
    const index = mockUsers.findIndex(u => u.id === userId);
    if (index !== -1) mockUsers.splice(index, 1);
    return;
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    await deleteDoc(doc(db, "users", userId));
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user");
  }
};

export const getUserStats = async () => {
  if (useMockData) {
    return {
      totalUsers: mockUsers.length,
      pendingUsers: mockUsers.filter(u => u.role === "pending").length,
      adminUsers: mockUsers.filter(u => u.role === "admin").length,
    };
  }

  try {
    const [allUsers, pendingUsers, adminUsers] = await Promise.all([getAllUsers(), getUsersByRole("pending"), getUsersByRole("admin")]);

    return {
      totalUsers: allUsers.length,
      pendingUsers: pendingUsers.length,
      adminUsers: adminUsers.length,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw new Error("Failed to fetch user stats");
  }
};
