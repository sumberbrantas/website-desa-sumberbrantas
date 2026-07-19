import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface NewsCardProps {
  news: {
    id: string;
    title: string;
    excerpt?: string;
    imageUrl?: string;
    authorName: string;
    createdAt: any;
    slug: string;
  };
  index: number;
  mounted: boolean;
}

const NewsCard = ({ news, index, mounted }: NewsCardProps) => {
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
      href={`/berita/${news.slug}`}
      className={`card-earth overflow-hidden group cursor-pointer hover-lift ${
        mounted ? "smooth-reveal" : "animate-on-load"
      }`}
      style={{ animationDelay: `${(index + 2) * 0.1}s` }}
    >
      <div className="aspect-video overflow-hidden">
        <img
          src={news.imageUrl || "/kantor_desa.jpg"}
          alt={news.title}
          className="w-full h-full object-cover group-hover:scale-105 smooth-transition"
        />
      </div>

      <div className="p-4 md:p-6">
        <h3 className="font-semibold text-earth-dark mb-2 md:mb-3 line-clamp-2 text-sm leading-relaxed smooth-transition group-hover:text-earth-accent">
          {news.title}
        </h3>
        <p className="text-earth-muted text-xs mb-3 md:mb-4 line-clamp-3 leading-relaxed smooth-transition">
          {news.excerpt || "Tidak ada excerpt"}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-earth-primary rounded-full flex items-center justify-center hover-scale smooth-transition">
              <span className="text-white text-xs font-bold">DN</span>
            </div>
            <div>
              <p className="text-xs font-medium text-earth-dark smooth-transition">{news.authorName}</p>
              <p className="text-xs text-earth-muted smooth-transition">{formatDate(news.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
