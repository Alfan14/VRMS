# Fleet Reserve — Vehicle Reservation & Monitoring System

Aplikasi monitoring dan pemesanan kendaraan untuk perusahaan tambang nikel dengan
banyak lokasi (kantor pusat, kantor cabang, dan beberapa site tambang). Dibangun untuk
memenuhi **Technical Test — Fullstack Developer (Intern), PT Sekawan Media Informatika**.

> Dokumen ini adalah panduan utama monorepo. Detail teknis masing-masing bagian ada di
> [`backend/README.md`](./backend/README.md) dan [`frontend/README.md`](./frontend/README.md).

---

## 1. Struktur Repository

```
.
├── backend/            # REST API — Laravel 12 (PHP 8.2+)
├── frontend/           # SPA — React 19 + TypeScript + Vite
├── database/           # Dump/skema database & ERD/Physical Data Model
├── postman/            # Postman Collection + Environment siap import
├── README.md           # <- Anda di sini (panduan utama)
├── backend/README.md   # Panduan detail backend
└── frontend/README.md  # Panduan detail frontend
```

## 2. Tech Stack Ringkas

| Layer | Teknologi | Versi |
|---|---|---|
| Backend Framework | Laravel | 12.x |
| Bahasa (Backend) | PHP | 8.2+ (disarankan 8.2 / 8.3) |
| Autentikasi API | Laravel Sanctum (token-based) | ^4.0 |
| Database | MySQL | 8.0+ (kompatibel MariaDB 10.6+) |
| Frontend Framework | React + TypeScript | React 19, TS 5.7 |
| Build Tool (Frontend) | Vite | 6.x |
| Node.js | — | 20.x (minimum 18) |
| Styling | Tailwind CSS | v4 |
| Chart / Dashboard | ApexCharts (`react-apexcharts`) | 4.x |
| Export Laporan | `xlsx` (Excel), `@react-pdf/renderer` (PDF) | — |

> Sesuaikan angka versi di atas dengan versi PHP/MySQL/Node yang benar-benar terpasang
> di mesin Anda sebelum submit (cek dengan `php -v`, `mysql --version`, `node -v`).

## 3. Alur Bisnis Singkat

1. **Admin** menginput pemesanan kendaraan (pilih kendaraan, driver, tanggal, tujuan).
2. Sistem otomatis membuat **2 record approval berjenjang**: Level 1 dan Level 2.
3. **Kepala Operasional** menyetujui/menolak di Level 1 (`PENDING_LV1` → `PENDING_LV2`).
4. Jika Level 1 disetujui, **Manager** menyetujui/menolak di Level 2 (`PENDING_LV2` → `APPROVED`).
5. Jika salah satu level menolak, status reservasi langsung `REJECTED`.
6. Setiap aksi (create, approve, reject, login, dsb.) tercatat di **Activity Log**.
7. Dashboard menampilkan grafik pemakaian kendaraan (ringkasan status kendaraan,
   status reservasi, konsumsi BBM, dan jadwal service).
8. Laporan (Reservasi / BBM / Service) dapat diekspor ke **Excel** atau **PDF**
   melalui modal cetak laporan di masing-masing halaman.

## 4. Role & Akun Login (Seeder)

| Role | Username | Password | Deskripsi |
|---|---|---|---|
| Admin | `admin` | `password123` | Input pemesanan, kelola master data (kendaraan, driver, kantor, wilayah) |
| Kepala Operasional | `operasional` | `password123` | Approval **Level 1** |
| Manager | `manager` | `password123` | Approval **Level 2** |

> Sumber: `database/seeders/UserSeeder.php`. Login menggunakan **username**, bukan email.
> Ganti password default ini sebelum digunakan di lingkungan produksi.

## 5. Menjalankan Aplikasi (Ringkas)

```bash
# 1) Backend
cd backend
composer install
cp .env.example .env   # buat manual jika belum ada, isi kredensial DB
php artisan key:generate
php artisan migrate --seed
php artisan serve                       # http://127.0.0.1:8000

# 2) Frontend (terminal terpisah)
cd frontend
npm install
cp .env.example .env   # isi: VITE_API_URL=http://127.0.0.1:8000/api
npm run dev                             # http://localhost:5173
```

Detail lengkap (konfigurasi `.env`, troubleshooting, seluruh endpoint API) ada di
README masing-masing folder.

## 6. Postman & Database

- **Postman**: import `postman/*.postman_collection.json` dan
  `postman/*.postman_environment.json`, lalu pilih environment tersebut sebelum
  mencoba endpoint. Variabel `{{base_url}}` dan `{{token}}` sudah disiapkan di
  environment (token terisi otomatis setelah request `Login` berhasil, jika
  menggunakan Postman test script / atau isi manual dari response login).
- **Database**: skema lengkap ada di `database/` — berupa file dump SQL (hasil
  `php artisan migrate`) dan diagram **Physical Data Model (PDM)**. Skema juga
  sepenuhnya reproducible lewat migration Laravel di `backend/database/migrations/`
  tanpa perlu import dump manual.

## 7. Checklist Pemenuhan Kriteria Soal

| # | Requirement | Status | Keterangan |
|---|---|---|---|
| a | 2 user: admin & pihak yang menyetujui | ✅ | Role `ADMIN`, `KEPALA_OPERASIONAL`, `MANAGER` (2 role approver berjenjang) |
| b | Admin input pemesanan + tentukan driver & approver | ⚠️ Sebagian | Admin memilih **kendaraan & driver** saat input. Approver **tidak dipilih manual per-transaksi** — sistem menugaskan otomatis berdasarkan role (Kepala Operasional = Lv1, Manager = Lv2). Lihat catatan di `backend/README.md` §Known Limitations. |
| c | Approval berjenjang minimal 2 level | ✅ | `ApprovalService` — Level 1 harus disetujui dulu sebelum Level 2 terbuka |
| d | Approver menyetujui melalui aplikasi | ✅ | Halaman `/approvals/level-1` dan `/approvals/level-2` |
| e | Dashboard grafik pemakaian kendaraan | ✅ | `DashboardService::summary()` + chart ApexCharts di `pages/Dashboard/Home.tsx` |
| f | Laporan periodik, export Excel | ✅ | `PrintExportModal` (PDF & Excel) dipakai di Reservations, Fuel, dan Services |
| g | README kredensial, versi DB/PHP, framework, panduan | ✅ | Dokumen ini + `backend/README.md` + `frontend/README.md` |

| Instruksi Tambahan | Status | Keterangan |
|---|---|---|
| a. Physical Data Model | 📄 Lihat `database/` | Dibuat dari struktur migration (10 tabel inti) |
| b. Activity diagram alur pemesanan | 📄 Lihat `database/` atau dokumen terpisah | Menggambarkan alur Admin → Lv1 → Lv2 |
| c. Log aplikasi tiap proses | ✅ | Tabel `activity_logs`, dicatat lewat `ActivityLogService` di setiap aksi (create, approve, reject, login, dst.) |
| d. UI/UX baik & responsive | ✅ | Berbasis template TailAdmin (Tailwind CSS, mobile-responsive, dark mode) |

## 8. Known Limitations / Catatan Jujur

Dicatat secara transparan agar mudah ditindaklanjuti sebelum submission:

1. **Approver tidak dipilih manual** — saat ini approval level 1/2 otomatis mengikat
   ke *role* (Kepala Operasional & Manager), bukan ke *user spesifik* yang dipilih
   Admin. Soal poin (b) meminta admin bisa "menentukan pihak yang menyetujui" — jika
   ingin nilai penuh, tambahkan kolom `approver_id` yang dipilih Admin saat membuat
   reservasi, atau minimal dokumentasikan interpretasi ini secara eksplisit ke penguji.
2. **Header dokumen PDF/Excel** pada `PrintExportModal` masih menampilkan teks bawaan
   template ("MART MODERN SUPERMARKET") — perlu diganti ke identitas perusahaan
   tambang nikel sebelum submit, agar laporan konsisten dengan konteks studi kasus.
3. **`reservations` (index/show)** hanya bisa diakses role `ADMIN` — Kepala
   Operasional/Manager melihat reservasi yang perlu mereka approve lewat endpoint
   `approvals/pending-level-1` / `pending-level-2`, bukan lewat daftar reservasi umum.
4. Migration `catatan_bbm` memiliki duplikasi definisi kolom (`harga_per_liter`,
   `total_biaya` didefinisikan dua kali) — tidak menyebabkan error karena Laravel
   mengizinkannya, tapi sebaiknya dirapikan.

---

**PT Sekawan Media Informatika — Technical Test Fullstack Developer (Intern)**