'use client';

import React from 'react';
import { Toaster } from '@/components/ui/sonner';
import AdminSidebar from './components/admin-sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {children}
        </main>
      </div>
      
      <Toaster />
    </div>
  );
}
