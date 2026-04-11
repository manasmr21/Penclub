import "./dashboard.css";
import DashboardShell from "./DashboardShell";

export default function DashboardLayout({ children }) {
  const menuItems = [
    { name: "Dashboard", icon: "dashboard", path: "/dashboard" },
    { name: "Users", icon: "users", path: "/users" },
    { name: "Publications", icon: "publications", path: "/publications" }, // ✅ fixed
    { name: "Articles", icon: "articles", path: "/all-articles" },
    { name: "Books", icon: "books", path: "/books" },
    { name: "Settings", icon: "settings", path: "/settings" },
  ];

  return (
    <DashboardShell menuItems={menuItems}>
      {children}
    </DashboardShell>
  );
}