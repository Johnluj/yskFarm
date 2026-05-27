import { Batch, DailyReport, SalesEntry, MaintenanceLog, AdminProfile } from '../types/admin';

// Beautiful default pre-loaded mock data
const DEFAULT_BATCHES: Batch[] = [
  {
    id: 'b1-oluyole',
    name: 'Batch #101 - Oluyole (Broilers)',
    stocking_date: '2026-05-10',
    initial_quantity: 5000,
    current_quantity: 4950,
    initial_feed_qty: 1200,
    breed: 'broilers',
    status: 'active',
    created_at: new Date('2026-05-10T08:00:00Z').toISOString()
  },
  {
    id: 'b2-akobo',
    name: 'Batch #102 - Akobo (Layers)',
    stocking_date: '2026-05-01',
    initial_quantity: 8000,
    current_quantity: 7890,
    initial_feed_qty: 2500,
    breed: 'layers',
    status: 'active',
    created_at: new Date('2026-05-01T09:00:00Z').toISOString()
  },
  {
    id: 'b3-moniya',
    name: 'Batch #99 - Moniya (Turkey)',
    stocking_date: '2026-04-15',
    initial_quantity: 2500,
    current_quantity: 2410,
    initial_feed_qty: 900,
    breed: 'turkey',
    status: 'archived',
    created_at: new Date('2026-04-15T07:30:00Z').toISOString()
  }
];

const DEFAULT_REPORTS: DailyReport[] = [
  {
    id: 'r1',
    batch_id: 'b1-oluyole',
    report_date: '2026-05-26',
    feed_consumed: 120.5,
    mortality: 2,
    medication: 'Gumboro Vaccine Booster',
    observations: 'Birds are highly active. Feeding rate is optimal.',
    staff_id: 'dev-user',
    created_at: new Date('2026-05-26T17:00:00Z').toISOString()
  },
  {
    id: 'r2',
    batch_id: 'b2-akobo',
    report_date: '2026-05-25',
    feed_consumed: 210.0,
    mortality: 5,
    medication: 'Multi-vitamin soluble powder',
    observations: 'Slight drop in water intake observed due to midday heat. Increased fan speed.',
    staff_id: 'dev-user',
    created_at: new Date('2026-05-25T17:30:00Z').toISOString()
  },
  {
    id: 'r3',
    batch_id: 'b1-oluyole',
    report_date: '2026-05-24',
    feed_consumed: 115.0,
    mortality: 1,
    medication: 'None',
    observations: 'Normal litter moisture and excellent sound levels.',
    staff_id: 'dev-user',
    created_at: new Date('2026-05-24T17:15:00Z').toISOString()
  }
];

const DEFAULT_SALES: SalesEntry[] = [
  {
    id: 's1',
    batch_id: 'b1-oluyole',
    sale_date: '2026-05-26',
    item_name: 'Premium Broilers (Bulk Coop)',
    category: 'birds',
    quantity: 450,
    unit_price: 3200,
    total_amount: 1440000,
    customer_name: 'Ibadan Hotels Corporation',
    created_at: new Date('2026-05-26T11:00:00Z').toISOString()
  },
  {
    id: 's2',
    batch_id: 'b2-akobo',
    sale_date: '2026-05-24',
    item_name: 'Fresh Egg Crates (Size Large)',
    category: 'other',
    quantity: 120,
    unit_price: 2400,
    total_amount: 288000,
    customer_name: 'De-Choice Supermarkets',
    created_at: new Date('2026-05-24T14:30:00Z').toISOString()
  },
  {
    id: 's3',
    batch_id: 'b3-moniya',
    sale_date: '2026-05-20',
    item_name: 'Frozen Turkey Pack (10kg Carton)',
    category: 'frozen',
    quantity: 60,
    unit_price: 25000,
    total_amount: 1500000,
    customer_name: 'Bodija Market Distributing Agent',
    created_at: new Date('2026-05-20T09:15:00Z').toISOString()
  }
];

const DEFAULT_LOGS: MaintenanceLog[] = [
  {
    id: 'm1',
    item_name: 'Pen 4 Automatic Feeders',
    activity: 'Repair of damaged gear assembly and track alignment',
    cost: 45000,
    log_date: '2026-05-22',
    staff_id: 'dev-user'
  },
  {
    id: 'm2',
    item_name: '32KVA backup generator',
    activity: 'Engine oil filter change & general maintenance',
    cost: 85000,
    log_date: '2026-05-18',
    staff_id: 'dev-user'
  },
  {
    id: 'm3',
    item_name: 'Brooder Heating Grid',
    activity: 'Replacement of 4 infrared heating ceramic panels',
    cost: 24000,
    log_date: '2026-05-12',
    staff_id: 'dev-user'
  }
];

const DEFAULT_PROFILES: AdminProfile[] = [
  {
    id: 'dev-user',
    email: 'adeagbojohnluj@gmail.com',
    role: 'admin',
    full_name: 'Adeagbo John (Developer)',
    created_at: new Date('2026-05-27T10:00:00Z').toISOString()
  },
  {
    id: 'p1',
    email: 'sam@ysjfarm.com',
    role: 'manager',
    full_name: 'Samuel Okon',
    created_at: new Date('2026-05-27T10:25:00Z').toISOString()
  },
  {
    id: 'p2',
    email: 'toyin@ysjfarm.com',
    role: 'staff',
    full_name: 'Toyin Alao',
    created_at: new Date('2026-05-27T10:30:00Z').toISOString()
  }
];

// Helper to safely get a unique ID
export const generateId = (): string => {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2, 11);
};

// Batches Storage APIs
export const getLocalBatches = (): Batch[] => {
  const data = localStorage.getItem('ysj_batches');
  if (!data) {
    localStorage.setItem('ysj_batches', JSON.stringify(DEFAULT_BATCHES));
    return DEFAULT_BATCHES;
  }
  return JSON.parse(data);
};

export const saveLocalBatch = (newBatch: Omit<Batch, 'id' | 'created_at'> & { id?: string, created_at?: string }) => {
  const list = getLocalBatches();
  const batch: Batch = {
    ...newBatch,
    id: newBatch.id || generateId(),
    created_at: newBatch.created_at || new Date().toISOString()
  } as Batch;
  const updated = [batch, ...list];
  localStorage.setItem('ysj_batches', JSON.stringify(updated));
  return batch;
};

export const updateLocalBatchStatus = (id: string, status: 'active' | 'completed' | 'archived') => {
  const list = getLocalBatches();
  const updated = list.map(b => b.id === id ? { ...b, status } : b);
  localStorage.setItem('ysj_batches', JSON.stringify(updated));
  return updated;
};

// Daily Reports Storage APIs
export const getLocalReports = (): DailyReport[] => {
  const data = localStorage.getItem('ysj_reports');
  if (!data) {
    localStorage.setItem('ysj_reports', JSON.stringify(DEFAULT_REPORTS));
    return DEFAULT_REPORTS;
  }
  return JSON.parse(data);
};

export const saveLocalReport = (newReport: Omit<DailyReport, 'id' | 'created_at' | 'staff_id'> & { id?: string, created_at?: string, staff_id?: string }) => {
  const list = getLocalReports();
  const report: DailyReport = {
    ...newReport,
    id: newReport.id || generateId(),
    staff_id: newReport.staff_id || 'dev-user',
    created_at: newReport.created_at || new Date().toISOString()
  } as DailyReport;
  const updated = [report, ...list];
  localStorage.setItem('ysj_reports', JSON.stringify(updated));

  // Update current quantity on the batch!
  const batchesList = getLocalBatches();
  const index = batchesList.findIndex(b => b.id === report.batch_id);
  if (index !== -1 && report.mortality > 0) {
    batchesList[index].current_quantity = Math.max(0, batchesList[index].current_quantity - report.mortality);
    localStorage.setItem('ysj_batches', JSON.stringify(batchesList));
  }

  return report;
};

// Sales Ledger Storage APIs
export const getLocalSales = (): SalesEntry[] => {
  const data = localStorage.getItem('ysj_sales');
  if (!data) {
    localStorage.setItem('ysj_sales', JSON.stringify(DEFAULT_SALES));
    return DEFAULT_SALES;
  }
  return JSON.parse(data);
};

export const saveLocalSale = (newSale: Omit<SalesEntry, 'id' | 'created_at'> & { id?: string, created_at?: string }) => {
  const list = getLocalSales();
  const sale: SalesEntry = {
    ...newSale,
    id: newSale.id || generateId(),
    created_at: newSale.created_at || new Date().toISOString()
  } as SalesEntry;
  const updated = [sale, ...list];
  localStorage.setItem('ysj_sales', JSON.stringify(updated));

  // Update current quantity of batch if category is birds
  if (sale.category === 'birds' && sale.batch_id) {
    const batchesList = getLocalBatches();
    const index = batchesList.findIndex(b => b.id === sale.batch_id);
    if (index !== -1) {
      batchesList[index].current_quantity = Math.max(0, batchesList[index].current_quantity - sale.quantity);
      localStorage.setItem('ysj_batches', JSON.stringify(batchesList));
    }
  }

  return sale;
};

// Maintenance Storage APIs
export const getLocalLogs = (): MaintenanceLog[] => {
  const data = localStorage.getItem('ysj_logs');
  if (!data) {
    localStorage.setItem('ysj_logs', JSON.stringify(DEFAULT_LOGS));
    return DEFAULT_LOGS;
  }
  return JSON.parse(data);
};

export const saveLocalLog = (newLog: Omit<MaintenanceLog, 'id' | 'staff_id'> & { id?: string, staff_id?: string }) => {
  const list = getLocalLogs();
  const log: MaintenanceLog = {
    ...newLog,
    id: newLog.id || generateId(),
    staff_id: newLog.staff_id || 'dev-user'
  } as MaintenanceLog;
  const updated = [log, ...list];
  localStorage.setItem('ysj_logs', JSON.stringify(updated));
  return log;
};

// Profiles Storage APIs
export const getLocalProfiles = (): AdminProfile[] => {
  const data = localStorage.getItem('ysj_profiles');
  if (!data) {
    localStorage.setItem('ysj_profiles', JSON.stringify(DEFAULT_PROFILES));
    return DEFAULT_PROFILES;
  }
  return JSON.parse(data);
};

export const saveLocalProfile = (newProfile: AdminProfile) => {
  const list = getLocalProfiles();
  const exists = list.some(p => p.id === newProfile.id || p.email === newProfile.email);
  let updated;
  if (exists) {
    updated = list.map(p => (p.id === newProfile.id || p.email === newProfile.email) ? { ...p, ...newProfile } : p);
  } else {
    updated = [newProfile, ...list];
  }
  localStorage.setItem('ysj_profiles', JSON.stringify(updated));
  return updated;
};

export const deleteLocalProfile = (id: string) => {
  const list = getLocalProfiles();
  const updated = list.filter(p => p.id !== id);
  localStorage.setItem('ysj_profiles', JSON.stringify(updated));
  return updated;
};

export const resetAllLocalData = () => {
  localStorage.setItem('ysj_batches', JSON.stringify(DEFAULT_BATCHES));
  localStorage.setItem('ysj_reports', JSON.stringify(DEFAULT_REPORTS));
  localStorage.setItem('ysj_sales', JSON.stringify(DEFAULT_SALES));
  localStorage.setItem('ysj_logs', JSON.stringify(DEFAULT_LOGS));
  localStorage.setItem('ysj_profiles', JSON.stringify(DEFAULT_PROFILES));
};
