"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { contactAdminService } from '@/lib/services/contact';
import { ContactSubmissionStats } from '@/types/contact';
import { 
    MessageSquare, 
    Settings, 
    Building2, 
    MapPin, 
    Image as ImageIcon,
    Users,
    Mail,
    Phone,
    Globe
} from 'lucide-react';

// Import tab components (we'll create these)
import ContactHeroTab from '@/components/admin/contact/hero-tab';
import ContactFormSettingsTab from '@/components/admin/contact/form-settings-tab';
import ContactInfoTab from '@/components/admin/contact/info-tab';
import ContactMapTab from '@/components/admin/contact/map-tab';
import ContactSubmissionsTab from '@/components/admin/contact/submissions-tab';


export default function ContactAdminPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [stats, setStats] = useState<ContactSubmissionStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'hero');

    useEffect(() => {
        loadStats();
    }, []);

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && tab !== activeTab) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const loadStats = async () => {
        try {
            const result = await contactAdminService.getSubmissionStats();
            setStats(result);
        } catch (error) {
            console.error('Failed to load stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', tabId);
        router.push(`/admin/contact?${params.toString()}`);
    };

    const tabs = [
        {
            id: 'hero',
            label: 'Hero Section',
            icon: ImageIcon,
            description: 'Manage hero section content and background image'
        },
        {
            id: 'form-settings',
            label: 'Form Settings',
            icon: Settings,
            description: 'Configure contact form settings and validation'
        },
        {
            id: 'contact-info',
            label: 'Contact Information',
            icon: Building2,
            description: 'Manage group companies and contact details'
        },
        {
            id: 'map-parking',
            label: 'Map',
            icon: MapPin,
            description: 'Configure map settings'
        },
        {
            id: 'submissions',
            label: 'Form Submissions',
            icon: MessageSquare,
            description: 'View and manage contact form submissions',
            badge: stats?.new || 0
        }
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us Management</h1>
                <p className="text-gray-600">
                    Manage all aspects of your contact us page including content, form settings, and submissions.
                </p>
            </div>

            {/* Stats Overview */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.today} today
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">New Messages</CardTitle>
                            <Mail className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
                            <p className="text-xs text-muted-foreground">
                                Requires attention
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">This Week</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.this_week}</div>
                            <p className="text-xs text-muted-foreground">
                                Weekly submissions
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Spam Blocked</CardTitle>
                            <Globe className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.spam}</div>
                            <p className="text-xs text-muted-foreground">
                                Automatically filtered
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <TabsTrigger 
                                key={tab.id} 
                                value={tab.id}
                                className="flex items-center gap-2 text-xs lg:text-sm"
                            >
                                <Icon className="h-4 w-4" />
                                <span className="hidden sm:inline">{tab.label}</span>
                                {tab.badge && tab.badge > 0 && (
                                    <Badge variant="destructive" className="ml-1 text-xs">
                                        {tab.badge}
                                    </Badge>
                                )}
                            </TabsTrigger>
                        );
                    })}
                </TabsList>

                <TabsContent value="hero" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Hero Section</CardTitle>
                            <CardDescription>
                                Manage the hero section content and background image for the contact us page.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ContactHeroTab />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="form-settings" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Form Settings</CardTitle>
                            <CardDescription>
                                Configure contact form settings, validation rules, and success messages.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ContactFormSettingsTab />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="contact-info" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                            <CardDescription>
                                Manage group companies and contact details displayed on the contact page.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ContactInfoTab />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="map-parking" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Map Settings</CardTitle>
                            <CardDescription>
                                Configure map embed settings.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ContactMapTab />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="submissions" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Form Submissions</CardTitle>
                            <CardDescription>
                                View, manage, and respond to contact form submissions.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ContactSubmissionsTab onStatsUpdate={loadStats} />
                        </CardContent>
                    </Card>
                </TabsContent>


            </Tabs>
        </div>
    );
}
