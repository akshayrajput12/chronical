"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Link as LinkIcon, ExternalLink, Trash2 } from "lucide-react";

interface LinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLinkInsert: (url: string, text?: string, target?: string) => void;
    onLinkRemove?: () => void;
    initialUrl?: string;
    initialText?: string;
    isEditing?: boolean;
}

export default function LinkModal({
    isOpen,
    onClose,
    onLinkInsert,
    onLinkRemove,
    initialUrl = "",
    initialText = "",
    isEditing = false,
}: LinkModalProps) {
    const [url, setUrl] = useState<string>(initialUrl);
    const [linkText, setLinkText] = useState<string>(initialText);
    const [target, setTarget] = useState<string>("_self");
    const [isValidUrl, setIsValidUrl] = useState<boolean>(true);

    useEffect(() => {
        setUrl(initialUrl);
        setLinkText(initialText);
    }, [initialUrl, initialText, isOpen]);

    const validateUrl = (urlString: string): boolean => {
        if (!urlString.trim()) return false;

        try {
            // Add protocol if missing
            const urlToTest = urlString.startsWith("http")
                ? urlString
                : `https://${urlString}`;

            new URL(urlToTest);
            return true;
        } catch {
            // Check if it's a relative URL or anchor
            return (
                urlString.startsWith("/") ||
                urlString.startsWith("#") ||
                urlString.startsWith("mailto:")
            );
        }
    };

    const handleUrlChange = (value: string) => {
        setUrl(value);
        setIsValidUrl(validateUrl(value));
    };

    const formatUrl = (urlString: string): string => {
        if (!urlString.trim()) return "";

        // Don't modify relative URLs, anchors, or mailto links
        if (
            urlString.startsWith("/") ||
            urlString.startsWith("#") ||
            urlString.startsWith("mailto:")
        ) {
            return urlString;
        }

        // Add https:// if no protocol is specified
        if (
            !urlString.startsWith("http://") &&
            !urlString.startsWith("https://")
        ) {
            return `https://${urlString}`;
        }

        return urlString;
    };

    const handleInsert = () => {
        if (!url.trim() || !isValidUrl) {
            return;
        }

        const formattedUrl = formatUrl(url);
        const targetValue = target === "_self" ? undefined : target;

        onLinkInsert(formattedUrl, linkText.trim() || undefined, targetValue);
        handleClose();
    };

    const handleRemove = () => {
        if (onLinkRemove) {
            onLinkRemove();
            handleClose();
        }
    };

    const handleClose = () => {
        setUrl("");
        setLinkText("");
        setTarget("_self");
        setIsValidUrl(true);
        onClose();
    };

    const getUrlPreview = () => {
        if (!url.trim()) return "";
        return formatUrl(url);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <LinkIcon className="w-5 h-5" />
                        {isEditing ? "Edit Link" : "Insert Link"}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* URL Input */}
                    <div className="space-y-2">
                        <Label htmlFor="url">URL *</Label>
                        <Input
                            id="url"
                            value={url}
                            onChange={e => handleUrlChange(e.target.value)}
                            placeholder="https://example.com or /page or #section"
                            className={!isValidUrl ? "border-red-500" : ""}
                        />
                        {!isValidUrl && (
                            <p className="text-sm text-red-600">
                                Please enter a valid URL
                            </p>
                        )}
                        {url.trim() && isValidUrl && (
                            <p className="text-xs text-gray-500">
                                Preview: {getUrlPreview()}
                            </p>
                        )}
                    </div>

                    {/* Link Text */}
                    <div className="space-y-2">
                        <Label htmlFor="linkText">Link Text (Optional)</Label>
                        <Input
                            id="linkText"
                            value={linkText}
                            onChange={e => setLinkText(e.target.value)}
                            placeholder="Leave empty to use selected text"
                        />
                        <p className="text-xs text-gray-500">
                            If empty, will use the currently selected text
                        </p>
                    </div>

                    {/* Target Options */}
                    <div className="space-y-2">
                        <Label>Open Link</Label>
                        <Select value={target} onValueChange={setTarget}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="_self">
                                    <div className="flex items-center gap-2">
                                        <LinkIcon className="w-4 h-4" />
                                        Same tab
                                    </div>
                                </SelectItem>
                                <SelectItem value="_blank">
                                    <div className="flex items-center gap-2">
                                        <ExternalLink className="w-4 h-4" />
                                        New tab
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* URL Examples */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                            Examples:
                        </p>
                        <ul className="text-xs text-gray-600 space-y-1">
                            <li>
                                • <code>https://example.com</code> - External
                                website
                            </li>
                            <li>
                                • <code>example.com</code> - External (https://
                                added automatically)
                            </li>
                            <li>
                                • <code>/about-us</code> - Internal page
                            </li>
                            <li>
                                • <code>#section</code> - Page anchor
                            </li>
                            <li>
                                • <code>mailto:email@example.com</code> - Email
                                link
                            </li>
                        </ul>
                    </div>
                </div>

                <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
                    <div className="order-2 sm:order-1">
                        {isEditing && onLinkRemove && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleRemove}
                                className="w-full sm:w-auto"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove Link
                            </Button>
                        )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 order-1 sm:order-2">
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleInsert}
                            disabled={!url.trim() || !isValidUrl}
                            className="w-full sm:w-auto"
                        >
                            <LinkIcon className="w-4 h-4 mr-2" />
                            {isEditing ? "Update" : "Insert"} Link
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
