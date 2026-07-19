"use client";

import { useActiveAccommodations } from "@/hooks/useAccommodations";
import { useVillageSettings } from "@/hooks/useVillageSettings";
import { getAccommodationWhatsAppLink } from "@/lib/accommodationService";
import { FiMapPin, FiExternalLink, FiPhone } from "react-icons/fi";
import Link from "next/link";

const AccommodationsSection = () => {
  const { accommodations, loading, error, refetch } = useActiveAccommodations(6);
  const { settings } = useVillageSettings();

  if (loading) {
    return (
      <section className="py-16 px-4" style={{ backgroundColor: "var(--background)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card-earth overflow-hidden">
                <div className="h-48 bg-earth-sand animate-pulse"></div>
                <div className="p-5">
                  <div className="bg-earth-sand rounded h-6 w-3/4 mb-3 animate-pulse"></div>
                  <div className="bg-earth-sand rounded h-4 w-full mb-2 animate-pulse"></div>
                  <div className="bg-earth-sand rounded h-4 w-2/3 mb-4 animate-pulse"></div>
                  <div className="bg-earth-sand rounded h-10 w-full animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return null;
  }

  if (accommodations.length === 0) {
    return null;
  }

  const globalWhatsApp = settings?.whatsappNumber;

  return (
    <section className="py-16 px-4" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-earth-dark">
            Penginapan
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-earth-muted">
            Temukan tempat penginapan nyaman untuk menginap di desa kami
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accommodations.map((accommodation) => {
            const whatsAppLink = getAccommodationWhatsAppLink(accommodation, globalWhatsApp);

            return (
              <div
                key={accommodation.id}
                className="group card-earth overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={accommodation.imageUrl || "/kantor_desa.jpg"}
                    alt={accommodation.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.src = "/kantor_desa.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {accommodation.priceRange && (
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-sm font-medium text-earth-dark">{accommodation.priceRange}</span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-xl mb-2 text-earth-dark">
                    {accommodation.name}
                  </h3>

                  {accommodation.location && (
                    <div className="flex items-center gap-2 text-sm text-earth-muted mb-3">
                      <FiMapPin size={14} />
                      <span>{accommodation.location}</span>
                    </div>
                  )}

                  {accommodation.description && (
                    <p className="text-sm text-earth-muted line-clamp-2 mb-4">
                      {accommodation.description}
                    </p>
                  )}

                  {whatsAppLink ? (
                    <a
                      href={whatsAppLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 active:scale-95 text-white"
                      style={{ backgroundColor: "#25D366" }}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      <span>Hubungi via WhatsApp</span>
                    </a>
                  ) : (
                    <div className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-medium bg-earth-sand text-earth-muted cursor-not-allowed">
                      <FiPhone size={18} />
                      <span>WhatsApp tidak tersedia</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/accommodations"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 active:scale-95"
            style={{ backgroundColor: "var(--primary)", color: "white" }}
          >
            <span>Lihat Semua Penginapan</span>
            <FiExternalLink size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AccommodationsSection;
