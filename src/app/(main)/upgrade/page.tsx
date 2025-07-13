'use client';

import { useState } from 'react';
import { 
  Check, 
  Crown, 
  Star, 
  Zap, 
  Users, 
  Download, 
  Palette, 
  Shield, 
  Headphones,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Globe,
  BarChart3,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@stackframe/stack';

export default function UpgradePage() {
  const user = useUser({ or: 'redirect' });
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const faqItems = [
    {
      id: 'cancel-subscription',
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time. You\'ll continue to have access to Pro features until the end of your billing period.'
    },
    {
      id: 'refund-policy',
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied with Pro, contact us for a full refund.'
    },
    {
      id: 'billing-difference',
      question: 'What\'s the difference between monthly and yearly billing?',
      answer: 'Yearly billing offers significant savings - up to 17% off compared to monthly billing. You\'ll get the same features with both options.'
    },
    {
      id: 'plan-upgrade',
      question: 'Can I upgrade or downgrade my plan anytime?',
      answer: 'Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the end of your current billing period.'
    },
    {
      id: 'enterprise-features',
      question: 'What\'s included in the Enterprise plan?',
      answer: 'Enterprise includes everything in Pro plus team collaboration, advanced analytics, priority support, API access, and custom integrations. Contact sales for pricing.'
    },
    {
      id: 'payment-methods',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for Enterprise customers.'
    },
    {
      id: 'data-migration',
      question: 'Will I lose my data if I upgrade?',
      answer: 'No, all your existing data will be preserved when you upgrade. You\'ll immediately gain access to additional features without losing any of your current work.'
    },
    {
      id: 'team-collaboration',
      question: 'How does team collaboration work?',
      answer: 'Pro and Enterprise plans include team workspaces where you can invite team members, share projects, and collaborate in real-time with role-based permissions.'
    }
  ];

  const plans = [
    {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for trying out our platform',
      features: [
        'Up to 3 projects',
        'Basic templates and tools',
        'Standard export formats',
        'Community support',
        'Basic analytics',
        'Public project sharing'
      ],
      buttonText: 'Current Plan',
      buttonVariant: 'outline' as const,
      popular: false,
      icon: Zap
    },
    {
      name: 'Basic',
      price: { monthly: 9, yearly: 99 },
      description: 'Essential features for individual users',
      features: [
        'Up to 25 projects',
        'Premium templates and tools',
        'HD export formats',
        'Email support',
        'Advanced analytics',
        'Priority processing',
        'Custom branding removal',
        'API access (basic)'
      ],
      buttonText: 'Upgrade to Basic',
      buttonVariant: 'default' as const,
      popular: false,
      icon: Download
    },
    {
      name: 'Pro',
      price: { monthly: 29, yearly: 299 },
      description: 'For professionals and growing teams',
      features: [
        'Unlimited projects',
        'All premium features',
        'Team collaboration (up to 10 users)',
        'Priority support',
        'Advanced integrations',
        'Custom domains',
        'Advanced analytics & reporting',
        'API access (full)',
        'White-label solutions',
        'Advanced security features'
      ],
      buttonText: 'Upgrade to Pro',
      buttonVariant: 'default' as const,
      popular: true,
      icon: Star,
      badge: 'Most Popular'
    },
    {
      name: 'Enterprise',
      price: { monthly: 0, yearly: 0 },
      description: 'For large organizations with custom needs',
      features: [
        'Everything in Pro',
        'Unlimited team members',
        'Advanced admin controls',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantees',
        'Advanced security & compliance',
        'Custom training & onboarding',
        'Priority feature requests',
        'Custom deployment options'
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline' as const,
      popular: false,
      icon: Crown,
      isCustomPricing: true
    }
  ];

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.isCustomPricing) return 'Custom';
    const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;
    const period = billingCycle === 'monthly' ? '/month' : '/year';
    return `$${price}${period}`;
  };

  const getSavings = (plan: typeof plans[0]) => {
    if (plan.isCustomPricing || plan.price.monthly === 0) return null;
    const monthlyTotal = plan.price.monthly * 12;
    const savings = monthlyTotal - plan.price.yearly;
    const percentage = Math.round((savings / monthlyTotal) * 100);
    return { amount: savings, percentage };
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-800 via-green-900 to-green-950"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative px-6 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <Crown className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl font-bold text-white mb-6">
              Upgrade to <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Pro</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Unlock unlimited projects, premium features, and advanced tools. 
              Take your productivity to the next level with our Pro plan.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-6 mb-3">
              <span className={`text-lg font-semibold ${billingCycle === 'monthly' ? 'text-white' : 'text-white/70'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="relative inline-flex h-8 w-16 items-center rounded-full bg-white/20 backdrop-blur-sm transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 hover:bg-white/30"
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-lg ${
                    billingCycle === 'yearly' ? 'translate-x-9' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-lg font-semibold ${billingCycle === 'yearly' ? 'text-white' : 'text-white/70'}`}>
                Yearly
              </span>
            </div>
            
            {/* Savings Badge */}
            <div className="flex justify-center mb-5">
              {billingCycle === 'yearly' && (
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-3 py-1 transition-all duration-300">
                  Save up to 17%
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="px-6 py-20 -mt-8 relative z-10">
        <div className="max-w-[1400px] mx-auto">
          {/* Current Plan - Free Plan */}
          {plans.filter(plan => plan.name === 'Free').map((plan) => {
            const Icon = plan.icon;
            return (
              <div key={plan.name} className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-xl border border-green-200 p-8 mb-12">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-2">{plan.name}</h4>
                    <p className="text-gray-700 mb-4">{plan.description}</p>
                    <div className="mb-4">
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 font-medium px-4 py-2">
                        Current Plan
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {plan.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-700">
                          <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent mb-2">
                      Free
                    </p>
                    <p className="text-gray-600 font-medium">forever</p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Upgrade Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
            {plans.filter(plan => plan.name !== 'Free').map((plan, index) => {
              const Icon = plan.icon;
              const savings = getSavings(plan);
              
              return (
                <Card 
                  key={plan.name}
                  className={`relative overflow-hidden transition-all duration-300 hover:border-gray-300 hover:-translate-y-2 w-full max-w-md border ${
                    plan.popular 
                      ? 'ring-2 ring-green-500 border-green-200 scale-105' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-green-800 to-green-900 text-white text-center py-2 text-sm font-semibold">
                      <Sparkles className="w-4 h-4 inline mr-1" />
                      {plan.badge}
                    </div>
                  )}
                  
                  <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-6'}`}>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </CardTitle>
                    
                    <div className="mb-4">
                      <div className="text-4xl font-bold text-gray-900 mb-1">
                        {getPrice(plan)}
                      </div>
                      {billingCycle === 'yearly' && savings && (
                        <div className="text-sm text-green-600 font-medium">
                          Save ${savings.amount} ({savings.percentage}% off)
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {plan.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="px-6 pb-6">
                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start space-x-3">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600 leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-green-800 to-green-900 hover:from-green-700 hover:to-green-800 text-white' 
                          : plan.name === 'Basic'
                          ? 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white'
                          : 'bg-white hover:bg-gray-50 border-gray-300'
                      }`}
                      variant={plan.buttonVariant}
                    >
                      {plan.buttonText}
                      {plan.name !== 'Enterprise' && (
                        <ArrowRight className="w-4 h-4 ml-2" />
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Comparison */}
      <div className="px-6 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Pro?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get access to premium features that will transform your productivity and workflow
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-800 to-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Reach</h3>
              <p className="text-gray-600">
                Access your work from anywhere with cloud sync and global CDN for fast loading
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
              <p className="text-gray-600">
                Detailed insights and reporting to help you understand your performance and growth
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Enterprise Security</h3>
              <p className="text-gray-600">
                Advanced security features including SSO, audit logs, and compliance certifications
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Have questions? We've got answers.
            </p>
          </div>
          
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
      </div>
    </div>
  );
} 