# Fleet Reserve — Backend (REST API)

REST API untuk sistem monitoring dan pemesanan kendaraan perusahaan tambang nikel,
dibangun dengan **Laravel 12**. Menangani autentikasi, pemesanan kendaraan, approval
berjenjang, pencatatan BBM, jadwal service, serta dashboard & activity log.

## 1. Tech Stack & Versi

| Komponen | Versi / Detail |
|---|---|
| Framework | **Laravel 12.x** |
| Bahasa | **PHP ^8.2** (disarankan 8.2 atau 8.3) |
| Database | **MySQL 8.0+** (kompatibel MariaDB 10.6+), koneksi via `config/database.php` |
| Autentikasi API | **Laravel Sanctum ^4.0** (Bearer Token, bukan session cookie) |
| Primary Key | **UUID** di seluruh tabel (`HasUuids` trait) |
| Testing | PHPUnit ^11.5 (`composer test`) |
| Package Manager | Composer |

> Cek versi PHP aktual di mesin Anda dengan `php -v`, dan MySQL dengan
> `mysql --version`, lalu sesuaikan tabel di atas bila berbeda.

## 2. Role & Otorisasi

Ada 3 role (`app/Enums/UserRole.php`), diberlakukan lewat `RoleMiddleware`:

| Role | Kewenangan Utama |
|---|---|
| `ADMIN` | Input pemesanan kendaraan, kelola master data (kendaraan, driver, kantor, wilayah), catat BBM & service |
| `KEPALA_OPERASIONAL` | Approval **Level 1** pemesanan |
| `MANAGER` | Approval **Level 2** pemesanan |

## 3. Akun Login (Seeder)

| Role | Username | Password | Email |
|---|---|---|---|
| Admin | `admin` | `password123` | admin@vehicle.test |
| Kepala Operasional | `operasional` | `password123` | operasional@vehicle.test |
| Manager | `manager` | `password123` | manager@vehicle.test |

Login menggunakan **username + password** (bukan email) → lihat
`POST /api/auth/login`. Sumber: `database/seeders/UserSeeder.php`.

> ⚠️ Ganti seluruh password default ini sebelum dipakai di luar lingkungan
> development/demo.

## 4. Arsitektur

```
app/
├── Enums/                # ApprovalStatus, ReservationStatus, UserRole, VehicleStatus, dst.
├── Http/
│   ├── Controllers/      # AuthController, ReservationController, ApprovalController,
│   │                     #   VehicleController, DriverController, FuelController,
│   │                     #   ServiceController, VehicleUsageController, DashboardController,
│   │                     #   KantorController, WilayahController, UserController
│   ├── Middleware/RoleMiddleware.php
│   └── Requests/         # Form Request validation per modul
├── Models/                # Eloquent model (1 model = 1 tabel)
├── Services/              # Business logic layer (dipanggil dari Controller)
│   ├── AuthService.php
│   ├── ReservationService.php
│   ├── ApprovalService.php       # <- inti alur approval berjenjang
│   ├── VehicleService.php
│   ├── VehicleUsageService.php
│   ├── FuelService.php
│   ├── DashboardService.php
│   └── ActivityLogService.php    # <- inti audit trail / logging
database/
├── migrations/            # skema database (10 tabel inti)
└── seeders/                # data awal (wilayah, kantor, kendaraan, driver, user)
routes/api.php              # seluruh endpoint REST
```

Pola: **Controller → Form Request (validasi) → Service (logika bisnis) → Model**.
Setiap operasi penting (create reservasi, approve/reject, login/logout, start/finish
pemakaian kendaraan) memanggil `ActivityLogService::log()` untuk mencatat jejak audit.

## 5. Alur Approval Berjenjang (Inti Sistem)

`app/Services/ApprovalService.php` + `app/Services/ReservationService.php`:

1. Saat Admin membuat reservasi (`POST /api/reservations`), sistem otomatis membuat
   **2 baris `approvals`**: `level=1` (status `PENDING`) dan `level=2` (status `PENDING`),
   serta reservasi diberi status awal `PENDING_LV1`.
2. **Level 1** hanya bisa di-approve oleh role `KEPALA_OPERASIONAL`. Begitu disetujui,
   status reservasi berubah ke `PENDING_LV2`.
3. **Level 2** hanya bisa diproses oleh role `MANAGER`, **dan hanya jika** reservasi
   sudah berstatus `PENDING_LV2` (Level 1 wajib selesai lebih dulu — dijaga di
   `ApprovalService::approve()`). Setelah disetujui, status menjadi `APPROVED`.
4. Jika salah satu level **reject**, status reservasi langsung `REJECTED` dan proses
   berhenti (level berikutnya tidak lagi bisa diproses).

Status reservasi (`app/Enums/ReservationStatus.php`):
`PENDING_LV1 → PENDING_LV2 → APPROVED` (atau `REJECTED` di titik manapun),
lalu opsional `COMPLETED` / `CANCELLED` setelah pemakaian selesai.

## 6. Skema Database (Physical Data Model — ringkas)

Seluruh tabel memakai **UUID primary key**. Tabel inti:

| Tabel | Fungsi | Relasi Kunci |
|---|---|---|
| `wilayah` | Master region (mis. Kalimantan Timur) | 1—N ke `kantor` |
| `kantor` | Kantor pusat/cabang/site tambang | belongsTo `wilayah`; 1—N ke `kendaraan`, `pengemudi` |
| `users` | Akun login (Admin/Kepala Operasional/Manager) | belongsTo `wilayah`, `kantor` |
| `kendaraan` | Master kendaraan (plat, tipe, status) | belongsTo `kantor`; 1—N ke `reservasi_kendaraan`, `jadwal_service` |
| `pengemudi` | Master driver (SIM, status) | belongsTo `kantor`; 1—N ke `reservasi_kendaraan` |
| `reservasi_kendaraan` | Transaksi pemesanan kendaraan | belongsTo `kendaraan`, `pengemudi`, `users` (pemohon); 1—N ke `approvals`, `penggunaan_kendaraan` |
| `approvals` | Baris approval per level (1 & 2) per reservasi | belongsTo `reservasi_kendaraan`; belongsTo `users` (approver) |
| `penggunaan_kendaraan` | Riwayat pemakaian aktual (odometer, waktu berangkat/kembali) | belongsTo `reservasi_kendaraan`; 1—N ke `catatan_bbm` |
| `catatan_bbm` | Catatan konsumsi BBM per pemakaian | belongsTo `penggunaan_kendaraan` |
| `jadwal_service` | Jadwal & riwayat service kendaraan | belongsTo `kendaraan` |
| `activity_logs` | Audit trail seluruh aksi penting | belongsTo `users` (nullable) |

> Diagram ERD/PDM visual tersedia terpisah di folder `../database/` pada monorepo
> (dibuat berdasarkan struktur migration di atas).

## 7. Daftar Endpoint REST API

Base URL: `http://127.0.0.1:8000/api` — semua endpoint (kecuali login) butuh header
`Authorization: Bearer <token>` dari hasil login.

### Publik
| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/auth/login` | Login (`username`, `password`) → token + data user |

### Semua role yang sudah login
| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/auth/logout` | Hapus token aktif |
| GET | `/auth/me` | Profil user aktif |
| GET | `/dashboard/summary` | Ringkasan statistik (kendaraan, reservasi, BBM, service) |
| GET | `/dashboard/recent-activities` | 20 log aktivitas terbaru |
| GET | `/vehicles`, `/vehicles/available`, `/vehicles/{id}` | Data kendaraan |
| GET | `/kantor`, `/kantor/{id}` | Data kantor/site |
| GET | `/wilayah`, `/wilayah/{id}` | Data wilayah/region |
| GET | `/drivers`, `/drivers/{id}` | Data driver |
| GET | `/vehicle-usages`, `/vehicle-usages/{id}` | Riwayat pemakaian kendaraan |
| GET | `/fuel-records` | Catatan BBM |

### Role `ADMIN` saja
| Method | Endpoint | Keterangan |
|---|---|---|
| GET/POST/GET | `/reservations` (`index`,`store`,`show`) | Input & lihat pemesanan kendaraan |

### Role `ADMIN` & `KEPALA_OPERASIONAL`
| Method | Endpoint | Keterangan |
|---|---|---|
| POST/PUT/DELETE | `/vehicles`, `/wilayah`, `/kantor` | Kelola master data |
| POST | `/vehicle-usages/start` | Mulai pemakaian kendaraan (odometer awal) |
| POST | `/vehicle-usages/{id}/finish` | Selesaikan pemakaian (odometer akhir) |
| GET/POST | `/fuel-records`, `/fuel-records/{id}` | Kelola catatan BBM |
| GET/POST | `/services`, `/services/{id}` | Kelola jadwal service |
| POST | `/services/{id}/complete` | Tandai service selesai |

### Role `KEPALA_OPERASIONAL` (Approval Level 1)
| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/approvals/pending-level-1` | Daftar reservasi menunggu approval Lv1 |
| POST | `/approvals/{approval}/approve` | Setujui (body: `catatan` opsional) |
| POST | `/approvals/{approval}/reject` | Tolak (body: `catatan` wajib) |

### Role `MANAGER` (Approval Level 2)
| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/approvals/pending-level-2` | Daftar reservasi menunggu approval Lv2 |
| POST | `/approvals/{approval}/approve` | Setujui |
| POST | `/approvals/{approval}/reject` | Tolak |

> Koleksi lengkap siap pakai (contoh request & response) tersedia di
> `../postman/` — import ke Postman beserta file environment-nya.

## 8. Activity Log (Audit Trail)

Setiap aksi penting tercatat otomatis ke tabel `activity_logs` lewat
`ActivityLogService::log()`, mencakup: `user_id`, `module` (mis. `RESERVATION`,
`APPROVAL`, `AUTH`, `VEHICLE`), `action` (`CREATE`, `UPDATE`, `APPROVE`, `REJECT`,
`LOGIN`, `LOGOUT`, dst.), `reference_id`, snapshot `old_data`/`new_data` (JSON),
`ip_address`, dan `user_agent`. Bisa dilihat lewat `GET /dashboard/recent-activities`.

## 9. Instalasi & Menjalankan

### Prasyarat
- PHP **^8.2** + ekstensi standar Laravel (`pdo_mysql`, `mbstring`, dll.)
- Composer
- MySQL **8.0+** (atau MariaDB 10.6+)

### Langkah

```bash
# 1. Masuk ke folder backend
cd backend

# 2. Install dependency PHP
composer install

# 3. Buat file environment (belum tersedia di repo — buat manual)
cp .env.example .env    # jika belum ada .env.example, copy dari .env yang sudah jalan
php artisan key:generate
```

Isi bagian koneksi database di `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=fleet_reserve
DB_USERNAME=root
DB_PASSWORD=
```

```bash
# 4. Migrasi + seed data awal (wilayah, kantor, kendaraan, driver, user)
php artisan migrate --seed

# 5. Jalankan server
php artisan serve
```

API tersedia di `http://127.0.0.1:8000/api`.

> Alternatif: `composer run setup` menjalankan install, copy `.env`, generate key,
> migrate, dan build asset sekaligus (lihat `composer.json` → `scripts.setup`).

### CORS

`config/cors.php` mengizinkan seluruh origin untuk path `api/*`
(`allowed_origins => ['*']`) — cukup untuk kebutuhan development/demo. Untuk
production, persempit ke domain frontend yang sebenarnya.

## 10. Known Limitations

- Approval level 1/2 saat ini terikat ke **role**, bukan ke user spesifik yang
  dipilih Admin saat membuat reservasi — lihat catatan di README utama (§8).
- Migration `catatan_bbm` memiliki duplikasi definisi kolom (`harga_per_liter`,
  `total_biaya`) — tidak error, tapi sebaiknya dirapikan sebelum dianggap final.
- `DatabaseSeeder.php` masih meng-import beberapa model/use case sisa proyek
  template lama (POS) yang tidak lagi relevan dengan konteks vehicle reservation —
  aman untuk dibersihkan agar tidak membingungkan reviewer.
