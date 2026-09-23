export interface Reservation {
  id: string;
  nomor_reservasi: string;

  kendaraan_id: string;
  pengemudi_id: string;
  pemohon_id: string;

  tanggal_mulai: string;
  tanggal_selesai: string;

  tujuan: string;
  keperluan: string;

  status: string;

  kendaraan?: Vehicle;
  pengemudi?: Driver;

  approvals?: Approval[];

  created_at?: string;
  updated_at?: string;
}

export interface ReservationFormData {
  kendaraan_id: string;
  pengemudi_id: string;

  tanggal_mulai: string;
  tanggal_selesai: string;

  tujuan: string;
  keperluan: string;
}

export interface Vehicle {
  id: string;
  kode_kendaraan: string;
  plat_nomor: string;
  merk: string;
  tipe: string;
  status: string;
}

export interface Driver {
  id: string;
  nama: string;
  no_hp: string;
  sim_nomor: string;
  status: string;
}

export interface Approval {
  id: string;

  level: number;

  approver_id: string | null;

  status: string;

  catatan: string | null;

  approved_at: string | null;
}

export interface AlertInfo {
  show: boolean;
  variant: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
}