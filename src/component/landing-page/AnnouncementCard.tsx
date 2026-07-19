import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface AnnouncementCardProps {
  announcement: {
    id: string;
    title: string;
    createdAt: any;
    slug: string;
  };
  index: number;
  mounted: boolean;
}

const AnnouncementCard = ({ announcement, index, mounted }: AnnouncementCardProps) => {
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, "EEEE, dd MMMM yyyy", { locale: idLocale });
    } catch (error) {
      return "";
    }
  };

  return (
    <Link
      href={`/pengumuman/${announcement.slug}`}
      className={`card-earth p-4 md:p-6 cursor-pointer group hover-lift block ${mounted ? "smooth-reveal" : "animate-on-load"}`}
      style={{ animationDelay: `${(index + 5) * 0.1}s` }}
    >
      <h4 className="font-medium text-earth-dark mb-2 md:mb-3 text-sm leading-relaxed group-hover:text-earth-accent smooth-transition line-clamp-2">{announcement.title}</h4>
      <div className="flex items-center gap-2 text-earth-muted smooth-transition">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
        <p className="text-xs">{formatDate(announcement.createdAt)}</p>
      </div>
    </Link>
  );
};

export default AnnouncementCard;
