'use client';

import { usePathname } from "next/navigation";
import Header from "@/components/layout/header-new";
import Footer from "@/components/layout/footer";


export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Check if the current path is for admin, login, or signup pages
  const isAdminOrAuthPage = pathname?.startsWith('/admin') ||
                           pathname?.startsWith('/login') ||
                           pathname?.startsWith('/signup');

  return (
    <>
      {/* Only show header on non-admin and non-auth pages */}
      {!isAdminOrAuthPage && <Header />}
      <div>
        {children}
      </div>
      {/* Only show footer on non-admin and non-auth pages */}
      {!isAdminOrAuthPage && <Footer />}
    </>
  );
}
