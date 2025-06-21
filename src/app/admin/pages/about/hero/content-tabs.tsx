// Content tabs for About Hero Admin - Part 2
// This contains the tab content that will be added to the main page

const contentSettingsTab = `
                    {/* Content Settings Tab */}
                    <TabsContent value="content" className="space-y-6">
                        {/* Hero Content */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Hero Content</CardTitle>
                                <CardDescription>
                                    Configure the main heading and subheading for the about hero section
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="hero_heading">Hero Heading</Label>
                                    <Input
                                        id="hero_heading"
                                        value={sectionData.hero_heading}
                                        onChange={(e) =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                hero_heading: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter the hero heading"
                                        className="text-lg font-semibold"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="hero_subheading">Hero Subheading</Label>
                                    <Textarea
                                        id="hero_subheading"
                                        value={sectionData.hero_subheading}
                                        onChange={(e) =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                hero_subheading: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter the hero subheading"
                                        rows={3}
                                        className="resize-none"
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={sectionData.is_active}
                                        onChange={(e) =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                is_active: e.target.checked,
                                            }))
                                        }
                                        className="rounded border-gray-300"
                                    />
                                    <Label htmlFor="is_active">Active</Label>
                                    <p className="text-sm text-gray-500">
                                        Uncheck to hide this section from the website
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Background Image Selection */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Background Image</CardTitle>
                                <CardDescription>
                                    Select the background image for the hero section
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {images.length === 0 ? (
                                    <div className="text-center py-8">
                                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500">
                                            No images available
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            Upload images in the Media Management tab first
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {images.map(image => (
                                            <div
                                                key={image.id}
                                                className={\`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all \${
                                                    sectionData.background_image_id === image.id
                                                        ? "border-[#a5cd39] ring-2 ring-[#a5cd39]/20"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }\`}
                                                onClick={() =>
                                                    setSectionData(prev => ({
                                                        ...prev,
                                                        background_image_id: image.id,
                                                    }))
                                                }
                                            >
                                                <div className="aspect-video relative">
                                                    <img
                                                        src={image.file_url}
                                                        alt={image.alt_text || image.file_name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    {sectionData.background_image_id === image.id && (
                                                        <div className="absolute inset-0 bg-[#a5cd39]/20 flex items-center justify-center">
                                                            <CheckCircle className="w-8 h-8 text-[#a5cd39]" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-2">
                                                    <p className="text-xs text-gray-600 truncate">
                                                        {image.file_name}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="fallback_image_url">Fallback Image URL</Label>
                                    <Input
                                        id="fallback_image_url"
                                        value={sectionData.fallback_image_url || ""}
                                        onChange={(e) =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                fallback_image_url: e.target.value,
                                            }))
                                        }
                                        placeholder="https://example.com/fallback-image.jpg"
                                    />
                                    <p className="text-xs text-gray-500">
                                        Used when no background image is selected
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Styling Configuration */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Styling Configuration</CardTitle>
                                <CardDescription>
                                    Customize colors, overlay, and layout of the hero section
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="overlay_color">Overlay Color</Label>
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                id="overlay_color"
                                                type="color"
                                                value={sectionData.overlay_color}
                                                onChange={(e) =>
                                                    setSectionData(prev => ({
                                                        ...prev,
                                                        overlay_color: e.target.value,
                                                    }))
                                                }
                                                className="w-16 h-10 p-1 border rounded"
                                            />
                                            <Input
                                                value={sectionData.overlay_color}
                                                onChange={(e) =>
                                                    setSectionData(prev => ({
                                                        ...prev,
                                                        overlay_color: e.target.value,
                                                    }))
                                                }
                                                placeholder="black"
                                                className="flex-1"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="text_color">Text Color</Label>
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                id="text_color"
                                                type="color"
                                                value={sectionData.text_color}
                                                onChange={(e) =>
                                                    setSectionData(prev => ({
                                                        ...prev,
                                                        text_color: e.target.value,
                                                    }))
                                                }
                                                className="w-16 h-10 p-1 border rounded"
                                            />
                                            <Input
                                                value={sectionData.text_color}
                                                onChange={(e) =>
                                                    setSectionData(prev => ({
                                                        ...prev,
                                                        text_color: e.target.value,
                                                    }))
                                                }
                                                placeholder="white"
                                                className="flex-1"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="overlay_opacity">Overlay Opacity</Label>
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                id="overlay_opacity"
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.05"
                                                value={sectionData.overlay_opacity}
                                                onChange={(e) =>
                                                    setSectionData(prev => ({
                                                        ...prev,
                                                        overlay_opacity: parseFloat(e.target.value),
                                                    }))
                                                }
                                                className="flex-1"
                                            />
                                            <span className="text-sm text-gray-600 w-12">
                                                {Math.round(sectionData.overlay_opacity * 100)}%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="height_class">Height Class</Label>
                                        <select
                                            id="height_class"
                                            value={sectionData.height_class}
                                            onChange={(e) =>
                                                setSectionData(prev => ({
                                                    ...prev,
                                                    height_class: e.target.value,
                                                }))
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39]"
                                        >
                                            <option value="h-screen">Full Screen (h-screen)</option>
                                            <option value="h-[100vh]">100vh</option>
                                            <option value="h-[90vh]">90vh</option>
                                            <option value="h-[80vh]">80vh</option>
                                            <option value="h-[70vh]">70vh</option>
                                            <option value="h-[60vh]">60vh</option>
                                            <option value="h-[50vh]">50vh</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="show_scroll_indicator"
                                        checked={sectionData.show_scroll_indicator}
                                        onChange={(e) =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                show_scroll_indicator: e.target.checked,
                                            }))
                                        }
                                        className="rounded border-gray-300"
                                    />
                                    <Label htmlFor="show_scroll_indicator">Show Scroll Indicator</Label>
                                    <p className="text-sm text-gray-500">
                                        Display the animated scroll down arrow
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
`;

export default contentSettingsTab;
