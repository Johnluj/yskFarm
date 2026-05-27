export type UserRole = 'admin' | 'staff' | 'md' | 'manager';

export interface AdminProfile {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string;
  created_at: string;
}

export interface Batch {
  id: string;
  name: string;
  stocking_date: string;
  initial_quantity: number;
  current_quantity: number;
  initial_feed_qty?: number;
  breed: string;
  status: 'active' | 'completed' | 'archived';
  created_at: string;
}

export interface DailyReport {
  id: string;
  batch_id: string;
  report_date: string;
  feed_consumed: number; // in kg
  mortality: number;
  medication?: string;
  observations?: string;
  staff_id: string;
  created_at: string;
}

export interface SalesEntry {
  id: string;
  batch_id?: string;
  sale_date: string;
  item_name: string;
  category: 'birds' | 'frozen' | 'other';
  quantity: number;
  unit_price: number;
  total_amount: number;
  customer_name?: string;
  created_at: string;
}

export interface MaintenanceLog {
  id: string;
  item_name: string;
  activity: string;
  cost: number;
  log_date: string;
  staff_id: string;
}
