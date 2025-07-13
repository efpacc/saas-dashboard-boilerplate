export default function CreatePage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Project</h1>
          <p className="text-gray-600 text-lg">Start building something amazing today.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-8 border border-gray-200">
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Create</h3>
          <p className="text-gray-500 mb-6">This is where your creation form would go.</p>
          <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-800 to-green-900 hover:from-green-900 hover:to-green-950 text-white rounded-xl font-semibold transition-all duration-200">
            Start Creating
          </button>
        </div>
      </div>
    </div>
  );
} 