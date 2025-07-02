"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ContactImageUpload } from './image-upload';
import { contactAdminService } from '@/lib/services/contact';
import { ContactImageLibrary, ContactStorageBucket } from '@/types/contact';
import { 
    Search, 
    Upload, 
    Trash2, 
    Download,
    Loader2, 
    AlertCircle, 
    CheckCircle,
    Image as ImageIcon,
    FolderOpen,
    Copy,
    ExternalLink,
    Grid3X3,
    List
} from 'lucide-react';

export default function ContactImageLibraryTab() {
    const [images, setImages] = useState<ContactImageLibrary[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [bucketFilter, setBucketFilter] = useState<ContactStorageBucket | 'all'>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [showUploadDialog, setShowUploadDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadImages();
    }, []);

    const loadImages = async () => {
        try {
            setLoading(true);
            const data = await contactAdminService.getImageLibrary();
            setImages(data);
        } catch (error) {
            console.error('Failed to load images:', error);
            setError('Failed to load image library');
        } finally {
            setLoading(false);
        }
    };

    const filteredImages = images.filter(image => {
        const matchesSearch = !searchTerm || 
            image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            image.folder?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesBucket = bucketFilter === 'all' || image.bucket === bucketFilter;
        
        return matchesSearch && matchesBucket;
    });

    const handleImageSelect = (imageId: string) => {
        setSelectedImages(prev => 
            prev.includes(imageId) 
                ? prev.filter(id => id !== imageId)
                : [...prev, imageId]
        );
    };

    const handleSelectAll = () => {
        if (selectedImages.length === filteredImages.length) {
            setSelectedImages([]);
        } else {
            setSelectedImages(filteredImages.map(img => img.id));
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedImages.length === 0) return;

        try {
            setActionLoading(true);
            const deletePromises = selectedImages.map(imageId => {
                const image = images.find(img => img.id === imageId);
                if (image && image.path) {
                    return contactAdminService.deleteImage(image.bucket, image.path);
                }
                return Promise.resolve(false);
            });

            const results = await Promise.all(deletePromises);
            const successCount = results.filter(Boolean).length;

            if (successCount > 0) {
                setSuccess(`Successfully deleted ${successCount} image(s)`);
                setSelectedImages([]);
                loadImages();
            } else {
                setError('Failed to delete images');
            }
        } catch (error) {
            console.error('Delete error:', error);
            setError('Failed to delete images');
        } finally {
            setActionLoading(false);
            setShowDeleteDialog(false);
        }
    };

    const handleCopyUrl = (url: string) => {
        navigator.clipboard.writeText(url);
        setSuccess('Image URL copied to clipboard');
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getBucketLabel = (bucket: ContactStorageBucket) => {
        const labels = {
            'contact-images': 'Contact Images',
            'contact-attachments': 'Form Attachments',
            'contact-admin-uploads': 'Admin Uploads'
        };
        return labels[bucket] || bucket;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading image library...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
            )}

            {/* Header */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5" />
                        Image Library
                    </CardTitle>
                    <CardDescription>
                        Manage all uploaded images for the contact page
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <Label htmlFor="search">Search Images</Label>
                            <div className="relative mt-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by filename or folder..."
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="lg:w-48">
                            <Label htmlFor="bucket-filter">Filter by Bucket</Label>
                            <Select value={bucketFilter} onValueChange={(value: any) => setBucketFilter(value)}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="All buckets" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Buckets</SelectItem>
                                    <SelectItem value="contact-images">Contact Images</SelectItem>
                                    <SelectItem value="contact-attachments">Form Attachments</SelectItem>
                                    <SelectItem value="contact-admin-uploads">Admin Uploads</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-2 items-end">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                                className="flex items-center gap-2"
                            >
                                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
                                {viewMode === 'grid' ? 'List' : 'Grid'}
                            </Button>
                            <Button
                                onClick={() => setShowUploadDialog(true)}
                                className="flex items-center gap-2"
                            >
                                <Upload className="h-4 w-4" />
                                Upload Images
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Actions Bar */}
            {selectedImages.length > 0 && (
                <Card>
                    <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium">
                                    {selectedImages.length} image(s) selected
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleSelectAll}
                                >
                                    {selectedImages.length === filteredImages.length ? 'Deselect All' : 'Select All'}
                                </Button>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => setShowDeleteDialog(true)}
                                    className="flex items-center gap-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete Selected
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Images Display */}
            {filteredImages.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-8">
                        <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {searchTerm || bucketFilter !== 'all' ? 'No Matching Images' : 'No Images Uploaded'}
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {searchTerm || bucketFilter !== 'all' 
                                ? 'Try adjusting your search or filter criteria.'
                                : 'Upload your first images to get started with the image library.'
                            }
                        </p>
                        <Button onClick={() => setShowUploadDialog(true)} className="flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            Upload Images
                        </Button>
                    </CardContent>
                </Card>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {filteredImages.map((image) => (
                        <Card 
                            key={image.id} 
                            className={`cursor-pointer transition-all ${
                                selectedImages.includes(image.id) 
                                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                                    : 'hover:shadow-md'
                            }`}
                            onClick={() => handleImageSelect(image.id)}
                        >
                            <CardContent className="p-2">
                                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                                    <img
                                        src={image.url}
                                        alt={image.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium truncate" title={image.name}>
                                        {image.name}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>{formatFileSize(image.size)}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCopyUrl(image.url);
                                            }}
                                            className="h-6 w-6 p-0"
                                        >
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {getBucketLabel(image.bucket)}
                                        {image.folder && ` / ${image.folder}`}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {filteredImages.map((image) => (
                                <div 
                                    key={image.id}
                                    className={`flex items-center gap-4 p-4 cursor-pointer transition-colors ${
                                        selectedImages.includes(image.id) 
                                            ? 'bg-blue-50' 
                                            : 'hover:bg-gray-50'
                                    }`}
                                    onClick={() => handleImageSelect(image.id)}
                                >
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            src={image.url}
                                            alt={image.name}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium truncate">{image.name}</h4>
                                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                            <span>{formatFileSize(image.size)}</span>
                                            <span>{getBucketLabel(image.bucket)}</span>
                                            {image.folder && (
                                                <span className="flex items-center gap-1">
                                                    <FolderOpen className="h-3 w-3" />
                                                    {image.folder}
                                                </span>
                                            )}
                                            <span>{formatDate(image.created_at)}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCopyUrl(image.url);
                                            }}
                                            className="flex items-center gap-1"
                                        >
                                            <Copy className="h-4 w-4" />
                                            Copy URL
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(image.url, '_blank');
                                            }}
                                            className="flex items-center gap-1"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                            View
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Upload Dialog */}
            <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Upload Images</DialogTitle>
                        <DialogDescription>
                            Upload new images to the contact image library
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                        <ContactImageUpload
                            value=""
                            onChange={() => {
                                // Refresh library after upload
                                loadImages();
                                setSuccess('Images uploaded successfully');
                            }}
                            bucket="contact-images"
                            folder="library"
                            label="Upload Images"
                            placeholder="Select or drag images to upload"
                            showLibrary={false}
                        />
                    </div>
                    
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Images</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {selectedImages.length} selected image(s)? 
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setShowDeleteDialog(false)}
                            disabled={actionLoading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="destructive"
                            onClick={handleDeleteSelected}
                            disabled={actionLoading}
                        >
                            {actionLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Images
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
