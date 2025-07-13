import Link from 'next/link';

interface ActivityItem {
  id: string;
  title: string;
  time: string;
  color: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
  viewAllLink?: string;
}

export default function RecentActivity({ 
  activities, 
  viewAllLink = '/activity' 
}: RecentActivityProps) {
  return (
    <div className="bg-white rounded-xl py-6 border-0 shadow-sm">
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Recent Activity</h3>
          <Link 
            href={viewAllLink} 
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            View All
          </Link>
        </div>
      </div>
      
      <div className="px-6 space-y-4">
        {activities.map((activity) => (
          <div 
            key={activity.id} 
            className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50"
          >
            <div className={`w-2 h-2 ${activity.color} rounded-full`}></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{activity.title}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 