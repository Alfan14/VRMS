export interface Vehicle {
  id: string;
  kantor_id: string;
  kode_kendaraan: string;
  plat_nomor: string;
  merk: string;
  tipe: string;
  tahun: string | number;
  warna: string;
  kapasitas_penumpang: number;
  status: "AVAILABLE" | "IN_USE";
  created_at?: string;
  updated_at?: string;
}

export interface VehicleFormData {
  kantor_id: string;
  kode_kendaraan: string;
  plat_nomor: string;
  merk: string;
  tipe: string;
  tahun: string | number;
  warna: string;
  kapasitas_penumpang: number;
}

export interface ButtonProps {
  children: string;
  variant: "outline" | "primary";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export interface AlertInfo {
  show: boolean;
  variant: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
}

export interface Kantor{
    id:string;
    nama_kantor:string;
}