"use client";

import {
  Bell,
  HelpCircle,
  Menu,
  Search,
} from "lucide-react";

type TopbarProps = {
  avatar: string;
  onMenuClick: () => void;
  search?: string;
  onSearchChange?: (value: string) => void;
};

export default function Topbar({
  avatar,
  onMenuClick,
  search = "",
  onSearchChange,
}: TopbarProps) {
  return (
    <header className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-[#434938] bg-[#131315]/95 px-4 backdrop-blur-md lg:left-[260px] lg:px-6">
      {/* Left side */}
      <div className="flex items-center gap-3">

        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded text-[#c3c9b2] hover:bg-[#2a2a2c] lg:hidden"
        >
          <Menu size={21} />
        </button>

        {/* Search */}
        <div className="hidden w-64 items-center gap-2 rounded-lg border border-[#434938] bg-[#1c1b1d] px-3 py-2 focus-within:border-[#bff365] sm:flex">
          <Search
            size={18}
            className="text-[#c3c9b2]"
          />

          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search clients, invoices..."
            className="w-full border-none bg-transparent p-0 text-sm text-[#e5e1e4] outline-none placeholder:text-[#c3c9b2] focus:ring-0"
          />
        </div>

        {/* Mobile search */}
        <button
          aria-label="Search"
          className="sm:hidden"
        >
          <Search
            size={20}
            className="text-[#c3c9b2]"
          />
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-4">

        {/* Notifications */}
        <button
          aria-label="Notifications"
          className="text-[#c3c9b2] hover:text-[#bff365]"
        >
          <Bell size={20} />
        </button>

        {/* Help */}
        <button
          aria-label="Help"
          className="hidden text-[#c3c9b2] hover:text-[#bff365] sm:block"
        >
          <HelpCircle size={20} />
        </button>

        {/* Divider */}
        <div className="hidden h-6 w-px bg-[#434938] sm:block" />

        {/* Avatar */}
        <button className="h-8 w-8 overflow-hidden rounded-full border border-[#434938]">
          <img
            src={avatar}
            alt="User avatar"
            className="h-full w-full object-cover"
          />
        </button>
      </div>
    </header>
  );
}
