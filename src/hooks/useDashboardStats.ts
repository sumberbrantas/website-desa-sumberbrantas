import { useArticleStats, useAnnouncementStats, useVisitorStats } from "./useStatisticsRefactored";

export const useDashboardStats = () => {
  const articleStats = useArticleStats();
  const announcementStats = useAnnouncementStats();
  const visitorStats = useVisitorStats();

  const loading = articleStats.loading || announcementStats.loading || visitorStats.loading;
  const hasError = articleStats.error || announcementStats.error || visitorStats.error;

  return {
    articles: {
      total: articleStats.totalArticles,
      published: articleStats.totalPublished,
      draft: articleStats.totalDraft,
      monthlyChange: articleStats.monthlyChange,
    },
    announcements: {
      total: announcementStats.totalAnnouncements,
      active: announcementStats.activeAnnouncements,
      // Properti 'expired' dan 'monthlyChange' dihapus karena tidak disuplai oleh service
    },
    visitors: {
      total: visitorStats.totalVisitors,
      // Mengubah 'today' dan 'monthly' menjadi 'unique' sesuai struktur data service
      unique: visitorStats.uniqueVisitors,
    },
    loading,
    error: hasError,
  };
};
