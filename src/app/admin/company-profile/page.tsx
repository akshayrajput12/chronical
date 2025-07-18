"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  Eye,
  Save,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  CompanyProfileDocument,
  CompanyProfileFormData,
  CompanyProfileFormState,
  COMPANY_PROFILE_CONSTANTS,
} from "@/types/company-profile";
import { revalidatePathAction } from "@/services/revalidate.action";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function CompanyProfileAdminPage() {
  // State management
  const [documents, setDocuments] = useState<CompanyProfileDocument[]>([]);
  const [currentDocument, setCurrentDocument] = useState<CompanyProfileDocument | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<CompanyProfileFormData>({
    title: COMPANY_PROFILE_CONSTANTS.DEFAULT_TITLE,
    description: "",
    version: COMPANY_PROFILE_CONSTANTS.DEFAULT_VERSION,
    is_active: true,
    is_current: false,
  });
  const [formState, setFormState] = useState<CompanyProfileFormState>({
    isLoading: false,
    isSaving: false,
    isUploading: false,
    isDeleting: false,
    hasChanges: false,
    errors: {},
  });

  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ============================================================================
  // DATA LOADING
  // ============================================================================

  const loadDocuments = async () => {
    try {
      setFormState(prev => ({ ...prev, isLoading: true }));

      const response = await fetch('/api/company-profile');
      const result = await response.json();

      if (result.success) {
        setDocuments(result.data.documents || []);
        setCurrentDocument(result.data.current || null);
      } else {
        toast.error(result.error || 'Failed to load documents');
      }
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  // ============================================================================
  // FILE HANDLING
  // ============================================================================

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return;
    }

    if (file.size > COMPANY_PROFILE_CONSTANTS.MAX_FILE_SIZE) {
      toast.error(`File size must be less than ${COMPANY_PROFILE_CONSTANTS.MAX_FILE_SIZE / (1024 * 1024)}MB`);
      return;
    }

    setSelectedFile(file);
    setFormData(prev => ({
      ...prev,
      title: file.name.replace('.pdf', '') || COMPANY_PROFILE_CONSTANTS.DEFAULT_TITLE,
    }));
    setFormState(prev => ({ ...prev, hasChanges: true }));
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFormState(prev => ({ ...prev, hasChanges: false }));
  };

  // ============================================================================
  // FORM HANDLING
  // ============================================================================

  const handleFormChange = (field: keyof CompanyProfileFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    setFormState(prev => ({ ...prev, hasChanges: true, errors: { ...prev.errors, [field]: '' } }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!selectedFile) {
      errors.file = 'Please select a PDF file';
    }

    setFormState(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  // ============================================================================
  // DOCUMENT OPERATIONS
  // ============================================================================

  const handleUpload = async () => {
    if (!validateForm()) return;

    try {
      setFormState(prev => ({ ...prev, isUploading: true }));

      const uploadFormData = new FormData();
      if (selectedFile) {
        uploadFormData.append('file', selectedFile);
      }
      uploadFormData.append('title', formData.title);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('version', formData.version);
      uploadFormData.append('is_active', formData.is_active.toString());
      uploadFormData.append('is_current', formData.is_current.toString());

      const response = await fetch('/api/company-profile', {
        method: 'POST',
        body: uploadFormData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Company profile uploaded successfully!');
        setShowUploadDialog(false);
        clearSelectedFile();
        setFormData({
          title: COMPANY_PROFILE_CONSTANTS.DEFAULT_TITLE,
          description: "",
          version: COMPANY_PROFILE_CONSTANTS.DEFAULT_VERSION,
          is_active: true,
          is_current: false,
        });
        await loadDocuments();
        
        // Revalidate pages that might display company profile
        await revalidatePathAction('/');
        await revalidatePathAction('/about-us');
        await revalidatePathAction('/contact-us');
      } else {
        toast.error(result.error || 'Failed to upload document');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    } finally {
      setFormState(prev => ({ ...prev, isUploading: false, hasChanges: false }));
    }
  };

  const handleSetCurrent = async (documentId: string) => {
    try {
      setFormState(prev => ({ ...prev, isSaving: true }));

      const response = await fetch(`/api/company-profile?id=${documentId}&action=set_current`, {
        method: 'PUT',
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Document set as current successfully!');
        await loadDocuments();
        
        // Revalidate pages that might display company profile
        await revalidatePathAction('/');
        await revalidatePathAction('/about-us');
        await revalidatePathAction('/contact-us');
      } else {
        toast.error(result.error || 'Failed to set document as current');
      }
    } catch (error) {
      console.error('Error setting current document:', error);
      toast.error('Failed to set document as current');
    } finally {
      setFormState(prev => ({ ...prev, isSaving: false }));
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      return;
    }

    try {
      setFormState(prev => ({ ...prev, isDeleting: true }));

      const response = await fetch(`/api/company-profile?id=${documentId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Document deleted successfully!');
        await loadDocuments();
        
        // Revalidate pages that might display company profile
        await revalidatePathAction('/');
        await revalidatePathAction('/about-us');
        await revalidatePathAction('/contact-us');
      } else {
        toast.error(result.error || 'Failed to delete document');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    } finally {
      setFormState(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      className="container mx-auto p-6 space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Company Profile Management</h1>
            <p className="text-gray-600 mt-2">
              Manage company profile PDF documents for footer download
            </p>
          </div>
          
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button className="bg-[#a5cd39] hover:bg-[#8fb32a] text-white">
                <Upload className="w-4 h-4 mr-2" />
                Upload New Document
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Upload Company Profile</DialogTitle>
                <DialogDescription>
                  Upload a new company profile PDF document
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* File Upload */}
                <div>
                  <Label htmlFor="file-upload">PDF Document *</Label>
                  <div className="mt-2">
                    <input
                      ref={fileInputRef}
                      id="file-upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {selectedFile ? selectedFile.name : 'Choose PDF File'}
                    </Button>
                    {selectedFile && (
                      <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                        <span>{formatFileSize(selectedFile.size)}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={clearSelectedFile}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  {formState.errors.file && (
                    <p className="text-red-500 text-sm mt-1">{formState.errors.file}</p>
                  )}
                </div>

                {/* Title */}
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleFormChange('title', e.target.value)}
                    placeholder="Company Profile"
                  />
                  {formState.errors.title && (
                    <p className="text-red-500 text-sm mt-1">{formState.errors.title}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    placeholder="Brief description of the document"
                    rows={3}
                  />
                </div>

                {/* Version */}
                <div>
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    value={formData.version}
                    onChange={(e) => handleFormChange('version', e.target.value)}
                    placeholder="1.0"
                  />
                </div>

                {/* Settings */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_active">Active</Label>
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => handleFormChange('is_active', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_current">Set as Current</Label>
                    <Switch
                      id="is_current"
                      checked={formData.is_current}
                      onCheckedChange={(checked) => handleFormChange('is_current', checked)}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleUpload}
                    disabled={formState.isUploading || !formState.hasChanges}
                    className="flex-1 bg-[#a5cd39] hover:bg-[#8fb32a] text-white"
                  >
                    {formState.isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Upload Document
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setShowUploadDialog(false)}
                    disabled={formState.isUploading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Current Document Status */}
      {currentDocument && (
        <motion.div variants={itemVariants}>
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <CardTitle className="text-green-800">Current Active Document</CardTitle>
              </div>
              <CardDescription className="text-green-700">
                This document is currently available for download in the footer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-green-800">{currentDocument.title}</h3>
                  <p className="text-sm text-green-600">
                    Version {currentDocument.version} • {formatFileSize(currentDocument.file_size)} •
                    Uploaded {formatDate(currentDocument.created_at)}
                  </p>
                  {currentDocument.description && (
                    <p className="text-sm text-green-600 mt-1">{currentDocument.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const url = `/api/company-profile?current=true`;
                      fetch(url)
                        .then(res => res.json())
                        .then(data => {
                          if (data.success && data.data.downloadUrl) {
                            window.open(data.data.downloadUrl, '_blank');
                          }
                        });
                    }}
                    className="border-green-300 text-green-700 hover:bg-green-100"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const url = `/api/company-profile?current=true`;
                      fetch(url)
                        .then(res => res.json())
                        .then(data => {
                          if (data.success && data.data.downloadUrl) {
                            const link = document.createElement('a');
                            link.href = data.data.downloadUrl;
                            link.download = currentDocument.original_filename;
                            link.click();
                          }
                        });
                    }}
                    className="border-green-300 text-green-700 hover:bg-green-100"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Documents List */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              All Documents ({documents.length})
            </CardTitle>
            <CardDescription>
              Manage all company profile documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            {formState.isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a5cd39]" />
                <span className="ml-2 text-gray-600">Loading documents...</span>
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No documents uploaded</h3>
                <p className="text-gray-600 mb-4">
                  Upload your first company profile document to get started
                </p>
                <Button
                  onClick={() => setShowUploadDialog(true)}
                  className="bg-[#a5cd39] hover:bg-[#8fb32a] text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className={`border rounded-lg p-4 ${
                      doc.is_current ? 'border-green-300 bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                          <div className="flex gap-1">
                            {doc.is_current && (
                              <Badge variant="default" className="bg-green-600">
                                Current
                              </Badge>
                            )}
                            {doc.is_active ? (
                              <Badge variant="default" className="bg-blue-600">
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                Inactive
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <span className="font-medium">File:</span> {doc.original_filename}
                            ({formatFileSize(doc.file_size)})
                          </p>
                          <p>
                            <span className="font-medium">Version:</span> {doc.version}
                          </p>
                          <p>
                            <span className="font-medium">Uploaded:</span> {formatDate(doc.created_at)}
                          </p>
                          {doc.description && (
                            <p>
                              <span className="font-medium">Description:</span> {doc.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const url = `/api/company-profile?id=${doc.id}`;
                            fetch(url)
                              .then(res => res.json())
                              .then(data => {
                                if (data.success && data.data.downloadUrl) {
                                  window.open(data.data.downloadUrl, '_blank');
                                }
                              });
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const url = `/api/company-profile?id=${doc.id}`;
                            fetch(url)
                              .then(res => res.json())
                              .then(data => {
                                if (data.success && data.data.downloadUrl) {
                                  const link = document.createElement('a');
                                  link.href = data.data.downloadUrl;
                                  link.download = doc.original_filename || 'document';
                                  link.click();
                                }
                              });
                          }}
                        >
                          <Download className="w-4 h-4" />
                        </Button>

                        {!doc.is_current && doc.is_active && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetCurrent(doc.id)}
                            disabled={formState.isSaving}
                            className="border-green-300 text-green-700 hover:bg-green-100"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Set Current
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(doc.id)}
                          disabled={formState.isDeleting}
                          className="border-red-300 text-red-700 hover:bg-red-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Help Section */}
      <motion.div variants={itemVariants}>
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <AlertCircle className="w-5 h-5" />
              How it Works
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700">
            <div className="space-y-2 text-sm">
              <p>• Upload PDF documents up to 100MB in size</p>
              <p>• Only one document can be "Current" at a time - this appears in the footer download</p>
              <p>• Documents must be marked as "Active" to be available for download</p>
              <p>• When you upload a new document or change the current one, the footer updates automatically</p>
              <p>• Deleted documents are permanently removed from storage</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
