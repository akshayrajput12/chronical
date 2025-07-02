"use client";

import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { contactAdminService } from '@/lib/services/contact';
import { ContactStorageBucket, ContactImageLibrary } from '@/types/contact';
import { Upload, X, Image as ImageIcon, Loader2, Trash2 } from 'lucide-react';

interface ContactImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    bucket?: ContactStorageBucket;
    folder?: string;
    label?: string;
    placeholder?: string;
    className?: string;
    showLibrary?: boolean;
    aspectRatio?: string;
}

export const ContactImageUpload: React.FC<ContactImageUploadProps> = ({
    value,
    onChange,
    bucket = 'contact-images',
    folder = '',
    label = 'Image',
    placeholder = 'Enter image URL or upload a file',
    className = '',
    showLibrary = true,
    aspectRatio = 'aspect-video'
}) => {
    const [uploading, setUploading] = useState(false);
    const [showImageLibrary, setShowImageLibrary] = useState(false);
    const [imageLibrary, setImageLibrary] = useState<ContactImageLibrary[]>([]);
    const [loadingLibrary, setLoadingLibrary] = useState(false);
    const [error, setError] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = useCallback(async (file: File) => {
        if (!file) return;

        setUploading(true);
        setError('');

        try {
            const result = await contactAdminService.uploadImage(file, bucket, folder);
            
            if (result.success && result.data) {
                onChange(result.data.url);
            } else {
                setError(result.error || 'Failed to upload image');
            }
        } catch (error) {
            console.error('Upload error:', error);
            setError('Failed to upload image');
        } finally {
            setUploading(false);
        }
    }, [bucket, folder, onChange]);

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleFileSelect(file);
        }
    }, [handleFileSelect]);

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const loadImageLibrary = async () => {
        setLoadingLibrary(true);
        try {
            const result = await contactAdminService.getImageLibrary(bucket, folder);
            if (result.success && result.data) {
                setImageLibrary(result.data);
            }
        } catch (error) {
            console.error('Failed to load image library:', error);
        } finally {
            setLoadingLibrary(false);
        }
    };

    const handleShowLibrary = () => {
        setShowImageLibrary(true);
        loadImageLibrary();
    };

    const handleSelectFromLibrary = (imageUrl: string) => {
        onChange(imageUrl);
        setShowImageLibrary(false);
    };

    const handleRemoveImage = () => {
        onChange('');
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <div>
                <Label htmlFor="image-input">{label}</Label>
                
                {/* URL Input */}
                <div className="flex gap-2 mt-2">
                    <Input
                        id="image-input"
                        type="text"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="flex-1"
                    />
                    {value && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleRemoveImage}
                            className="px-3"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                {error && (
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                )}
            </div>

            {/* Image Preview */}
            {value && (
                <div className={`relative ${aspectRatio} w-full max-w-md border rounded-lg overflow-hidden`}>
                    <img
                        src={value}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={() => setError('Failed to load image')}
                    />
                </div>
            )}

            {/* Upload Actions */}
            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2"
                >
                    {uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Upload className="h-4 w-4" />
                    )}
                    {uploading ? 'Uploading...' : 'Upload Image'}
                </Button>

                {showLibrary && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleShowLibrary}
                        className="flex items-center gap-2"
                    >
                        <ImageIcon className="h-4 w-4" />
                        Select from Library
                    </Button>
                )}
            </div>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
            />

            {/* Drag and Drop Area */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
            >
                <ImageIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                    Drag and drop an image here, or click "Upload Image" to select a file
                </p>
            </div>

            {/* Image Library Modal */}
            {showImageLibrary && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Select Image from Library</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowImageLibrary(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {loadingLibrary ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin" />
                                <span className="ml-2">Loading images...</span>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {imageLibrary.map((image) => (
                                    <div
                                        key={image.id}
                                        className="relative group cursor-pointer border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                                        onClick={() => handleSelectFromLibrary(image.url)}
                                    >
                                        <div className="aspect-square">
                                            <img
                                                src={image.url}
                                                alt={image.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all" />
                                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 text-xs truncate">
                                            {image.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!loadingLibrary && imageLibrary.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No images found in the library
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
