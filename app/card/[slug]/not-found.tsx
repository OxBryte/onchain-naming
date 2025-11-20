export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          404 - Card Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          This card doesn't exist or hasn't been published yet.
        </p>
        <a
          href="/"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors inline-block"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}

