import { stackServerApp } from '@/stack';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus, Folder, Clock, Star, TrendingUp, Download, Users, Zap, ArrowRight, Sparkles, CheckCircle, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function Dashboard() {
  const user = await stackServerApp.getUser();
  
  if (!user) {
    redirect('/handler/sign-in');
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600 text-lg">Plan, prioritize, and accomplish your tasks with ease.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            asChild
            className="bg-gradient-to-r from-green-800 to-green-900 hover:from-green-900 hover:to-green-950 text-white px-8 py-3 rounded-xl font-semibold text-base transition-all duration-200 border-0"
          >
            <Link href="/create" className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Project</span>
            </Link>
          </Button>
          
          <Button 
            asChild
            variant="outline"
            className="border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-xl font-semibold text-base transition-all duration-200"
          >
            <Link href="/projects" className="flex items-center space-x-2">
              <Folder className="w-5 h-5" />
              <span>Import Data</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards - Main Focus */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-gray-200 bg-gradient-to-br from-green-800 to-green-900 text-white hover:from-green-900 hover:to-green-950 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-100">Total Projects</p>
                <p className="text-3xl font-bold text-white mt-1">24</p>
                <div className="text-sm text-green-100 flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Increased from last month
                </div>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Folder className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ended Projects</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">10</p>
                <div className="text-sm text-green-800 flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Increased from last month
                </div>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Running Projects</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">12</p>
                <div className="text-sm text-green-800 flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Increased from last month
                </div>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Project</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">2</p>
                <p className="text-sm text-gray-500 mt-2">On Discuss</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.displayName || 'there'}! 👋
          </h2>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your projects today.
          </p>
        </div>
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border border-gray-200 bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
                <p className="text-gray-600 mt-1 text-sm">Manage your platform efficiently</p>
              </div>
              <Zap className="w-6 h-6 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/create" className="block group">
              <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-800 rounded-lg flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Create New Project</h3>
                    <p className="text-sm text-gray-600">Start a new project from scratch</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </Link>

            <Link href="/projects" className="block group">
              <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <Folder className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Manage Projects</h3>
                    <p className="text-sm text-gray-600">View and edit your projects</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </Link>

            <Link href="/resources" className="block group">
              <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Browse Resources</h3>
                    <p className="text-sm text-gray-600">Discover helpful templates and guides</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
                <p className="text-gray-600 mt-1 text-sm">Latest updates on your work</p>
              </div>
              <Activity className="w-6 h-6 text-green-800" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl">
              <div className="w-10 h-10 bg-green-800 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Project Completed</h3>
                <p className="text-sm text-gray-600">Dashboard v2.1 deployed successfully</p>
                <span className="text-xs text-gray-500">2 minutes ago</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Team Member Added</h3>
                <p className="text-sm text-gray-600">Sarah Johnson joined as Developer</p>
                <span className="text-xs text-gray-500">15 minutes ago</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Analytics Updated</h3>
                <p className="text-sm text-gray-600">New insights available for Project Alpha</p>
                <span className="text-xs text-gray-500">1 hour ago</span>
              </div>
            </div>

            <div className="text-center pt-4">
              <Button 
                asChild
                variant="ghost" 
                className="text-green-800 hover:text-green-900 hover:bg-green-50"
              >
                <Link href="/analytics">
                  View All Activity
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
