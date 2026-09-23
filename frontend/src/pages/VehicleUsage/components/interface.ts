export interface VehicleUsage {
  id: string;
  reservasi_id: string;
  odometer_awal: number;
  odometer_akhir?: number | null;
  catatan?: string | null;
  started_at?: string;
  finished_at?: string;
  status: string;
  reservation?: Reservation;
  created_at?: string;
  updated_at?: string;
}

export interface Reservation {
  id: string;
  nomor_reservasi: string;
  tujuan: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  status: string;
  kendaraan: Vehicle;
  pengemudi: Driver;
}

export interface Vehicle {
  id: string;
  kode_kendaraan: string;
  plat_nomor: string;
  merk: string;
  tipe: string;
}

export interface Driver {
  id: string;
  nama: string;
}

export interface StartUsageFormData {
  reservasi_id: string;
  odometer_awal: number;
}

export interface FinishUsageFormData {
  odometer_akhir: number;
  catatan: string;
}

export interface AlertInfo {
  show: boolean;
  variant:
    | "success"
    | "error"
    | "warning"
    | "info";

  title: string;
  message: string;
}