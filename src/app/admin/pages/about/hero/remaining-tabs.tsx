// Remaining tabs for About Hero Admin
// This contains the Media Management and Preview tabs

const remainingTabs = `
                    {/* Media Management Tab */}
                    <TabsContent value="media" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Image Upload</CardTitle>
                                <CardDescription>
                                    Upload and manage background images for the about hero section
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={(e) => {
                                                if (e.target.files) {
                                                    handleImageUpload(e.target.files);
                                                }
                                            }}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className="cursor-pointer flex flex-col items-center"
                                        >
                                            <Upload className="w-12 h-12 text-gray-400 mb-4" />
                                            <p className="text-lg font-medium text-gray-900 mb-2">
                                                Upload Images
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Click to select images or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-400 mt-2">
                                                Supports: JPG, PNG, WebP, GIF (Max: 50MB each)
                                            </p>
                                        </label>
                                    </div>

                                    {uploading && (
                                        <div className="flex items-center justify-center py-4">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#a5cd39] mr-2"></div>
                                            <span className="text-sm text-gray-600">Uploading images...</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Uploaded Images</CardTitle>
                                <CardDescription>
                                    Manage your uploaded background images
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {images.length === 0 ? (
                                    <div className="text-center py-8">
                                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500">No images uploaded yet</p>
                                        <p className="text-sm text-gray-400">
                                            Upload some images to get started
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {images.map(image => (
                                            <div
                                                key={image.id}
                                                className="border rounded-lg overflow-hidden bg-white shadow-sm"
                                            >
                                                <div className="aspect-video relative">
                                                    <img
                                                        src={image.file_url}
                                                        alt={image.alt_text || image.file_name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="p-3">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {image.file_name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {(image.file_size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                    <div className="flex items-center justify-between mt-3">
                                                        <span className={\`text-xs px-2 py-1 rounded-full \${
                                                            sectionData.background_image_id === image.id
                                                                ? "bg-[#a5cd39]/20 text-[#a5cd39]"
                                                                : "bg-gray-100 text-gray-600"
                                                        }\`}>
                                                            {sectionData.background_image_id === image.id ? "Selected" : "Available"}
                                                        </span>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleImageDelete(image.id)}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
                    </TabsContent>

                    {/* Preview Tab */}
                    <TabsContent value="preview" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Preview</CardTitle>
                                <CardDescription>
                                    Preview how the about hero section will appear on the website
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {sectionData.hero_heading ? (
                                    <div 
                                        className={\`relative \${sectionData.height_class} flex items-center justify-center overflow-hidden rounded-lg\`}
                                        style={{
                                            backgroundImage: sectionData.background_image_id 
                                                ? \`url(\${images.find(img => img.id === sectionData.background_image_id)?.file_url})\`
                                                : \`url(\${sectionData.fallback_image_url})\`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            backgroundRepeat: 'no-repeat',
                                        }}
                                    >
                                        {/* Overlay */}
                                        <div 
                                            className="absolute inset-0"
                                            style={{
                                                backgroundColor: sectionData.overlay_color,
                                                opacity: sectionData.overlay_opacity,
                                            }}
                                        />

                                        {/* Content */}
                                        <div 
                                            className="relative z-10 text-center w-full px-4 sm:px-6 md:px-8 lg:px-12"
                                            style={{ color: sectionData.text_color }}
                                        >
                                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-rubik font-bold mb-4 sm:mb-6 leading-tight">
                                                {sectionData.hero_heading}
                                            </h1>
                                            <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-markazi-text max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed font-light tracking-wide opacity-90">
                                                {sectionData.hero_subheading}
                                            </h3>
                                        </div>

                                        {/* Scroll Indicator */}
                                        {sectionData.show_scroll_indicator && (
                                            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                                                <div className="w-8 h-8 animate-bounce" style={{ color: sectionData.text_color }}>
                                                    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500">
                                            Enter hero content to see the preview
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Live Preview</CardTitle>
                                <CardDescription>
                                    View the actual about page to see your changes
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    variant="outline"
                                    onClick={() => window.open("/about", "_blank")}
                                    className="w-full"
                                >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Open About Page in New Tab
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </motion.div>
    );
};

export default AboutHeroEditor;
`;

export default remainingTabs;
