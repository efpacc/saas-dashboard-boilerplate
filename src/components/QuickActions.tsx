import Link from 'next/link';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  hoverBgColor: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export default function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className="bg-white rounded-xl py-6 border-0 shadow-sm">
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Quick Actions</h3>
            <p className="text-gray-600 mt-1 text-sm">Manage your platform efficiently</p>
          </div>
          <div className="w-6 h-6 text-yellow-500">
            ⚡
          </div>
        </div>
      </div>
      
      <div className="px-6 space-y-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link 
              key={index} 
              href={action.href} 
              className="block group"
            >
              <div className={`flex items-center justify-between p-4 rounded-xl ${action.bgColor} ${action.hoverBgColor} transition-colors`}>
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 ${action.iconColor} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{action.title}</h4>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 