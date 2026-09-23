export interface Approval {
  id: string;
  reservasi_id: string;
  level: number;
  status: string;
  approver_id?: string | null;
  catatan?: string | null;
  approved_at?: string | null;
  created_at?: string;
  updated_at?: string;
  reservasi?: Reservation;
}

export interface Reservation {
  id: string;
  nomor_reservasi: string;
  tujuan: string;
  keperluan: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  status: string;
  kendaraan?: Vehicle;
  pengemudi?: Driver;
  pemohon?: Applicant;
}

export interface Vehicle {
  id: string;
  kode_kendaraan: string;
  plat_nomor: string;
  merk: string;
  tipe: string;
  warna: string;
}

export interface Driver {
  id: string;
  nama: string;
  no_hp: string;
}

export interface Applicant {
  id: string;
  name: string;
  email: string;
}

export interface ApprovalFormData {
  catatan: string;
}

export interface ApprovalTableProps {
  level: number;
}

export interface ApprovalBadgeProps {
  status: string;
}

export interface ApprovalActionModalProps {
  open: boolean;
  type: "approve" | "reject";
  loading: boolean;
  formData: ApprovalFormData;
  onChange: ( e: React.ChangeEvent<HTMLTextAreaElement> ) => void;
  onClose: () => void;
  onSubmit: ( e: React.FormEvent ) => void;
}

export interface ApprovalDetailModalProps {
  open: boolean;
  approval: Approval | null;
  onClose: () => void;
}

export interface AlertInfo {
  show: boolean;
  variant:| "success"  | "error"  | "warning"  | "info";
  title: string;
  message: string;
}