"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FiCalendar, FiUser, FiClock, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import Header from "@/component/landing-page/Header";
import Footer from "@/component/landing-page/Footer";
import { getArticleBySlug } from "@/lib/articleService";
import { Article } from "@/lib/articleService";
import { usePublishedArticles } from "@/hooks/useArticles";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import CreditsFooter from "@/component/common/CreditsFooter";

const BeritaDetailPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const [mounted, setMounted] = useState(false);
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { articles: relatedArticles } = usePublishedArticles(4);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setError(null);
        const articleData = await getArticleBySlug(slug);

        if (articleData && articleData.status === "published") {
          setArticle(articleData);
        } else {
          setError("Artikel tidak ditemukan atau belum dipublikasikan");
        }
      } catch (err) {
        setError("Gagal memuat artikel");
        console.error("Error fetching article:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";

    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, "EEEE, dd MMMM yyyy", { locale: idLocale });
    } catch (error) {
      return "";
    }
  };

  const formatReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(" ").length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} menit baca`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-grow flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3A6D] mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat artikel...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <main className="min-h-screen flex flex-col lg:block">
        <Header />
        <div className="h-screen lg:h-screen lg:w-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 lg:fixed lg:inset-0 lg:overflow-hidden">
          <div className={`max-w-6xl w-full smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
              <div className="flex-1 flex justify-center lg:justify-end relative">
                <div className="relative">
                  <Image height={400} width={600} src="/not-found.png" alt="Artikel tidak ditemukan" className="max-w-full h-auto" />
                </div>
              </div>

              <div className="flex-1 text-center lg:text-left max-w-md lg:max-w-lg">
                <div className="space-y-6">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">Artikel Tidak Ditemukan</h1>

                  <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">{error || "Artikel yang Anda cari tidak ditemukan atau mungkin telah dipindahkan."}</p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Link
                      href="/berita"
                      className="bg-[#1B3A6D] text-white px-8 py-2 rounded-lg font-medium border-2 border-[#1B3A6D] hover:bg-[#1B3A6D] hover:text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Kembali ke Berita
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`w-full bg-gray-200 py-4 md:py-4 smooth-transition lg:fixed lg:bottom-0 lg:left-0 lg:z-20 ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
          <CreditsFooter variant="light" />
        </div>
      </main>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
      <Header />

      {/* Breadcrumb */}
      <nav className="bg-gray-50 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#1B3A6D] transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <Link href="/berita" className="hover:text-[#1B3A6D] transition-colors">
              Berita
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{article.title}</span>
          </div>
        </div>
      </nav>

      {/* Article Content */}
      <main className="flex-grow bg-white py-8">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link href="/berita" className="inline-flex items-center gap-2 text-[#1B3A6D] hover:text-[#152f5a] transition-colors mb-6">
            <FiArrowLeft size={16} />
            Kembali ke Berita
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{article.title}</h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <FiUser size={16} />
                <span>{article.authorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar size={16} />
                <span>{formatDate(article.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiClock size={16} />
                <span>{formatReadingTime(article.content)}</span>
              </div>
            </div>

            {/* Featured Image */}
            {article.imageUrl && (
              <div className="aspect-video w-full overflow-hidden rounded-lg mb-6">
                <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
              </div>
            )}
          </header>

          {/* Article Body */}
          <div className="prose prose-lg max-w-none">
            <div
              className="article-content text-justify leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: article.content.replace(/\n/g, "<br />"),
              }}
            />
          </div>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Diterbitkan pada {formatDate(article.createdAt)}
                {article.updatedAt && article.updatedAt !== article.createdAt && <span> • Diperbarui pada {formatDate(article.updatedAt)}</span>}
              </div>
              <Link href="/berita" className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B3A6D] text-white rounded hover:bg-[#152f5a] transition-colors">
                Lihat Berita Lainnya
              </Link>
            </div>
          </footer>
        </article>

        {/* Related Articles */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Berita Terkait</h2>

          {relatedArticles.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-200">
                {relatedArticles
                  .filter((related) => related.id !== article.id)
                  .slice(0, 3)
                  .map((related, index) => (
                    <Link key={related.id} href={`/berita/${related.slug}`} className="block">
                      <div className="hover:bg-gray-50 transition-colors cursor-pointer group">
                        <div className="flex items-center">
                          {/* Featured Image */}

                          {/* Content */}
                          <div className="flex-1 p-6 flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              {/* Title */}
                              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#1B3A6D] transition-colors">{related.title}</h3>

                              {/* Meta Info */}
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <FiUser size={14} />
                                  <span>{related.authorName}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <FiCalendar size={14} />
                                  <span>{formatDate(related.createdAt)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Arrow Icon */}
                            <div className="flex-shrink-0 ml-4">
                              <svg className="w-5 h-5 text-gray-400 group-hover:text-[#1B3A6D] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500">Tidak ada berita terkait</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BeritaDetailPage;
