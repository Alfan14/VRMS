export interface Driver {
  id: string;
  kantor_id: string;
  nama: string;
  no_hp: string;
  sim_nomor: string;
  sim_expired: string;
  status: "AVAILABLE" | "ASSIGNED";
  created_at?: string;
  updated_at?: string;
  kantor?: Kantor;
}

export interface Kantor {
  id: string;
  wilayah_id: string;
  kode_kantor: string;
  nama_kantor: string;
  alamat: string;
  created_at?: string;
  updated_at?: string;
}

export interface DriverFormData {
  kantor_id: string;
  nama: string;
  no_hp: string;
  sim_nomor: string;
  sim_expired: string;
  status: "AVAILABLE" | "ASSIGNED";
}

export interface AlertInfo {
  show: boolean;

  variant:  | "success"  | "error"  | "warning"  | "info";

  title: string;
  message: string;
}

export interface ReportColumn {
  header: string;
  accessor: string;
}

export interface ButtonProps {
  children: string;
  variant: "outline" | "primary";

  onClick?: () => void;

  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}