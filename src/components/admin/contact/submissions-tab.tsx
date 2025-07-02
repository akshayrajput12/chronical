"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { contactAdminService } from '@/lib/services/contact';
import { ContactFormSubmission, ContactFormSubmissionStatus } from '@/types/contact';
import { 
    Search, 
    Filter, 
    Eye, 
    Reply, 
    Trash2, 
    Download,
    Loader2, 
    AlertCircle, 
    CheckCircle,
    Mail,
    Phone,
    Calendar,
    User,
    MessageSquare,
    Archive,
    Star
} from 'lucide-react';

interface ContactSubmissionsTabProps {
    onStatsUpdate?: () => void;
}

export default function ContactSubmissionsTab({ onStatsUpdate }: ContactSubmissionsTabProps) {
    const [submissions, setSubmissions] = useState<ContactFormSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<ContactFormSubmissionStatus | 'all'>('all');
    const [selectedSubmission, setSelectedSubmission] = useState<ContactFormSubmission | null>(null);
    const [showViewDialog, setShowViewDialog] = useState(false);
    const [showReplyDialog, setShowReplyDialog] = useState(false);
    const [replyMessage, setReplyMessage] = useState('');
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadSubmissions();
    }, []);

    const loadSubmissions = async () => {
        try {
            setLoading(true);
            const data = await contactAdminService.getSubmissions();
            console.log('Loaded submissions:', data); // Debug log
            setSubmissions(data);
        } catch (error) {
            console.error('Failed to load submissions:', error);
            setError('Failed to load submissions');
        } finally {
            setLoading(false);
        }
    };

    const filteredSubmissions = submissions.filter(submission => {
        const matchesSearch = !searchTerm ||
            submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (submission.company_name && submission.company_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (submission.exhibition_name && submission.exhibition_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            submission.message.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Debug logging
    console.log('Total submissions:', submissions.length);
    console.log('Filtered submissions:', filteredSubmissions.length);
    console.log('Search term:', searchTerm);
    console.log('Status filter:', statusFilter);

    const handleViewSubmission = (submission: ContactFormSubmission) => {
        setSelectedSubmission(submission);
        setShowViewDialog(true);
        // Mark as read if it's new
        if (submission.status === 'new') {
            handleStatusChange(submission.id, 'read');
        }
    };

    const handleReplySubmission = (submission: ContactFormSubmission) => {
        setSelectedSubmission(submission);
        setReplyMessage('');
        setShowReplyDialog(true);
    };

    const handleStatusChange = async (submissionId: string, newStatus: ContactFormSubmissionStatus) => {
        try {
            setActionLoading(true);
            const success = await contactAdminService.updateSubmissionStatus(submissionId, newStatus);
            if (success) {
                setSubmissions(prev => 
                    prev.map(sub => 
                        sub.id === submissionId 
                            ? { ...sub, status: newStatus, updated_at: new Date().toISOString() }
                            : sub
                    )
                );
                setSuccess('Status updated successfully');
                onStatsUpdate?.();
            } else {
                setError('Failed to update status');
            }
        } catch (error) {
            console.error('Status update error:', error);
            setError('Failed to update status');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteSubmission = async (submissionId: string) => {
        if (!confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
            return;
        }

        try {
            setActionLoading(true);
            const success = await contactAdminService.deleteSubmission(submissionId);
            if (success) {
                setSubmissions(prev => prev.filter(sub => sub.id !== submissionId));
                setSuccess('Submission deleted successfully');
                onStatsUpdate?.();
            } else {
                setError('Failed to delete submission');
            }
        } catch (error) {
            console.error('Delete error:', error);
            setError('Failed to delete submission');
        } finally {
            setActionLoading(false);
        }
    };

    const handleSendReply = async () => {
        if (!selectedSubmission || !replyMessage.trim()) {
            setError('Reply message is required');
            return;
        }

        try {
            setActionLoading(true);
            const success = await contactAdminService.sendReply(selectedSubmission.id, replyMessage);
            if (success) {
                setSuccess('Reply sent successfully');
                setShowReplyDialog(false);
                setReplyMessage('');
                // Update status to replied
                handleStatusChange(selectedSubmission.id, 'replied');
            } else {
                setError('Failed to send reply');
            }
        } catch (error) {
            console.error('Reply error:', error);
            setError('Failed to send reply');
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusBadge = (status: ContactFormSubmissionStatus) => {
        const variants = {
            new: 'bg-blue-100 text-blue-800',
            read: 'bg-gray-100 text-gray-800',
            replied: 'bg-green-100 text-green-800',
            archived: 'bg-yellow-100 text-yellow-800',
            spam: 'bg-red-100 text-red-800'
        };

        const labels = {
            new: 'New',
            read: 'Read',
            replied: 'Replied',
            archived: 'Archived',
            spam: 'Spam'
        };

        return (
            <Badge className={variants[status]}>
                {labels[status]}
            </Badge>
        );
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading submissions...</span>
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

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Contact Form Submissions
                    </CardTitle>
                    <CardDescription>
                        View and manage all contact form submissions
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <Label htmlFor="search">Search Submissions</Label>
                            <div className="relative mt-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by name, email, company, exhibition, or message..."
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="sm:w-48">
                            <Label htmlFor="status-filter">Filter by Status</Label>
                            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="All statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="new">New</SelectItem>
                                    <SelectItem value="read">Read</SelectItem>
                                    <SelectItem value="replied">Replied</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                    <SelectItem value="spam">Spam</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Submissions List */}
            <div className="space-y-4">
                {filteredSubmissions.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-8">
                            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {searchTerm || statusFilter !== 'all' ? 'No Matching Submissions' : 'No Submissions Yet'}
                            </h3>
                            <p className="text-gray-600">
                                {searchTerm || statusFilter !== 'all' 
                                    ? 'Try adjusting your search or filter criteria.'
                                    : 'Contact form submissions will appear here when users submit the form.'
                                }
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredSubmissions.map((submission) => (
                        <Card key={submission.id} className={`${submission.status === 'new' ? 'border-blue-200 bg-blue-50/30' : ''}`}>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold text-lg">
                                                {submission.exhibition_name
                                                    ? `${submission.name} - ${submission.exhibition_name}`
                                                    : submission.company_name
                                                        ? `${submission.name} - ${submission.company_name}`
                                                        : submission.name
                                                }
                                            </h3>
                                            {getStatusBadge(submission.status)}
                                            {submission.status === 'new' && <Star className="h-4 w-4 text-blue-500" />}
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                                            <div className="flex items-center gap-1">
                                                <User className="h-4 w-4" />
                                                <span>{submission.name}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Mail className="h-4 w-4" />
                                                <span>{submission.email}</span>
                                            </div>
                                            {submission.phone && (
                                                <div className="flex items-center gap-1">
                                                    <Phone className="h-4 w-4" />
                                                    <span>{submission.phone}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                <span>{formatDate(submission.created_at)}</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 line-clamp-2">{submission.message}</p>
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewSubmission(submission)}
                                            className="flex items-center gap-1"
                                        >
                                            <Eye className="h-4 w-4" />
                                            View
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleReplySubmission(submission)}
                                            className="flex items-center gap-1"
                                        >
                                            <Reply className="h-4 w-4" />
                                            Reply
                                        </Button>
                                        <Select
                                            value={submission.status}
                                            onValueChange={(value: ContactFormSubmissionStatus) =>
                                                handleStatusChange(submission.id, value)
                                            }
                                        >
                                            <SelectTrigger className="w-32">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="new">New</SelectItem>
                                                <SelectItem value="read">Read</SelectItem>
                                                <SelectItem value="replied">Replied</SelectItem>
                                                <SelectItem value="archived">Archived</SelectItem>
                                                <SelectItem value="spam">Spam</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDeleteSubmission(submission.id)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* View Submission Dialog */}
            <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Submission Details</DialogTitle>
                        <DialogDescription>
                            Full details of the contact form submission
                        </DialogDescription>
                    </DialogHeader>
                    
                    {selectedSubmission && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Name</Label>
                                    <p className="font-medium">{selectedSubmission.name}</p>
                                </div>
                                <div>
                                    <Label>Email</Label>
                                    <p className="font-medium">{selectedSubmission.email}</p>
                                </div>
                                {selectedSubmission.phone && (
                                    <div>
                                        <Label>Phone</Label>
                                        <p className="font-medium">{selectedSubmission.phone}</p>
                                    </div>
                                )}
                                {selectedSubmission.company_name && (
                                    <div>
                                        <Label>Company Name</Label>
                                        <p className="font-medium">{selectedSubmission.company_name}</p>
                                    </div>
                                )}
                                {selectedSubmission.exhibition_name && (
                                    <div>
                                        <Label>Exhibition Name</Label>
                                        <p className="font-medium">{selectedSubmission.exhibition_name}</p>
                                    </div>
                                )}
                                <div>
                                    <Label>Status</Label>
                                    <div className="mt-1">
                                        {getStatusBadge(selectedSubmission.status)}
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <Label>Message</Label>
                                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                    <p className="whitespace-pre-wrap">{selectedSubmission.message}</p>
                                </div>
                            </div>
                            
                            <div className="text-sm text-gray-500">
                                <p>Submitted: {formatDate(selectedSubmission.created_at)}</p>
                                {selectedSubmission.updated_at !== selectedSubmission.created_at && (
                                    <p>Updated: {formatDate(selectedSubmission.updated_at)}</p>
                                )}
                            </div>
                        </div>
                    )}
                    
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowViewDialog(false)}>
                            Close
                        </Button>
                        {selectedSubmission && (
                            <Button onClick={() => {
                                setShowViewDialog(false);
                                handleReplySubmission(selectedSubmission);
                            }}>
                                <Reply className="h-4 w-4 mr-2" />
                                Reply
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reply Dialog */}
            <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Reply to Submission</DialogTitle>
                        <DialogDescription>
                            Send a reply to {selectedSubmission?.name} ({selectedSubmission?.email})
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="reply-message">Reply Message</Label>
                            <Textarea
                                id="reply-message"
                                value={replyMessage}
                                onChange={(e) => setReplyMessage(e.target.value)}
                                placeholder="Type your reply message here..."
                                rows={6}
                                className="mt-1"
                            />
                        </div>
                    </div>
                    
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setShowReplyDialog(false)}
                            disabled={actionLoading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleSendReply}
                            disabled={actionLoading || !replyMessage.trim()}
                        >
                            {actionLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Reply className="h-4 w-4 mr-2" />
                                    Send Reply
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
