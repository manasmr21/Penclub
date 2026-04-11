"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  Library,
  Settings,
} from "lucide-react";

import { Sidebar } from "@/src/components/Dashboard/Sidebar";
import { Header } from "@/src/components/Dashboard/Header";

// ✅ icon map lives in CLIENT
const iconMap = {
  dashboard: LayoutDashboard,
  users: Users,
  publications: Library,
  articles: FileText,
  books: BookOpen,
  settings: Settings,
};

export default function DashboardShell({ children, menuItems }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // ✅ inject icons here
  const menuWithIcons = menuItems.map((item) => ({
    ...item,
    icon: iconMap[item.icon],
  }));

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        menuItems={menuWithIcons} // ✅ now contains actual components
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 flex flex-col">
        <Header
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          setMobileOpen={setMobileOpen}
        />

        <main className="p-4 lg:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}