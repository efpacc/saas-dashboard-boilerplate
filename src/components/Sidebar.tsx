"use client";

import { Home, FolderOpen, FileText, Users, BarChart3, Settings, HelpCircle, Crown, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from './SidebarContext';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Home,
  },
  {
    name: 'Projects',
    href: '/projects',
    icon: FolderOpen,
  },
  {
    name: 'Create',
    href: '/create',
    icon: Plus,
    isPrimary: true,
  },
  {
    name: 'Resources',
    href: '/resources',
    icon: FileText,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    name: 'Team',
    href: '/team',
    icon: Users,
  },
];

const bottomItems = [
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
  {
    name: 'Help',
    href: '/help',
    icon: HelpCircle,
  },
  {
    name: 'Upgrade to Pro',
    href: '/upgrade',
    icon: Crown,
    isUpgrade: true,
  },
];

export default function Sidebar() {
  const { isExpanded, isMobileMenuOpen, toggle, setMobileMenuOpen } = useSidebar();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

      const handleMobileNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 z-40 h-screen bg-gradient-to-b from-green-800 via-green-900 to-green-950 flex flex-col transition-all duration-300
        ${isMobileMenuOpen ? 'w-64' : isExpanded ? 'w-64' : 'w-20'}
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
      {/* Logo Section */}
      <div className="flex items-center py-4 px-4">
        <Link href="/" className="flex items-center">
          <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-green-800 text-xl font-bold">D</span>
          </div>
          {(isExpanded || isMobileMenuOpen) && (
            <div className="ml-3 overflow-hidden">
              <span className="text-xl font-bold text-white whitespace-nowrap">Donezo</span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={handleMobileNavClick}
              className={`
                group flex items-center rounded-xl transition-all duration-200 relative
                ${(isExpanded || isMobileMenuOpen) ? 'w-full h-16 px-4' : 'w-16 h-16 justify-center mx-auto'}
                ${item.isPrimary 
                  ? 'bg-white text-green-800 hover:bg-gray-50' 
                  : active 
                  ? 'bg-green-700 text-white' 
                  : 'text-green-100 hover:bg-green-700/50 hover:text-white'
                }
              `}
              title={(isExpanded || isMobileMenuOpen) ? '' : item.name}
            >
              <Icon className="w-6 h-6 flex-shrink-0" />
              
              {(isExpanded || isMobileMenuOpen) && (
                <span className="ml-4 text-base font-medium whitespace-nowrap overflow-hidden">
                  {item.name}
                </span>
              )}
              
              {/* Tooltip for collapsed state */}
              {!(isExpanded || isMobileMenuOpen) && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Items */}
      <div className="px-2 py-4 space-y-2 border-t border-green-700">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={handleMobileNavClick}
              className={`
                group flex items-center rounded-xl transition-all duration-200 relative
                ${(isExpanded || isMobileMenuOpen) ? 'w-full h-16 px-4' : 'w-16 h-16 justify-center mx-auto'}
                ${item.isUpgrade
                  ? 'bg-white text-green-800 hover:bg-gray-50'
                  : active 
                  ? 'bg-green-700 text-white' 
                  : 'text-green-100 hover:bg-green-700/50 hover:text-white'
                }
              `}
              title={(isExpanded || isMobileMenuOpen) ? '' : item.name}
            >
              <Icon className="w-6 h-6 flex-shrink-0" />
              
              {(isExpanded || isMobileMenuOpen) && (
                <span className="ml-4 text-base font-medium whitespace-nowrap overflow-hidden">
                  {item.name}
                </span>
              )}
              
              {/* Tooltip for collapsed state */}
              {!(isExpanded || isMobileMenuOpen) && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Toggle Button */}
      <div className="px-2 pb-4">
        <button
          onClick={toggle}
          className={`
            group flex items-center rounded-xl transition-all duration-200 relative
            ${(isExpanded || isMobileMenuOpen) ? 'w-full h-16 px-4' : 'w-16 h-16 justify-center mx-auto'}
            text-green-100 hover:bg-green-700/50 hover:text-white border-2 border-green-700 hover:border-green-600
            ${isMobileMenuOpen ? 'lg:flex hidden' : 'flex'}
          `}
          title={(isExpanded || isMobileMenuOpen) ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isExpanded || isMobileMenuOpen ? (
            <ChevronLeft className="w-6 h-6 flex-shrink-0" />
          ) : (
            <ChevronRight className="w-6 h-6 flex-shrink-0" />
          )}
          
          {(isExpanded || isMobileMenuOpen) && (
            <span className="ml-4 text-base font-medium whitespace-nowrap overflow-hidden">
              Collapse
            </span>
          )}
          
          {/* Tooltip for collapsed state */}
          {!(isExpanded || isMobileMenuOpen) && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              {isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            </div>
          )}
        </button>
      </div>
    </div>
    </>
  );
} 