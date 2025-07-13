export default function Loading() {
  // Stack uses React Suspense, which will render this page while user data is being fetched.
  // See: https://nextjs.org/docs/app/api-reference/file-conventions/loading
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-20 w-20 bg-gradient-to-r from-green-800 to-green-900 rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-2xl">D</span>
        </div>
        <div className="text-xl font-semibold text-gray-900">Loading...</div>
        <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
