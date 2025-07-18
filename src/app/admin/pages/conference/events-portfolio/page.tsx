"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Image as ImageIcon,
  Star,
  StarOff,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  EventsPortfolioImage,
  EventsPortfolioFormData,
  EventsPortfolioFormState,
  EventsPortfolioFilter,
  EventType,
  EVENT_TYPES,
  EVENTS_PORTFOLIO_CONSTANTS,
} from "@/types/events-portfolio";
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

export default function EventsPortfolioAdminPage() {
  // State management
  const [filteredImages, setFilteredImages] = useState<EventsPortfolioImage[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<EventsPortfolioFormData>({
    title: "",
    description: "",
    alt_text: "",
    caption: "",
    event_name: "", // Keep for compatibility but won't be used in form
    event_date: "", // Keep for compatibility but won't be used in form
    event_location: "", // Keep for compatibility but won't be used in form
    event_type: "conference", // Always conference for this admin section
    is_active: true,
    is_featured: false,
    display_order: 0,
    tags: [], // Keep for compatibility but won't be used in form
    seo_keywords: "", // Keep for compatibility but won't be used in form
  });
  const [formState, setFormState] = useState<EventsPortfolioFormState>({
    isLoading: false,
    isSaving: false,
    isUploading: false,
    isDeleting: false,
    isReordering: false,
    hasChanges: false,
    errors: {},
  });
  const [filter, setFilter] = useState<EventsPortfolioFilter>({
    is_active: undefined,
    is_featured: undefined,
    event_type: undefined,
    search: "",
    sortBy: "display_order",
    sortOrder: "asc",
  });
  const [editingImage, setEditingImage] = useState<EventsPortfolioImage | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [stats, setStats] = useState({
    totalImages: 0,
    activeImages: 0,
    featuredImages: 0,
    totalSize: 0,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ============================================================================
  // DATA LOADING
  // ============================================================================

  const loadImages = useCallback(async () => {
    console.log('loadImages called - setFilteredImages is:', typeof setFilteredImages);
    try {
      setFormState(prev => ({ ...prev, isLoading: true }));

      const params = new URLSearchParams();
      if (filter.is_active !== undefined) params.append('active_only', filter.is_active.toString());
      if (filter.is_featured !== undefined) params.append('featured_only', filter.is_featured.toString());
      // Always filter for conference events in this admin section
      params.append('event_type', 'conference');
      if (filter.search) params.append('search', filter.search);
      params.append('sort_by', filter.sortBy || 'display_order');
      params.append('sort_order', filter.sortOrder || 'asc');

      const response = await fetch(`/api/events-portfolio?${params}`);
      const result = await response.json();

      if (result.success) {
        setFilteredImages(result.data.images || []);
        updateStats(result.data.images || []);
      } else {
        toast.error(result.error || 'Failed to load images');
      }
    } catch (error) {
      console.error('Error loading images:', error);
      toast.error('Failed to load images');
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }));
    }
  }, [filter]);

  const updateStats = (imageList: EventsPortfolioImage[]) => {
    setStats({
      totalImages: imageList.length,
      activeImages: imageList.filter(img => img.is_active).length,
      featuredImages: imageList.filter(img => img.is_featured && img.is_active).length,
      totalSize: imageList.reduce((sum, img) => sum + img.file_size, 0),
    });
  };

  useEffect(() => {
    loadImages();
  }, [filter, loadImages]);

  // ============================================================================
  // FILE HANDLING
  // ============================================================================

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!EVENTS_PORTFOLIO_CONSTANTS.ALLOWED_MIME_TYPES.includes(file.type as any)) {
      toast.error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
      return;
    }

    if (file.size > EVENTS_PORTFOLIO_CONSTANTS.MAX_FILE_SIZE) {
      toast.error(`File size must be less than ${EVENTS_PORTFOLIO_CONSTANTS.MAX_FILE_SIZE / (1024 * 1024)}MB`);
      return;
    }

    setSelectedFile(file);
    setFormData(prev => ({
      ...prev,
      title: file.name.replace(/\.[^/.]+$/, '') || EVENTS_PORTFOLIO_CONSTANTS.DEFAULT_TITLE,
      alt_text: file.name.replace(/\.[^/.]+$/, '') || EVENTS_PORTFOLIO_CONSTANTS.DEFAULT_ALT_TEXT,
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

  const handleFormChange = (field: keyof EventsPortfolioFormData, value: any) => {
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

    if (!formData.alt_text.trim()) {
      errors.alt_text = 'Alt text is required';
    }

    if (!selectedFile && !editingImage) {
      errors.file = 'Please select an image file';
    }

    if (formData.event_date && isNaN(Date.parse(formData.event_date))) {
      errors.event_date = 'Invalid date format';
    }

    setFormState(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      alt_text: "",
      caption: "",
      event_name: "", // Keep for compatibility
      event_date: "", // Keep for compatibility
      event_location: "", // Keep for compatibility
      event_type: "conference", // Always conference
      is_active: true,
      is_featured: false,
      display_order: 0,
      tags: [], // Keep for compatibility
      seo_keywords: "", // Keep for compatibility
    });
    clearSelectedFile();
    setEditingImage(null);
    setFormState(prev => ({ ...prev, hasChanges: false, errors: {} }));
  };

  // ============================================================================
  // IMAGE OPERATIONS
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
      uploadFormData.append('alt_text', formData.alt_text);
      uploadFormData.append('caption', formData.caption);
      uploadFormData.append('event_type', 'conference'); // Always set as conference
      uploadFormData.append('is_active', formData.is_active.toString());
      uploadFormData.append('is_featured', formData.is_featured.toString());
      uploadFormData.append('display_order', formData.display_order.toString());

      const response = await fetch('/api/events-portfolio', {
        method: 'POST',
        body: uploadFormData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Image uploaded successfully!');
        setShowUploadDialog(false);
        resetForm();
        await loadImages();
        
        // Revalidate pages that might display portfolio
        await revalidatePathAction('/');
        await revalidatePathAction('/conference-organizers-in-dubai-uae');
      } else {
        toast.error(result.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setFormState(prev => ({ ...prev, isUploading: false, hasChanges: false }));
    }
  };

  const handleEdit = async () => {
    if (!editingImage || !validateForm()) return;

    try {
      setFormState(prev => ({ ...prev, isSaving: true }));

      const response = await fetch(`/api/events-portfolio?id=${editingImage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          alt_text: formData.alt_text,
          caption: formData.caption,
          event_type: 'conference', // Always conference
          is_active: formData.is_active,
          is_featured: formData.is_featured,
          display_order: formData.display_order,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Image updated successfully!');
        setShowEditDialog(false);
        resetForm();
        await loadImages();
        
        // Revalidate pages that might display portfolio
        await revalidatePathAction('/');
        await revalidatePathAction('/conference-organizers-in-dubai-uae');
      } else {
        toast.error(result.error || 'Failed to update image');
      }
    } catch (error) {
      console.error('Error updating image:', error);
      toast.error('Failed to update image');
    } finally {
      setFormState(prev => ({ ...prev, isSaving: false, hasChanges: false }));
    }
  };

  const handleToggleFeatured = async (imageId: string) => {
    try {
      setFormState(prev => ({ ...prev, isSaving: true }));

      const response = await fetch(`/api/events-portfolio?id=${imageId}&action=toggle_featured`, {
        method: 'PUT',
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Featured status updated!');
        await loadImages();
        
        // Revalidate pages that might display portfolio
        await revalidatePathAction('/');
        await revalidatePathAction('/conference-organizers-in-dubai-uae');
      } else {
        toast.error(result.error || 'Failed to update featured status');
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast.error('Failed to update featured status');
    } finally {
      setFormState(prev => ({ ...prev, isSaving: false }));
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      return;
    }

    try {
      setFormState(prev => ({ ...prev, isDeleting: true }));

      const response = await fetch(`/api/events-portfolio?id=${imageId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Image deleted successfully!');
        await loadImages();
        
        // Revalidate pages that might display portfolio
        await revalidatePathAction('/');
        await revalidatePathAction('/conference-organizers-in-dubai-uae');
      } else {
        toast.error(result.error || 'Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    } finally {
      setFormState(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const openEditDialog = (image: EventsPortfolioImage) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      description: image.description || "",
      alt_text: image.alt_text,
      caption: image.caption || "",
      event_name: "", // Not used in conference admin
      event_date: "", // Not used in conference admin
      event_location: "", // Not used in conference admin
      event_type: "conference", // Always conference
      is_active: image.is_active,
      is_featured: image.is_featured,
      display_order: image.display_order,
      tags: [], // Not used in conference admin
      seo_keywords: "", // Not used in conference admin
    });
    setShowEditDialog(true);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
            <h1 className="text-3xl font-bold text-gray-900">Conference Portfolio Management</h1>
            <p className="text-gray-600 mt-2">
              Manage images for the conference portfolio section
            </p>
          </div>
          
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button className="bg-[#a5cd39] hover:bg-[#8fb32a] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Conference Portfolio
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Conference Portfolio Image</DialogTitle>
                <DialogDescription>
                  Add a new image to the conference portfolio section
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* File Upload */}
                <div>
                  <Label htmlFor="file-upload">Image File *</Label>
                  <div className="mt-2">
                    <input
                      ref={fileInputRef}
                      id="file-upload"
                      type="file"
                      accept="image/*"
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
                      {selectedFile ? selectedFile.name : 'Choose Image File'}
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
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                  {formState.errors.file && (
                    <p className="text-red-500 text-sm mt-1">{formState.errors.file}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Title */}
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleFormChange('title', e.target.value)}
                      placeholder="Image title"
                    />
                    {formState.errors.title && (
                      <p className="text-red-500 text-sm mt-1">{formState.errors.title}</p>
                    )}
                  </div>

                  {/* Alt Text */}
                  <div>
                    <Label htmlFor="alt_text">Alt Text *</Label>
                    <Input
                      id="alt_text"
                      value={formData.alt_text}
                      onChange={(e) => handleFormChange('alt_text', e.target.value)}
                      placeholder="Alt text for accessibility"
                    />
                    {formState.errors.alt_text && (
                      <p className="text-red-500 text-sm mt-1">{formState.errors.alt_text}</p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    placeholder="Brief description of the conference image"
                    rows={3}
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
                    <Label htmlFor="is_featured">Featured</Label>
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => handleFormChange('is_featured', checked)}
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
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
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

          {/* Edit Dialog */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Conference Portfolio Image</DialogTitle>
                <DialogDescription>
                  Update the conference portfolio image details
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Title */}
                  <div>
                    <Label htmlFor="edit-title">Title *</Label>
                    <Input
                      id="edit-title"
                      value={formData.title}
                      onChange={(e) => handleFormChange('title', e.target.value)}
                      placeholder="Image title"
                    />
                    {formState.errors.title && (
                      <p className="text-red-500 text-sm mt-1">{formState.errors.title}</p>
                    )}
                  </div>

                  {/* Alt Text */}
                  <div>
                    <Label htmlFor="edit-alt_text">Alt Text *</Label>
                    <Input
                      id="edit-alt_text"
                      value={formData.alt_text}
                      onChange={(e) => handleFormChange('alt_text', e.target.value)}
                      placeholder="Alt text for accessibility"
                    />
                    {formState.errors.alt_text && (
                      <p className="text-red-500 text-sm mt-1">{formState.errors.alt_text}</p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    placeholder="Brief description of the conference image"
                    rows={3}
                  />
                </div>

                {/* Caption */}
                <div>
                  <Label htmlFor="edit-caption">Caption</Label>
                  <Input
                    id="edit-caption"
                    value={formData.caption}
                    onChange={(e) => handleFormChange('caption', e.target.value)}
                    placeholder="Image caption"
                  />
                </div>

                {/* Settings */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-is_active">Active</Label>
                    <Switch
                      id="edit-is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => handleFormChange('is_active', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-is_featured">Featured</Label>
                    <Switch
                      id="edit-is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => handleFormChange('is_featured', checked)}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleEdit}
                    disabled={formState.isSaving || !formState.hasChanges}
                    className="flex-1 bg-[#a5cd39] hover:bg-[#8fb32a] text-white"
                  >
                    {formState.isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setShowEditDialog(false)}
                    disabled={formState.isSaving}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Statistics */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <ImageIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Images</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalImages}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Images</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeImages}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Featured Images</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.featuredImages}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Download className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Size</p>
                  <p className="text-2xl font-bold text-gray-900">{formatFileSize(stats.totalSize)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Search images..."
                    value={filter.search || ''}
                    onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="status-filter">Status</Label>
                <Select
                  value={filter.is_active === undefined ? 'all' : filter.is_active.toString()}
                  onValueChange={(value) =>
                    setFilter(prev => ({
                      ...prev,
                      is_active: value === 'all' ? undefined : value === 'true'
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Images</SelectItem>
                    <SelectItem value="true">Active Only</SelectItem>
                    <SelectItem value="false">Inactive Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="featured-filter">Featured</Label>
                <Select
                  value={filter.is_featured === undefined ? 'all' : filter.is_featured.toString()}
                  onValueChange={(value) =>
                    setFilter(prev => ({
                      ...prev,
                      is_featured: value === 'all' ? undefined : value === 'true'
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Images</SelectItem>
                    <SelectItem value="true">Featured Only</SelectItem>
                    <SelectItem value="false">Not Featured</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type-filter">Event Type</Label>
                <Select
                  value={filter.event_type || 'all'}
                  onValueChange={(value) =>
                    setFilter(prev => ({
                      ...prev,
                      event_type: value === 'all' ? undefined : value as EventType
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {Object.entries(EVENT_TYPES).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Images Grid */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Portfolio Images ({filteredImages.length})
            </CardTitle>
            <CardDescription>
              Manage your events portfolio images
            </CardDescription>
          </CardHeader>
          <CardContent>
            {formState.isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a5cd39]" />
                <span className="ml-2 text-gray-600">Loading images...</span>
              </div>
            ) : filteredImages.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
                <p className="text-gray-600 mb-4">
                  {filter.search || filter.event_type || filter.is_active !== undefined || filter.is_featured !== undefined
                    ? 'No images match your current filters'
                    : 'Upload your first portfolio image to get started'
                  }
                </p>
                <Button
                  onClick={() => setShowUploadDialog(true)}
                  className="bg-[#a5cd39] hover:bg-[#8fb32a] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Conference Portfolio
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredImages.map((image) => (
                  <div
                    key={image.id}
                    className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Image */}
                    <div className="relative aspect-video bg-gray-100">
                      <img
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/events-portfolio-images/${image.file_path}`}
                        alt={image.alt_text}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        {image.is_featured && (
                          <Badge className="bg-yellow-500">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        {!image.is_active && (
                          <Badge variant="secondary">
                            Inactive
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{image.title}</h3>

                      {image.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {image.description}
                        </p>
                      )}

                      <div className="space-y-1 text-xs text-gray-500 mb-3">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Conference Portfolio
                        </div>
                        <div className="text-xs text-gray-400">
                          Created: {formatDate(image.created_at)}
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 mb-3">
                        {formatFileSize(image.file_size)} • Order: {image.display_order}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleFeatured(image.id)}
                          disabled={formState.isSaving}
                        >
                          {image.is_featured ? (
                            <StarOff className="w-4 h-4" />
                          ) : (
                            <Star className="w-4 h-4" />
                          )}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(image)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(image.id)}
                          disabled={formState.isDeleting}
                          className="text-red-600 hover:text-red-700"
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
    </motion.div>
  );
}
