import { collection, getCountFromServer, query, where, Timestamp, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const fetchArticleStats = async () => {
  if (!db) return { totalArticles: 0, totalPublished: 0, totalDraft: 0, monthlyChange: 0 };

  const totalQuery = query(collection(db, "articles"));
  const totalSnapshot = await getCountFromServer(totalQuery);
  const totalCount = totalSnapshot.data().count;

  const publishedQuery = query(collection(db, "articles"), where("status", "==", "published"));
  const publishedSnapshot = await getCountFromServer(publishedQuery);
  const publishedCount = publishedSnapshot.data().count;

  const draftQuery = query(collection(db, "articles"), where("status", "==", "draft"));
  const draftSnapshot = await getCountFromServer(draftQuery);
  const draftCount = draftSnapshot.data().count;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyQuery = query(collection(db, "articles"), where("createdAt", ">=", Timestamp.fromDate(startOfMonth)));
  const monthlySnapshot = await getCountFromServer(monthlyQuery);
  const monthlyCount = monthlySnapshot.data().count;

  return {
    totalArticles: totalCount,
    totalPublished: publishedCount,
    totalDraft: draftCount,
    monthlyChange: monthlyCount,
  };
};

export const fetchAnnouncementStats = async () => {
  if (!db) return { totalAnnouncements: 0, activeAnnouncements: 0 };

  const totalQuery = query(collection(db, "announcements"));
  const totalSnapshot = await getCountFromServer(totalQuery);
  const totalCount = totalSnapshot.data().count;

  const activeQuery = query(collection(db, "announcements"), where("status", "==", "active"));
  const activeSnapshot = await getCountFromServer(activeQuery);
  const activeCount = activeSnapshot.data().count;

  return {
    totalAnnouncements: totalCount,
    activeAnnouncements: activeCount,
  };
};

export const fetchVisitorStats = async () => {
  if (!db) return { totalVisitors: 0, uniqueVisitors: 0 };

  const q = query(collection(db, "visitors"), where("date", ">=", "2025-01-01"));
  const snapshot = await getDocs(q);
  let totalVisitors = 0;
  const uniqueDates = new Set<string>();

  snapshot.forEach((doc) => {
    const data = doc.data();
    totalVisitors += data.count || 0;
    uniqueDates.add(data.date);
  });

  return {
    totalVisitors,
    uniqueVisitors: uniqueDates.size,
  };
};
