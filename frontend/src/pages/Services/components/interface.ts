export interface Service {
  id: string;
  kendaraan_id: string;
  tanggal_service: string;
  jenis_service: string;
  vendor: string;
  biaya: number;
  keterangan: string | null;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED";
  kendaraan?: Vehicle;
  created_at?: string;
  updated_at?: string;
}

export interface Vehicle {
  id: string;
  kode_kendaraan: string;
  plat_nomor: string;
  merk: string;
  tipe: string;
  tahun: string;
  warna: string;
  status: string;
}

export interface ServiceFormData {
  kendaraan_id: string;
  tanggal_service: string;
  jenis_service: string;
  vendor: string;
  biaya: number;
  keterangan: string;
}

export interface CompleteServiceFormData {
  keterangan: string;
}

export interface AlertInfo {
  show: boolean;
  variant:| "success"  | "error"  | "warning" | "info";
  title: string;
  message: string;
}