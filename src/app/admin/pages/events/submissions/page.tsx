"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Search,
    Filter,
    Download,
    Eye,
    Trash2,
    Mail,
    Calendar,
    Building,
    User,
    MessageSquare,
    AlertTriangle,
    CheckCircle,
    Clock,
    Archive,
    MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { EventFormSubmission } from "@/types/events";

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

const EventSubmissionsPage = () => {
    // State management
    const [submissions, setSubmissions] = useState<EventFormSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [eventFilter, setEventFilter] = useState<string>("all");
    const [spamFilter, setSpamFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalSubmissions, setTotalSubmissions] = useState(0);

    // View modal state
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState<EventFormSubmission | null>(null);

    const fetchSubmissions = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: '20',
                ...(statusFilter !== 'all' && { status: statusFilter }),
                ...(eventFilter !== 'all' && { event_id: eventFilter }),
                ...(spamFilter !== 'all' && { is_spam: spamFilter }),
                ...(searchTerm && { search: searchTerm }),
            });

            const response = await fetch(`/api/events/submissions?${params}`);
            const data = await response.json();

            if (data.submissions) {
                setSubmissions(data.submissions);
                setTotalPages(data.pagination?.total_pages || 1);
                setTotalSubmissions(data.pagination?.total_count || 0);
            }
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setLoading(false);
        }
    }, [currentPage, statusFilter, eventFilter, spamFilter, searchTerm]);

    // Fetch submissions data
    useEffect(() => {
        fetchSubmissions();
    }, [fetchSubmissions]);

    // View submission handler
    const handleViewSubmission = (submission: EventFormSubmission) => {
        setSelectedSubmission(submission);
        setViewModalOpen(true);
    };

    // Download attachment handler
    const handleDownloadAttachment = async (submission: EventFormSubmission) => {
        if (!submission.attachment_url) return;

        try {
            // Create a temporary link to download the file
            const link = document.createElement('a');
            link.href = submission.attachment_url;
            link.download = submission.attachment_filename || 'attachment';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading attachment:', error);
        }
    };

    // Status update handler
    const handleStatusUpdate = async (submissionId: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/events/submissions/${submissionId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                // Refresh submissions
                fetchSubmissions();
            } else {
                console.error('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    // Delete handler
    const handleDelete = async (submissionId: string) => {
        if (!confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`/api/events/submissions/${submissionId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Refresh submissions
                fetchSubmissions();
            } else {
                console.error('Failed to delete submission');
            }
        } catch (error) {
            console.error('Error deleting submission:', error);
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            new: { color: "bg-blue-100 text-blue-800", icon: Clock, label: "New" },
            reviewed: { color: "bg-yellow-100 text-yellow-800", icon: Eye, label: "Reviewed" },
            responded: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Responded" },
            archived: { color: "bg-gray-100 text-gray-800", icon: Archive, label: "Archived" },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
        const Icon = config.icon;

        return (
            <Badge className={`${config.color} flex items-center gap-1`}>
                <Icon className="w-3 h-3" />
                {config.label}
            </Badge>
        );
    };

    const formatDate = (dateString: string) => {
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
            className="p-6 max-w-7xl mx-auto space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                variants={itemVariants}
            >
                <div className="flex items-center gap-4">
                    <Link href="/admin/pages/events">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Events
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Event Form Submissions
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Manage and respond to event inquiries ({totalSubmissions} total)
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                    </Button>
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
                            <div className="space-y-2">
                                <Label>Search</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Search by name, email, company..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="new">New</SelectItem>
                                        <SelectItem value="reviewed">Reviewed</SelectItem>
                                        <SelectItem value="responded">Responded</SelectItem>
                                        <SelectItem value="archived">Archived</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Event</Label>
                                <Select value={eventFilter} onValueChange={setEventFilter}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Events</SelectItem>
                                        {/* TODO: Add dynamic event options */}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Spam Filter</Label>
                                <Select value={spamFilter} onValueChange={setSpamFilter}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Submissions</SelectItem>
                                        <SelectItem value="false">Valid Only</SelectItem>
                                        <SelectItem value="true">Spam Only</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Submissions Table */}
            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <CardTitle>Submissions</CardTitle>
                        <CardDescription>
                            Recent form submissions from event pages
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a5cd39]"></div>
                                <span className="ml-2">Loading submissions...</span>
                            </div>
                        ) : submissions.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No submissions found matching your criteria.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Contact</TableHead>
                                            <TableHead>Event</TableHead>
                                            <TableHead>Company</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {submissions.map((submission) => (
                                            <TableRow key={submission.id}>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <User className="w-4 h-4 text-gray-400" />
                                                            <span className="font-medium">{submission.name}</span>
                                                            {submission.is_spam && (
                                                                <Badge variant="destructive" className="text-xs">
                                                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                                                    Spam
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                                            <Mail className="w-3 h-3" />
                                                            {submission.email}
                                                        </div>
                                                        {submission.phone && (
                                                            <div className="text-sm text-gray-500">
                                                                📞 {submission.phone}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">
                                                        {submission.event?.title || 'Unknown Event'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Building className="w-4 h-4 text-gray-400" />
                                                        <div className="flex flex-col">
                                                            <span>{submission.company_name || 'Not specified'}</span>
                                                            {submission.attachment_url && (
                                                                <span className="text-xs text-blue-600 flex items-center gap-1">
                                                                    <Download className="w-3 h-3" />
                                                                    Has attachment
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(submission.status)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        {formatDate(submission.created_at)}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                onClick={() => handleViewSubmission(submission)}
                                                            >
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleStatusUpdate(submission.id, 'reviewed')}
                                                            >
                                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                                Mark as Reviewed
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleStatusUpdate(submission.id, 'responded')}
                                                            >
                                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                                Mark as Responded
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleStatusUpdate(submission.id, 'archived')}
                                                            >
                                                                <Archive className="w-4 h-4 mr-2" />
                                                                Archive
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleDelete(submission.id)}
                                                                className="text-red-600"
                                                            >
                                                                <Trash2 className="w-4 h-4 mr-2" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-500">
                                            Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, totalSubmissions)} of {totalSubmissions} submissions
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                disabled={currentPage === 1}
                                            >
                                                Previous
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                disabled={currentPage === totalPages}
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* View Submission Modal */}
            <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Eye className="w-5 h-5" />
                            Submission Details
                        </DialogTitle>
                        <DialogDescription>
                            Complete form submission information
                        </DialogDescription>
                    </DialogHeader>

                    {selectedSubmission && (
                        <div className="space-y-6">
                            {/* Header Info */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <h3 className="font-semibold text-lg">{selectedSubmission.name}</h3>
                                    <p className="text-gray-600">{selectedSubmission.email}</p>
                                    {selectedSubmission.phone && (
                                        <p className="text-gray-600">📞 {selectedSubmission.phone}</p>
                                    )}
                                </div>
                                <div className="text-right">
                                    {getStatusBadge(selectedSubmission.status)}
                                    <p className="text-sm text-gray-500 mt-1">
                                        {formatDate(selectedSubmission.created_at)}
                                    </p>
                                </div>
                            </div>

                            {/* Form Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Event
                                        </label>
                                        <p className="text-gray-900">
                                            {selectedSubmission.event?.title || 'Not specified'}
                                        </p>
                                    </div>

                                    {selectedSubmission.company_name && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Company Name
                                            </label>
                                            <p className="text-gray-900">{selectedSubmission.company_name}</p>
                                        </div>
                                    )}

                                    {selectedSubmission.exhibition_name && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Exhibition Name
                                            </label>
                                            <p className="text-gray-900">{selectedSubmission.exhibition_name}</p>
                                        </div>
                                    )}

                                    {selectedSubmission.budget && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Budget
                                            </label>
                                            <p className="text-gray-900">{selectedSubmission.budget}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Contact Information
                                        </label>
                                        <div className="space-y-1">
                                            <p className="text-gray-900">{selectedSubmission.name}</p>
                                            <p className="text-gray-600">{selectedSubmission.email}</p>
                                            {selectedSubmission.phone && (
                                                <p className="text-gray-600">{selectedSubmission.phone}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Submission Info
                                        </label>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p>Date: {formatDate(selectedSubmission.created_at)}</p>
                                            {selectedSubmission.ip_address && (
                                                <p>IP: {selectedSubmission.ip_address}</p>
                                            )}
                                            {selectedSubmission.referrer && selectedSubmission.referrer !== 'direct' && (
                                                <p>Referrer: {selectedSubmission.referrer}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Attachment Section */}
                                    {selectedSubmission.attachment_url && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Attachment
                                            </label>
                                            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                                                <div className="flex-1">
                                                    <p className="font-medium text-blue-900">
                                                        {selectedSubmission.attachment_filename || 'Attachment'}
                                                    </p>
                                                    {selectedSubmission.attachment_size && (
                                                        <p className="text-sm text-blue-600">
                                                            {(selectedSubmission.attachment_size / 1024 / 1024).toFixed(2)} MB
                                                        </p>
                                                    )}
                                                </div>
                                                <Button
                                                    onClick={() => handleDownloadAttachment(selectedSubmission)}
                                                    size="sm"
                                                    className="bg-blue-600 hover:bg-blue-700"
                                                >
                                                    <Download className="w-4 h-4 mr-1" />
                                                    Download
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Message Section */}
                            {selectedSubmission.message && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Message
                                    </label>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <p className="text-gray-900 whitespace-pre-wrap">
                                            {selectedSubmission.message}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Admin Notes Section */}
                            {selectedSubmission.admin_notes && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Admin Notes
                                    </label>
                                    <div className="p-4 bg-yellow-50 rounded-lg">
                                        <p className="text-gray-900 whitespace-pre-wrap">
                                            {selectedSubmission.admin_notes}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-2 pt-4 border-t">
                                <Button
                                    variant="outline"
                                    onClick={() => setViewModalOpen(false)}
                                >
                                    Close
                                </Button>
                                {selectedSubmission.attachment_url && (
                                    <Button
                                        onClick={() => handleDownloadAttachment(selectedSubmission)}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download Attachment
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </motion.div>
    );
};

export default EventSubmissionsPage;
