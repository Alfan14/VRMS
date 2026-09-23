export interface Wilayah {
  id: string;
  kode_wilayah: string;
  nama_wilayah: string;
  created_at?: string;
  updated_at?: string;
}

export interface WilayahFormData {
  kode_wilayah: string;
  nama_wilayah: string;
}

export interface AlertInfo {
  show: boolean;
  variant: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
}