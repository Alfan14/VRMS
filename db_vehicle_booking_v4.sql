-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for db_vehicle_booking
CREATE DATABASE IF NOT EXISTS `db_vehicle_booking` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `db_vehicle_booking`;

-- Dumping structure for table db_vehicle_booking.activity_logs
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `module` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reference_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `old_data` json DEFAULT NULL,
  `new_data` json DEFAULT NULL,
  `ip_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `activity_logs_user_id_module_action_index` (`user_id`,`module`,`action`),
  CONSTRAINT `activity_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_vehicle_booking.activity_logs: ~22 rows (approximately)
INSERT INTO `activity_logs` (`id`, `user_id`, `module`, `action`, `reference_id`, `old_data`, `new_data`, `ip_address`, `user_agent`, `created_at`, `updated_at`) VALUES
	('019f7b2e-863f-7211-ab14-215f911502dd', NULL, 'AUTH', 'LOGIN', '019f7b2e-15f5-71f6-a616-798197b49b68', NULL, NULL, '127.0.0.1', 'PostmanRuntime/7.54.0', '2026-07-19 09:21:14', '2026-07-19 09:21:14'),
	('019f7b2e-ed48-73e4-8b4d-65161b48c775', NULL, 'AUTH', 'LOGIN', '019f7b2e-1798-70c3-b050-11d45aab577c', NULL, NULL, '127.0.0.1', 'PostmanRuntime/7.54.0', '2026-07-19 09:21:40', '2026-07-19 09:21:40'),
	('019f7b2f-67d5-70fd-b48a-4cbf947c64a3', NULL, 'AUTH', 'LOGIN', '019f7b2e-16cb-73ce-a7b8-f104daef62b4', NULL, NULL, '127.0.0.1', 'PostmanRuntime/7.54.0', '2026-07-19 09:22:12', '2026-07-19 09:22:12'),
	('019f7b30-f5c7-7081-9db4-b7b6b79fe72c', '019f7b2e-15f5-71f6-a616-798197b49b68', 'RESERVATION', 'CREATE', '019f7b30-f5c0-73cb-a55a-38c6e7c57c5c', NULL, '{"id": "019f7b30-f5c0-73cb-a55a-38c6e7c57c5c", "status": "PENDING_LV1", "tujuan": "Site B", "keperluan": "Meeting", "created_at": "2026-07-19T16:23:54.000000Z", "pemohon_id": "019f7b2e-15f5-71f6-a616-798197b49b68", "updated_at": "2026-07-19T16:23:54.000000Z", "kendaraan_id": "019f7b2e-17a0-72c3-96a7-995b239aef93", "pengemudi_id": "019f7b2e-17a8-71ba-ad6b-8b73624f04aa", "tanggal_mulai": "2026-07-19T17:00:00.000000Z", "nomor_reservasi": "RSV-20260719-0001", "tanggal_selesai": "2026-07-20T08:00:00.000000Z"}', '127.0.0.1', 'PostmanRuntime/7.54.0', '2026-07-19 09:23:54', '2026-07-19 09:23:54'),
	('019f7b32-c025-7085-aa98-9ef68a9e7fb2', NULL, 'AUTH', 'LOGIN', '019f7b2e-16cb-73ce-a7b8-f104daef62b4', NULL, NULL, '127.0.0.1', 'PostmanRuntime/7.54.0', '2026-07-19 09:25:51', '2026-07-19 09:25:51'),
	('019f7b7f-92f6-7034-96f0-24f50baef618', '019f7b2e-15f5-71f6-a616-798197b49b68', 'RESERVATION', 'CREATE', '019f7b7f-928b-712e-8708-8cd0be637014', NULL, '{"id": "019f7b7f-928b-712e-8708-8cd0be637014", "status": "PENDING_LV1", "tujuan": "Site C", "keperluan": "Antar Barang", "created_at": "2026-07-19T17:49:46.000000Z", "pemohon_id": "019f7b2e-15f5-71f6-a616-798197b49b68", "updated_at": "2026-07-19T17:49:46.000000Z", "kendaraan_id": "019f7b2e-179d-731c-8bfe-d1434e9f84a9", "pengemudi_id": "019f7b2e-17aa-7047-99c8-b53339b7204c", "tanggal_mulai": "2026-07-20T17:00:00.000000Z", "nomor_reservasi": "RSV-20260719-0002", "tanggal_selesai": "2026-07-21T08:00:00.000000Z"}', '127.0.0.1', 'PostmanRuntime/7.54.0', '2026-07-19 10:49:46', '2026-07-19 10:49:46'),
	('019f7bb6-7ecd-7363-ad86-2cdf05ac27be', '019f7b2e-15f5-71f6-a616-798197b49b68', 'RESERVATION', 'CREATE', '019f7bb6-7ec5-722e-a787-763694edcce1', NULL, '{"id": "019f7bb6-7ec5-722e-a787-763694edcce1", "status": "PENDING_LV1", "tujuan": "Site D", "keperluan": "Angkut Batu Bara", "created_at": "2026-07-19T18:49:45.000000Z", "pemohon_id": "019f7b2e-15f5-71f6-a616-798197b49b68", "updated_at": "2026-07-19T18:49:45.000000Z", "kendaraan_id": "019f7b2e-17a0-72c3-96a7-995b239aef93", "pengemudi_id": "019f7b2e-17a8-71ba-ad6b-8b73624f04aa", "tanggal_mulai": "2026-07-20T17:00:00.000000Z", "nomor_reservasi": "RSV-20260719-0003", "tanggal_selesai": "2026-07-21T08:00:00.000000Z"}', '127.0.0.1', 'PostmanRuntime/7.54.0', '2026-07-19 11:49:45', '2026-07-19 11:49:45'),
	('019f7f48-fc98-728c-a01d-5e74a1b349d9', '019f7b2e-15f5-71f6-a616-798197b49b68', 'SERVICE', 'CREATE', '019f7f48-fc46-7294-91e9-a0ebbfac3827', NULL, '{"id": "019f7f48-fc46-7294-91e9-a0ebbfac3827", "biaya": 750000, "status": "SCHEDULED", "vendor": "Auto2000", "created_at": "2026-07-20T11:28:37.000000Z", "keterangan": "Service berkala 10.000 KM", "updated_at": "2026-07-20T11:28:37.000000Z", "kendaraan_id": "019f7b2e-17a1-7003-b5d3-17762e633d21", "jenis_service": "Ganti Oli", "tanggal_service": "2026-08-01T00:00:00.000000Z"}', '127.0.0.1', 'PostmanRuntime/7.54.0', '2026-07-20 04:28:37', '2026-07-20 04:28:37'),
	('019f7f4e-d187-73e8-bf51-1d490d95268c', '019f7b2e-15f5-71f6-a616-798197b49b68', 'SERVICE', 'UPDATE', '019f7f48-fc46-7294-91e9-a0ebbfac3827', '{"id": "019f7f48-fc46-7294-91e9-a0ebbfac3827", "biaya": "750000.00", "status": "SCHEDULED", "vendor": "Auto2000", "created_at": "2026-07-20T11:28:37.000000Z", "keterangan": "Service berkala 10.000 KM", "updated_at": "2026-07-20T11:28:37.000000Z", "kendaraan_id": "019f7b2e-17a1-7003-b5d3-17762e633d21", "jenis_service": "Ganti Oli", "tanggal_service": "2026-08-01T00:00:00.000000Z"}', '{"id": "019f7f48-fc46-7294-91e9-a0ebbfac3827", "biaya": "750000.00", "status": "COMPLETED", "vendor": "Auto2000", "created_at": "2026-07-20T11:28:37.000000Z", "keterangan": "Service selesai", "updated_at": "2026-07-20T11:34:59.000000Z", "kendaraan_id": "019f7b2e-17a1-7003-b5d3-17762e633d21", "jenis_service": "Ganti Oli", "tanggal_service": "2026-08-01T00:00:00.000000Z"}', '127.0.0.1', 'PostmanRuntime/7.54.0', '2026-07-20 04:34:59', '2026-07-20 04:34:59'),
	('019f7f9b-5429-7029-95f0-9f2059e9b04f', NULL, 'AUTH', 'LOGIN', '019f7b2e-16cb-73ce-a7b8-f104daef62b4', NULL, NULL, '127.0.0.1', 'PostmanRuntime/7.54.0', '2026-07-20 05:58:33', '2026-07-20 05:58:33'),
	('019f7fcb-76be-7042-a45c-a986a05e9d96', NULL, 'AUTH', 'LOGIN', '019f7b2e-15f5-71f6-a616-798197b49b68', NULL, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', '2026-07-20 06:51:08', '2026-07-20 06:51:08'),
	('019f7fcd-d589-70d4-9e8a-6ceafac2cb1d', '019f7b2e-15f5-71f6-a616-798197b49b68', 'AUTH', 'LOGOUT', '019f7b2e-15f5-71f6-a616-798197b49b68', NULL, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', '2026-07-20 06:53:43', '2026-07-20 06:53:43'),
	('019f7fcd-fc2c-700e-81d4-2d30110c5745', NULL, 'AUTH', 'LOGIN', '019f7b2e-1798-70c3-b050-11d45aab577c', NULL, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', '2026-07-20 06:53:53', '2026-07-20 06:53:53'),
	('019f7fce-07c5-708d-b17e-e41adecebddf', '019f7b2e-1798-70c3-b050-11d45aab577c', 'AUTH', 'LOGOUT', '019f7b2e-1798-70c3-b050-11d45aab577c', NULL, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', '2026-07-20 06:53:56', '2026-07-20 06:53:56'),
	('019f7fce-4aad-7373-9c09-4f5931278bc5', NULL, 'AUTH', 'LOGIN', '019f7b2e-16cb-73ce-a7b8-f104daef62b4', NULL, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', '2026-07-20 06:54:13', '2026-07-20 06:54:13'),
	('019f7fce-5e27-71a4-92b2-a22711c44d27', '019f7b2e-16cb-73ce-a7b8-f104daef62b4', 'AUTH', 'LOGOUT', '019f7b2e-16cb-73ce-a7b8-f104daef62b4', NULL, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', '2026-07-20 06:54:18', '2026-07-20 06:54:18'),
	('019f7fd0-87bf-72f2-92b8-704908322782', NULL, 'AUTH', 'LOGIN', '019f7b2e-15f5-71f6-a616-798197b49b68', NULL, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', '2026-07-20 06:56:40', '2026-07-20 06:56:40'),
	('019f8019-27cd-70a9-901e-f90fc0065864', '019f7b2e-15f5-71f6-a616-798197b49b68', 'VEHICLE', 'CREATE', '019f8019-27c6-710f-8545-6539375d0e14', NULL, '{"id": "019f8019-27c6-710f-8545-6539375d0e14", "merk": "Toyota", "tipe": "Fortuner", "tahun": 2025, "warna": "Hitam", "status": "AVAILABLE", "kantor_id": "019f7b2e-151a-734b-bd94-7d1165e34a59", "created_at": "2026-07-20T15:16:00.000000Z", "plat_nomor": "KT1003AA", "updated_at": "2026-07-20T15:16:00.000000Z", "kode_kendaraan": "DT003", "kapasitas_penumpang": 7}', '127.0.0.1', 'PostmanRuntime/7.54.0', '2026-07-20 08:16:00', '2026-07-20 08:16:00'),
	('019f801b-89c3-70f0-abe2-da2dc6380e02', '019f7b2e-15f5-71f6-a616-798197b49b68', 'VEHICLE', 'UPDATE', '019f7b2e-179d-731c-8bfe-d1434e9f84a9', '{"id": "019f7b2e-179d-731c-8bfe-d1434e9f84a9", "merk": "Toyota", "tipe": "Hilux", "tahun": "2023", "warna": "Putih", "status": "AVAILABLE", "kantor_id": "019f7b2e-151a-734b-bd94-7d1165e34a59", "created_at": "2026-07-19T16:20:46.000000Z", "plat_nomor": "KT1001AA", "updated_at": "2026-07-19T16:20:46.000000Z", "kode_kendaraan": "DT001", "kapasitas_penumpang": 5}', '{"id": "019f7b2e-179d-731c-8bfe-d1434e9f84a9", "merk": "Toyota", "tipe": "Hilux", "tahun": "2023", "warna": "Merah", "status": "AVAILABLE", "kantor_id": "019f7b2e-151a-734b-bd94-7d1165e34a59", "created_at": "2026-07-19T16:20:46.000000Z", "plat_nomor": "KT1001AA", "updated_at": "2026-07-20T15:18:36.000000Z", "kode_kendaraan": "DT001", "kapasitas_penumpang": 5}', '127.0.0.1', 'PostmanRuntime/7.54.0', '2026-07-20 08:18:36', '2026-07-20 08:18:36'),
	('019f801d-af00-7007-a32b-f52c0a46aff1', '019f7b2e-15f5-71f6-a616-798197b49b68', 'VEHICLE', 'DELETE', '019f8019-27c6-710f-8545-6539375d0e14', '{"id": "019f8019-27c6-710f-8545-6539375d0e14", "merk": "Toyota", "tipe": "Fortuner", "tahun": "2025", "warna": "Hitam", "status": "AVAILABLE", "kantor_id": "019f7b2e-151a-734b-bd94-7d1165e34a59", "created_at": "2026-07-20T15:16:00.000000Z", "plat_nomor": "KT1003AA", "updated_at": "2026-07-20T15:16:00.000000Z", "kode_kendaraan": "DT003", "kapasitas_penumpang": 7}', NULL, '127.0.0.1', 'PostmanRuntime/7.54.0', '2026-07-20 08:20:56', '2026-07-20 08:20:56'),
	('019f804d-ba27-7336-a677-e45402515d56', '019f7b2e-15f5-71f6-a616-798197b49b68', 'AUTH', 'LOGOUT', '019f7b2e-15f5-71f6-a616-798197b49b68', NULL, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', '2026-07-20 09:13:25', '2026-07-20 09:13:25'),
	('019f804e-1eb7-70ec-8148-ac86ca55883b', NULL, 'AUTH', 'LOGIN', '019f7b2e-15f5-71f6-a616-798197b49b68', NULL, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', '2026-07-20 09:13:51', '2026-07-20 09:13:51'),
	('019f81cf-2807-73fb-bfb6-c154ced37a33', '019f7b2e-15f5-71f6-a616-798197b49b68', 'AUTH', 'LOGOUT', '019f7b2e-15f5-71f6-a616-798197b49b68', NULL, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', '2026-07-20 16:14:24', '2026-07-20 16:14:24'),
	('019f81cf-604c-7019-aae0-1eb6ac8d5888', NULL, 'AUTH', 'LOGIN', '019f7b2e-15f5-71f6-a616-798197b49b68', NULL, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', '2026-07-20 16:14:39', '2026-07-20 16:14:39'),
	('019f8354-4c2d-72b9-96f1-6015cc0e15c6', NULL, 'AUTH', 'LOGIN', '019f7b2e-15f5-71f6-a616-798197b49b68', NULL, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', '2026-07-20 23:19:27', '2026-07-20 23:19:27'),
	('019f837e-a05a-73a0-aa2e-ecdd3c27aa38', '019f7b2e-15f5-71f6-a616-798197b49b68', 'VEHICLE', 'UPDATE', '019f7b2e-179d-731c-8bfe-d1434e9f84a9', '{"id": "019f7b2e-179d-731c-8bfe-d1434e9f84a9", "merk": "Toyota", "tipe": "Hilux", "tahun": "2023", "warna": "Merah", "status": "AVAILABLE", "kantor_id": "019f7b2e-151a-734b-bd94-7d1165e34a59", "created_at": "2026-07-19T16:20:46.000000Z", "plat_nomor": "KT1001AA", "updated_at": "2026-07-20T15:18:36.000000Z", "kode_kendaraan": "DT001", "kapasitas_penumpang": 5}', '{"id": "019f7b2e-179d-731c-8bfe-d1434e9f84a9", "merk": "Toyota", "tipe": "Hilu", "tahun": "2023", "warna": "Merah", "status": "AVAILABLE", "kantor_id": "019f7b2e-151a-734b-bd94-7d1165e34a59", "created_at": "2026-07-19T16:20:46.000000Z", "plat_nomor": "KT1001AA", "updated_at": "2026-07-21T07:05:41.000000Z", "kode_kendaraan": "DT001", "kapasitas_penumpang": 5}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', '2026-07-21 00:05:41', '2026-07-21 00:05:41'),
	('019f837e-c417-72a0-9473-cfe5110c6ec4', '019f7b2e-15f5-71f6-a616-798197b49b68', 'VEHICLE', 'UPDATE', '019f7b2e-179d-731c-8bfe-d1434e9f84a9', '{"id": "019f7b2e-179d-731c-8bfe-d1434e9f84a9", "merk": "Toyota", "tipe": "Hilu", "tahun": "2023", "warna": "Merah", "status": "AVAILABLE", "kantor_id": "019f7b2e-151a-734b-bd94-7d1165e34a59", "created_at": "2026-07-19T16:20:46.000000Z", "plat_nomor": "KT1001AA", "updated_at": "2026-07-21T07:05:41.000000Z", "kode_kendaraan": "DT001", "kapasitas_penumpang": 5}', '{"id": "019f7b2e-179d-731c-8bfe-d1434e9f84a9", "merk": "Toyota", "tipe": "Hilux", "tahun": "2023", "warna": "Merah", "status": "AVAILABLE", "kantor_id": "019f7b2e-151a-734b-bd94-7d1165e34a59", "created_at": "2026-07-19T16:20:46.000000Z", "plat_nomor": "KT1001AA", "updated_at": "2026-07-21T07:05:50.000000Z", "kode_kendaraan": "DT001", "kapasitas_penumpang": 5}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', '2026-07-21 00:05:50', '2026-07-21 00:05:50'),
	('019f8401-1664-735e-a53a-ddc599be6d36', '019f7b2e-15f5-71f6-a616-798197b49b68', 'SERVICE', 'CREATE', '019f8401-165d-7323-9909-49a6c29acaba', NULL, '{"id": "019f8401-165d-7323-9909-49a6c29acaba", "biaya": 500000, "status": "SCHEDULED", "vendor": "Mitsubishi Motors", "created_at": "2026-07-21T09:28:11.000000Z", "keterangan": null, "updated_at": "2026-07-21T09:28:11.000000Z", "kendaraan_id": "019f7b2e-179d-731c-8bfe-d1434e9f84a9", "jenis_service": "Service Berkala", "tanggal_service": "2026-02-14T00:00:00.000000Z"}', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36', '2026-07-21 02:28:11', '2026-07-21 02:28:11'),
	('019f8402-0010-73f1-860d-97d298d383f7', '019f7b2e-15f5-71f6-a616-798197b49b68', 'AUTH', 'LOGOUT', '019f7b2e-15f5-71f6-a616-798197b49b68', NULL, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', '2026-07-21 02:29:11', '2026-07-21 02:29:11'),
	('019f8402-2072-7011-9aac-623ed22bd4c4', NULL, 'AUTH', 'LOGIN', '019f7b2e-1798-70c3-b050-11d45aab577c', NULL, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', '2026-07-21 02:29:19', '2026-07-21 02:29:19'),
	('019f8402-6721-71d4-8217-2d4bd72ef025', '019f7b2e-1798-70c3-b050-11d45aab577c', 'AUTH', 'LOGOUT', '019f7b2e-1798-70c3-b050-11d45aab577c', NULL, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', '2026-07-21 02:29:37', '2026-07-21 02:29:37'),
	('019f8402-b3d8-7144-842f-2a5bc8324c6c', NULL, 'AUTH', 'LOGIN', '019f7b2e-16cb-73ce-a7b8-f104daef62b4', NULL, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', '2026-07-21 02:29:57', '2026-07-21 02:29:57'),
	('019f8430-92f0-73aa-8bb2-c37a00d1c0ef', '019f7b2e-16cb-73ce-a7b8-f104daef62b4', 'AUTH', 'LOGOUT', '019f7b2e-16cb-73ce-a7b8-f104daef62b4', NULL, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', '2026-07-21 03:20:03', '2026-07-21 03:20:03'),
	('019f8430-b399-7177-8c30-6fece6afceda', NULL, 'AUTH', 'LOGIN', '019f7b2e-15f5-71f6-a616-798197b49b68', NULL, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', '2026-07-21 03:20:12', '2026-07-21 03:20:12'),
	('019f8430-c2b0-704e-8fd5-ba60006a0eaa', '019f7b2e-15f5-71f6-a616-798197b49b68', 'AUTH', 'LOGOUT', '019f7b2e-15f5-71f6-a616-798197b49b68', NULL, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', '2026-07-21 03:20:15', '2026-07-21 03:20:15'),
	('019f8431-06ca-73a5-9b3e-6bedfe2d9c46', NULL, 'AUTH', 'LOGIN', '019f7b2e-1798-70c3-b050-11d45aab577c', NULL, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', '2026-07-21 03:20:33', '2026-07-21 03:20:33'),
	('019f8431-8e59-7250-b585-03ef44f44b6b', '019f7b2e-1798-70c3-b050-11d45aab577c', 'AUTH', 'LOGOUT', '019f7b2e-1798-70c3-b050-11d45aab577c', NULL, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', '2026-07-21 03:21:08', '2026-07-21 03:21:08'),
	('019f8431-afa6-730f-aed2-0c0ac2ac30e7', NULL, 'AUTH', 'LOGIN', '019f7b2e-16cb-73ce-a7b8-f104daef62b4', NULL, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', '2026-07-21 03:21:16', '2026-07-21 03:21:16'),
	('019f8478-27c1-7178-bb7e-68c2a30786e3', '019f7b2e-16cb-73ce-a7b8-f104daef62b4', 'AUTH', 'LOGOUT', '019f7b2e-16cb-73ce-a7b8-f104daef62b4', NULL, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', '2026-07-21 04:38:14', '2026-07-21 04:38:14'),
	('019f8478-672e-71f0-a38f-bc09cb515a00', NULL, 'AUTH', 'LOGIN', '019f7b2e-15f5-71f6-a616-798197b49b68', NULL, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', '2026-07-21 04:38:31', '2026-07-21 04:38:31');

-- Dumping structure for table db_vehicle_booking.approvals
CREATE TABLE IF NOT EXISTS `approvals` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reservasi_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `level` tinyint unsigned NOT NULL,
  `approver_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `catatan` text COLLATE utf8mb4_unicode_ci,
  `approved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `approvals_approver_id_foreign` (`approver_id`),
  KEY `approvals_reservasi_id_level_index` (`reservasi_id`,`level`),
  CONSTRAINT `approvals_approver_id_foreign` FOREIGN KEY (`approver_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `approvals_reservasi_id_foreign` FOREIGN KEY (`reservasi_id`) REFERENCES `reservasi_kendaraan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_vehicle_booking.approvals: ~6 rows (approximately)
INSERT INTO `approvals` (`id`, `reservasi_id`, `level`, `approver_id`, `status`, `catatan`, `approved_at`, `created_at`, `updated_at`) VALUES
	('019f7b30-f5c2-7044-9ad2-13eab5cf4fa3', '019f7b30-f5c0-73cb-a55a-38c6e7c57c5c', 1, '019f7b2e-16cb-73ce-a7b8-f104daef62b4', 'APPROVED', 'Disetujui untuk operasional', '2026-07-19 10:39:39', '2026-07-19 09:23:54', '2026-07-19 10:39:39'),
	('019f7b30-f5c3-7258-9d09-26a6e1260301', '019f7b30-f5c0-73cb-a55a-38c6e7c57c5c', 2, '019f7b2e-1798-70c3-b050-11d45aab577c', 'APPROVED', 'Disetujui manager', '2026-07-19 10:44:16', '2026-07-19 09:23:54', '2026-07-19 10:44:16'),
	('019f7b7f-92b8-73d2-b7f7-2448d36c3329', '019f7b7f-928b-712e-8708-8cd0be637014', 1, '019f7b2e-15f5-71f6-a616-798197b49b68', 'REJECTED', 'Kendaraan tidak tersedia', '2026-07-19 10:52:11', '2026-07-19 10:49:46', '2026-07-19 10:52:11'),
	('019f7b7f-92b9-7328-8f54-f8514e75a60a', '019f7b7f-928b-712e-8708-8cd0be637014', 2, NULL, 'PENDING', NULL, NULL, '2026-07-19 10:49:46', '2026-07-19 10:49:46'),
	('019f7bb6-7ec8-7219-93bc-42f6c2f39e17', '019f7bb6-7ec5-722e-a787-763694edcce1', 1, '019f7b2e-16cb-73ce-a7b8-f104daef62b4', 'APPROVED', 'Disetujui untuk operasional', '2026-07-19 11:51:06', '2026-07-19 11:49:45', '2026-07-19 11:51:06'),
	('019f7bb6-7ec9-7353-876b-466d1d4cd8f8', '019f7bb6-7ec5-722e-a787-763694edcce1', 2, '019f7b2e-1798-70c3-b050-11d45aab577c', 'APPROVED', 'Disetujui manager', '2026-07-19 11:51:30', '2026-07-19 11:49:45', '2026-07-19 11:51:30');

-- Dumping structure for table db_vehicle_booking.cache
CREATE TABLE IF NOT EXISTS `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_vehicle_booking.cache: ~0 rows (approximately)

-- Dumping structure for table db_vehicle_booking.cache_locks
CREATE TABLE IF NOT EXISTS `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_vehicle_booking.cache_locks: ~0 rows (approximately)

-- Dumping structure for table db_vehicle_booking.catatan_bbm
CREATE TABLE IF NOT EXISTS `catatan_bbm` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `penggunaan_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal` date NOT NULL,
  `liter` decimal(10,2) NOT NULL,
  `harga_per_liter` decimal(15,2) NOT NULL,
  `total_biaya` decimal(15,2) NOT NULL,
  `spbu` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `catatan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `catatan_bbm_penggunaan_id_foreign` (`penggunaan_id`),
  CONSTRAINT `catatan_bbm_penggunaan_id_foreign` FOREIGN KEY (`penggunaan_id`) REFERENCES `penggunaan_kendaraan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_vehicle_booking.catatan_bbm: ~1 rows (approximately)
INSERT INTO `catatan_bbm` (`id`, `penggunaan_id`, `tanggal`, `liter`, `harga_per_liter`, `total_biaya`, `spbu`, `catatan`, `created_at`, `updated_at`) VALUES
	('019f7bbc-4b7b-7249-b3f7-6e51317faaea', '019f7bb8-b35f-7050-a199-2553ed98b27a', '2026-07-20', 50.00, 10000.00, 500000.00, 'Pertamina Balikpapan', 'Isi penuh', '2026-07-19 11:56:05', '2026-07-19 11:56:05');

-- Dumping structure for table db_vehicle_booking.jadwal_service
CREATE TABLE IF NOT EXISTS `jadwal_service` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kendaraan_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal_service` date NOT NULL,
  `jenis_service` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vendor` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `biaya` decimal(15,2) NOT NULL DEFAULT '0.00',
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'SCHEDULED',
  `keterangan` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `jadwal_service_kendaraan_id_foreign` (`kendaraan_id`),
  CONSTRAINT `jadwal_service_kendaraan_id_foreign` FOREIGN KEY (`kendaraan_id`) REFERENCES `kendaraan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_vehicle_booking.jadwal_service: ~0 rows (approximately)
INSERT INTO `jadwal_service` (`id`, `kendaraan_id`, `tanggal_service`, `jenis_service`, `vendor`, `biaya`, `status`, `keterangan`, `created_at`, `updated_at`) VALUES
	('019f7f48-fc46-7294-91e9-a0ebbfac3827', '019f7b2e-17a1-7003-b5d3-17762e633d21', '2026-08-01', 'Ganti Oli', 'Auto2000', 750000.00, 'COMPLETED', 'Service selesai', '2026-07-20 04:28:37', '2026-07-20 04:34:59'),
	('019f8401-165d-7323-9909-49a6c29acaba', '019f7b2e-179d-731c-8bfe-d1434e9f84a9', '2026-02-14', 'Service Berkala', 'Mitsubishi Motors', 500000.00, 'SCHEDULED', NULL, '2026-07-21 02:28:11', '2026-07-21 02:28:11');

-- Dumping structure for table db_vehicle_booking.kantor
CREATE TABLE IF NOT EXISTS `kantor` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `wilayah_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kode_kantor` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama_kantor` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alamat` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `kantor_kode_kantor_unique` (`kode_kantor`),
  KEY `kantor_wilayah_id_foreign` (`wilayah_id`),
  CONSTRAINT `kantor_wilayah_id_foreign` FOREIGN KEY (`wilayah_id`) REFERENCES `wilayah` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_vehicle_booking.kantor: ~2 rows (approximately)
INSERT INTO `kantor` (`id`, `wilayah_id`, `kode_kantor`, `nama_kantor`, `alamat`, `created_at`, `updated_at`) VALUES
	('019f7b2e-151a-734b-bd94-7d1165e34a59', '019f7b2e-150e-7276-9936-8da2fd99812b', 'SITE-A', 'Site A', 'Kutai Timur', '2026-07-19 09:20:45', '2026-07-19 09:20:45'),
	('019f7b2e-151d-7294-849b-8b91f3c4489c', '019f7b2e-150e-7276-9936-8da2fd99812b', 'SITE-B', 'Site B', 'Samarinda', '2026-07-19 09:20:45', '2026-07-19 09:20:45'),
	('019f81cd-9584-712f-94c4-c2d46f5a5034', '019f7b2e-150e-7276-9936-8da2fd99812b', 'SITE-C', 'Site C', 'Saradan', '2026-07-20 16:12:41', '2026-07-20 16:12:41');

-- Dumping structure for table db_vehicle_booking.kendaraan
CREATE TABLE IF NOT EXISTS `kendaraan` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kantor_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kode_kendaraan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `plat_nomor` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `merk` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipe` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tahun` year NOT NULL,
  `warna` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kapasitas_penumpang` int NOT NULL DEFAULT '1',
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'AVAILABLE',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `kendaraan_kode_kendaraan_unique` (`kode_kendaraan`),
  UNIQUE KEY `kendaraan_plat_nomor_unique` (`plat_nomor`),
  KEY `kendaraan_kantor_id_foreign` (`kantor_id`),
  CONSTRAINT `kendaraan_kantor_id_foreign` FOREIGN KEY (`kantor_id`) REFERENCES `kantor` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_vehicle_booking.kendaraan: ~3 rows (approximately)
INSERT INTO `kendaraan` (`id`, `kantor_id`, `kode_kendaraan`, `plat_nomor`, `merk`, `tipe`, `tahun`, `warna`, `kapasitas_penumpang`, `status`, `created_at`, `updated_at`) VALUES
	('019f7b2e-179d-731c-8bfe-d1434e9f84a9', '019f7b2e-151a-734b-bd94-7d1165e34a59', 'DT001', 'KT1001AA', 'Toyota', 'Hilux', '2023', 'Merah', 5, 'SERVICE', '2026-07-19 09:20:46', '2026-07-21 02:28:11'),
	('019f7b2e-17a0-72c3-96a7-995b239aef93', '019f7b2e-151a-734b-bd94-7d1165e34a59', 'DT002', 'KT1002AA', 'Mitsubishi', 'Triton', '2024', 'Putih', 5, 'IN_USE', '2026-07-19 09:20:46', '2026-07-19 11:52:09'),
	('019f7b2e-17a1-7003-b5d3-17762e633d21', '019f7b2e-151a-734b-bd94-7d1165e34a59', 'LV001', 'KT2001AA', 'Toyota', 'Fortuner', '2023', 'Putih', 5, 'AVAILABLE', '2026-07-19 09:20:46', '2026-07-20 04:34:59');

-- Dumping structure for table db_vehicle_booking.migrations
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_vehicle_booking.migrations: ~0 rows (approximately)
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
	(1, '0001_01_01_000000_create_users_tablecreate_users_table', 1),
	(2, '2026_07_19_081738_create_wilayah_table', 1),
	(3, '2026_07_19_081827_create_kantor_table', 1),
	(4, '2026_07_19_081900_add_wilayah_kantor_to_users_table', 1),
	(5, '2026_07_19_082019_create_kendaraan_table', 1),
	(6, '2026_07_19_082115_create_pengemudi_table', 1),
	(7, '2026_07_19_082220_create_reservasi_kendaraan_table', 1),
	(8, '2026_07_19_082327_create_approvals_table', 1),
	(9, '2026_07_19_082505_create_penggunaan_kendaraan_table', 1),
	(10, '2026_07_19_082603_create_catatan_bbm_table', 1),
	(11, '2026_07_19_082645_create_jadwal_service_table', 1),
	(12, '2026_07_19_091219_create_activity_logs_table', 1),
	(13, '2026_07_19_093349_create_personal_access_tokens_table', 1),
	(14, '2026_07_19_162032_create_cache_table', 1),
	(15, '2026_07_19_181430_alter_penggunaan_kendaraan_add_status_and_distance', 2);

-- Dumping structure for table db_vehicle_booking.pengemudi
CREATE TABLE IF NOT EXISTS `pengemudi` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kantor_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `no_hp` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sim_nomor` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sim_expired` date NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'AVAILABLE',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pengemudi_kantor_id_foreign` (`kantor_id`),
  CONSTRAINT `pengemudi_kantor_id_foreign` FOREIGN KEY (`kantor_id`) REFERENCES `kantor` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_vehicle_booking.pengemudi: ~2 rows (approximately)
INSERT INTO `pengemudi` (`id`, `kantor_id`, `nama`, `no_hp`, `sim_nomor`, `sim_expired`, `status`, `created_at`, `updated_at`) VALUES
	('019f7b2e-17a8-71ba-ad6b-8b73624f04aa', '019f7b2e-151a-734b-bd94-7d1165e34a59', 'Budi Santoso', '081111111111', 'SIM001', '2031-07-19', 'AVAILABLE', '2026-07-19 09:20:46', '2026-07-19 09:20:46'),
	('019f7b2e-17aa-7047-99c8-b53339b7204c', '019f7b2e-151a-734b-bd94-7d1165e34a59', 'Andi Saputra', '082222222222', 'SIM002', '2031-07-19', 'AVAILABLE', '2026-07-19 09:20:46', '2026-07-19 09:20:46'),
	('019f7b2e-17ac-727a-ab36-29ec6999b0a0', '019f7b2e-151a-734b-bd94-7d1165e34a59', 'Joko Susilo', '083333333333', 'SIM003', '2031-07-19', 'AVAILABLE', '2026-07-19 09:20:46', '2026-07-19 09:20:46');

-- Dumping structure for table db_vehicle_booking.penggunaan_kendaraan
CREATE TABLE IF NOT EXISTS `penggunaan_kendaraan` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reservasi_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `odometer_awal` int NOT NULL,
  `odometer_akhir` int DEFAULT NULL,
  `tanggal_berangkat` datetime NOT NULL,
  `tanggal_kembali` datetime DEFAULT NULL,
  `catatan` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'IN_PROGRESS',
  `jarak_tempuh` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `penggunaan_kendaraan_reservasi_id_foreign` (`reservasi_id`),
  CONSTRAINT `penggunaan_kendaraan_reservasi_id_foreign` FOREIGN KEY (`reservasi_id`) REFERENCES `reservasi_kendaraan` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_vehicle_booking.penggunaan_kendaraan: ~2 rows (approximately)
INSERT INTO `penggunaan_kendaraan` (`id`, `reservasi_id`, `odometer_awal`, `odometer_akhir`, `tanggal_berangkat`, `tanggal_kembali`, `catatan`, `status`, `jarak_tempuh`, `created_at`, `updated_at`) VALUES
	('019f7ba9-1088-72c0-9dd1-b9590f9606e9', '019f7b30-f5c0-73cb-a55a-38c6e7c57c5c', 12000, 15000, '2026-07-19 18:35:05', '2026-07-19 18:36:28', 'Perjalanan selesai', 'COMPLETED', 3000, '2026-07-19 11:35:05', '2026-07-19 11:36:28'),
	('019f7bb8-b35f-7050-a199-2553ed98b27a', '019f7bb6-7ec5-722e-a787-763694edcce1', 15000, NULL, '2026-07-19 18:52:09', NULL, NULL, 'IN_PROGRESS', NULL, '2026-07-19 11:52:09', '2026-07-19 11:52:09');

-- Dumping structure for table db_vehicle_booking.personal_access_tokens
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_vehicle_booking.personal_access_tokens: ~6 rows (approximately)
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
	(1, 'App\\Models\\User', '019f7b2e-15f5-71f6-a616-798197b49b68', 'vehicle-reservation', '6ed3a0da7b225d113cb8acd571870b70b474eb2803ee5b23031079cda850ce0e', '["*"]', '2026-07-21 04:30:06', NULL, '2026-07-19 09:21:14', '2026-07-21 04:30:06'),
	(2, 'App\\Models\\User', '019f7b2e-1798-70c3-b050-11d45aab577c', 'vehicle-reservation', 'b043f2d475137c8adeb67dd3aebfed722d18f22f1975229fa2a00bee34dc6aa3', '["*"]', '2026-07-20 09:25:16', NULL, '2026-07-19 09:21:40', '2026-07-20 09:25:16'),
	(3, 'App\\Models\\User', '019f7b2e-16cb-73ce-a7b8-f104daef62b4', 'vehicle-reservation', '68ba1c9a6c30da34fab1bffeb4d5b45a99064b8b5c135b5e49c25d382acfebd3', '["*"]', '2026-07-19 09:24:21', NULL, '2026-07-19 09:22:12', '2026-07-19 09:24:21'),
	(4, 'App\\Models\\User', '019f7b2e-16cb-73ce-a7b8-f104daef62b4', 'vehicle-reservation', '30a06a13ec1654faba6cc435f4ff27e597e81b1716ba50851647e83b03a5f779', '["*"]', '2026-07-21 04:32:29', NULL, '2026-07-19 09:25:51', '2026-07-21 04:32:29'),
	(5, 'App\\Models\\User', '019f7b2e-16cb-73ce-a7b8-f104daef62b4', 'vehicle-reservation', '91a97809d358d02fa61b1fbddc15d3eab99d1d0c2953cf82c93b58a9a0a2f287', '["*"]', NULL, NULL, '2026-07-20 05:58:33', '2026-07-20 05:58:33'),
	(11, 'App\\Models\\User', '019f7b2e-15f5-71f6-a616-798197b49b68', 'vehicle-reservation', '3625415d71e9830ca99ce10b33e674dd9be71a1ac43f35a0b315ee74c67d20ff', '["*"]', '2026-07-20 16:35:17', NULL, '2026-07-20 16:14:39', '2026-07-20 16:35:17'),
	(18, 'App\\Models\\User', '019f7b2e-15f5-71f6-a616-798197b49b68', 'vehicle-reservation', 'c79cb4ede1a81db5021c439b8f9ab56fe0e7af93024fdf32d76491090e6cf110', '["*"]', '2026-07-21 04:39:12', NULL, '2026-07-21 04:38:31', '2026-07-21 04:39:12');

-- Dumping structure for table db_vehicle_booking.reservasi_kendaraan
CREATE TABLE IF NOT EXISTS `reservasi_kendaraan` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nomor_reservasi` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kendaraan_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pengemudi_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pemohon_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal_mulai` datetime NOT NULL,
  `tanggal_selesai` datetime NOT NULL,
  `tujuan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `keperluan` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING_LV1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reservasi_kendaraan_nomor_reservasi_unique` (`nomor_reservasi`),
  KEY `reservasi_kendaraan_pemohon_id_foreign` (`pemohon_id`),
  KEY `idx_reservation_vehicle` (`kendaraan_id`,`tanggal_mulai`,`tanggal_selesai`),
  KEY `idx_reservation_driver` (`pengemudi_id`,`tanggal_mulai`,`tanggal_selesai`),
  CONSTRAINT `reservasi_kendaraan_kendaraan_id_foreign` FOREIGN KEY (`kendaraan_id`) REFERENCES `kendaraan` (`id`),
  CONSTRAINT `reservasi_kendaraan_pemohon_id_foreign` FOREIGN KEY (`pemohon_id`) REFERENCES `users` (`id`),
  CONSTRAINT `reservasi_kendaraan_pengemudi_id_foreign` FOREIGN KEY (`pengemudi_id`) REFERENCES `pengemudi` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_vehicle_booking.reservasi_kendaraan: ~2 rows (approximately)
INSERT INTO `reservasi_kendaraan` (`id`, `nomor_reservasi`, `kendaraan_id`, `pengemudi_id`, `pemohon_id`, `tanggal_mulai`, `tanggal_selesai`, `tujuan`, `keperluan`, `status`, `created_at`, `updated_at`) VALUES
	('019f7b30-f5c0-73cb-a55a-38c6e7c57c5c', 'RSV-20260719-0001', '019f7b2e-17a0-72c3-96a7-995b239aef93', '019f7b2e-17a8-71ba-ad6b-8b73624f04aa', '019f7b2e-15f5-71f6-a616-798197b49b68', '2026-07-19 17:00:00', '2026-07-20 08:00:00', 'Site B', 'Meeting', 'COMPLETED', '2026-07-19 09:23:54', '2026-07-19 11:36:28'),
	('019f7b7f-928b-712e-8708-8cd0be637014', 'RSV-20260719-0002', '019f7b2e-179d-731c-8bfe-d1434e9f84a9', '019f7b2e-17aa-7047-99c8-b53339b7204c', '019f7b2e-15f5-71f6-a616-798197b49b68', '2026-07-20 17:00:00', '2026-07-21 08:00:00', 'Site C', 'Antar Barang', 'REJECTED', '2026-07-19 10:49:46', '2026-07-19 10:52:11'),
	('019f7bb6-7ec5-722e-a787-763694edcce1', 'RSV-20260719-0003', '019f7b2e-17a0-72c3-96a7-995b239aef93', '019f7b2e-17a8-71ba-ad6b-8b73624f04aa', '019f7b2e-15f5-71f6-a616-798197b49b68', '2026-07-20 17:00:00', '2026-07-21 08:00:00', 'Site D', 'Angkut Batu Bara', 'APPROVED', '2026-07-19 11:49:45', '2026-07-19 11:51:30');

-- Dumping structure for table db_vehicle_booking.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pin` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `wilayah_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kantor_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `last_login_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_unique` (`username`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_wilayah_id_foreign` (`wilayah_id`),
  KEY `users_kantor_id_foreign` (`kantor_id`),
  CONSTRAINT `users_kantor_id_foreign` FOREIGN KEY (`kantor_id`) REFERENCES `kantor` (`id`) ON DELETE SET NULL,
  CONSTRAINT `users_wilayah_id_foreign` FOREIGN KEY (`wilayah_id`) REFERENCES `wilayah` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_vehicle_booking.users: ~2 rows (approximately)
INSERT INTO `users` (`id`, `nama`, `username`, `email`, `password`, `pin`, `role`, `wilayah_id`, `kantor_id`, `is_active`, `last_login_at`, `created_at`, `updated_at`) VALUES
	('019f7b2e-15f5-71f6-a616-798197b49b68', 'System Admin', 'admin', 'admin@vehicle.test', '$2y$12$8rn26DodCFsGjOVfnefTZeYOl0SYLPM4r8SqYnPzKO4iKLMsRHgeG', '123456', 'ADMIN', '019f7b2e-150e-7276-9936-8da2fd99812b', '019f7b2e-151a-734b-bd94-7d1165e34a59', 1, NULL, '2026-07-19 09:20:45', '2026-07-19 09:20:45'),
	('019f7b2e-16cb-73ce-a7b8-f104daef62b4', 'Kepala Operasional', 'operasional', 'operasional@vehicle.test', '$2y$12$U7dhuOCv839CWrFer5lO1.KXiMadoYZxGKS/3aC3VXFY65g6cRh5u', '123456', 'KEPALA_OPERASIONAL', '019f7b2e-150e-7276-9936-8da2fd99812b', '019f7b2e-151a-734b-bd94-7d1165e34a59', 1, NULL, '2026-07-19 09:20:45', '2026-07-19 09:20:45'),
	('019f7b2e-1798-70c3-b050-11d45aab577c', 'Manager', 'manager', 'manager@vehicle.test', '$2y$12$W5KZNHwBhsQOLVR/42LeXOy.i41nvIdcS0v3hAwz8mdIYjj9qkwO.', '123456', 'MANAGER', '019f7b2e-150e-7276-9936-8da2fd99812b', '019f7b2e-151a-734b-bd94-7d1165e34a59', 1, NULL, '2026-07-19 09:20:46', '2026-07-19 09:20:46');

-- Dumping structure for table db_vehicle_booking.wilayah
CREATE TABLE IF NOT EXISTS `wilayah` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kode_wilayah` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama_wilayah` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `wilayah_kode_wilayah_unique` (`kode_wilayah`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_vehicle_booking.wilayah: ~3 rows (approximately)
INSERT INTO `wilayah` (`id`, `kode_wilayah`, `nama_wilayah`, `created_at`, `updated_at`) VALUES
	('019f7b2e-150e-7276-9936-8da2fd99812b', 'KALTIM', 'Kalimantan Timur', '2026-07-19 09:20:45', '2026-07-19 09:20:45'),
	('019f7b2e-1513-732e-a5de-c1671c2a6e29', 'KALSEL', 'Kalimantan Selatan', '2026-07-19 09:20:45', '2026-07-19 09:20:45'),
	('019f7b2e-1514-728e-85a6-1e4c86e591ca', 'KALTENG', 'Kalimantan Tengah', '2026-07-19 09:20:45', '2026-07-19 09:20:45'),
	('019f81ce-19c0-70e1-8667-e7641a621ee1', 'KALBAR', 'Kalimantan Barat', '2026-07-20 16:13:15', '2026-07-20 16:13:15');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
