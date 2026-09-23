# Fleet Reserve — Frontend (SPA)

Aplikasi client dari **Fleet Reserve**, dibangun sebagai **Single Page Application**
yang mengonsumsi REST API dari [backend Laravel](../backend/README.md).

## 1. Tech Stack & Versi

| Kategori | Teknologi | Versi |
|---|---|---|
| Framework | React + TypeScript | React 19, TypeScript 5.7 |
| Build Tool | Vite | 6.x |
| Node.js (disarankan) | — | 20.x (minimum 18) |
| Styling | Tailwind CSS | v4 |
| Routing | React Router (client-side) | v7 |
| Komunikasi API | Native Fetch API (`src/lib/apiClient.ts`) | — |
| Validasi Form | Zod | — |
| Visualisasi Data (Dashboard) | ApexCharts (`react-apexcharts`) | 4.x |
| Export Laporan | `xlsx` (Excel), `@react-pdf/renderer` (PDF) | — |
| Komponen UI | Radix UI, Lucide Icons | — |
| Kalender | FullCalendar | — |

## 2. Fitur Utama

- **Autentikasi** — Login dengan username & password; token disimpan di
  `localStorage`, otomatis disisipkan ke setiap request (`Authorization: Bearer <token>`).
- **Role-based Routing** — `ProtectedRoute` (wajib login) dan `RoleRoute`
  (wajib role tertentu) di `src/App.tsx`.
- **Dashboard** — Ringkasan status kendaraan, status reservasi, statistik BBM &
  service, ditampilkan dalam grafik ApexCharts.
- **Pemesanan Kendaraan (Reservations)** — Admin input pemesanan: pilih kendaraan,
  driver, tujuan, tanggal mulai/selesai; sistem otomatis menyiapkan approval 2 level.
- **Approval Level 1 & Level 2** — Halaman khusus untuk Kepala Operasional dan
  Manager menyetujui/menolak pemesanan yang masuk ke antrean mereka.
- **Master Data** — CRUD Kendaraan, Driver, Kantor, Wilayah, User.
- **Pemakaian Kendaraan** — Mulai (start, catat odometer awal) dan selesaikan
  (finish, catat odometer akhir) pemakaian aktual.
- **BBM & Service** — Catat konsumsi BBM dan jadwal/riwayat service kendaraan.
- **Export & Cetak Laporan** — Modal cetak (`PrintExportModal`) di halaman
  Reservations, Fuel, dan Services — bisa export ke **Excel (.xlsx)** atau
  **PDF** dengan kop laporan & kolom tanda tangan.
- **Dark Mode** — Toggle tema gelap/terang.
- **Notifikasi** — Toast untuk feedback aksi (sukses/gagal/akses ditolak).

## 3. Role & Halaman

| Halaman | Route | Role yang Bisa Akses |
|---|---|---|
| Dashboard | `/` | Semua role login |
| Profil | `/profile` | Semua role login |
| Master User | `/users` | Admin, Kepala Operasional, Manager |
| Master Kendaraan | `/vehicles` | Admin, Kepala Operasional, Manager |
| Master Kantor | `/master/offices` | Admin, Kepala Operasional, Manager |
| Master Wilayah | `/master/regions` | Admin, Kepala Operasional, Manager |
| Pemesanan (Reservations) | `/reservations` | Admin, Kepala Operasional, Manager |
| Pemakaian Kendaraan | `/vehicle-usages` | Admin, Kepala Operasional, Manager |
| Catatan BBM | `/fuel-records` | Admin, Kepala Operasional, Manager |
| Jadwal Service | `/services` | Admin, Kepala Operasional, Manager |
| Approval Level 1 | `/approvals/level-1` | Admin, Kepala Operasional, Manager* |
| Approval Level 2 | `/approvals/level-2` | Admin, Kepala Operasional, Manager* |

\* Akses halaman **frontend** untuk approval saat ini tidak dibatasi ketat per role
(memakai grup role yang sama seperti halaman lain) — pembatasan aktual siapa yang
**bisa memproses approve/reject** tetap dijaga di sisi **backend**
(`role:KEPALA_OPERASIONAL` untuk Level 1, `role:MANAGER` untuk Level 2). Jika ingin
UI juga menyembunyikan menu Level 1/2 dari role yang tidak berwenang, tambahkan
pengecekan role spesifik di `RoleRoute` untuk kedua route tersebut.

## 4. Struktur Folder (ringkas)

```
frontend/
├── public/                     # aset statis (logo, ikon, gambar)
├── src/
│   ├── components/             # komponen reusable (form, table, ui, header, chart, dll.)
│   ├── context/                # React Context (Sidebar, Theme)
│   ├── hooks/                  # custom hooks
│   ├── layout/                 # layout aplikasi (AppLayout, Auth layout)
│   ├── lib/
│   │   ├── apiClient.ts        # wrapper Fetch API (GET/POST/PUT/DELETE + auth header)
│   │   ├── auth.ts             # helper role & user tersimpan
│   │   ├── constants/roles.ts  # daftar role
│   │   ├── excelExport.ts      # util export Excel (generic)
│   │   └── pdfGenerator.ts     # util export PDF
│   ├── pages/
│   │   ├── Dashboard/Home.tsx
│   │   ├── Reservations/       # pemesanan kendaraan
│   │   ├── Approvals/          # ApprovalLevel1.tsx, ApprovalLevel2.tsx
│   │   ├── Vehicles/ Kantor/ Wilayah/ Users/  # master data
│   │   ├── VehicleUsage/ Fuels/ Services/     # operasional harian
│   │   └── AuthPages/SignIn.tsx
│   ├── App.tsx                 # definisi routing SPA
│   └── main.tsx                # entry point React
├── package.json
└── vite.config.ts
```

Pola tiap modul (`pages/<Modul>/`) konsisten: **endpoint.ts** (URL API),
**interface.ts** (tipe data), **components/display/form.tsx** + **table.tsx**
(tampilan), dipanggil dari `<Modul>.tsx`.

## 5. Instalasi & Menjalankan

### Prasyarat
- Node.js 18+ (disarankan 20+)
- Backend API sudah berjalan — lihat [`backend/README.md`](../backend/README.md)

### Langkah

```bash
# 1. Masuk ke folder frontend
cd frontend

# 2. Install dependency
npm install

# 3. Buat file environment (belum tersedia di repo — buat manual)
cp .env.example .env
```

Isi `.env`:
```env
VITE_API_URL=http://127.0.0.1:8000/api
```

```bash
# 4. Jalankan development server
npm run dev
```

Aplikasi tersedia di `http://localhost:5173`.

### Script yang Tersedia

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Menjalankan development server (Vite) |
| `npm run build` | Build production (`tsc -b && vite build`) |
| `npm run preview` | Preview hasil build |
| `npm run lint` | Menjalankan ESLint |

## 6. Panduan Penggunaan Aplikasi (Alur Pemakaian)

1. **Login** di `/signin` menggunakan salah satu akun seeder (lihat tabel kredensial
   di README utama atau `backend/README.md`).
2. **Sebagai Admin**:
   - Buka menu **Master Data** untuk memastikan kendaraan, driver, kantor, dan
     wilayah sudah terdaftar.
   - Buka **Reservations → Tambah Pemesanan**, isi kendaraan, driver, tujuan,
     tanggal mulai/selesai, lalu simpan. Sistem otomatis membuat antrean approval
     Level 1 & Level 2.
   - Setelah reservasi disetujui penuh, gunakan menu **Pemakaian Kendaraan** untuk
     mencatat *start* (odometer awal) dan *finish* (odometer akhir) saat kendaraan
     benar-benar dipakai.
   - Catat konsumsi BBM di menu **Fuel Records**, dan jadwal/riwayat service di
     menu **Services**.
3. **Sebagai Kepala Operasional**: buka **Approval Level 1**, tinjau detail
   pemesanan yang masuk, lalu **Setujui** atau **Tolak** (wajib isi catatan bila
   menolak).
4. **Sebagai Manager**: setelah suatu pemesanan lolos Level 1, buka
   **Approval Level 2** untuk keputusan akhir.
5. **Dashboard** (halaman awal setelah login) menampilkan ringkasan jumlah
   kendaraan berdasarkan status, jumlah reservasi per status, total konsumsi BBM,
   dan status jadwal service — dalam bentuk grafik.
6. **Export Laporan**: di halaman Reservations / Fuel Records / Services, klik
   tombol **Cetak Laporan** → pilih format **Excel** (langsung terunduh) atau
   **PDF** (isi info penandatangan → preview → unduh).

## 7. Integrasi dengan Backend

Semua request API terpusat lewat `src/lib/apiClient.ts`:

```ts
const BASE_URL = import.meta.env.VITE_API_URL;
// otomatis menyisipkan header Authorization: Bearer <token> dari localStorage
apiClient.get('/vehicles');
apiClient.post('/reservations', payload);
```

- Base URL diambil dari env `VITE_API_URL` → memudahkan berpindah antara backend
  lokal/staging/production tanpa mengubah kode.
- Response `403` dari backend otomatis memicu toast "Akses Ditolak".
- Struktur request/response mengikuti kontrak REST API backend — lihat
  `backend/README.md` §7 (Daftar Endpoint) atau Postman Collection di `../postman/`.