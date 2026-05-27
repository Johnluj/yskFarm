-- YSJ Poultry Management Suite - Supabase Schema

-- 1. Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'staff' CHECK (role IN ('admin', 'staff', 'md', 'manager')),
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Batches Table
CREATE TABLE batches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  stocking_date DATE NOT NULL,
  initial_quantity INTEGER NOT NULL,
  current_quantity INTEGER NOT NULL,
  initial_feed_qty NUMERIC DEFAULT 0,
  breed TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Daily Reports Table
CREATE TABLE daily_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
  report_date DATE DEFAULT CURRENT_DATE,
  feed_consumed NUMERIC NOT NULL,
  mortality INTEGER NOT NULL,
  medication TEXT,
  observations TEXT,
  staff_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Sales Ledger
CREATE TABLE sales_ledger (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id UUID REFERENCES batches(id) ON DELETE SET NULL,
  sale_date DATE DEFAULT CURRENT_DATE,
  item_name TEXT NOT NULL,
  category TEXT CHECK (category IN ('birds', 'frozen', 'other')),
  quantity INTEGER NOT NULL,
  unit_price NUMERIC NOT NULL,
  total_amount NUMERIC NOT NULL,
  customer_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Maintenance Logs
CREATE TABLE maintenance_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_name TEXT NOT NULL,
  activity TEXT NOT NULL,
  cost NUMERIC NOT NULL,
  log_date DATE DEFAULT CURRENT_DATE,
  staff_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Row Level Security (RLS) Policies

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by all authenticated users" ON profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage all profiles" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Batches
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view batches" ON batches FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage batches" ON batches FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Daily Reports
ALTER TABLE daily_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view daily reports" ON daily_reports FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can add reports" ON daily_reports FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage all reports" ON daily_reports FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Sales Ledger
ALTER TABLE sales_ledger ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view sales" ON sales_ledger FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage sales" ON sales_ledger FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Maintenance Logs
ALTER TABLE maintenance_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view maintenance" ON maintenance_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage maintenance" ON maintenance_logs FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
