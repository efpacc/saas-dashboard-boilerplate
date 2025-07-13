"use client";

import { useState } from 'react';
import { useUser } from '@stackframe/stack';
import { 
  Users, 
  Plus, 
  Mail, 
  MoreVertical, 
  Crown, 
  Shield, 
  User, 
  Settings, 
  Trash2, 
  Clock,
  Search,
  Filter,
  UserPlus,
  Star,
  TrendingUp,
  Activity,
  ArrowRight,
  Sparkles,
  Globe,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock data for demonstration - in real app, this would come from Stack Auth
const mockTeamMembers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@company.com',
    role: 'Owner',
    avatar: null,
    status: 'active',
    joinedAt: '2024-01-15',
    lastActive: '2 hours ago',
    projectsCount: 12,
    isOnline: true
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah@company.com',
    role: 'Admin',
    avatar: null,
    status: 'active',
    joinedAt: '2024-01-20',
    lastActive: '1 day ago',
    projectsCount: 8,
    isOnline: false
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike@company.com',
    role: 'Member',
    avatar: null,
    status: 'active',
    joinedAt: '2024-02-01',
    lastActive: '3 days ago',
    projectsCount: 5,
    isOnline: true
  },
  {
    id: '4',
    name: 'Emma Davis',
    email: 'emma@company.com',
    role: 'Member',
    avatar: null,
    status: 'active',
    joinedAt: '2024-02-10',
    lastActive: '1 week ago',
    projectsCount: 3,
    isOnline: false
  }
];

const mockPendingInvitations = [
  {
    id: '1',
    email: 'alex@company.com',
    role: 'Member',
    invitedBy: 'John Doe',
    invitedAt: '2024-01-25',
    status: 'pending'
  },
  {
    id: '2',
    email: 'lisa@company.com',
    role: 'Admin',
    invitedBy: 'Sarah Wilson',
    invitedAt: '2024-01-28',
    status: 'pending'
  }
];

const roleConfig = {
  Owner: {
    icon: Crown,
    color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    textColor: 'text-white',
    badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    description: 'Full access to all features and settings'
  },
  Admin: {
    icon: Shield,
    color: 'bg-gradient-to-r from-green-800 to-green-900',
    textColor: 'text-white',
    badgeColor: 'bg-green-100 text-green-800 border-green-200',
    description: 'Can manage team members and most settings'
  },
  Member: {
    icon: User,
    color: 'bg-gradient-to-r from-green-600 to-green-700',
    textColor: 'text-white',
    badgeColor: 'bg-green-50 text-green-700 border-green-200',
    description: 'Can access and collaborate on projects'
  }
};

export default function TeamPage() {
  const user = useUser({ or: "redirect" });
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Member');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const filteredMembers = mockTeamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleInviteMember = () => {
    // TODO: Integrate with Stack Auth team invitation API
    console.log('Inviting:', inviteEmail, 'as', inviteRole);
    setShowInviteModal(false);
    setInviteEmail('');
    setInviteRole('Member');
  };

  const handleRemoveMember = (memberId: string) => {
    // TODO: Integrate with Stack Auth remove member API
    console.log('Removing member:', memberId);
  };

  const handleChangeRole = (memberId: string, newRole: string) => {
    // TODO: Integrate with Stack Auth role change API
    console.log('Changing role for:', memberId, 'to:', newRole);
  };

  const handleResendInvitation = (invitationId: string) => {
    // TODO: Integrate with Stack Auth resend invitation API
    console.log('Resending invitation:', invitationId);
  };

  const handleCancelInvitation = (invitationId: string) => {
    // TODO: Integrate with Stack Auth cancel invitation API
    console.log('Canceling invitation:', invitationId);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-800 to-green-900 rounded-3xl p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-800/90 to-green-900/90"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold mb-4 flex items-center gap-4">
                <Users className="w-12 h-12" />
                Team Management
              </h1>
              <p className="text-xl text-green-100 mb-8 max-w-2xl">
                Collaborate with your team members, manage permissions, and build amazing things together.
              </p>
              
              <div className="flex items-center gap-6 text-green-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm font-medium">
                    {mockTeamMembers.filter(m => m.isOnline).length} online now
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-medium">Global collaboration</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <Button 
                onClick={() => setShowInviteModal(true)}
                className="bg-white text-green-800 hover:bg-green-50 hover:text-green-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Invite Team Member
              </Button>
              <div className="text-center">
                <p className="text-green-100 text-sm">
                  ⌘ + I to invite anywhere
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Your Team Dashboard 👥
          </h2>
          <p className="text-gray-600 mt-1">
            Monitor team activity, manage roles, and foster collaboration.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
            <Activity className="w-3 h-3 mr-1" />
            All systems operational
          </Badge>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Members</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{mockTeamMembers.length}</p>
                <div className="text-sm text-green-600 flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +2 this month
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Online Now</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {mockTeamMembers.filter(m => m.isOnline).length}
                </p>
                <div className="text-sm text-green-600 flex items-center mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Active collaboration
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Invites</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{mockPendingInvitations.length}</p>
                <p className="text-sm text-orange-600 mt-2">Awaiting response</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admin Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {mockTeamMembers.filter(m => m.role === 'Admin' || m.role === 'Owner').length}
                </p>
                <p className="text-sm text-green-600 mt-2">Management roles</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-none border-none">
        <CardContent className="p-2">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search team members by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all duration-200 text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Role Filter Chips */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Filter className="w-4 h-4" />
                <span>Filter by role:</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {/* All Roles Chip */}
                <button
                  onClick={() => setRoleFilter('All')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    roleFilter === 'All'
                      ? 'bg-gradient-to-r from-green-800 to-green-900 text-white shadow-lg shadow-green-500/25'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    All
                    <Badge className="bg-white/20 text-white text-xs ml-1">
                      {mockTeamMembers.length}
                    </Badge>
                  </div>
                </button>

                {/* Owner Chip */}
                <button
                  onClick={() => setRoleFilter('Owner')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    roleFilter === 'Owner'
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg shadow-yellow-500/25'
                      : 'bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    Owner
                    <Badge className={`text-xs ml-1 ${
                      roleFilter === 'Owner' ? 'bg-white/20 text-white' : 'bg-yellow-200 text-yellow-800'
                    }`}>
                      {mockTeamMembers.filter(m => m.role === 'Owner').length}
                    </Badge>
                  </div>
                </button>

                {/* Admin Chip */}
                <button
                  onClick={() => setRoleFilter('Admin')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    roleFilter === 'Admin'
                      ? 'bg-gradient-to-r from-green-800 to-green-900 text-white shadow-lg shadow-green-500/25'
                      : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Admin
                    <Badge className={`text-xs ml-1 ${
                      roleFilter === 'Admin' ? 'bg-white/20 text-white' : 'bg-green-200 text-green-800'
                    }`}>
                      {mockTeamMembers.filter(m => m.role === 'Admin').length}
                    </Badge>
                  </div>
                </button>

                {/* Member Chip */}
                <button
                  onClick={() => setRoleFilter('Member')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    roleFilter === 'Member'
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-500/25'
                      : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Member
                    <Badge className={`text-xs ml-1 ${
                      roleFilter === 'Member' ? 'bg-white/20 text-white' : 'bg-green-200 text-green-800'
                    }`}>
                      {mockTeamMembers.filter(m => m.role === 'Member').length}
                    </Badge>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || roleFilter !== 'All') && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Active filters:</span>
                  <div className="flex items-center gap-2">
                    {searchTerm && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Search: "{searchTerm}"
                      </Badge>
                    )}
                    {roleFilter !== 'All' && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Role: {roleFilter}
                      </Badge>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setRoleFilter('All');
                  }}
                  className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Users className="w-6 h-6 text-green-600" />
                Team Members ({filteredMembers.length})
              </CardTitle>
              <p className="text-gray-600 mt-1 text-sm">Manage your team and their permissions</p>
            </div>
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMembers.map((member) => {
              const RoleIcon = roleConfig[member.role as keyof typeof roleConfig].icon;
              return (
                <div key={member.id} className="group relative">
                                     <div className="flex items-center justify-between p-6 rounded-2xl border border-gray-200 hover:border-green-200 hover:bg-gradient-to-r hover:from-green-50/50 hover:to-green-100/50 transition-all duration-200">
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-r from-green-800 to-green-900 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-lg">
                            {getInitials(member.name)}
                          </span>
                        </div>
                        {member.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-gray-900 text-lg">{member.name}</h3>
                          {member.id === user?.id && (
                            <Badge className="bg-gradient-to-r from-green-800 to-green-900 text-white border-0">
                              You
                            </Badge>
                          )}
                          {member.isOnline && (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              Online
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{member.email}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {member.lastActive}
                          </span>
                          <span className="flex items-center gap-1">
                            <Award className="w-4 h-4" />
                            {member.projectsCount} projects
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge className={`${roleConfig[member.role as keyof typeof roleConfig].badgeColor} border font-medium`}>
                          <RoleIcon className="w-3 h-3 mr-1" />
                          {member.role}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {roleConfig[member.role as keyof typeof roleConfig].description}
                        </p>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel>Member Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleChangeRole(member.id, 'Admin')}>
                            <Shield className="w-4 h-4 mr-2" />
                            Promote to Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeRole(member.id, 'Member')}>
                            <User className="w-4 h-4 mr-2" />
                            Change to Member
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleRemoveMember(member.id)}
                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove from Team
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      {mockPendingInvitations.length > 0 && (
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Mail className="w-6 h-6 text-orange-600" />
                  Pending Invitations ({mockPendingInvitations.length})
                </CardTitle>
                <p className="text-gray-600 mt-1 text-sm">Members who haven't accepted their invitations yet</p>
              </div>
              <Clock className="w-6 h-6 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPendingInvitations.map((invitation) => (
                <div key={invitation.id} className="group relative">
                  <div className="flex items-center justify-between p-6 rounded-2xl border-2 border-orange-200 bg-gradient-to-r from-orange-50/50 to-yellow-50/50 hover:border-orange-300 transition-all duration-200">
                    <div className="flex items-center space-x-6">
                      <div className="w-14 h-14 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Mail className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{invitation.email}</h3>
                        <p className="text-gray-600 mt-1">
                          Invited by {invitation.invitedBy} on {invitation.invitedAt}
                        </p>
                        <Badge className={`${roleConfig[invitation.role as keyof typeof roleConfig].badgeColor} border font-medium mt-2`}>
                          {invitation.role}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleResendInvitation(invitation.id)}
                        className="border-orange-300 text-orange-700 hover:bg-orange-100 hover:border-orange-400"
                      >
                        Resend Invite
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCancelInvitation(invitation.id)}
                        className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-800 to-green-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Invite Team Member</h2>
              <p className="text-gray-600">Add a new member to your team and assign their role</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 focus:bg-white transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Role Assignment
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 focus:bg-white transition-all duration-200"
                >
                  <option value="Member">Member</option>
                  <option value="Admin">Admin</option>
                </select>
                <div className="mt-3 p-3 bg-green-50 rounded-xl">
                  <p className="text-sm text-green-800 font-medium">
                    {roleConfig[inviteRole as keyof typeof roleConfig].description}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-8">
              <Button 
                variant="outline" 
                onClick={() => setShowInviteModal(false)}
                className="px-6 py-3 rounded-xl"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleInviteMember}
                disabled={!inviteEmail}
                className="bg-gradient-to-r from-green-800 to-green-900 hover:from-green-700 hover:to-green-800 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Send Invitation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 