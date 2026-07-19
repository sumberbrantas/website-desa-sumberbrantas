/**
 * Type definitions untuk Profil Desa
 */

export interface Visi {
  text: string;
}

export interface Misi {
  id: string;
  text: string;
  order: number;
}

export interface BatasWilayah {
  arah: "Utara" | "Timur" | "Selatan" | "Barat";
  wilayah: string;
}

export interface StatistikDesa {
  luasDesa: string;       // dalam Ha
  jumlahPenduduk: string;  // jumlah jiwa
  jarakKeKecamatan: string;  // dalam Km
  jarakKeKabupaten: string;   // dalam Km
}

export interface PenggunaanLahan {
  id: string;
  jenis: string;
  luas: string;
  icon: string;
}

export interface DataDusun {
  id: string;
  dusun: string;
  rt: number;
  rw: number;
  penduduk: number;
  kk: number;
}

export interface DataAgama {
  id: string;
  agama: string;
  total: number;
  persentase: string;
}

export interface MataPencaharian {
  id: string;
  jenis: string;
  jumlah: number;
  icon: string;
}

export interface ProfilDesa {
  // Header
  judulHalaman: string;
  subJudul: string;

  // Visi & Misi
  visi: Visi;
  misi: Misi[];

  // Peta Lokasi
  googleMapsUrl: string;
  batasWilayah: BatasWilayah[];
  statistik: StatistikDesa;

  // Informasi Umum
  penggunaanLahan: PenggunaanLahan[];
  dataDusun: DataDusun[];
  dataAgama: DataAgama[];
  mataPencaharian: MataPencaharian[];

  // Timestamps
  createdAt?: any;
  updatedAt?: any;
}
