'use client';

import { useState } from 'react';
import { 
  Search,
  Book,
  MessageCircle,
  Video,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  Star,
  Clock,
  Users,
  Zap,
  Palette,
  Download,
  Settings,
  CreditCard,
  Mail,
  ExternalLink,
  PlayCircle,
  Shield,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('getting-started');

  const helpCategories = [
    { id: 'getting-started', label: 'Getting Started', icon: Zap, count: 8 },
    { id: 'features', label: 'Features & Tools', icon: Palette, count: 12 },
    { id: 'data-export', label: 'Data & Export', icon: Download, count: 6 },
    { id: 'account-settings', label: 'Account & Settings', icon: Settings, count: 9 },
    { id: 'billing-plans', label: 'Billing & Plans', icon: CreditCard, count: 7 },
    { id: 'security', label: 'Security & Privacy', icon: Shield, count: 5 },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: HelpCircle, count: 11 }
  ];

  const popularArticles = [
    {
      title: 'Getting started with your first project',
      description: 'Complete walkthrough of creating and managing your first project',
      category: 'Getting Started',
      readTime: '5 min',
      views: '2.3k',
      rating: 4.9
    },
    {
      title: 'Understanding file formats and exports',
      description: 'Learn about different export options and when to use each format',
      category: 'Data & Export',
      readTime: '3 min',
      views: '1.8k',
      rating: 4.8
    },
    {
      title: 'Customizing your workspace',
      description: 'Personalize your dashboard and optimize your workflow',
      category: 'Features',
      readTime: '4 min',
      views: '1.5k',
      rating: 4.7
    },
    {
      title: 'Managing team members and permissions',
      description: 'Set up collaboration and control access levels for your team',
      category: 'Account Settings',
      readTime: '6 min',
      views: '1.4k',
      rating: 4.6
    },
    {
      title: 'Upgrading your plan and billing',
      description: 'Everything you need to know about plans, pricing, and payments',
      category: 'Billing',
      readTime: '3 min',
      views: '1.2k',
      rating: 4.5
    },
    {
      title: 'Data security and privacy settings',
      description: 'Keep your data safe with our security features and privacy controls',
      category: 'Security',
      readTime: '4 min',
      views: '950',
      rating: 4.7
    }
  ];

  const faqItems = [
    {
      id: 'what-is-platform',
      question: 'What is this platform and how does it work?',
      answer: 'Our platform is designed to help you manage your projects efficiently with powerful tools and insights. Simply sign up, create your first project, and start exploring the features that best fit your workflow.'
    },
    {
      id: 'free-vs-pro',
      question: 'What\'s the difference between Free and Pro plans?',
      answer: 'The Free plan includes basic features with some limitations on storage and projects. Pro plans offer unlimited projects, advanced features, priority support, and enhanced collaboration tools.'
    },
    {
      id: 'data-security',
      question: 'How secure is my data?',
      answer: 'We take security seriously. All data is encrypted in transit and at rest, we follow industry best practices, and our platform is regularly audited for security vulnerabilities. You maintain full control over your data.'
    },
    {
      id: 'team-collaboration',
      question: 'Can I collaborate with my team?',
      answer: 'Yes! Team collaboration features are available on Pro and Enterprise plans. You can invite team members, assign roles and permissions, share projects, and collaborate in real-time.'
    },
    {
      id: 'data-export',
      question: 'Can I export my data?',
      answer: 'Absolutely. We provide multiple export formats and you can download your data at any time. We believe in data portability and never lock you into our platform.'
    },
    {
      id: 'refund-policy',
      question: 'What is your refund policy?',
      answer: 'We offer a 30-day money-back guarantee for all paid plans. If you\'re not satisfied, contact our support team within 30 days of purchase for a full refund.'
    },
    {
      id: 'integrations',
      question: 'What integrations are available?',
      answer: 'We integrate with popular tools like Slack, Google Drive, Dropbox, Zapier, and many others. Check our integrations page for the complete list and setup instructions.'
    },
    {
      id: 'mobile-access',
      question: 'Is there a mobile app?',
      answer: 'Yes! Our mobile app is available for iOS and Android. You can access your projects, collaborate with your team, and manage your account on the go.'
    }
  ];

  const videoTutorials = [
    {
      title: 'Platform Overview & Getting Started',
      duration: '4:32',
      thumbnail: '/api/placeholder/400/225',
      views: '15k'
    },
    {
      title: 'Advanced Features & Customization',
      duration: '7:18',
      thumbnail: '/api/placeholder/400/225',
      views: '9.2k'
    },
    {
      title: 'Team Collaboration Best Practices',
      duration: '5:45',
      thumbnail: '/api/placeholder/400/225',
      views: '6.8k'
    }
  ];

  const filteredArticles = popularArticles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Help Header */}
      <div className="bg-gradient-to-br from-green-800 via-green-900 to-green-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-800/95 via-green-900/95 to-green-950/95"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl translate-y-16 -translate-x-16"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
            Help Center
          </h1>
          <p className="text-lg sm:text-xl text-green-100 font-medium mb-8">
            Find answers, tutorials, and resources to help you succeed
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help articles, tutorials, or FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg bg-white/15 backdrop-blur-md border border-white/30 text-white placeholder:text-white/80 rounded-xl focus:bg-white/25 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-green-300 transition-all duration-200 cursor-pointer group">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-800 to-green-900 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Book className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Browse Articles</h3>
            <p className="text-sm text-gray-600">Find detailed guides and tutorials</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-green-300 transition-all duration-200 cursor-pointer group">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Contact Support</h3>
            <p className="text-sm text-gray-600">Get help from our team</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-green-300 transition-all duration-200 cursor-pointer group">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Video className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Video Tutorials</h3>
            <p className="text-sm text-gray-600">Watch step-by-step guides</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-green-300 transition-all duration-200 cursor-pointer group">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Community</h3>
            <p className="text-sm text-gray-600">Join our community forum</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 shadow-lg shadow-gray-100/50 sticky top-6 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Categories</h3>
            </div>
            <div className="p-2">
              <nav className="space-y-1">
                {helpCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                        activeCategory === category.id
                          ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-5 h-5 transition-colors ${
                          activeCategory === category.id ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'
                        }`} />
                        <span className="font-medium text-sm">{category.label}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-8">
          {/* Popular Articles */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Popular Articles</h2>
              <Button variant="outline" className="bg-white hover:bg-gray-50 border-gray-300">
                View All
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredArticles.map((article, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-green-300 transition-all duration-200 cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
                      {article.category}
                    </Badge>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{article.rating}</span>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{article.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{article.readTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{article.views}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 group-hover:text-green-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Video Tutorials */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Video Tutorials</h2>
              <Button variant="outline" className="bg-white hover:bg-gray-50 border-gray-300">
                View All
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {videoTutorials.map((video, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-green-300 transition-all duration-200 cursor-pointer group">
                  <div className="relative">
                    <div className="w-full h-40 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <PlayCircle className="w-16 h-16 text-gray-400" />
                    </div>
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                      <PlayCircle className="w-12 h-12 text-white group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                      {video.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{video.views} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {faqItems.map((faq) => (
                <div key={faq.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                    {expandedFaq === faq.id ? (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="px-6 pb-4 text-gray-600">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-xl p-8 border border-gray-200">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-800 to-green-900 rounded-2xl mb-6">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Still Need Help?</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Can't find what you're looking for? Our support team is here to help you with any questions or issues.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-green-800 to-green-900 hover:from-green-900 hover:to-green-950 text-white">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Support
                </Button>
                <Button variant="outline" className="bg-white hover:bg-gray-50 border-gray-300">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Live Chat
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 