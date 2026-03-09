"use client";

import { signOut } from "next-auth/react";
import { LogOut, ExternalLink } from "lucide-react";

export default function AdminHeader({ userName }: { userName: string }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 pl-14 lg:pl-6 sticky top-0 z-20">
      <h1 className="text-lg font-semibold text-gray-900 truncate">
        Spring Valley Admin
      </h1>

      <div className="flex items-center gap-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#ab815a] hover:bg-[#ab815a]/10 rounded-lg transition font-medium"
        >
          <ExternalLink className="w-4 h-4" />
          <span className="hidden sm:inline">View Website</span>
        </a>
        <span className="text-sm text-gray-600 hidden sm:inline">{userName}</span>
        <button
          onClick={() => signOut({ callbackUrl: "/admin-login" })}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </header>
  );
}
