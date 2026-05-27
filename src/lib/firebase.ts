import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Detect if configuration is set with real variables rather than placeholders
export const isFirebaseConfigured = 
  firebaseConfig && 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== 'placeholder-api-key' &&
  firebaseConfig.projectId !== 'placeholder-project' &&
  (typeof window !== 'undefined' && localStorage.getItem('ysj_sandbox_mode') !== 'true');

// Safe Initialization to prevent crashes when using dummy placeholder values during setup
let app;
let dbInstance;
let authInstance;

try {
  if (isFirebaseConfigured) {
    app = initializeApp(firebaseConfig);
    // CRITICAL: Must pass databaseId if custom, otherwise defaults
    dbInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
    authInstance = getAuth(app);
    
    // Validate connection asynchronously
    getDocFromServer(doc(dbInstance, 'test', 'connection')).catch((_err) => {
      // Graceful background verification
    });
  }
} catch (error) {
  console.error('Firebase Initialization failed:', error);
}

export const db = dbInstance;
export const auth = authInstance;

// --- Specialized Structured Error Handlers (Required by SKILL.md) ---

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: authInstance?.currentUser?.uid || null,
      email: authInstance?.currentUser?.email || null,
      emailVerified: authInstance?.currentUser?.emailVerified || null,
      isAnonymous: authInstance?.currentUser?.isAnonymous || null,
      tenantId: authInstance?.currentUser?.tenantId || null,
      providerInfo: authInstance?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  
  console.error('Firestore Error Payload:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
