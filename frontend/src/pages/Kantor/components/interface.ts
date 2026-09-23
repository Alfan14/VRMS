export interface Wilayah {
  id: string;
  kode_wilayah: string;
  nama_wilayah: string;
}

export interface Kantor {
  id: string;
  wilayah_id: string;
  kode_kantor: string;
  nama_kantor: string;
  alamat: string;
  created_at?: string;
  updated_at?: string;
  wilayah?: Wilayah;
}

export interface KantorFormData {
  wilayah_id: string;
  kode_kantor: string;
  nama_kantor: string;
  alamat: string;
}

export interface AlertInfo {
  show: boolean;
  variant: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
}