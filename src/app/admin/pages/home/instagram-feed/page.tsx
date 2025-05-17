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
  FileText,
  Camera,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { toast } from 'sonner';
import { InstagramFeedService } from '@/services/instagram-feed.service';
import { InstagramFeedSection, InstagramPost } from '@/types/instagram-feed';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const InstagramFeedEditor = () => {
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

  // State for Instagram feed section data
  const [sectionData, setSectionData] = useState<InstagramFeedSection | null>(null);
  const [posts, setPosts] = useState<InstagramPost[]>([]);

  // State for loading, saving, and uploading
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<{file: File, preview: string} | null>(null);

  // Fetch Instagram feed section data on component mount
  useEffect(() => {
    const fetchInstagramFeedData = async () => {
      setLoading(true);
      try {
        const data = await InstagramFeedService.getInstagramFeedSection();
        if (data) {
          setSectionData(data);
          const postsData = await InstagramFeedService.getInstagramPosts(data.id);
          setPosts(postsData);
        }
      } catch (error) {
        console.error('Error fetching Instagram feed data:', error);
        toast.error('Failed to load Instagram feed section data');
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramFeedData();
  }, []);

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage.preview);
      }
    };
  }, [previewImage]);

  // Handle input changes for section data
  const handleInputChange = (field: keyof InstagramFeedSection, value: string) => {
    if (!sectionData) return;

    setSectionData({
      ...sectionData,
      [field]: value
    });
  };

  // Save Instagram feed section data
  const saveInstagramFeedData = async () => {
    if (!sectionData) return;

    setSaving(true);

    try {
      // Save the Instagram feed section data
      const result = await InstagramFeedService.updateInstagramFeedSection(sectionData);

      if (result) {
        toast.success('Instagram feed section saved successfully');
      } else {
        toast.error('Failed to save Instagram feed section');
      }
    } catch (error) {
      console.error('Error saving Instagram feed section:', error);
      toast.error('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  // Handle image selection for preview
  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Revoke previous preview URL if exists
    if (previewImage) {
      URL.revokeObjectURL(previewImage.preview);
    }

    // Create preview URL
    const preview = URL.createObjectURL(file);
    setPreviewImage({ file, preview });
  };

  // Handle image upload
  const handleImageUpload = async () => {
    if (!previewImage?.file || !sectionData) return;

    try {
      setUploading(true);

      // Generate a unique file path
      const file = previewImage.file;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${sectionData.id}/${fileName}`;

      // Upload to storage
      const imageUrl = await InstagramFeedService.uploadImage(file, filePath);

      if (imageUrl) {
        // Add to database
        const newPost = {
          section_id: sectionData.id,
          image_url: imageUrl,
          caption: file.name.split('.')[0], // Use filename as caption initially
          subcaption: null,
          tag: null,
          redirect_url: null,
          display_order: posts.length,
          is_active: true
        };

        const addedPost = await InstagramFeedService.addInstagramPost(newPost);

        if (addedPost) {
          // Update local state
          setPosts(prev => [...prev, addedPost]);
          toast.success('Instagram post added successfully');

          // Clear preview
          URL.revokeObjectURL(previewImage.preview);
          setPreviewImage(null);
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  // Handle post delete
  const handlePostDelete = async (post: InstagramPost) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const deleted = await InstagramFeedService.deleteInstagramPost(post.id);

      if (deleted) {
        // Extract path from URL to delete from storage
        const urlParts = post.image_url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `${sectionData?.id}/${fileName}`;

        // Delete from storage
        await InstagramFeedService.deleteImageFromStorage(filePath);

        // Update local state
        setPosts(prev => prev.filter(p => p.id !== post.id));
        toast.success('Instagram post deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  // Handle post update
  const handlePostUpdate = async (post: InstagramPost, field: keyof InstagramPost, value: string) => {
    try {
      const updatedPost = {
        ...post,
        [field]: value
      };

      const result = await InstagramFeedService.updateInstagramPost(updatedPost);

      if (result) {
        // Update local state
        setPosts(prev => prev.map(p => p.id === post.id ? result : p));
      }
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post');
    }
  };

  // Handle post reordering
  const movePost = async (postId: string, direction: 'up' | 'down') => {
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return;

    // Can't move first item up or last item down
    if ((direction === 'up' && postIndex === 0) ||
        (direction === 'down' && postIndex === posts.length - 1)) {
      return;
    }

    const newPosts = [...posts];
    const swapIndex = direction === 'up' ? postIndex - 1 : postIndex + 1;

    // Swap display_order values
    const tempOrder = newPosts[postIndex].display_order;
    newPosts[postIndex].display_order = newPosts[swapIndex].display_order;
    newPosts[swapIndex].display_order = tempOrder;

    // Swap positions in array
    [newPosts[postIndex], newPosts[swapIndex]] = [newPosts[swapIndex], newPosts[postIndex]];

    // Update state
    setPosts(newPosts);

    // Update in database
    try {
      const updateData = [
        { id: newPosts[postIndex].id, display_order: newPosts[postIndex].display_order },
        { id: newPosts[swapIndex].id, display_order: newPosts[swapIndex].display_order }
      ];

      await InstagramFeedService.reorderInstagramPosts(updateData);
    } catch (error) {
      console.error('Error reordering posts:', error);
      toast.error('Failed to reorder posts');
    }
  };

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin h-10 w-10 border-4 border-[#a5cd39] border-t-transparent rounded-full"></div>
        <p className="text-gray-600">Loading Instagram feed data...</p>
      </div>
    );
  }

  if (!sectionData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="text-red-500">
          <Info size={48} />
        </div>
        <p className="text-gray-600">No Instagram feed section data found.</p>
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
          <h3 className="font-medium text-blue-700 mb-1">About the Instagram Feed Section</h3>
          <p className="text-blue-600 text-sm">
            You can edit the title, subtitle, and Instagram handle for the Instagram feed section.
            You can also add, edit, and delete Instagram posts that appear in the feed.
          </p>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div variants={itemVariants} className="flex justify-end">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => window.open('/#instagram-feed', '_blank')}
            className="gap-1"
          >
            <Eye size={16} />
            <span>Preview</span>
          </Button>
          <Button
            onClick={saveInstagramFeedData}
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

      {/* Tabs for Content and Posts */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content">
              <FileText className="mr-2 h-4 w-4" />
              Section Content
            </TabsTrigger>
            <TabsTrigger value="posts">
              <Camera className="mr-2 h-4 w-4" />
              Instagram Posts
            </TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Instagram Feed Section Content</CardTitle>
                <CardDescription>
                  Edit the title, subtitle, and Instagram handle for the Instagram feed section
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
                  <Label htmlFor="instagram_handle">Instagram Handle</Label>
                  <Input
                    id="instagram_handle"
                    value={sectionData.instagram_handle}
                    onChange={(e) => handleInputChange('instagram_handle', e.target.value)}
                    placeholder="Enter Instagram handle (e.g. @dwtc_freezone)"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Posts Tab */}
          <TabsContent value="posts">
            <Card>
              <CardHeader>
                <CardTitle>Instagram Posts Management</CardTitle>
                <CardDescription>
                  Add, edit, and delete Instagram posts that appear in the feed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-3">Add New Post</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        type="file"
                        accept="image/*"
                        className="mb-3"
                        onChange={handleImageSelection}
                      />
                      <Button
                        onClick={handleImageUpload}
                        disabled={!previewImage || uploading}
                        className="w-full gap-1 bg-[#a5cd39] hover:bg-[#94b933]"
                      >
                        {uploading ? (
                          <>
                            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload size={16} />
                            <span>Upload Post</span>
                          </>
                        )}
                      </Button>
                    </div>
                    {previewImage && (
                      <div className="relative aspect-square rounded-md overflow-hidden border">
                        <Image
                          src={previewImage.preview}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Existing Posts</h3>
                  {posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center border border-dashed rounded-md p-8 text-gray-400">
                      <Camera size={48} className="mb-2 opacity-50" />
                      <p>No Instagram posts yet</p>
                      <p className="text-sm">Upload images to add posts</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {posts.map((post) => (
                        <div key={post.id} className="border rounded-md p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">Post #{post.display_order + 1}</h4>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => movePost(post.id, 'up')}
                                disabled={post.display_order === 0}
                              >
                                <ArrowUp size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => movePost(post.id, 'down')}
                                disabled={post.display_order === posts.length - 1}
                              >
                                <ArrowDown size={16} />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handlePostDelete(post)}
                              >
                                <Trash size={16} />
                              </Button>
                            </div>
                          </div>
                          <div className="relative aspect-square rounded-md overflow-hidden">
                            <Image
                              src={post.image_url}
                              alt={post.caption}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="space-y-2">
                            <div>
                              <Label htmlFor={`caption-${post.id}`} className="text-xs">Caption</Label>
                              <Input
                                id={`caption-${post.id}`}
                                value={post.caption}
                                onChange={(e) => handlePostUpdate(post, 'caption', e.target.value)}
                                className="text-sm"
                                placeholder="Caption"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`subcaption-${post.id}`} className="text-xs">Subcaption (optional)</Label>
                              <Input
                                id={`subcaption-${post.id}`}
                                value={post.subcaption || ''}
                                onChange={(e) => handlePostUpdate(post, 'subcaption', e.target.value)}
                                className="text-sm"
                                placeholder="Subcaption"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`tag-${post.id}`} className="text-xs">Tag (optional)</Label>
                              <Input
                                id={`tag-${post.id}`}
                                value={post.tag || ''}
                                onChange={(e) => handlePostUpdate(post, 'tag', e.target.value)}
                                className="text-sm"
                                placeholder="Tag"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`redirect-url-${post.id}`} className="text-xs">Redirect URL (optional)</Label>
                              <Input
                                id={`redirect-url-${post.id}`}
                                value={post.redirect_url || ''}
                                onChange={(e) => handlePostUpdate(post, 'redirect_url', e.target.value)}
                                className="text-sm"
                                placeholder="https://example.com/page"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Add a URL to make this post clickable
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default InstagramFeedEditor;
