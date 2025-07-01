"use client";

import React, { useState, useEffect } from "react";
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

    const fetchSubmissions = async () => {
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
    };

    // Fetch submissions data
    useEffect(() => {
        fetchSubmissions();
    }, [currentPage, statusFilter, eventFilter, spamFilter, searchTerm, fetchSubmissions]);

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

    const handleStatusUpdate = async (submissionId: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/events/submissions/${submissionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                fetchSubmissions(); // Refresh the list
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleDelete = async (submissionId: string) => {
        if (confirm('Are you sure you want to delete this submission?')) {
            try {
                const response = await fetch(`/api/events/submissions/${submissionId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    fetchSubmissions(); // Refresh the list
                }
            } catch (error) {
                console.error('Error deleting submission:', error);
            }
        }
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
                                                        {submission.company_name || 'Not specified'}
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
                                                                onClick={() => handleStatusUpdate(submission.id, 'reviewed')}
                                                            >
                                                                <Eye className="w-4 h-4 mr-2" />
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
        </motion.div>
    );
};

export default EventSubmissionsPage;
