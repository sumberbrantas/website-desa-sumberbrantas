import React from "react";

interface ErrorFallbackProps {
  error?: Error;
  onRetry?: () => void;
  title?: string;
  description?: string;
}

export const ErrorFallback = ({ error, onRetry, title = "Terjadi kesalahan", description = "Silakan refresh halaman atau coba lagi nanti" }: ErrorFallbackProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      <div className="text-red-500 mb-2 text-lg font-semibold">{title}</div>
      <div className="text-gray-500 text-sm mb-4 text-center max-w-md">{description}</div>

      {process.env.NODE_ENV === "development" && error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 max-w-md">
          <div className="text-red-700 text-xs font-mono">{error.message}</div>
        </div>
      )}

      <button onClick={onRetry} className="bg-[#1B3A6D] text-white px-4 py-2 rounded-lg hover:bg-[#152f5a] transition-colors text-sm">
        Coba Lagi
      </button>
    </div>
  );
};

export const NetworkErrorFallback = ({ onRetry }: { onRetry?: () => void }) => <ErrorFallback title="Koneksi bermasalah" description="Periksa koneksi internet Anda dan coba lagi" onRetry={onRetry} />;

export const NotFoundFallback = ({ onRetry }: { onRetry?: () => void }) => <ErrorFallback title="Data tidak ditemukan" description="Data yang Anda cari tidak ditemukan atau sudah dihapus" onRetry={onRetry} />;

export const UnauthorizedFallback = ({ onRetry }: { onRetry?: () => void }) => <ErrorFallback title="Akses ditolak" description="Anda tidak memiliki akses untuk melihat konten ini" onRetry={onRetry} />;
