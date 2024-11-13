"use client"

export function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Voi Economics</h1>
            <p className="text-blue-100 text-sm">Token Distribution Dashboard</p>
          </div>
          <nav className="flex items-center space-x-4">
            {/* Add navigation items here if needed */}
          </nav>
        </div>
      </div>
    </header>
  );
}