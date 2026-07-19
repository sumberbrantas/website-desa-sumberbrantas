import React from "react";
import Link from "next/link";
import AnnouncementCard from "./AnnouncementCard";
import { ErrorState, EmptyState, CardSkeleton } from "@/component/common/LoadingStates";

interface AnnouncementsContentProps {
  activeAnnouncements: any[];
  announcementsLoading: boolean;
  announcementsError: string | null;
  refetchAnnouncements: () => void;
  mounted: boolean;
}

const AnnouncementsContent = ({ 
  activeAnnouncements, 
  announcementsLoading, 
  announcementsError, 
  refetchAnnouncements, 
  mounted 
}: AnnouncementsContentProps) => {
  if (announcementsLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <CardSkeleton key={index} className="!p-4" />
        ))}
      </div>
    );
  }

  if (announcementsError) {
    return <ErrorState message={announcementsError} onRetry={refetchAnnouncements} />;
  }

  if (activeAnnouncements.length === 0) {
    return <EmptyState title="Belum ada pengumuman" description="Pengumuman akan muncul di sini ketika tersedia" />;
  }

  return (
    <>
      <div className="space-y-4 mb-6 md:mb-8">
        {activeAnnouncements.map((announcement, index) => (
          <AnnouncementCard
            key={announcement.id}
            announcement={announcement}
            index={index}
            mounted={mounted}
          />
        ))}
      </div>

      <div className={`smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
        <Link
          href="/pengumuman"
          className="btn-earth-primary px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium smooth-transition text-sm btn-animate inline-block"
        >
          Lihat Pengumuman Lainnya
        </Link>
      </div>
    </>
  );
};

export default AnnouncementsContent;
