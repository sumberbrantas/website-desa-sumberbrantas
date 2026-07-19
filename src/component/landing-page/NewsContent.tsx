import React from "react";
import Link from "next/link";
import NewsCard from "./NewsCard";
import { LoadingSpinner, ErrorState, EmptyState, NewsCardSkeleton } from "@/component/common/LoadingStates";

interface NewsContentProps {
  articles: any[];
  articlesLoading: boolean;
  articlesError: string | null;
  refetchArticles: () => void;
  mounted: boolean;
}

const NewsContent = ({ articles, articlesLoading, articlesError, refetchArticles, mounted }: NewsContentProps) => {
  if (articlesLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        {Array.from({ length: 2 }).map((_, index) => (
          <NewsCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (articlesError) {
    return <ErrorState message={articlesError} onRetry={refetchArticles} className="mb-6 md:mb-8" />;
  }

  if (articles.length === 0) {
    return <EmptyState title="Belum ada berita" description="Berita akan muncul di sini setelah dipublikasikan" className="mb-6 md:mb-8" />;
  }

  const newsData = articles.slice(0, 2);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        {newsData.map((news, index) => (
          <NewsCard key={news.id} news={news} index={index} mounted={mounted} />
        ))}
      </div>

      <div className={`smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
        <Link
          href="/berita"
          className="btn-earth-primary px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium smooth-transition text-sm btn-animate inline-block"
        >
          Berita Lainnya
        </Link>
      </div>
    </>
  );
};

export default NewsContent;
