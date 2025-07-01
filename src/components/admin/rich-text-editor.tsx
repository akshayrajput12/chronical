"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    Link,
    Image as ImageIcon,
    Quote,
    Heading1,
    Heading2,
    Heading3,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Undo,
    Redo,
} from "lucide-react";

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
    content,
    onChange,
    placeholder = "Start writing...",
    className = "",
}) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isEditorFocused, setIsEditorFocused] = useState(false);

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== content) {
            editorRef.current.innerHTML = content;
        }
    }, [content]);

    const executeCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
        editorRef.current?.focus();
    };

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const insertLink = () => {
        const url = prompt("Enter URL:");
        if (url) {
            executeCommand("createLink", url);
        }
    };

    const insertImage = () => {
        const url = prompt("Enter image URL:");
        if (url) {
            executeCommand("insertImage", url);
        }
    };

    const toolbarButtons = [
        {
            icon: <Undo className="w-4 h-4" />,
            command: "undo",
            title: "Undo",
        },
        {
            icon: <Redo className="w-4 h-4" />,
            command: "redo",
            title: "Redo",
        },
        { type: "separator" },
        {
            icon: <Heading1 className="w-4 h-4" />,
            command: "formatBlock",
            value: "h1",
            title: "Heading 1",
        },
        {
            icon: <Heading2 className="w-4 h-4" />,
            command: "formatBlock",
            value: "h2",
            title: "Heading 2",
        },
        {
            icon: <Heading3 className="w-4 h-4" />,
            command: "formatBlock",
            value: "h3",
            title: "Heading 3",
        },
        { type: "separator" },
        {
            icon: <Bold className="w-4 h-4" />,
            command: "bold",
            title: "Bold",
        },
        {
            icon: <Italic className="w-4 h-4" />,
            command: "italic",
            title: "Italic",
        },
        {
            icon: <Underline className="w-4 h-4" />,
            command: "underline",
            title: "Underline",
        },
        { type: "separator" },
        {
            icon: <AlignLeft className="w-4 h-4" />,
            command: "justifyLeft",
            title: "Align Left",
        },
        {
            icon: <AlignCenter className="w-4 h-4" />,
            command: "justifyCenter",
            title: "Align Center",
        },
        {
            icon: <AlignRight className="w-4 h-4" />,
            command: "justifyRight",
            title: "Align Right",
        },
        { type: "separator" },
        {
            icon: <List className="w-4 h-4" />,
            command: "insertUnorderedList",
            title: "Bullet List",
        },
        {
            icon: <ListOrdered className="w-4 h-4" />,
            command: "insertOrderedList",
            title: "Numbered List",
        },
        {
            icon: <Quote className="w-4 h-4" />,
            command: "formatBlock",
            value: "blockquote",
            title: "Quote",
        },
        { type: "separator" },
        {
            icon: <Link className="w-4 h-4" />,
            action: insertLink,
            title: "Insert Link",
        },
        {
            icon: <ImageIcon className="w-4 h-4" />,
            action: insertImage,
            title: "Insert Image",
        },
    ];

    return (
        <div className={`border rounded-lg overflow-hidden bg-white ${className}`}>
            {/* Toolbar */}
            <div className="border-b bg-gray-50 p-2 flex flex-wrap gap-1">
                {toolbarButtons.map((button, index) => {
                    if (button.type === "separator") {
                        return (
                            <div
                                key={index}
                                className="w-px h-6 bg-gray-300 mx-1"
                            />
                        );
                    }

                    return (
                        <Button
                            key={index}
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-200"
                            onClick={() => {
                                if (button.action) {
                                    button.action();
                                } else if (button.command) {
                                    if (button.value) {
                                        executeCommand(button.command, button.value);
                                    } else {
                                        executeCommand(button.command);
                                    }
                                }
                            }}
                            title={button.title}
                        >
                            {button.icon}
                        </Button>
                    );
                })}
            </div>

            {/* Editor */}
            <div
                ref={editorRef}
                contentEditable
                className={`p-4 min-h-[300px] focus:outline-none ${
                    !content && !isEditorFocused ? "text-gray-400" : ""
                }`}
                onInput={handleInput}
                onFocus={() => setIsEditorFocused(true)}
                onBlur={() => setIsEditorFocused(false)}
                style={{
                    lineHeight: "1.6",
                }}
                suppressContentEditableWarning={true}
                dangerouslySetInnerHTML={
                    !content && !isEditorFocused
                        ? { __html: placeholder }
                        : undefined
                }
            />

            {/* Character count and tips */}
            <div className="border-t bg-gray-50 px-4 py-2 text-xs text-gray-500 flex justify-between items-center">
                <div>
                    {content.replace(/<[^>]*>/g, "").length} characters
                </div>
                <div className="flex gap-4">
                    <span>💡 Use headings to structure your content</span>
                    <span>🔗 Add links for external resources</span>
                </div>
            </div>

            {/* Custom styles for the editor content */}
            <style jsx>{`
                div[contenteditable] h1 {
                    font-family: 'Rubik', sans-serif;
                    font-size: 2rem;
                    font-weight: bold;
                    margin: 1rem 0;
                    color: #1f2937;
                }
                
                div[contenteditable] h2 {
                    font-family: 'Rubik', sans-serif;
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin: 0.875rem 0;
                    color: #374151;
                }
                
                div[contenteditable] h3 {
                    font-family: 'Markazi Text', serif;
                    font-size: 1.25rem;
                    font-weight: 500;
                    margin: 0.75rem 0;
                    color: #4b5563;
                }
                
                div[contenteditable] p {
                    margin: 0.5rem 0;
                    line-height: 1.6;
                }
                
                div[contenteditable] ul,
                div[contenteditable] ol {
                    margin: 0.5rem 0;
                    padding-left: 1.5rem;
                }
                
                div[contenteditable] li {
                    margin: 0.25rem 0;
                }
                
                div[contenteditable] blockquote {
                    border-left: 4px solid #a5cd39;
                    padding-left: 1rem;
                    margin: 1rem 0;
                    font-style: italic;
                    color: #6b7280;
                }
                
                div[contenteditable] a {
                    color: #a5cd39;
                    text-decoration: underline;
                }
                
                div[contenteditable] img {
                    max-width: 100%;
                    height: auto;
                    margin: 1rem 0;
                    border-radius: 0.5rem;
                }
            `}</style>
        </div>
    );
};

export default RichTextEditor;
