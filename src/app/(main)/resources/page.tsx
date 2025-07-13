export default function ResourcesPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Resources</h1>
          <p className="text-gray-600 text-lg">Explore templates, guides, and tools to help you build better.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-8 border border-gray-200">
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Resources Coming Soon</h3>
          <p className="text-gray-500 mb-6">We're preparing helpful resources for you.</p>
          <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-800 to-green-900 hover:from-green-900 hover:to-green-950 text-white rounded-xl font-semibold transition-all duration-200">
            Get Notified
          </button>
        </div>
      </div>
    </div>
  );
} 