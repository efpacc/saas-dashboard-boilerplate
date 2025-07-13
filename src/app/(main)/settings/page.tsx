'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Download, 
  Palette, 
  Globe, 
  HelpCircle,
  ChevronRight,
  Check,
  X,
  Eye,
  EyeOff,
  Camera,
  Trash2,
  Save,
  Settings as SettingsIcon,
  Moon,
  Sun,
  Monitor,
  Lock,
  Mail,
  Smartphone,
  Key
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@stackframe/stack';

export default function SettingsPage() {
  const user = useUser({ or: 'redirect' });
  const [activeSection, setActiveSection] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: true,
    updates: true
  });
  const [theme, setTheme] = useState('system');

  const settingsSections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account & Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'data', label: 'Data & Privacy', icon: Lock },
    { id: 'support', label: 'Help & Support', icon: HelpCircle }
  ];

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
        
        {/* Profile Picture */}
        <div className="flex items-center space-x-6 mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-green-800 to-green-900 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.displayName?.charAt(0) || 'U'}
            </div>
            <Button size="sm" className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full p-0 bg-white border-2 border-gray-200 hover:bg-gray-50">
              <Camera className="w-4 h-4 text-gray-600" />
            </Button>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Profile Photo</h4>
            <p className="text-sm text-gray-500">Upload a new profile picture</p>
            <div className="flex space-x-2 mt-2">
              <Button variant="outline" size="sm">Upload</Button>
              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
            <Input 
              defaultValue={user.displayName || ''} 
              placeholder="Enter your display name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <Input 
              defaultValue={user.primaryEmail || ''} 
              type="email"
              disabled
              className="bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
            <Input placeholder="Your company name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
            <Input placeholder="Your job title" />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
          <textarea 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            rows={3}
            placeholder="Tell us about yourself..."
          />
        </div>

        <div className="flex justify-end mt-6">
          <Button className="bg-gradient-to-r from-green-800 to-green-900 hover:from-green-900 hover:to-green-950 text-white">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );

  const renderAccountSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Security</h3>
        
        <div className="space-y-6">
          {/* Password Section */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold text-gray-900">Password</h4>
                <p className="text-sm text-gray-600 mt-1">Update your password to keep your account secure</p>
              </div>
              <Button variant="outline" className="bg-white hover:bg-gray-50 border-gray-300">Change Password</Button>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold text-gray-900">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-600 mt-1">Add an extra layer of security to your account</p>
              </div>
              <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 font-medium">
                Not Enabled
              </Badge>
            </div>
            <Button variant="outline" className="w-full sm:w-auto bg-white hover:bg-gray-50 border-gray-300">
              <Key className="w-4 h-4 mr-2" />
              Enable 2FA
            </Button>
          </div>

          {/* Connected Accounts */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 hover:shadow-sm transition-shadow">
            <h4 className="font-semibold text-gray-900 mb-4">Connected Accounts</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-shadow">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-800 to-green-900 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm">G</div>
                  <div>
                    <p className="font-semibold text-gray-900">Google</p>
                    <p className="text-sm text-gray-600">Connected</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  Disconnect
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
        
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 hover:shadow-sm transition-shadow">
          <div className="space-y-6">
            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="font-semibold text-gray-900">Email Notifications</h4>
                <p className="text-sm text-gray-600 mt-1">Receive notifications via email</p>
              </div>
              <Button
                variant={notifications.email ? "default" : "outline"}
                size="sm"
                className={`${
                  notifications.email 
                    ? "bg-gradient-to-r from-green-800 to-green-900 hover:from-green-700 hover:to-green-800 text-white shadow-sm"
                    : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
                } w-8 h-8 p-0 rounded-lg transition-all duration-200`}
                onClick={() => setNotifications(prev => ({ ...prev, email: !prev.email }))}
              >
                {notifications.email ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              </Button>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="font-semibold text-gray-900">Push Notifications</h4>
                <p className="text-sm text-gray-600 mt-1">Receive push notifications in your browser</p>
              </div>
              <Button
                variant={notifications.push ? "default" : "outline"}
                size="sm"
                className={`${
                  notifications.push 
                    ? "bg-gradient-to-r from-green-800 to-green-900 hover:from-green-700 hover:to-green-800 text-white shadow-sm"
                    : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
                } w-8 h-8 p-0 rounded-lg transition-all duration-200`}
                onClick={() => setNotifications(prev => ({ ...prev, push: !prev.push }))}
              >
                {notifications.push ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              </Button>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="font-semibold text-gray-900">Marketing Updates</h4>
                <p className="text-sm text-gray-600 mt-1">Receive updates about new features and promotions</p>
              </div>
              <Button
                variant={notifications.marketing ? "default" : "outline"}
                size="sm"
                className={`${
                  notifications.marketing 
                    ? "bg-gradient-to-r from-green-800 to-green-900 hover:from-green-700 hover:to-green-800 text-white shadow-sm"
                    : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
                } w-8 h-8 p-0 rounded-lg transition-all duration-200`}
                onClick={() => setNotifications(prev => ({ ...prev, marketing: !prev.marketing }))}
              >
                {notifications.marketing ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              </Button>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="font-semibold text-gray-900">Product Updates</h4>
                <p className="text-sm text-gray-600 mt-1">Get notified about important product updates</p>
              </div>
              <Button
                variant={notifications.updates ? "default" : "outline"}
                size="sm"
                className={`${
                  notifications.updates 
                    ? "bg-gradient-to-r from-green-800 to-green-900 hover:from-green-700 hover:to-green-800 text-white shadow-sm"
                    : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
                } w-8 h-8 p-0 rounded-lg transition-all duration-200`}
                onClick={() => setNotifications(prev => ({ ...prev, updates: !prev.updates }))}
              >
                {notifications.updates ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBillingSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing & Subscription</h3>
        
        {/* Current Plan */}
        <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-xl border border-green-200 p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-gray-900 text-lg">Free Plan</h4>
              <p className="text-sm text-gray-700 mt-1">Perfect for trying out the platform</p>
              <div className="mt-3">
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 font-medium">Current Plan</Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">Free</p>
              <p className="text-sm text-gray-600 font-medium">forever</p>
            </div>
          </div>
        </div>

        {/* Upgrade Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-gray-400 transition-all duration-200 group">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-900 text-lg">Basic Plan</h4>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">$9<span className="text-base font-normal text-gray-600">/month</span></p>
            <p className="text-sm text-gray-600 mb-6">Essential features for getting started</p>
            <ul className="space-y-3 text-sm text-gray-700 mb-6">
              <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />All basic features</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />Unlimited projects</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />Priority support</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />Advanced analytics</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />Email support</li>
            </ul>
            <Button className="w-full bg-gradient-to-r from-green-800 to-green-900 hover:from-green-700 hover:to-green-800 text-white shadow-sm font-medium">
              Upgrade to Basic
            </Button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-green-300 transition-all duration-200 group">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-900 text-lg">Pro Plan</h4>
              <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 font-medium">Popular</Badge>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">$29<span className="text-base font-normal text-gray-600">/month</span></p>
            <p className="text-sm text-gray-600 mb-6">For professionals and growing businesses</p>
            <ul className="space-y-3 text-sm text-gray-700 mb-6">
              <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />Everything in Basic</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />Advanced features</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />Team collaboration</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />Custom integrations</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />Priority support</li>
            </ul>
            <Button className="w-full bg-gradient-to-r from-green-800 to-green-900 hover:from-green-700 hover:to-green-800 text-white shadow-sm font-medium">
              Upgrade to Pro
            </Button>
          </div>

                      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-green-300 transition-all duration-200 group">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-900 text-lg">Enterprise</h4>
              <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 font-medium">Custom</Badge>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">Custom<span className="text-base font-normal text-gray-600"> pricing</span></p>
            <p className="text-sm text-gray-600 mb-6">For large organizations</p>
            <ul className="space-y-3 text-sm text-gray-700 mb-6">
              <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />Everything in Pro</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />Team collaboration</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />Custom branding</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />Dedicated support</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />API access</li>
            </ul>
            <Button variant="outline" className="w-full bg-white hover:bg-gray-50 border-gray-300 font-medium">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreferencesSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">App Preferences</h3>
        
        <div className="space-y-6">
          {/* Theme Selection */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 hover:shadow-sm transition-shadow">
            <h4 className="font-semibold text-gray-900 mb-6">Theme</h4>
            <div className="grid grid-cols-3 gap-4">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                className={`flex flex-col items-center p-6 h-auto transition-all ${
                  theme === 'light' 
                    ? 'bg-gradient-to-r from-green-800 to-green-900 hover:from-green-700 hover:to-green-800 text-white shadow-sm' 
                    : 'bg-white hover:bg-gray-50 border-gray-300'
                }`}
                onClick={() => setTheme('light')}
              >
                <Sun className="w-6 h-6 mb-3" />
                <span className="font-medium">Light</span>
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                className={`flex flex-col items-center p-6 h-auto transition-all ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-green-800 to-green-900 hover:from-green-700 hover:to-green-800 text-white shadow-sm' 
                    : 'bg-white hover:bg-gray-50 border-gray-300'
                }`}
                onClick={() => setTheme('dark')}
              >
                <Moon className="w-6 h-6 mb-3" />
                <span className="font-medium">Dark</span>
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                className={`flex flex-col items-center p-6 h-auto transition-all ${
                  theme === 'system' 
                    ? 'bg-gradient-to-r from-green-800 to-green-900 hover:from-green-700 hover:to-green-800 text-white shadow-sm' 
                    : 'bg-white hover:bg-gray-50 border-gray-300'
                }`}
                onClick={() => setTheme('system')}
              >
                <Monitor className="w-6 h-6 mb-3" />
                <span className="font-medium">System</span>
              </Button>
            </div>
          </div>

          {/* Other Preferences */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 hover:shadow-sm transition-shadow">
            <h4 className="font-semibold text-gray-900 mb-6">General</h4>
            <div className="space-y-6">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-semibold text-gray-900">Auto-save projects</p>
                  <p className="text-sm text-gray-600 mt-1">Automatically save your work</p>
                </div>
                <Button className="bg-gradient-to-r from-green-800 to-green-900 hover:from-green-700 hover:to-green-800 text-white shadow-sm" size="sm">
                  <Check className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-semibold text-gray-900">High quality previews</p>
                  <p className="text-sm text-gray-600 mt-1">Show high resolution previews</p>
                </div>
                <Button className="bg-gradient-to-r from-green-800 to-green-900 hover:from-green-700 hover:to-green-800 text-white shadow-sm" size="sm">
                  <Check className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data & Privacy</h3>
        
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 hover:shadow-sm transition-shadow">
            <h4 className="font-semibold text-gray-900 mb-4">Data Export</h4>
            <p className="text-sm text-gray-600 mb-6">Download all your data including projects, designs, and account information.</p>
            <Button variant="outline" className="bg-white hover:bg-gray-50 border-gray-300 font-medium">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>

          <div className="bg-red-50 rounded-xl border border-red-200 p-6 hover:shadow-sm transition-shadow">
            <h4 className="font-semibold text-red-900 mb-2">Delete Account</h4>
            <p className="text-sm text-red-700 mb-6">Permanently delete your account and all associated data. This action cannot be undone.</p>
            <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100 bg-white font-medium">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSupportSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Help & Support</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-green-300 transition-all duration-200 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">Help Center</h4>
                <p className="text-sm text-gray-600 mt-1">Browse our knowledge base</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-green-300 transition-all duration-200 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">Contact Support</h4>
                <p className="text-sm text-gray-600 mt-1">Get help from our team</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-green-300 transition-all duration-200 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">Feature Requests</h4>
                <p className="text-sm text-gray-600 mt-1">Suggest new features</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-green-300 transition-all duration-200 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">Community</h4>
                <p className="text-sm text-gray-600 mt-1">Join our Discord server</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection();
      case 'account':
        return renderAccountSection();
      case 'notifications':
        return renderNotificationsSection();
      case 'billing':
        return renderBillingSection();
      case 'preferences':
        return renderPreferencesSection();
      case 'data':
        return renderDataSection();
      case 'support':
        return renderSupportSection();
      default:
        return renderProfileSection();
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Settings Header */}
      <div className="bg-gradient-to-br from-green-800 via-green-900 to-green-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-800/95 via-green-900/95 to-green-950/95"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl translate-y-16 -translate-x-16"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
            <SettingsIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
            Settings
          </h1>
          <p className="text-lg sm:text-xl text-green-100 font-medium">
            Manage your account preferences and application settings
          </p>
        </div>
      </div>

      {/* Settings Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 shadow-lg shadow-gray-100/50 sticky top-6 overflow-hidden">
            <div className="p-2">
              <nav className="space-y-1">
                {settingsSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                        activeSection === section.id
                          ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-l-4 border-green-800'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className={`w-5 h-5 transition-colors ${
                        activeSection === section.id ? 'text-green-800' : 'text-gray-400 group-hover:text-gray-600'
                      }`} />
                      <span className="font-medium text-sm">{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-gray-100 shadow-lg shadow-gray-100/50 overflow-hidden">
            <div className="p-6 lg:p-8">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 