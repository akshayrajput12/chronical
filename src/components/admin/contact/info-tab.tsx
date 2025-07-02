"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { contactAdminService } from '@/lib/services/contact';
import { ContactGroupCompany, ContactGroupCompanyFormInput } from '@/types/contact';
import { 
    Save, 
    Loader2, 
    AlertCircle, 
    CheckCircle, 
    Plus, 
    Edit, 
    Trash2, 
    Building2,
    Phone,
    Mail,
    MapPin
} from 'lucide-react';

export default function ContactInfoTab() {
    const [companies, setCompanies] = useState<ContactGroupCompany[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [editingCompany, setEditingCompany] = useState<ContactGroupCompany | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [formData, setFormData] = useState<ContactGroupCompanyFormInput>({
        name: '',
        description: '',
        phone: '',
        email: '',
        address: '',
        is_active: true,
        display_order: 0
    });

    useEffect(() => {
        loadCompanies();
    }, []);

    const loadCompanies = async () => {
        try {
            setLoading(true);
            const data = await contactAdminService.getGroupCompanies();
            setCompanies(data);
        } catch (error) {
            console.error('Failed to load companies:', error);
            setError('Failed to load group companies');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            phone: '',
            email: '',
            address: '',
            is_active: true,
            display_order: companies.length
        });
        setEditingCompany(null);
    };

    const handleAdd = () => {
        resetForm();
        setShowDialog(true);
    };

    const handleEdit = (company: ContactGroupCompany) => {
        setFormData({
            name: company.region,
            description: company.description || '',
            phone: company.phone,
            email: company.email,
            address: company.address,
            is_active: company.is_active,
            display_order: company.sort_order
        });
        setEditingCompany(company);
        setShowDialog(true);
    };

    const handleInputChange = (field: keyof ContactGroupCompanyFormInput, value: string | number | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError('');
            setSuccess('');

            // Validate required fields
            if (!formData.name.trim()) {
                setError('Company name is required');
                return;
            }
            if (!formData.description.trim()) {
                setError('Description is required');
                return;
            }

            let result;
            if (editingCompany) {
                // Update existing
                result = await contactAdminService.updateGroupCompany(editingCompany.id, formData);
            } else {
                // Create new
                result = await contactAdminService.createGroupCompany(formData);
            }

            if (result) {
                setSuccess(`Company ${editingCompany ? 'updated' : 'created'} successfully!`);
                setShowDialog(false);
                resetForm();
                loadCompanies();
            } else {
                setError('Failed to save company');
            }
        } catch (error) {
            console.error('Save error:', error);
            setError('Failed to save company');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (company: ContactGroupCompany) => {
        if (!confirm(`Are you sure you want to delete "${company.region}"?`)) {
            return;
        }

        try {
            const success = await contactAdminService.deleteGroupCompany(company.id);
            if (success) {
                setSuccess('Company deleted successfully!');
                loadCompanies();
            } else {
                setError('Failed to delete company');
            }
        } catch (error) {
            console.error('Delete error:', error);
            setError('Failed to delete company');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading group companies...</span>
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

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Group Companies</h3>
                    <p className="text-sm text-gray-600">
                        Manage the group companies displayed on the contact page
                    </p>
                </div>
                <Button onClick={handleAdd} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Company
                </Button>
            </div>

            {/* Companies List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {companies.map((company) => (
                    <Card key={company.id} className={`${!company.is_active ? 'opacity-60' : ''}`}>
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-blue-600" />
                                    <CardTitle className="text-base">{company.region}</CardTitle>
                                </div>
                                <div className="flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEdit(company)}
                                        className="h-8 w-8 p-0"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(company)}
                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            {!company.is_active && (
                                <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                                    Inactive
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="text-sm text-gray-600">{company.description}</p>
                            
                            {company.phone && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    <span>{company.phone}</span>
                                </div>
                            )}
                            
                            {company.email && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <span>{company.email}</span>
                                </div>
                            )}
                            
                            {company.address && (
                                <div className="flex items-start gap-2 text-sm">
                                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                    <span className="flex-1">{company.address}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {companies.length === 0 && (
                <Card>
                    <CardContent className="text-center py-8">
                        <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Companies Added</h3>
                        <p className="text-gray-600 mb-4">
                            Add your first group company to display contact information on the contact page.
                        </p>
                        <Button onClick={handleAdd} className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add First Company
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingCompany ? 'Edit Company' : 'Add New Company'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingCompany 
                                ? 'Update the company information below.'
                                : 'Enter the details for the new group company.'
                            }
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Company Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Enter company name"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="Enter company description"
                                rows={3}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                placeholder="Enter phone number"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="Enter email address"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="address">Address</Label>
                            <Textarea
                                id="address"
                                value={formData.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                placeholder="Enter company address"
                                rows={2}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="display_order">Display Order</Label>
                            <Input
                                id="display_order"
                                type="number"
                                min="0"
                                value={formData.display_order}
                                onChange={(e) => handleInputChange('display_order', parseInt(e.target.value) || 0)}
                                className="mt-1"
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="is_active"
                                checked={formData.is_active}
                                onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                            />
                            <Label htmlFor="is_active">Active</Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDialog(false)}
                            disabled={saving}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    {editingCompany ? 'Update' : 'Create'} Company
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
