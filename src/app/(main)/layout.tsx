"use client";

import { Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { SidebarProvider, useSidebar } from "@/components/SidebarContext";

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed left-0 top-0 z-40 h-screen w-20 bg-gradient-to-b from-green-800 to-green-950 animate-pulse hidden lg:block"></div>
      <div className="fixed top-0 lg:left-20 left-0 right-0 z-50 bg-white border-b border-gray-200 h-16 animate-pulse"></div>
      <main className="pt-16 lg:pl-20 pl-0 min-h-screen bg-gray-50">
        <div className="p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="bg-gray-200 h-20 rounded-xl"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-green-200 h-32 rounded-xl"></div>
                <div className="bg-gray-200 h-32 rounded-xl"></div>
                <div className="bg-gray-200 h-32 rounded-xl"></div>
                <div className="bg-gray-200 h-32 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isExpanded } = useSidebar();
  
  return (
    <>
      <Sidebar />
      <Header />
      <main className={`pt-16 min-h-screen bg-gray-50 transition-all duration-300 ${isExpanded ? 'lg:pl-64' : 'lg:pl-20'} pl-0`}>
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </>
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Suspense fallback={<LoadingFallback />}>
        <LayoutContent>
          {children}
        </LayoutContent>
      </Suspense>
    </SidebarProvider>
  );
} 