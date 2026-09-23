export interface FuelRecord {
  id: string;
  penggunaan_id: string;
  tanggal: string;
  liter: number;
  harga_per_liter: number;
  total_biaya: number;
  spbu: string;
  catatan: string | null;
  penggunaan?: VehicleUsage;
  created_at?: string;
  updated_at?: string;
}

export interface VehicleUsage {
  id: string;
  reservasi_id: string;
  odometer_awal: number;
  odometer_akhir?: number | null;
  tanggal_berangkat: string;
  tanggal_kembali?: string | null;
  status: string;
  reservasi: Reservation;
}

export interface Reservation {
  id: string;
  nomor_reservasi: string;
  tujuan: string;
  status: string;
  kendaraan_id: string;
  pengemudi_id: string;
}

export interface FuelFormData {
  penggunaan_id: string;
  tanggal: string;
  liter: number;
  harga_per_liter: number;
  spbu: string;
  catatan: string;
}

export interface AlertInfo {
  show: boolean;
  variant:| "success" | "error" | "warning"  | "info";
  title: string;
  message: string;
}