"use client";

import { useState } from 'react';
import { useUser } from '@stackframe/stack';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  DollarSign, 
  Eye, 
  Clock,
  Calendar,
  Globe,
  Zap,
  Target,
  Activity,
  ArrowUp,
  ArrowDown,
  Filter,
  Download,
  RefreshCw,
  Sparkles,
  Star,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock analytics data - in real app, this would come from your analytics API
const analyticsData = {
  overview: {
    totalRevenue: 45420,
    monthlyGrowth: 12.5,
    totalUsers: 2847,
    userGrowth: 8.2,
    pageViews: 156789,
    viewsGrowth: -2.4,
    conversionRate: 3.2,
    conversionGrowth: 15.7
  },
  realtimeMetrics: {
    activeUsers: 143,
    sessionsToday: 1247,
    avgSessionDuration: '4m 23s',
    bounceRate: 32.1
  },
  topPages: [
    { path: '/dashboard', views: 12450, change: 8.3 },
    { path: '/projects', views: 8790, change: -2.1 },
    { path: '/team', views: 6540, change: 15.4 },
    { path: '/analytics', views: 4320, change: 22.7 },
    { path: '/settings', views: 3210, change: -5.2 }
  ],
  userSources: [
    { source: 'Organic Search', users: 1247, percentage: 43.8 },
    { source: 'Direct', users: 856, percentage: 30.1 },
    { source: 'Social Media', users: 398, percentage: 14.0 },
    { source: 'Referrals', users: 231, percentage: 8.1 },
    { source: 'Email', users: 115, percentage: 4.0 }
  ],
  revenueData: {
    mrr: 15680,
    arr: 188160,
    churnRate: 2.3,
    arpu: 89.50
  }
};

const timeFilters = [
  { id: 'today', label: 'Today', icon: Clock },
  { id: '7d', label: '7 Days', icon: Calendar },
  { id: '30d', label: '30 Days', icon: Calendar },
  { id: '90d', label: '90 Days', icon: Calendar },
  { id: 'year', label: 'Year', icon: Calendar }
];

export default function AnalyticsPage() {
  const user = useUser({ or: "redirect" });
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
                <BarChart3 className="w-12 h-12" />
                Analytics Dashboard
              </h1>
              <p className="text-xl text-green-100 mb-8 max-w-2xl">
                Track your business performance, user engagement, and growth metrics in real-time.
              </p>
              
              <div className="flex items-center gap-6 text-green-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">
                    {analyticsData.realtimeMetrics.activeUsers} users online
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  <span className="text-sm font-medium">Live tracking enabled</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <Button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-white text-green-800 hover:bg-green-50 hover:text-green-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200"
              >
                <RefreshCw className={`w-5 h-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
              </Button>
              <div className="text-center">
                <p className="text-green-100 text-sm">
                  Last updated: 2 minutes ago
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Time Filter */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Performance Overview 📊
          </h2>
          <p className="text-gray-600 mt-1">
            Monitor key metrics and track your business growth.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Filter className="w-4 h-4" />
            <span>Time period:</span>
          </div>
          <div className="flex items-center gap-2">
            {timeFilters.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => setSelectedTimeFilter(filter.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedTimeFilter === filter.id
                      ? 'bg-gradient-to-r from-green-800 to-green-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {filter.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {formatCurrency(analyticsData.overview.totalRevenue)}
                </p>
                <div className="text-sm text-green-600 flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{analyticsData.overview.monthlyGrowth}% vs last month
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {formatNumber(analyticsData.overview.totalUsers)}
                </p>
                <div className="text-sm text-green-600 flex items-center mt-2">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  +{analyticsData.overview.userGrowth}% growth
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-800" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Page Views</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {formatNumber(analyticsData.overview.pageViews)}
                </p>
                <div className="text-sm text-red-600 flex items-center mt-2">
                  <ArrowDown className="w-4 h-4 mr-1" />
                  {analyticsData.overview.viewsGrowth}% vs last period
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {analyticsData.overview.conversionRate}%
                </p>
                <div className="text-sm text-green-600 flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{analyticsData.overview.conversionGrowth}% improvement
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Metrics */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-600" />
                Real-time Metrics
              </CardTitle>
              <p className="text-gray-600 mt-1 text-sm">Live activity and engagement data</p>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-200 animate-pulse">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Live
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.realtimeMetrics.activeUsers}</p>
              <p className="text-sm text-gray-600 mt-1">Active Users</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Play className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.realtimeMetrics.sessionsToday)}</p>
              <p className="text-sm text-gray-600 mt-1">Sessions Today</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.realtimeMetrics.avgSessionDuration}</p>
              <p className="text-sm text-gray-600 mt-1">Avg. Session</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.realtimeMetrics.bounceRate}%</p>
              <p className="text-sm text-gray-600 mt-1">Bounce Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Pages */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Eye className="w-6 h-6 text-green-600" />
                  Top Pages
                </CardTitle>
                <p className="text-gray-600 mt-1 text-sm">Most visited pages this period</p>
              </div>
              <Sparkles className="w-6 h-6 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topPages.map((page, index) => (
                <div key={page.path} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-bold text-sm">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{page.path}</p>
                      <p className="text-sm text-gray-600">{formatNumber(page.views)} views</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    page.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {page.change >= 0 ? (
                      <ArrowUp className="w-4 h-4" />
                    ) : (
                      <ArrowDown className="w-4 h-4" />
                    )}
                    {Math.abs(page.change)}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Sources */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Globe className="w-6 h-6 text-green-600" />
                  Traffic Sources
                </CardTitle>
                <p className="text-gray-600 mt-1 text-sm">Where your users are coming from</p>
              </div>
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.userSources.map((source, index) => (
                <div key={source.source} className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-4 h-4 rounded-full" style={{
                      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index]
                    }}></div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{source.source}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="h-2 rounded-full"
                          style={{
                            width: `${source.percentage}%`,
                            backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index]
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold text-gray-900">{formatNumber(source.users)}</p>
                    <p className="text-sm text-gray-600">{source.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Analytics */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-green-600" />
                Revenue Analytics
              </CardTitle>
              <p className="text-gray-600 mt-1 text-sm">Financial performance and subscription metrics</p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
              <p className="text-sm font-medium text-gray-600 mb-2">Monthly Recurring Revenue</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(analyticsData.revenueData.mrr)}</p>
              <Badge className="bg-green-100 text-green-800 border-green-200 mt-2">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12.3%
              </Badge>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
              <p className="text-sm font-medium text-gray-600 mb-2">Annual Recurring Revenue</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(analyticsData.revenueData.arr)}</p>
              <Badge className="bg-green-100 text-green-800 border-green-200 mt-2">
                <TrendingUp className="w-3 h-3 mr-1" />
                +18.7%
              </Badge>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-red-50 to-pink-100 rounded-2xl">
              <p className="text-sm font-medium text-gray-600 mb-2">Churn Rate</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.revenueData.churnRate}%</p>
              <Badge className="bg-red-100 text-red-800 border-red-200 mt-2">
                <TrendingDown className="w-3 h-3 mr-1" />
                -0.8%
              </Badge>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
              <p className="text-sm font-medium text-gray-600 mb-2">Avg. Revenue Per User</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(analyticsData.revenueData.arpu)}</p>
              <Badge className="bg-green-100 text-green-800 border-green-200 mt-2">
                <TrendingUp className="w-3 h-3 mr-1" />
                +5.2%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 