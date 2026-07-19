"use client";

import { useState, useEffect } from "react";
import { collection, getCountFromServer, query, where, Timestamp } from "firebase/firestore";
import { db, useMockData } from "@/lib/firebase";

// Helper to check if Firestore is properly initialized
const isFirestoreAvailable = () => {
  return !useMockData && db !== null && db !== undefined;
};

export const useArticleStats = () => {
  const [totalArticles, setTotalArticles] = useState(0);
  const [totalPublished, setTotalPublished] = useState(0);
  const [totalDraft, setTotalDraft] = useState(0);
  const [monthlyChange, setMonthlyChange] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticleStats = async () => {
      try {
        setLoading(true);

        // Jika mock mode atau db tidak tersedia, gunakan fallback
        if (!isFirestoreAvailable()) {
          setTotalArticles(156);
          setTotalPublished(142);
          setTotalDraft(14);
          setMonthlyChange(8);
          setError(null);
          setLoading(false);
          return;
        }

        const totalQuery = query(collection(db!, "articles"));
        const totalSnapshot = await getCountFromServer(totalQuery);
        const totalCount = totalSnapshot.data().count;
        setTotalArticles(totalCount);

        const publishedQuery = query(collection(db!, "articles"), where("status", "==", "published"));
        const publishedSnapshot = await getCountFromServer(publishedQuery);
        const publishedCount = publishedSnapshot.data().count;
        setTotalPublished(publishedCount);

        const draftQuery = query(collection(db!, "articles"), where("status", "==", "draft"));
        const draftSnapshot = await getCountFromServer(draftQuery);
        const draftCount = draftSnapshot.data().count;
        setTotalDraft(draftCount);

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthlyQuery = query(collection(db!, "articles"), where("createdAt", ">=", Timestamp.fromDate(startOfMonth)));
        const monthlySnapshot = await getCountFromServer(monthlyQuery);
        const monthlyCount = monthlySnapshot.data().count;
        setMonthlyChange(monthlyCount);

        setError(null);
      } catch (err) {
        console.error("Error fetching article stats:", err);
        setError("Gagal memuat statistik artikel");
      } finally {
        setLoading(false);
      }
    };

    fetchArticleStats();
  }, []);

  return {
    totalArticles,
    totalPublished,
    totalDraft,
    monthlyChange,
    loading,
    error,
  };
};

export const useAnnouncementStats = () => {
  const [totalAnnouncements, setTotalAnnouncements] = useState(0);
  const [activeAnnouncements, setActiveAnnouncements] = useState(0);
  const [expiredAnnouncements, setExpiredAnnouncements] = useState(0);
  const [monthlyChange, setMonthlyChange] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncementStats = async () => {
      try {
        setLoading(true);

        // Jika mock mode atau db tidak tersedia, gunakan fallback
        if (!isFirestoreAvailable()) {
          setTotalAnnouncements(42);
          setActiveAnnouncements(8);
          setExpiredAnnouncements(34);
          setMonthlyChange(3);
          setError(null);
          setLoading(false);
          return;
        }

        const totalQuery = query(collection(db!, "announcements"));
        const totalSnapshot = await getCountFromServer(totalQuery);
        const totalCount = totalSnapshot.data().count;
        setTotalAnnouncements(totalCount);

        const now = new Date();
        const activeQuery = query(
          collection(db!, "announcements"),
          where("startDate", "<=", now.toISOString().split("T")[0]),
          where("endDate", ">=", now.toISOString().split("T")[0])
        );
        const activeSnapshot = await getCountFromServer(activeQuery);
        const activeCount = activeSnapshot.data().count;
        setActiveAnnouncements(activeCount);

        const expiredQuery = query(
          collection(db!, "announcements"),
          where("endDate", "<", now.toISOString().split("T")[0])
        );
        const expiredSnapshot = await getCountFromServer(expiredQuery);
        const expiredCount = expiredSnapshot.data().count;
        setExpiredAnnouncements(expiredCount);

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthlyQuery = query(
          collection(db!, "announcements"),
          where("createdAt", ">=", Timestamp.fromDate(startOfMonth))
        );
        const monthlySnapshot = await getCountFromServer(monthlyQuery);
        const monthlyCount = monthlySnapshot.data().count;
        setMonthlyChange(monthlyCount);

        setError(null);
      } catch (err) {
        console.error("Error fetching announcement stats:", err);
        setError("Gagal memuat statistik pengumuman");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncementStats();
  }, []);

  return {
    totalAnnouncements,
    activeAnnouncements,
    expiredAnnouncements,
    monthlyChange,
    loading,
    error,
  };
};

export const useVisitorStats = () => {
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [dailyVisitors, setDailyVisitors] = useState(0);
  const [todayChange, setTodayChange] = useState(0);
  const [pageViews, setPageViews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndUpdateVisitorStats = async () => {
      try {
        setLoading(true);

        const { getVisitorStats, updateVisitorStats, getTodayVisitorCount, cleanupOldVisitorData, ensureHistoricalData } = await import("@/lib/visitorService");

        await updateVisitorStats();

        await ensureHistoricalData(30);

        const stats = await getVisitorStats();

        if (stats) {
          setTotalVisitors(stats.totalVisitors);
          setPageViews(stats.pageViews);

          const todayCount = getTodayVisitorCount(stats);
          setDailyVisitors(todayCount);
          setTodayChange(todayCount);

          const lastCleanup = localStorage.getItem("lastCleanupDate");
          const today = new Date().toISOString().split("T")[0];
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

          if (!lastCleanup || new Date(lastCleanup) < oneWeekAgo) {
            await cleanupOldVisitorData();
            localStorage.setItem("lastCleanupDate", today);
          }
        } else {
          setTotalVisitors(0);
          setDailyVisitors(0);
          setTodayChange(0);
          setPageViews(0);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching visitor stats:", err);
        setError("Gagal memuat statistik pengunjung");

        setTotalVisitors(0);
        setDailyVisitors(0);
        setTodayChange(0);
        setPageViews(0);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchAndUpdateVisitorStats, 1000);

    return () => clearTimeout(timer);
  }, []);

  return {
    totalVisitors,
    dailyVisitors,
    todayChange,
    pageViews,
    loading,
    error,
  };
};

export const useDashboardStats = () => {
  const articleStats = useArticleStats();
  const announcementStats = useAnnouncementStats();
  const visitorStats = useVisitorStats();

  return {
    articles: articleStats,
    announcements: announcementStats,
    visitors: visitorStats,
    loading: articleStats.loading || announcementStats.loading || visitorStats.loading,
  };
};

