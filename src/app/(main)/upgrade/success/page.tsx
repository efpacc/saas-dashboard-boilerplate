'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Sparkles, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@stackframe/stack';

export default function UpgradeSuccessPage() {
  const user = useUser({ or: 'redirect' });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time to show the celebration
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    router.push('/');
  };

  const handleViewBilling = () => {
    router.push('/settings');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 mx-auto mb-4">
            <Sparkles className="w-12 h-12 text-green-600" />
          </div>
          <p className="text-gray-600">Processing your upgrade...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🎉 Welcome to Pro!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your subscription has been activated successfully. You now have access to all Pro features!
            </p>
          </div>

          {/* Success Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="border border-green-200 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 mr-2" />
                  What's Included
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Unlimited projects and advanced features</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Priority customer support</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Advanced analytics and reporting</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Team collaboration tools</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">API access and integrations</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-green-200 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <Sparkles className="w-5 h-5 text-green-500 mr-2" />
                  Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                    1
                  </div>
                  <span className="text-sm text-gray-600">Explore your new Pro features</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                    2
                  </div>
                  <span className="text-sm text-gray-600">Check your email for receipt and welcome guide</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                    3
                  </div>
                  <span className="text-sm text-gray-600">Set up your team and invite members</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                    4
                  </div>
                  <span className="text-sm text-gray-600">Contact support if you need help</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-green-800 to-green-900 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 text-lg"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={handleViewBilling}
              variant="outline"
              className="border-gray-300 px-8 py-3 text-lg"
            >
              View Billing Details
            </Button>
          </div>

          {/* Support Information */}
          <Card className="border border-gray-200 bg-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Need Help Getting Started?
              </h3>
              <p className="text-gray-600 mb-4">
                Our support team is here to help you make the most of your Pro subscription.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  className="border-green-300 text-green-600 hover:bg-green-50"
                  onClick={() => router.push('/help')}
                >
                  Browse Help Center
                </Button>
                <Button
                  variant="outline"
                  className="border-green-300 text-green-600 hover:bg-green-50"
                  onClick={() => window.open('mailto:support@yourapp.com', '_blank')}
                >
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer Note */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">
              You can manage your subscription, download invoices, and update payment methods in your{' '}
              <button
                onClick={handleViewBilling}
                className="text-green-600 hover:text-green-800 underline"
              >
                billing settings
              </button>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 