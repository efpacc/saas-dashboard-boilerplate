export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        <div className="animate-pulse">
          <div className="h-20 w-20 bg-gradient-to-r from-green-800 to-green-900 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-3xl font-bold">D</span>
          </div>
        </div>
        <div className="text-xl font-semibold text-gray-900">Loading Dashboard...</div>
        <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
} 