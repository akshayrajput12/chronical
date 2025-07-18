// ============================================================================
// COMPANY PROFILE TYPES
// ============================================================================
// TypeScript types for company profile PDF document management
// Created: 2025-07-18

// ============================================================================
// CORE DOCUMENT TYPES
// ============================================================================

export interface CompanyProfileDocument {
  id: string;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  title: string;
  description?: string;
  version: string;
  is_active: boolean;
  is_current: boolean;
  uploaded_by?: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

// Input type for creating/updating company profile documents
export interface CompanyProfileDocumentInput {
  title: string;
  description?: string;
  version?: string;
  is_active?: boolean;
  is_current?: boolean;
}

// ============================================================================
// UPLOAD TYPES
// ============================================================================

export interface CompanyProfileUploadData {
  file: File;
  title: string;
  description?: string;
  version?: string;
  is_active?: boolean;
  is_current?: boolean;
}

export interface CompanyProfileUploadResponse {
  success: boolean;
  data?: {
    document: CompanyProfileDocument;
    url: string;
    path: string;
  };
  error?: string;
}

export interface CompanyProfileDeleteResponse {
  success: boolean;
  error?: string;
}

// ============================================================================
// ADMIN FORM TYPES
// ============================================================================

export interface CompanyProfileFormData {
  title: string;
  description: string;
  version: string;
  is_active: boolean;
  is_current: boolean;
}

export interface CompanyProfileFormState {
  isLoading: boolean;
  isSaving: boolean;
  isUploading: boolean;
  isDeleting: boolean;
  hasChanges: boolean;
  errors: Record<string, string>;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface CompanyProfileApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CompanyProfileListResponse {
  success: boolean;
  data?: {
    documents: CompanyProfileDocument[];
    total: number;
    current?: CompanyProfileDocument;
  };
  error?: string;
}

// ============================================================================
// STORAGE TYPES
// ============================================================================

export type CompanyProfileStorageBucket = 'company-profile-documents';

export interface CompanyProfileStorageConfig {
  bucket: CompanyProfileStorageBucket;
  maxFileSize: number; // in bytes
  allowedTypes: string[];
  isPublic: boolean;
}

export const COMPANY_PROFILE_STORAGE_CONFIG: Record<CompanyProfileStorageBucket, CompanyProfileStorageConfig> = {
  'company-profile-documents': {
    bucket: 'company-profile-documents',
    maxFileSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: ['application/pdf'],
    isPublic: true
  }
};

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface CompanyProfileValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface CompanyProfileFileValidation {
  isValid: boolean;
  error?: string;
  size?: number;
  type?: string;
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export interface CompanyProfileNotification {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

// ============================================================================
// ADMIN MANAGEMENT TYPES
// ============================================================================

export interface CompanyProfileAdminStats {
  totalDocuments: number;
  activeDocuments: number;
  currentDocument?: CompanyProfileDocument;
  lastUpload?: string;
  totalSize: number; // in bytes
}

export interface CompanyProfileAdminAction {
  type: 'upload' | 'update' | 'delete' | 'activate' | 'set_current';
  documentId?: string;
  data?: any;
}

// ============================================================================
// FOOTER INTEGRATION TYPES
// ============================================================================

export interface CompanyProfileDownloadInfo {
  available: boolean;
  document?: CompanyProfileDocument;
  downloadUrl?: string;
  error?: string;
}

// ============================================================================
// SERVICE TYPES
// ============================================================================

export interface CompanyProfileServiceMethods {
  getCurrentDocument(): Promise<CompanyProfileDocument | null>;
  getAllDocuments(): Promise<CompanyProfileDocument[]>;
  uploadDocument(data: CompanyProfileUploadData): Promise<CompanyProfileUploadResponse>;
  updateDocument(id: string, data: CompanyProfileDocumentInput): Promise<CompanyProfileApiResponse<CompanyProfileDocument>>;
  deleteDocument(id: string): Promise<CompanyProfileDeleteResponse>;
  setCurrentDocument(id: string): Promise<CompanyProfileApiResponse<boolean>>;
  getDownloadUrl(document: CompanyProfileDocument): string;
  validateFile(file: File): CompanyProfileFileValidation;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type CompanyProfileDocumentStatus = 'active' | 'inactive' | 'current';

export interface CompanyProfileFilter {
  status?: CompanyProfileDocumentStatus;
  search?: string;
  sortBy?: 'created_at' | 'updated_at' | 'title' | 'file_size';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export class CompanyProfileError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'CompanyProfileError';
  }
}

export interface CompanyProfileErrorDetails {
  field?: string;
  code: string;
  message: string;
  details?: any;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const COMPANY_PROFILE_CONSTANTS = {
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  ALLOWED_MIME_TYPES: ['application/pdf'],
  ALLOWED_EXTENSIONS: ['.pdf'],
  DEFAULT_TITLE: 'Company Profile',
  DEFAULT_VERSION: '1.0',
  STORAGE_BUCKET: 'company-profile-documents' as CompanyProfileStorageBucket,
} as const;

// ============================================================================
// TYPE GUARDS
// ============================================================================

export function isCompanyProfileDocument(obj: any): obj is CompanyProfileDocument {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.filename === 'string' &&
    typeof obj.file_path === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.is_active === 'boolean' &&
    typeof obj.is_current === 'boolean'
  );
}

export function isValidPdfFile(file: File): boolean {
  return (
    file.type === 'application/pdf' &&
    file.size > 0 &&
    file.size <= COMPANY_PROFILE_CONSTANTS.MAX_FILE_SIZE
  );
}
