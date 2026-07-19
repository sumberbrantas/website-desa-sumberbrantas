# Website Desa Sumberbrantas

Website resmi Desa Sumberbrantas, Kecamatan Bumiaji, Kota Batu, Jawa Timur.

## Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS dengan custom Earth Tone color palette
- **Database**: Firebase Firestore
- **Image Hosting**: imgbb API (gratis 1GB)
- **Document Hosting**: Google Drive (embed link)
- **Auth**: Firebase Authentication
- **Deployment**: Vercel

## Fitur Utama

### 🎥 Video Profile
- YouTube embed video profile desa di halaman utama

### 📄 Dokumen Desa
- Embed dokumen resmi desa via Google Drive
- Share via link Google Drive (Anyone with the link)

### 🏠 Penginapan
- Katalog tempat penginapan
- Tombol WhatsApp langsung untuk booking

### 🗺️ Destinasi Wisata
- Katalog tempat wisata desa

### 🛒 E-Katalog UMKM
- Produk lokal dari pelaku usaha desa
- Filter berdasarkan kategori
- Tombol WhatsApp untuk pemesanan

### ⚙️ CMS (Content Management)
- **Pengaturan Desa**: Nama, logo, video, kontak
- **Manajemen Menu**: Atur navigasi website
- **Kelola Profil Desa**: Visi, Misi, Peta, Demografi
- **Manajemen Dokumen**: Link Google Drive
- **Kelola Penginapan**: CRUD penginapan
- **Kelola Destinasi**: CRUD destinasi wisata
- **Kelola Produk**: CRUD produk UMKM

## Color Palette - Earth Tone

| Purpose | Color | Hex |
|---------|-------|-----|
| Background | Cream | `#f7f6e2` |
| Background Alt | Parchment | `#efe9d5` |
| Primary Text | Dark Brown | `#4e361e` |
| Primary Buttons | Forest Green | `#556846` |
| Secondary | Coffee Brown | `#6c5134` |
| Borders | Grayish Brown | `#aea387` |

## Struktur Database (Firestore)

```
📁 village_settings     → Pengaturan umum desa
📁 menus               → Menu navigasi
📁 documents           → Link Google Drive dokumen
📁 accommodations      → Tempat penginapan
📁 destinations        → Tempat wisata
📁 products            → Produk UMKM
📁 articles            → Berita/artikel
📁 announcements       → Pengumuman
📁 users               → User admin
📁 visitors            → Statistik visitor
```

## 🚀 Konfigurasi & Instalasi

### 1. Clone & Install

```bash
git clone <repo-url>
cd website
npm install
```

### 2. Setup Firebase Project

1. Buka [Firebase Console](https://console.firebase.google.com)
2. Buat project baru (misal: `sumberbrantas-test`)
3. Aktifkan service berikut:
   - **Firestore Database** (mode: Production atau Test)
   - **Authentication** → Sign-in method → Email/Password (enable)
   - (Storage tidak wajib karena pakai imgbb)

### 3. Setup imgbb API (Untuk Upload Gambar)

1. Buka [https://imgbb.com](https://imgbb.com)
2. Daftar gratis (tidak butuh kartu kredit)
3. Buka [https://api.imgbb.com](https://api.imgbb.com)
4. Klik **Get API Key** untuk mendapatkan API key
5. Free tier: 1GB storage, 1000 uploads/bulan

### 4. Konfigurasi Environment

Edit file `.env.local` di root project:

```env
# ============================================
# MATIKAN MOCK DATA - PAKAI FIREBASE
# ============================================
NEXT_PUBLIC_USE_MOCK_DATA=false

# ============================================
# FIREBASE CONFIGURATION
# (dapat dari Firebase Console → Project Settings → General → Your apps)
# ============================================
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=sumberbrantas-test.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sumberbrantas-test
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=sumberbrantas-test.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC123

# ============================================
# IMGBB API (Untuk upload gambar di CMS)
# Daftar gratis: https://imgbb.com
# ============================================
NEXT_PUBLIC_IMGBB_API_KEY=your-imgbb-api-key

# ============================================
# CARA DAPATKAN KREDENSIAL FIREBASE:
# 1. Buka Firebase Console
# 2. Pilih project Anda
# 3. Klik ⚙️ (Settings) → Project settings
# 4. Di tab "General", scroll ke "Your apps"
# 5. Klik ikon web (</>) untuk mendaftarkan web app
# 6. Salin konfigurasi ke file ini
# ============================================
```

### 5. Setup Firestore Rules

Buka Firebase Console → Firestore Database → Rules. Gunakan rules berikut:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }

    function isAdmin() {
      return isSignedIn() &&
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Public read untuk konten landing page
    match /village_settings/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /menus/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /documents/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /accommodations/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /destinations/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /products/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /articles/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /announcements/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /gallery/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /structures/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /profil_desa/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /visitors/{document=**} {
      allow read: if true;
      allow create: if true;
      allow update: if true;
    }

    // Users collection - hanya admin yang bisa manage
    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn() && request.auth.uid == userId;
      allow update, delete: if isAdmin() || request.auth.uid == userId;
    }
  }
}
```

Klik **Publish**.

### 6. Setup Admin User

1. Jalankan development server:
   ```bash
   npm run dev
   ```
2. Buka [http://localhost:3000/register](http://localhost:3000/register)
3. Daftar dengan email admin (misal: `admin@desa.test` dengan password kuat)
4. Buka Firebase Console → Firestore Database
5. Buka collection `users` (otomatis dibuat saat register)
6. Klik dokumen user yang baru dibuat
7. Edit field `role` dari `"pending"` menjadi `"admin"`
8. Klik **Update**
9. Logout dan login kembali
10. Sekarang Anda bisa akses `/dashboard`

### 7. Inisialisasi Menu (PENTING!)

**Menu navigasi harus ada di Firestore**, karena di mode production (`useMockData=false`) data dari localStorage tidak digunakan.

Ada **2 cara** untuk setup menu:

#### Cara A: Auto-Initialize (Recommended)

Saat pertama kali website diakses (mode production), sistem akan **otomatis membuat 6 menu default** di Firestore:

1. Beranda (`/`)
2. Profil Desa (`/profil-desa`)
3. Berita (`/berita`)
4. Pengumuman (`/pengumuman`)
5. Struktur (`/struktur`)
6. Pelayanan (`/pelayanan`)

Cukup **refresh browser** setelah setup Firebase selesai, menu akan muncul otomatis.

> **Catatan**: Auto-create hanya berjalan jika Firestore Rules mengizinkan write untuk user yang login.

#### Cara B: Manual via Firebase Console

1. Buka Firebase Console → Firestore Database
2. Klik **Start collection**
3. Collection ID: `menus`
4. Klik **Next** → **Auto ID**
5. Tambahkan field-field berikut:

| Field | Type | Value |
|-------|------|-------|
| `name` | string | "Beranda" |
| `href` | string | "/" |
| `icon` | string | "FiHome" |
| `order` | number | 1 |
| `isActive` | boolean | true |
| `isBuiltIn` | boolean | true |
| `targetBlank` | boolean | false |

6. Klik **Save**
7. Ulangi untuk menu lainnya:

| # | name | href | icon | order |
|---|------|------|------|-------|
| 2 | Profil Desa | /profil-desa | FiInfo | 2 |
| 3 | Berita | /berita | FiFileText | 3 |
| 4 | Pengumuman | /pengumuman | FiBell | 4 |
| 5 | Struktur | /struktur | FiUsers | 5 |
| 6 | Pelayanan | /pelayanan | FiFilePlus | 6 |

### 8. Setup Pengaturan Desa

1. Login sebagai admin di `/login`
2. Buka `/dashboard/settings`
3. Isi field-field berikut (minimal):
   - **Village Name**: "Desa Sumberbrantas"
   - **Village Tagline**: "Kampung Damai & Budaya Luhur"
   - **WhatsApp Number**: "6281234567890" (format 62xxx)
   - **Address**: Alamat lengkap desa
   - **Email**: Email desa
4. Upload **Logo** dan **Icon** (akan di-host ke imgbb)
5. Isi **YouTube Video URL** untuk video profile
6. Klik **Simpan**

### 9. Setup Dokumen (Google Drive)

Untuk menambahkan dokumen di CMS:

1. Upload file PDF/DOC ke Google Drive Anda
2. Klik kanan → **Share** → **Anyone with the link**
3. Copy link Google Drive (format: `https://drive.google.com/file/d/FILE_ID/view`)
4. Di CMS `/dashboard/documents/create`, paste link tersebut
5. Sistem otomatis convert ke format embed yang aman

### 10. Setup imgbb (Sudah Otomatis)

Cukup isi `NEXT_PUBLIC_IMGBB_API_KEY` di `.env.local`. Semua upload gambar di CMS (logo, icon, penginapan, destinasi, produk) akan otomatis di-upload ke imgbb.

**Keuntungan imgbb:**
- ✅ Gratis 1GB storage
- ✅ 1000 upload/bulan
- ✅ Tidak perlu setup Firebase Storage
- ✅ Tidak perlu kartu kredit
- ✅ Akses publik otomatis (untuk ditampilkan di website)

## 🚀 Deployment ke Vercel

Vercel adalah platform deployment resmi untuk Next.js dengan setup paling mudah.

### 1. Push ke GitHub

Pastikan project sudah di-push ke GitHub repository (lihat [section GitHub](#-push-ke-github)).

### 2. Connect Vercel ke GitHub

1. Buka [https://vercel.com](https://vercel.com) dan login (bisa pakai akun GitHub)
2. Klik **Add New...** → **Project**
3. Pilih **Import** repository GitHub Anda
4. Klik **Import**

### 3. Configure Project

Di halaman konfigurasi:

**Framework Preset**: Otomatis terdeteksi sebagai **Next.js**

**Root Directory**: Biarkan default `./`

**Build & Output Settings**: Biarkan default

### 4. ⚠️ WAJIB: Setup Environment Variables

Ini bagian **PALING PENTING** - tanpa ini website tidak akan jalan di production!

1. Scroll ke bagian **Environment Variables**
2. Tambahkan satu per satu variable berikut:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_USE_MOCK_DATA` | `false` | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSy...your-key` | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `your-project-id` | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `your-project.appspot.com` | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `123456789` | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:123:web:abc` | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | `G-ABC123` | Production, Preview, Development |
| `NEXT_PUBLIC_IMGBB_API_KEY` | `your-imgbb-key` | Production, Preview, Development |

**Cara cepat**: Copy dari `.env.local` Anda, paste di kolom value (tiap baris).

> ⚠️ **PENTING**: Centang semua environment (Production, Preview, Development) supaya tidak perlu setup ulang untuk preview deployment.

### 5. Deploy

1. Klik **Deploy**
2. Tunggu build selesai (biasanya 1-3 menit)
3. Setelah selesai, klik **Visit** untuk membuka website
4. Vercel akan kasih URL seperti: `https://website-desa-xxxxx.vercel.app`

### 6. Setup Custom Domain (Opsional)

Jika punya domain sendiri (misal: `desasumberbrantas.id`):

1. Di Vercel project, buka **Settings** → **Domains**
2. Klik **Add Domain**
3. Masukkan domain Anda (misal: `desasumberbrantas.id`)
4. Ikuti instruksi untuk setup DNS:
   - Untuk **apex domain** (`desasumberbrantas.id`): tambah A record ke `76.76.21.21`
   - Untuk **subdomain** (`www.desasumberbrantas.id`): tambah CNAME ke `cname.vercel-dns.com`
5. Tunggu propagasi DNS (bisa 5 menit - 48 jam)
6. SSL otomatis di-setup oleh Vercel

### 7. Setup Authorized Domain di Firebase

Setelah deploy, tambahkan domain Vercel ke Firebase:

1. Buka Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Klik **Add domain**
3. Tambahkan:
   - `website-desa-xxxxx.vercel.app` (domain Vercel)
   - `desasumberbrantas.id` (custom domain Anda, jika ada)
4. Klik **Add**

### 8. Auto-Deployment Setup

Vercel otomatis deploy setiap push ke branch yang dipilih:

**Setup Branch Production**:
- Buka **Settings** → **Git**
- **Production Branch**: `main` (atau branch utama Anda)
- Setiap push ke `main` → otomatis deploy ke production

**Preview Deployments**:
- Push ke branch lain → otomatis dapet URL preview
- Berguna untuk testing sebelum merge ke main

### Troubleshooting Deployment

#### ❌ Build Failed: "Module not found"

**Solusi**: Pastikan semua dependencies ada di `package.json`. Jalankan `npm install` lokal, lalu `npm run build` untuk verifikasi.

#### ❌ Website tampil tapi data kosong

**Penyebab**: Environment Variables belum di-setup atau salah.

**Solusi**:
1. Cek Vercel → **Settings** → **Environment Variables**
2. Pastikan `NEXT_PUBLIC_USE_MOCK_DATA=false`
3. Pastikan semua Firebase credential benar
4. Redeploy: **Deployments** → klik deployment terakhir → **⋯** → **Redeploy**

#### ❌ "Firebase: Error (auth/invalid-api-key)"

**Penyebab**: API Key Firebase salah atau tidak ada.

**Solusi**:
1. Cek `NEXT_PUBLIC_FIREBASE_API_KEY` di Vercel Environment Variables
2. Bandingkan dengan Firebase Console → Project Settings → General
3. Pastikan tidak ada spasi/karakter tambahan

#### ❌ Gambar tidak muncul di production

**Penyebab**: imgbb API key tidak ada di Vercel.

**Solusi**:
1. Tambahkan `NEXT_PUBLIC_IMGBB_API_KEY` di Vercel Environment Variables
2. Redeploy

#### ❌ Menu kosong di production

**Penyebab**: Firestore Rules tidak mengizinkan read, atau collection `menus` kosong.

**Solusi**:
1. Pastikan Rules sudah published (lihat Setup Firestore Rules di atas)
2. Cek Firebase Console → Firestore → collection `menus` ada isinya
3. Jika kosong, buka `/dashboard/menus` sebagai admin untuk auto-create

#### 🔍 Cek Logs

Untuk debug:
1. Vercel → **Deployments** → klik deployment
2. Klik tab **Functions** atau **Build Logs**
3. Lihat error yang muncul

## 📦 Push ke GitHub

### 1. Setup Git

```bash
git init
git add .
git commit -m "Initial commit: Website Desa Sumberbrantas"
```

### 2. Create Repository di GitHub

1. Buka [GitHub](https://github.com) → klik **+** → **New repository**
2. **Repository name**: `website-desa-sumberbrantas` (atau nama lain)
3. **Description**: "Website resmi Desa Sumberbrantas"
4. Pilih **Public** atau **Private**
5. **JANGAN** centang "Add a README file" (karena sudah ada)
6. **JANGAN** centang "Add .gitignore" (karena sudah ada)
7. Klik **Create repository**

### 3. Push ke GitHub

```bash
git remote add origin https://github.com/username-anda/website-desa-sumberbrantas.git
git branch -M main
git push -u origin main
```

### ⚠️ Yang TIDAK Boleh di-Push

File `.gitignore` sudah exclude:

- ❌ `.env.local` (berisi API keys)
- ❌ `node_modules/`
- ❌ `.next/` (build output)
- ❌ `.vercel/` (Vercel config)
- ❌ File IDE (.vscode/, .idea/)
- ❌ Log files

**JANGAN PERNAH** push file yang berisi credentials! Kalau tidak sengaja, segera rotate API key di Firebase dan imgbb.

## Menjalankan Project

### Development (dengan Mock Data)

```bash
# Set NEXT_PUBLIC_USE_MOCK_DATA=true di .env.local
npm run dev
```

Website berjalan dengan mock data tanpa Firebase. Cocok untuk development UI.

### Development (dengan Firebase)

```bash
# Set NEXT_PUBLIC_USE_MOCK_DATA=false di .env.local
npm run dev
```

Website berjalan dengan Firebase. Bisa langsung edit data di CMS.

### Production Build

```bash
npm run build
npm run start
```

## Dashboard Admin

Akses `/dashboard` untuk masuk ke panel admin.

### Menu Dashboard

```
📊 Dashboard          → /dashboard
├── ⚙️ Pengaturan Desa      → /dashboard/settings
├── 📋 Kelola Menu           → /dashboard/menus
├── 🏘️ Kelola Profil Desa    → /dashboard/profil-desa
├── 📄 Kelola Dokumen        → /dashboard/documents
├── 🏠 Kelola Penginapan     → /dashboard/accommodations
├── 🗺️ Kelola Destinasi      → /dashboard/destinations
├── 🛒 Kelola Produk UMKM    → /dashboard/products
├── 📰 Kelola Berita         → /dashboard/article
├── 📢 Kelola Pengumuman     → /dashboard/announcement
├── 🖼️ Kelola Galeri         → /dashboard/gallery
├── 👥 Kelola Struktur       → /dashboard/structure
├── 👤 Kelola Akun          → /dashboard/users
└── 📖 Panduan Admin        → /dashboard/panduan
```

## Troubleshooting

### Menu tidak muncul di header

**Penyebab**: Collection `menus` kosong di Firestore.

**Solusi**:
- Refresh browser, sistem akan auto-create menu default
- Atau tambah manual via Firebase Console (lihat Setup Menu di atas)
- Cek Console browser (F12) untuk error

### Gambar tidak terupload di CMS

**Penyebab**: `NEXT_PUBLIC_IMGBB_API_KEY` kosong atau salah.

**Solusi**:
- Cek file `.env.local`, pastikan API key imgbb valid
- Restart `npm run dev` setelah edit `.env.local`
- Cek Console browser untuk error imgbb

### "Missing or insufficient permissions" error

**Penyebab**: Firestore Rules terlalu ketat.

**Solusi**:
- Pastikan Rules sudah di-publish
- Pastikan user yang login memiliki `role: "admin"` di collection `users`

### Dokumen Google Drive tidak bisa dibuka

**Penyebab**: Link Google Drive belum di-share public.

**Solusi**:
- Buka file di Google Drive
- Klik **Share** → ubah ke **Anyone with the link** → **Viewer**
- Copy link ulang dan paste di CMS

## Credits

Dikembangkan oleh Tim KKN FIA UB 2026

## License

MIT License
