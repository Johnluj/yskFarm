import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { Batch, DailyReport, SalesEntry, MaintenanceLog, AdminProfile } from '../types/admin';

// Unified helper to generate string database IDs
const generateId = () => {
  return Math.random().toString(36).substring(2, 11);
};

// 1. Profiles API
export const getFirebaseProfile = async (uid: string): Promise<AdminProfile | null> => {
  const path = `profiles/${uid}`;
  try {
    if (!db) return null;
    const docRef = doc(db, 'profiles', uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as AdminProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
};

export const getFirebaseProfiles = async (): Promise<AdminProfile[]> => {
  const path = 'profiles';
  try {
    if (!db) return [];
    const q = query(collection(db, 'profiles'), orderBy('role', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as AdminProfile);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
};

export const saveFirebaseProfile = async (profile: AdminProfile): Promise<void> => {
  const path = `profiles/${profile.id}`;
  try {
    if (!db) return;
    const docRef = doc(db, 'profiles', profile.id);
    
    // Strict schema structure to adhere to rule: data.keys().size() == 5
    const payload = {
      id: profile.id,
      email: profile.email.toLowerCase(),
      role: profile.role || 'staff',
      full_name: profile.full_name || profile.email.split('@')[0],
      created_at: profile.created_at || new Date().toISOString()
    };

    await setDoc(docRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const deleteFirebaseProfile = async (uid: string): Promise<void> => {
  const path = `profiles/${uid}`;
  try {
    if (!db) return;
    await deleteDoc(doc(db, 'profiles', uid));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};


// 2. Batches API
export const getFirebaseBatches = async (): Promise<Batch[]> => {
  const path = 'batches';
  try {
    if (!db) return [];
    const q = query(collection(db, 'batches'), orderBy('created_at', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as Batch);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
};

export const saveFirebaseBatch = async (
  newBatch: Omit<Batch, 'id' | 'created_at'> & { id?: string; created_at?: string }
): Promise<Batch> => {
  const id = newBatch.id || generateId();
  const path = `batches/${id}`;
  try {
    if (!db) throw new Error("Database not connected");
    const docRef = doc(db, 'batches', id);
    
    // Strict schema structure to adhere to rule: data.keys().size() == 9
    const payload: Batch = {
      id,
      name: String(newBatch.name).substring(0, 200),
      stocking_date: newBatch.stocking_date,
      initial_quantity: Math.max(0, Math.floor(Number(newBatch.initial_quantity))),
      current_quantity: Math.max(0, Math.floor(Number(newBatch.current_quantity ?? newBatch.initial_quantity))),
      initial_feed_qty: Math.max(0, Number(newBatch.initial_feed_qty || 0)),
      breed: String(newBatch.breed).substring(0, 50),
      status: (newBatch.status || 'active') as 'active' | 'completed' | 'archived',
      created_at: newBatch.created_at || new Date().toISOString()
    };

    await setDoc(docRef, payload);
    return payload;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const updateFirebaseBatchStatus = async (
  id: string, 
  status: 'active' | 'completed' | 'archived'
): Promise<void> => {
  const path = `batches/${id}`;
  try {
    if (!db) return;
    const docRef = doc(db, 'batches', id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) throw new Error("Batch not found");
    
    const existing = snap.data() as Batch;
    const payload: Batch = {
      ...existing,
      status
    };
    await setDoc(docRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

export const updateFirebaseBatchQty = async (
  id: string, 
  newQty: number
): Promise<void> => {
  const path = `batches/${id}`;
  try {
    if (!db) return;
    const docRef = doc(db, 'batches', id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) throw new Error("Batch not found");
    
    const existing = snap.data() as Batch;
    const payload: Batch = {
      ...existing,
      current_quantity: Math.max(0, Math.floor(Number(newQty)))
    };
    await setDoc(docRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};


// 3. Daily Reports API
export const getFirebaseReports = async (): Promise<DailyReport[]> => {
  const path = 'daily_reports';
  try {
    if (!db) return [];
    const q = query(collection(db, 'daily_reports'), orderBy('report_date', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as DailyReport);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
};

export const saveFirebaseReport = async (
  newReport: Omit<DailyReport, 'id' | 'created_at' | 'staff_id'> & { id?: string; created_at?: string; staff_id?: string }
): Promise<DailyReport> => {
  const id = newReport.id || generateId();
  const path = `daily_reports/${id}`;
  try {
    if (!db) throw new Error("Database not connected");
    const docRef = doc(db, 'daily_reports', id);
    
    const staff_id = newReport.staff_id || auth?.currentUser?.uid || 'anonymous';
    
    // Strict schema structure to adhere to rule: data.keys().size() == 9
    const payload: DailyReport = {
      id,
      batch_id: newReport.batch_id,
      report_date: newReport.report_date,
      feed_consumed: Math.max(0, Number(newReport.feed_consumed || 0)),
      mortality: Math.max(0, Math.floor(Number(newReport.mortality || 0))),
      medication: String(newReport.medication || '').substring(0, 1000),
      observations: String(newReport.observations || '').substring(0, 2000),
      staff_id,
      created_at: newReport.created_at || new Date().toISOString()
    };

    await setDoc(docRef, payload);

    // Update batch quantity synchronously locally if mortality occurred
    if (payload.mortality > 0) {
      try {
        const batchRef = doc(db, 'batches', payload.batch_id);
        const batchSnap = await getDoc(batchRef);
        if (batchSnap.exists()) {
          const batch = batchSnap.data() as Batch;
          const updatedPayload: Batch = {
            ...batch,
            current_quantity: Math.max(0, batch.current_quantity - payload.mortality)
          };
          await setDoc(batchRef, updatedPayload);
        }
      } catch (bErr) {
        console.warn("Failed to synchronize mortality count to batch:", bErr);
      }
    }

    return payload;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};


// 4. Sales Ledger API
export const getFirebaseSales = async (): Promise<SalesEntry[]> => {
  const path = 'sales_ledger';
  try {
    if (!db) return [];
    const q = query(collection(db, 'sales_ledger'), orderBy('sale_date', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as SalesEntry);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
};

export const saveFirebaseSale = async (
  newSale: Omit<SalesEntry, 'id' | 'created_at'> & { id?: string; created_at?: string }
): Promise<SalesEntry> => {
  const id = newSale.id || generateId();
  const path = `sales_ledger/${id}`;
  try {
    if (!db) throw new Error("Database not connected");
    const docRef = doc(db, 'sales_ledger', id);
    
    // Strict schema structure to satisfy rule:
    // keys.size() == 9 (no batch_id) OR keys.size() == 10 (with batch_id)
    const payload: SalesEntry = {
      id,
      sale_date: newSale.sale_date,
      item_name: String(newSale.item_name).substring(0, 200),
      category: (newSale.category || 'other') as 'birds' | 'frozen' | 'other',
      quantity: Math.max(0, Math.floor(Number(newSale.quantity))),
      unit_price: Math.max(0, Number(newSale.unit_price)),
      total_amount: Math.max(0, Number(newSale.total_amount)),
      customer_name: String(newSale.customer_name || 'Generic Buyer').substring(0, 200),
      created_at: newSale.created_at || new Date().toISOString()
    };

    if (newSale.batch_id) {
      payload.batch_id = newSale.batch_id;
    }

    await setDoc(docRef, payload);

    // Update batch quantity if category is birds and batch exists
    if (payload.category === 'birds' && payload.batch_id) {
      try {
        const batchRef = doc(db, 'batches', payload.batch_id);
        const batchSnap = await getDoc(batchRef);
        if (batchSnap.exists()) {
          const batch = batchSnap.data() as Batch;
          const updatedPayload: Batch = {
            ...batch,
            current_quantity: Math.max(0, batch.current_quantity - payload.quantity)
          };
          await setDoc(batchRef, updatedPayload);
        }
      } catch (bErr) {
        console.warn("Failed to synchronize sales count to batch:", bErr);
      }
    }

    return payload;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};


// 5. Maintenance Logs API
export const getFirebaseLogs = async (): Promise<MaintenanceLog[]> => {
  const path = 'maintenance_logs';
  try {
    if (!db) return [];
    const q = query(collection(db, 'maintenance_logs'), orderBy('log_date', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as MaintenanceLog);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
};

export const saveFirebaseLog = async (
  newLog: Omit<MaintenanceLog, 'id' | 'staff_id'> & { id?: string; staff_id?: string }
): Promise<MaintenanceLog> => {
  const id = newLog.id || generateId();
  const path = `maintenance_logs/${id}`;
  try {
    if (!db) throw new Error("Database not connected");
    const docRef = doc(db, 'maintenance_logs', id);
    const staff_id = newLog.staff_id || auth?.currentUser?.uid || 'anonymous';
    
    // Strict schema structure to adhere to rule: data.keys().size() == 6
    const payload: MaintenanceLog = {
      id,
      item_name: String(newLog.item_name).substring(0, 200),
      activity: String(newLog.activity).substring(0, 2000),
      log_date: newLog.log_date,
      cost: Math.max(0, Number(newLog.cost)),
      staff_id
    };

    await setDoc(docRef, payload);
    return payload;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

// 6. Reset Firestore database (Delete all docs)
export const resetAllFirebaseData = async (): Promise<void> => {
  try {
    if (!db) return;
    const collectionsToReset = ['batches', 'daily_reports', 'sales_ledger', 'maintenance_logs'];
    
    for (const col of collectionsToReset) {
      const colRef = collection(db, col);
      const snap = await getDocs(colRef);
      for (const d of snap.docs) {
        await deleteDoc(doc(db, col, d.id));
      }
    }
  } catch (error) {
    console.error("Failed resetting data in Firestore:", error);
  }
};
