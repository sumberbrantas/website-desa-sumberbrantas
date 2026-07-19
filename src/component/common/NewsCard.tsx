import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { FiUser, FiCalendar } from "react-icons/fi";

interface NewsCardProps {
  id: string;
  title: string;
  excerpt?: string;
  imageUrl?: string;
  authorName: string;
  createdAt: any;
  slug: string;
  className?: string;
}

const NewsCard = ({ id, title, excerpt, imageUrl, authorName, createdAt, slug, className = "" }: NewsCardProps) => {
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
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow ${className}`}>
      <Link href={`/berita/${slug}`}>
        <div className="aspect-video w-full overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/berita/${slug}`}>
          <h3 className="font-semibold text-gray-900 mb-2 hover:text-[#1B3A6D] transition-colors line-clamp-2">{title}</h3>
        </Link>

        {excerpt && <p className="text-gray-600 text-sm mb-3 line-clamp-3">{excerpt}</p>}

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <FiUser size={12} />
              <span>{authorName}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiCalendar size={12} />
              <span>{formatDate(createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
