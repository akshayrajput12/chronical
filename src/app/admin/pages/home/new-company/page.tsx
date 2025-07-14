'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Save,
  Eye,
  Upload,
  Trash,
  Info,
  ImageIcon,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { NewCompanyService } from '@/services/new-company.service';
import { NewCompanySection, NewCompanyImage } from '@/types/new-company';
import { revalidatePathAction } from '@/services/revalidate.action';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const NewCompanySectionEditor = () => {
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  // State for new company section data
  const [sectionData, setSectionData] = useState<NewCompanySection | null>(null);
  const [images, setImages] = useState<Record<number, NewCompanyImage[]>>({});
  
  // State for loading, saving, and uploading
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingColumn, setUploadingColumn] = useState<number | null>(null);

  // Fetch new company section data on component mount
  useEffect(() => {
    const fetchNewCompanyData = async () => {
      setLoading(true);
      try {
        const data = await NewCompanyService.getNewCompanySection();
        if (data) {
          setSectionData(data);
          const imagesData = await NewCompanyService.getNewCompanyImagesByColumn(data.id);
          setImages(imagesData);
        }
      } catch (error) {
        console.error('Error fetching new company data:', error);
        toast.error('Failed to load new company section data');
      } finally {
        setLoading(false);
      }
    };

    fetchNewCompanyData();
  }, []);

  // Handle input changes
  const handleInputChange = (field: keyof NewCompanySection, value: string) => {
    if (!sectionData) return;
    
    setSectionData({
      ...sectionData,
      [field]: value
    });
  };

  // Save new company section data
  const saveNewCompanySectionData = async () => {
    if (!sectionData) return;
    
    setSaving(true);

    // Validate data before saving
    if (!sectionData.title.trim()) {
      toast.error('Title cannot be empty');
      setSaving(false);
      return;
    }

    try {
      // Save the new company section data
      const result = await NewCompanyService.updateNewCompanySection(sectionData);

      if (result) {
        toast.success('New company section saved successfully');
      } else {
        toast.error('Failed to save new company section');
      }
    } catch (error) {
      console.error('Error saving new company section:', error);
      toast.error('An error occurred while saving');
    } finally {
      revalidatePathAction('/');
      setSaving(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, columnNumber: number) => {
    const file = e.target.files?.[0];
    if (!file || !sectionData) return;

    try {
      setUploadingColumn(columnNumber);

      // Generate a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${sectionData.id}/${columnNumber}/${fileName}`;

      // Upload to storage
      const imageUrl = await NewCompanyService.uploadImage(file, filePath);

      if (imageUrl) {
        // Add to database
        const newImage = {
          section_id: sectionData.id,
          image_url: imageUrl,
          image_alt: file.name.split('.')[0], // Use filename as alt text initially
          column_number: columnNumber,
          display_order: images[columnNumber]?.length || 0,
          is_active: true
        };

        const addedImage = await NewCompanyService.addNewCompanyImage(newImage);

        if (addedImage) {
          // Update local state
          setImages(prev => {
            const updatedImages = { ...prev };
            if (!updatedImages[columnNumber]) {
              updatedImages[columnNumber] = [];
            }
            updatedImages[columnNumber] = [...updatedImages[columnNumber], addedImage];
            return updatedImages;
          });

          toast.success('Image uploaded successfully');
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingColumn(null);
    }
  };

  // Handle image delete
  const handleImageDelete = async (image: NewCompanyImage) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const deleted = await NewCompanyService.deleteNewCompanyImage(image.id);

      if (deleted) {
        // Extract path from URL to delete from storage
        const urlParts = image.image_url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `${sectionData?.id}/${image.column_number}/${fileName}`;

        // Delete from storage
        await NewCompanyService.deleteImageFromStorage(filePath);

        // Update local state
        setImages(prev => {
          const updatedImages = { ...prev };
          updatedImages[image.column_number] = updatedImages[image.column_number].filter(
            img => img.id !== image.id
          );
          return updatedImages;
        });

        toast.success('Image deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  // Handle image alt text update
  const handleImageAltChange = async (image: NewCompanyImage, newAlt: string) => {
    try {
      const updatedImage = {
        ...image,
        image_alt: newAlt
      };

      await NewCompanyService.updateNewCompanyImage(updatedImage);

      // Update local state
      setImages(prev => {
        const updatedImages = { ...prev };
        updatedImages[image.column_number] = updatedImages[image.column_number].map(
          img => img.id === image.id ? { ...img, image_alt: newAlt } : img
        );
        return updatedImages;
      });
    } catch (error) {
      console.error('Error updating image alt text:', error);
      toast.error('Failed to update image alt text');
    }
  };

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin h-10 w-10 border-4 border-[#a5cd39] border-t-transparent rounded-full"></div>
        <p className="text-gray-600">Loading new company section data...</p>
      </div>
    );
  }

  if (!sectionData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="text-red-500">
          <Info size={48} />
        </div>
        <p className="text-gray-600">No new company section data found.</p>
        <Button onClick={() => window.location.reload()}>Refresh</Button>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Info Banner */}
      <motion.div
        variants={itemVariants}
        className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 flex items-start gap-3"
      >
        <Info className="text-blue-500 mt-0.5 flex-shrink-0" size={18} />
        <div>
          <h3 className="font-medium text-blue-700 mb-1">About the New Company Section</h3>
          <p className="text-blue-600 text-sm">
            You can edit the text content and manage the images for the New Company Formation section.
            The section displays a grid of scrolling images alongside the text content.
          </p>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div variants={itemVariants} className="flex justify-end">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => window.open('/#new-company', '_blank')}
            className="gap-1"
          >
            <Eye size={16} />
            <span>Preview</span>
          </Button>
          <Button
            onClick={saveNewCompanySectionData}
            disabled={saving}
            className="gap-1 bg-[#a5cd39] hover:bg-[#94b933]"
          >
            {saving ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Tabs for Content and Images */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content">
              <FileText className="mr-2 h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="images">
              <ImageIcon className="mr-2 h-4 w-4" />
              Images
            </TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>New Company Section Content</CardTitle>
                <CardDescription>
                  Edit the text content for the New Company Formation section
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={sectionData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input
                      id="subtitle"
                      value={sectionData.subtitle}
                      onChange={(e) => handleInputChange('subtitle', e.target.value)}
                      placeholder="Enter subtitle"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description_1">First Paragraph</Label>
                  <Textarea
                    id="description_1"
                    value={sectionData.description_1}
                    onChange={(e) => handleInputChange('description_1', e.target.value)}
                    placeholder="Enter first paragraph"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description_2">Second Paragraph</Label>
                  <Textarea
                    id="description_2"
                    value={sectionData.description_2}
                    onChange={(e) => handleInputChange('description_2', e.target.value)}
                    placeholder="Enter second paragraph"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="button_text">Button Text</Label>
                    <Input
                      id="button_text"
                      value={sectionData.button_text}
                      onChange={(e) => handleInputChange('button_text', e.target.value)}
                      placeholder="Enter button text"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="button_url">Button URL</Label>
                    <Input
                      id="button_url"
                      value={sectionData.button_url}
                      onChange={(e) => handleInputChange('button_url', e.target.value)}
                      placeholder="Enter button URL"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Images Tab */}
          <TabsContent value="images">
            <Card>
              <CardHeader>
                <CardTitle>Image Grid Management</CardTitle>
                <CardDescription>
                  Manage the images for each column in the scrolling grid
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((columnNumber) => (
                    <div key={columnNumber} className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Column {columnNumber}</h3>
                        <div className="relative">
                          <Input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id={`image-upload-${columnNumber}`}
                            onChange={(e) => handleImageUpload(e, columnNumber)}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={() => document.getElementById(`image-upload-${columnNumber}`)?.click()}
                            disabled={uploadingColumn === columnNumber}
                          >
                            {uploadingColumn === columnNumber ? (
                              <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                            ) : (
                              <Upload size={14} />
                            )}
                            <span>Upload</span>
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                        {images[columnNumber]?.map((image) => (
                          <div key={image.id} className="border rounded-md p-3 space-y-2">
                            <div className="relative aspect-video rounded-md overflow-hidden">
                              <Image
                                src={image.image_url}
                                alt={image.image_alt}
                                fill
                                className="object-cover"
                              />
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-8 w-8"
                                onClick={() => handleImageDelete(image)}
                              >
                                <Trash size={14} />
                              </Button>
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor={`alt-${image.id}`} className="text-xs">Alt Text</Label>
                              <Input
                                id={`alt-${image.id}`}
                                value={image.image_alt}
                                onChange={(e) => handleImageAltChange(image, e.target.value)}
                                className="text-sm"
                                placeholder="Image description"
                              />
                            </div>
                          </div>
                        ))}

                        {(!images[columnNumber] || images[columnNumber].length === 0) && (
                          <div className="flex flex-col items-center justify-center border border-dashed rounded-md p-8 text-gray-400">
                            <ImageIcon size={48} className="mb-2 opacity-50" />
                            <p>No images in this column</p>
                            <p className="text-sm">Click Upload to add images</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Preview Section */}
      <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Preview</h2>
        <div className="flex flex-col md:flex-row gap-8 p-6 bg-gray-50 rounded-lg">
          <div className="md:w-1/2 space-y-4">
            <div>
              <h3 className="text-2xl font-bold">
                {sectionData.title}{" "}
                <span className="font-normal text-gray-700">{sectionData.subtitle}</span>
              </h3>
              <div className="h-1 bg-[#a5cd39] w-24 mt-2"></div>
            </div>
            <p className="text-gray-700">{sectionData.description_1}</p>
            <p className="text-gray-700">{sectionData.description_2}</p>
            <Button className="bg-[#a5cd39] hover:bg-[#94b933]">
              {sectionData.button_text}
            </Button>
          </div>
          <div className="md:w-1/2 h-[300px] bg-gray-200 rounded-md flex items-center justify-center">
            <p className="text-gray-500">Image Grid Preview</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NewCompanySectionEditor;
