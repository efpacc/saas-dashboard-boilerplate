"use client";

import { useState } from 'react';
import { useUser } from '@stackframe/stack';
import { Bell, Search, Activity, Users, TrendingUp, ChevronDown, Plus, Crown, Settings, LogOut, HelpCircle, Check, X, AlertCircle, Info, CheckCircle, Menu } from 'lucide-react';
import { useSidebar } from './SidebarContext';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import Link from 'next/link';

export default function Header() {
  const user = useUser();
  const { isExpanded, toggleMobileMenu } = useSidebar();
  const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false);

  const handleLogout = () => {
    if (user) {
      user.signOut();
    }
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchExpanded(!isMobileSearchExpanded);
  };

  return (
    <>
      <header className={`fixed top-0 right-0 z-50 bg-white border-b border-gray-200 h-16 transition-all duration-300 ${isExpanded ? 'lg:left-64' : 'lg:left-20'} left-0`}>
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        {/* Left side - Mobile menu + Main nav */}
        <div className="flex items-center space-x-4 lg:space-x-8">
          {/* Mobile hamburger menu */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </Button>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center space-x-6 ml-0">
            <a href="#" className="text-base font-medium text-gray-600 hover:text-green-600 transition-colors">
              Documentation
            </a>
            <a href="#" className="text-base font-medium text-gray-600 hover:text-green-600 transition-colors">
              API
            </a>
            <a href="#" className="text-base font-medium text-gray-600 hover:text-green-600 transition-colors">
              Support
            </a>
            <a href="#" className="text-base font-medium text-gray-600 hover:text-green-600 transition-colors">
              Pricing
            </a>
          </nav>

          {/* Mobile page title */}
          <h1 className="lg:hidden text-lg font-semibold text-gray-900">Donezo</h1>
        </div>

        {/* Center - Search */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-8">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects, resources, or start typing..."
              className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-full bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-300 focus:bg-white transition-all duration-200 text-base"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Mobile search button */}
          <Button 
            variant="ghost"
            size="sm"
            onClick={toggleMobileSearch}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Search className="w-5 h-5" />
          </Button>

          {/* Create button */}
          <Button 
            asChild
            className="bg-gradient-to-r from-green-800 to-green-900 hover:from-green-900 hover:to-green-950 text-white px-4 lg:px-8 py-3 rounded-full text-sm lg:text-base font-semibold transition-all duration-200 border-0"
          >
            <Link href="/create" className="flex items-center space-x-1">
              <Plus className="w-4 lg:w-5 h-4 lg:h-5" />
              <span className="hidden sm:inline">Add Project</span>
            </Link>
          </Button>

          {/* System Status */}
          <div className="hidden xl:flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1.5 text-green-800 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
              <Activity className="w-3 h-3" />
              <span className="font-medium">2,847</span>
            </div>
            <div className="flex items-center space-x-1.5 text-green-800 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
              <TrendingUp className="w-3 h-3" />
              <span className="font-medium">99.9%</span>
            </div>
          </div>

          {/* Notifications */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
                className="relative p-3 text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-full transition-all duration-200"
              >
                <Bell />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-sm animate-pulse"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              sideOffset={12}
              alignOffset={-8}
              className="w-96 rounded-2xl border border-gray-200 shadow-2xl bg-white backdrop-blur-sm p-0 max-h-[480px] overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-green-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                  <div className="flex items-center space-x-2">
                    <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">3 new</span>
                    <Button variant="ghost" size="sm" className="p-1 h-auto text-green-800 hover:text-green-900">
                      <span className="text-xs font-medium">Mark all read</span>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {/* New deployment notification */}
                <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer relative">
                  <div className="absolute left-4 top-4 w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="ml-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium text-gray-900">Deployment Successful</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Your project "Dashboard v2.1" has been deployed successfully to production.
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">2 minutes ago</span>
                          <Button variant="ghost" size="sm" className="p-1 h-auto">
                            <X className="w-3 h-3 text-gray-400" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Team invitation notification */}
                <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer relative">
                  <div className="absolute left-4 top-4 w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="ml-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Users className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium text-gray-900">New Team Member</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Sarah Johnson joined your team as a Developer.
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">15 minutes ago</span>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" className="text-xs text-green-600 hover:text-green-700 p-1 h-auto">
                              View profile
                            </Button>
                            <Button variant="ghost" size="sm" className="p-1 h-auto">
                              <X className="w-3 h-3 text-gray-400" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security alert notification */}
                <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer relative">
                  <div className="absolute left-4 top-4 w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="ml-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <AlertCircle className="w-4 h-4 text-orange-500" />
                          <span className="text-sm font-medium text-gray-900">Security Alert</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          New login detected from San Francisco, CA. If this wasn't you, please secure your account.
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">1 hour ago</span>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" className="text-xs text-orange-600 hover:text-orange-700 p-1 h-auto">
                              Review
                            </Button>
                            <Button variant="ghost" size="sm" className="p-1 h-auto">
                              <X className="w-3 h-3 text-gray-400" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Usage limit notification */}
                <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Info className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-gray-900">Usage Limit Reminder</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        You've used 80% of your monthly API calls. Consider upgrading to avoid service interruption.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">3 hours ago</span>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" className="text-xs text-green-600 hover:text-green-700 p-1 h-auto">
                            Upgrade
                          </Button>
                          <Button variant="ghost" size="sm" className="p-1 h-auto">
                            <X className="w-3 h-3 text-gray-400" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project shared notification */}
                <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Activity className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-gray-900">Project Update</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Mike Chen shared "Mobile App Redesign" project with you.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Yesterday</span>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" className="text-xs text-green-600 hover:text-green-700 p-1 h-auto">
                            View project
                          </Button>
                          <Button variant="ghost" size="sm" className="p-1 h-auto">
                            <X className="w-3 h-3 text-gray-400" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* System maintenance notification */}
                <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Settings className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">Scheduled Maintenance</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        System maintenance scheduled for this weekend. No downtime expected.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">2 days ago</span>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" className="text-xs text-gray-600 hover:text-gray-700 p-1 h-auto">
                            Learn more
                          </Button>
                          <Button variant="ghost" size="sm" className="p-1 h-auto">
                            <X className="w-3 h-3 text-gray-400" />
          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <Button variant="ghost" className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  View all notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile Dropdown */}
          {user ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-2 px-3 py-2 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-full transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-green-800 to-green-900 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm font-semibold">
                      {user?.displayName?.charAt(0) || user?.primaryEmail?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-gray-400 hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                sideOffset={12}
                alignOffset={-8}
                className="w-64 rounded-2xl border border-gray-200 shadow-2xl bg-white backdrop-blur-sm p-2"
              >
                <DropdownMenuLabel className="px-4 py-4 border-b border-gray-100 mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-800 to-green-900 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-base font-semibold">
                        {user?.displayName?.charAt(0) || user?.primaryEmail?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-gray-900 truncate">
                        {user?.displayName || 'User'}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {user?.primaryEmail || 'user@example.com'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center mt-3">
                    <div className="bg-gradient-to-r from-green-800 to-green-900 text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                      Pro Plan
                    </div>
                  </div>
                </DropdownMenuLabel>
                
                <div className="space-y-1">
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 rounded-xl cursor-pointer transition-all duration-200 group">
                      <Settings className="w-4 h-4 mr-3 text-gray-500 group-hover:text-green-600 transition-colors" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link href="/upgrade" className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:text-green-700 rounded-xl cursor-pointer transition-all duration-200 group">
                      <Crown className="w-4 h-4 mr-3 text-green-500 group-hover:text-green-600 transition-colors" />
                      Upgrade to Pro
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link href="/help" className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 rounded-xl cursor-pointer transition-all duration-200 group">
                      <HelpCircle className="w-4 h-4 mr-3 text-gray-500 group-hover:text-green-600 transition-colors" />
                      Help & Support
                    </Link>
                  </DropdownMenuItem>
                </div>
                
                <DropdownMenuSeparator className="my-3 border-gray-200" />
                
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-700 rounded-xl cursor-pointer transition-all duration-200 group"
                >
                  <LogOut className="w-4 h-4 mr-3 text-red-500 group-hover:text-red-700 transition-colors" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/handler/sign-in"
              className="flex items-center space-x-2 px-3 py-2 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-full transition-all duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-green-800 to-green-900 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-semibold">?</span>
              </div>
              <ChevronDown className="w-3 h-3 text-gray-400 hidden sm:block" />
            </Link>
          )}
        </div>
      </div>
    </header>

      {/* Mobile Search Overlay */}
      {isMobileSearchExpanded && (
        <div className={`fixed top-16 right-0 left-0 z-40 bg-white border-b border-gray-200 p-4 md:hidden transition-all duration-300 ${isExpanded ? 'lg:left-64' : 'lg:left-20'}`}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects, resources, or start typing..."
              className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-full bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-300 focus:bg-white transition-all duration-200 text-base"
              autoFocus
            />
            <Button 
              variant="ghost"
              size="sm"
              onClick={toggleMobileSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
} 