"use client";

import { useState, useEffect } from "react";
import { collection, getCountFromServer, query, where } from "firebase/firestore";
import { db, useMockData } from "@/lib/firebase";

// Helper to check if Firestore is properly initialized
const isFirestoreAvailable = () => {
  return !useMockData && db !== null && db !== undefined;
};

export const usePublicStats = () => {
  const [totalArticles, setTotalArticles] = useState(0);
  const [totalAnnouncements, setTotalAnnouncements] = useState(0);
  const [activeAnnouncements, setActiveAnnouncements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublicStats = async () => {
      try {
        setLoading(true);

        // Jika mock mode atau db tidak tersedia, gunakan fallback
        if (!isFirestoreAvailable()) {
          setTotalArticles(156);
          setTotalAnnouncements(42);
          setActiveAnnouncements(8);
          setError(null);
          setLoading(false);
          return;
        }

        const articlesQuery = query(collection(db!, "articles"), where("status", "==", "published"));
        const articlesSnapshot = await getCountFromServer(articlesQuery);
        const articlesCount = articlesSnapshot.data().count;
        setTotalArticles(articlesCount);

        const announcementsQuery = query(collection(db!, "announcements"));
        const announcementsSnapshot = await getCountFromServer(announcementsQuery);
        const announcementsCount = announcementsSnapshot.data().count;
        setTotalAnnouncements(announcementsCount);

        const now = new Date();
        const activeQuery = query(
          collection(db!, "announcements"),
          where("startDate", "<=", now.toISOString().split("T")[0]),
          where("endDate", ">=", now.toISOString().split("T")[0])
        );
        const activeSnapshot = await getCountFromServer(activeQuery);
        const activeCount = activeSnapshot.data().count;
        setActiveAnnouncements(activeCount);

        setError(null);
      } catch (err) {
        console.error("Error fetching public stats:", err);
        setError("Gagal memuat statistik");
        // Fallback values
        setTotalArticles(156);
        setTotalAnnouncements(42);
        setActiveAnnouncements(8);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicStats();
  }, []);

  return {
    totalArticles,
    totalAnnouncements,
    activeAnnouncements,
    loading,
    error,
  };
};

