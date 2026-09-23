import { UserRole } from "@/lib/constants/roles";
export enum SavingType {
  POKOK = "POKOK",
  WAJIB = "WAJIB",
  SUKARELA = "SUKARELA",
}

export enum LoanStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  ACTIVE = 'ACTIVE',
  REJECTED = "REJECTED",
  PAID = "PAID",
}

export enum TransactionType {
  DEBIT = "DEBIT",
  CREDIT = "CREDIT",
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  pin: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

export interface Member {
  id: string;
  nik: string;
  name: string;
  address: string;
  phone_number: string;
  balance: number; 
  created_at: string;
  updated_at: string | null;
}

export interface Saving {
  id: string;
  member_id: string; 
  amount: number;
  type: SavingType;
  created_at: string;
  updated_at: string | null;
  member?: Member;
}

export interface Loan {
  id: string;
  member_id: string; 
  member_name: string;
  amount: number; 
  interest_rate: number;
  tenor: number; 
  remaining_amount: number; 
  monthly_payment: number; 
  status: LoanStatus;
  approved_by: string | null; 
  created_at: string;
  updated_at: string | null;
  member?: Member;
  approvedBy?: User;
}

export interface Installment {
  id: string;
  loan_id: string; 
  installment_number: number; 
  amount: number; 
  paid_at: string | null;
  loan?: Loan;
}

export interface MemberTransaction {
  id: string;
  member_id: string; 
  amount: number;
  type: TransactionType;
  description: string;
  created_at: string;
  member?: Member;
}

export interface AuditLog {
  id: string;
  action: string;
  user_id: string;
  ip_address: string;
  metadata: any; 
  created_at: string;
  user?: User;
}
