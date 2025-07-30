"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    Calendar,
    Tag,
    User,
    MoreHorizontal,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

// Event status type (similar to BlogPostStatus)
type EventStatus = "draft" | "published";

interface EventWithCategory {
    id: string;
    title: string;
    slug: string;
    short_description?: string;
    description?: string;
    featured_image_url?: string;
    start_date?: string;
    end_date?: string;
    venue?: string;
    organizer?: string;
    is_active: boolean;
    is_featured: boolean;
    published_at?: string;
    created_at: string;
    updated_at: string;
    view_count?: number;
    category_id?: string;
    category_name?: string;
    category_color?: string;
    status?: EventStatus;
}

const EventsAdminPage = () => {
    const [events, setEvents] = useState<EventWithCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<EventStatus | "all">(
        "all",
    );
    const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
    const supabase = createClient();

    // Fetch events
    const fetchEvents = async () => {
        try {
            setLoading(true);
            let query = supabase
                .from("events")
                .select(
                    `
                    *,
                    event_categories (
                        name,
                        color
                    )
                `,
                )
                .order("created_at", { ascending: false });

            // Apply status filter based on is_active and published_at
            if (statusFilter === "published") {
                query = query
                    .eq("is_active", true)
                    .not("published_at", "is", null);
            } else if (statusFilter === "draft") {
                query = query.is("published_at", null);
            }

            if (searchTerm) {
                query = query.or(
                    `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,organizer.ilike.%${searchTerm}%`,
                );
            }

            const { data, error } = await query;

            if (error) {
                console.error("Error fetching events:", error);
                return;
            }

            const eventsWithCategory =
                data?.map(event => ({
                    ...event,
                    category_name: event.event_categories?.name,
                    category_color: event.event_categories?.color,
                    // Determine status based on is_active and published_at
                    status:
                        event.published_at && event.is_active
                            ? ("published" as EventStatus)
                            : !event.published_at
                            ? ("draft" as EventStatus)
                            : ("archived" as EventStatus),
                })) || [];

            setEvents(eventsWithCategory);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter, searchTerm]);

    // Delete event
    const handleDelete = async (eventId: string) => {
        if (!confirm("Are you sure you want to delete this event?")) return;

        try {
            const response = await fetch(`/api/events/${eventId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                console.error("Error deleting event");
                return;
            }

            setEvents(events.filter(event => event.id !== eventId));
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Update event status
    const handleStatusChange = async (
        eventId: string,
        newStatus: EventStatus,
    ) => {
        try {
            let action = "";
            let value = null;

            switch (newStatus) {
                case "published":
                    action = "publish";
                    break;
                case "draft":
                    action = "unpublish";
                    break;
            }

            const response = await fetch(`/api/events/${eventId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ action, value }),
            });

            if (!response.ok) {
                console.error("Error updating event status");
                return;
            }

            fetchEvents();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Bulk actions
    const handleBulkDelete = async () => {
        if (
            !confirm(
                `Are you sure you want to delete ${selectedEvents.length} events?`,
            )
        )
            return;

        try {
            const deletePromises = selectedEvents.map(eventId =>
                fetch(`/api/events/${eventId}`, { method: "DELETE" }),
            );

            await Promise.all(deletePromises);

            setEvents(
                events.filter(event => !selectedEvents.includes(event.id)),
            );
            setSelectedEvents([]);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const getStatusBadge = (status: EventStatus) => {
        const styles = {
            draft: "bg-gray-100 text-gray-800",
            published: "bg-green-100 text-green-800",
        };

        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}
            >
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Events</h1>
                    <p className="text-gray-600 mt-2">Manage your events</p>
                </div>
                <Link href="/admin/pages/events/create">
                    <Button className="bg-[#a5cd39] hover:bg-[#8fb82e] text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Event
                    </Button>
                </Link>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search events..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={statusFilter}
                            onChange={e =>
                                setStatusFilter(
                                    e.target.value as EventStatus | "all",
                                )
                            }
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39]"
                        >
                            <option value="all">All Status</option>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                        {selectedEvents.length > 0 && (
                            <Button
                                variant="destructive"
                                onClick={handleBulkDelete}
                                className="ml-2"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete ({selectedEvents.length})
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Events Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a5cd39] mx-auto"></div>
                        <p className="text-gray-600 mt-2">Loading events...</p>
                    </div>
                ) : events.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-600">No events found</p>
                        <Link href="/admin/pages/events/create">
                            <Button className="mt-4 bg-[#a5cd39] hover:bg-[#8fb82e] text-white">
                                Create your first event
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <input
                                            type="checkbox"
                                            checked={
                                                selectedEvents.length ===
                                                    events.length &&
                                                events.length > 0
                                            }
                                            onChange={e => {
                                                if (e.target.checked) {
                                                    setSelectedEvents(
                                                        events.map(
                                                            event => event.id,
                                                        ),
                                                    );
                                                } else {
                                                    setSelectedEvents([]);
                                                }
                                            }}
                                            className="rounded border-gray-300 text-[#a5cd39] focus:ring-[#a5cd39]"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Views
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {events.map(event => (
                                    <tr
                                        key={event.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={selectedEvents.includes(
                                                    event.id,
                                                )}
                                                onChange={e => {
                                                    if (e.target.checked) {
                                                        setSelectedEvents([
                                                            ...selectedEvents,
                                                            event.id,
                                                        ]);
                                                    } else {
                                                        setSelectedEvents(
                                                            selectedEvents.filter(
                                                                id =>
                                                                    id !==
                                                                    event.id,
                                                            ),
                                                        );
                                                    }
                                                }}
                                                className="rounded border-gray-300 text-[#a5cd39] focus:ring-[#a5cd39]"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                {event.featured_image_url && (
                                                    <img
                                                        src={
                                                            event.featured_image_url
                                                        }
                                                        alt={event.title}
                                                        className="w-10 h-10 rounded object-cover mr-3"
                                                    />
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {event.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        /{event.slug}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(
                                                event.status as EventStatus,
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {event.category_name && (
                                                <span
                                                    className="px-2 py-1 rounded-full text-xs font-medium text-white"
                                                    style={{
                                                        backgroundColor:
                                                            event.category_color,
                                                    }}
                                                >
                                                    {event.category_name}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {event.published_at
                                                ? formatDate(event.published_at)
                                                : formatDate(event.created_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {event.view_count || 0}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                {event.status ===
                                                    "published" && (
                                                    <Link
                                                        href={`/${event.slug}`}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                )}
                                                <Link
                                                    href={`/admin/pages/events/edit/${event.id}`}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <div className="relative group">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                    >
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                                        <div className="py-1">
                                                            {event.status !==
                                                                "published" && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleStatusChange(
                                                                            event.id,
                                                                            "published",
                                                                        )
                                                                    }
                                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                >
                                                                    Publish
                                                                </button>
                                                            )}
                                                            {event.status !==
                                                                "draft" && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleStatusChange(
                                                                            event.id,
                                                                            "draft",
                                                                        )
                                                                    }
                                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                >
                                                                    Move to
                                                                    Draft
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        event.id,
                                                                    )
                                                                }
                                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventsAdminPage;
