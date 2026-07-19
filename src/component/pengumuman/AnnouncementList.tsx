import { FC } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface AnnouncementListProps {
  mounted: boolean;
  announcements: any[];
}

const AnnouncementList: FC<AnnouncementListProps> = ({ mounted, announcements }) => {
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";

    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, "EEEE, dd MMMM yyyy", { locale: idLocale });
    } catch (error) {
      return "";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "penting":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "Urgent";
      case "penting":
        return "Penting";
      default:
        return "Normal";
    }
  };

  return (
    <div className={`smooth-transition ${mounted ? "smooth-reveal stagger-3" : "animate-on-load"}`}>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-12">
        <div className="divide-y divide-gray-200">
          {announcements.map((announcement, index) => (
            <Link key={announcement.id} href={`/pengumuman/${announcement.slug}`} className="block">
              <div className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="mb-3">
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(announcement.priority)}`}>{getPriorityLabel(announcement.priority)}</span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#1B3A6D] transition-colors">{announcement.title}</h3>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{announcement.content.length > 150 ? `${announcement.content.substring(0, 150)}...` : announcement.content}</p>

                    <p className="text-sm text-gray-500">{formatDate(announcement.createdAt)}</p>
                  </div>

                  <div className="ml-4 flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-[#1B3A6D] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementList;
