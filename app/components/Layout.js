"use client";

export default function Layout({ children }) {
  return (
    <div className="flex bg-black text-white min-h-screen">
      
      {/* SIDEBAR */}
      <aside className="hidden md:flex md:flex-col md:w-[240px] md:fixed md:inset-y-0 md:left-0 bg-black border-r border-gray-800 p-6 z-50">
        
        {/* LOGO */}
        <div className="text-2xl font-extrabold text-red-600 mb-10 tracking-wide">
          AIV
        </div>

        {/* NAV */}
        <nav className="flex flex-col gap-5 text-sm">
          <div className="text-gray-400 hover:text-white cursor-pointer transition">
            Home
          </div>
          <div className="text-gray-400 hover:text-white cursor-pointer transition">
            Movies
          </div>
          <div className="text-gray-400 hover:text-white cursor-pointer transition">
            Series
          </div>
          <div className="text-gray-400 hover:text-white cursor-pointer transition">
            My List
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-[240px] overflow-y-auto">
        
        {/* CONTENT WRAPPER (fixes crowding) */}
        <div className="px-4 md:px-8 py-6 space-y-10 max-w-[1400px] mx-auto">
          {children}
        </div>

      </main>
    </div>
  );
}