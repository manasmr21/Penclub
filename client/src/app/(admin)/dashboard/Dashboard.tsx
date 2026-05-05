"use client";

import {
  Users,
  FileText,
  Eye,
  TrendingUp,
  Activity,
  Calendar,
  MessageCircle,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Download,
  RefreshCw,
  ChevronRight,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";

const now = Date.now();
// Stat Card Component
function StatCard({ title, value, icon: Icon, trend, trendValue, color }) {
  const isPositive = trend === "up";

  // Map incoming color to theme colors
  const colorMap = {
    blue: "primary",
    purple: "secondary",
    green: "green-500", // Keep semantic colors if theme doesn't provide replacements
    orange: "orange-500",
  };

  const themeColor = colorMap[color] || color;

  return (
    <div className="bg-white rounded-2xl border border-border/40 p-6 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-primary">{value}</h3>

          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {isPositive ? (
                <ArrowUpRight className="w-4 h-4 text-green-600" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-600" />
              )}
              <span
                className={`text-sm font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}
              >
                {trendValue}
              </span>
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>

        <div className={`p-3 rounded-2xl bg-primary/5 text-primary`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

// Recent Activity Component
function RecentActivity({ activities }) {
  const getActivityIcon = (type) => {
    switch (type) {
      case "user":
        return <Users className="w-4 h-4 text-primary" />;
      case "document":
        return <FileText className="w-4 h-4 text-secondary" />;
      case "comment":
        return <MessageCircle className="w-4 h-4 text-green-600" />;
      case "view":
        return <Eye className="w-4 h-4 text-orange-500" />;
      default:
        return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTimeAgo = (date: string | Date): string => {
    const past = new Date(date).getTime();

    const seconds = Math.floor((now - past) / 1000);

    if (seconds < 60) return "just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(seconds / 3600);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

    const days = Math.floor(seconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="bg-white rounded-2xl border border-border/40 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-border/40 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-primary uppercase tracking-wider text-sm">Recent Activity</h3>
          <button className="text-xs text-secondary hover:text-primary font-bold uppercase tracking-widest transition-colors">
            View All
          </button>
        </div>
      </div>

      <div className="divide-y divide-border/20">
        {activities.map((activity, index) => (
          <div key={index} className="p-4 hover:bg-background/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-primary/5 rounded-xl text-primary">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-primary">
                  {activity.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 font-serif italic">
                  {activity.description}
                </p>
                <p className="text-[10px] text-muted-foreground/60 mt-1.5 font-medium uppercase tracking-tighter">
                  {getTimeAgo(activity.timestamp)}
                </p>
              </div>
              {activity.status && (
                <div
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                    activity.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : activity.status === "pending"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {activity.status}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Chart Component (Simple bar chart)
function SimpleBarChart({ data, title }) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="bg-white rounded-2xl border border-border/40 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-bold text-primary uppercase tracking-wider text-sm">{title}</h3>
        <button className="p-1.5 hover:bg-background rounded-full transition-colors">
          <MoreVertical className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="flex items-end justify-between gap-4 h-56">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-3">
            <div
              className="w-full bg-gradient-to-t from-primary to-secondary rounded-xl transition-all duration-700 hover:brightness-110 relative group"
              style={{
                height: `${(item.value / maxValue) * 100}%`,
                minHeight: "8px",
              }}
            >
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {item.value} units
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Tasks Component
function TasksList({ tasks, onToggleTask }) {
  return (
    <div className="bg-white rounded-2xl border border-border/40 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-border/40 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-primary uppercase tracking-wider text-sm">Today&apos;s Tasks</h3>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-widest">
              {tasks.filter((t) => t.completed).length} of {tasks.length}{" "}
              completed
            </p>
          </div>
          <button className="text-xs text-secondary hover:text-primary font-bold uppercase tracking-widest transition-colors">
            Add Task
          </button>
        </div>
      </div>

      <div className="divide-y divide-border/20">
        {tasks.map((task) => (
          <div key={task.id} className="p-4 hover:bg-background/50 transition-colors">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleTask(task.id)}
                className="w-4 h-4 rounded border-primary/30 text-primary focus:ring-primary/40 cursor-pointer"
              />
              <div className="flex-1">
                <p
                  className={`text-sm font-bold ${task.completed ? "text-muted-foreground/50 line-through" : "text-primary"}`}
                >
                  {task.title}
                </p>
                {task.dueDate && (
                  <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1 font-medium uppercase tracking-tighter">
                    <Clock className="w-3 h-3" />
                    Due {task.dueDate}
                  </p>
                )}
              </div>
              {task.priority && (
                <div
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                    task.priority === "high"
                      ? "bg-red-100 text-red-700"
                      : task.priority === "medium"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-green-100 text-green-700"
                  }`}
                >
                  {task.priority}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Quick Stats Component
function QuickStats({ stats }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl border border-border/40 p-5 shadow-sm group hover:border-primary/20 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <stat.icon className="w-4 h-4 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
            <span
              className={`text-[10px] font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded ${
                stat.change > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {stat.change > 0 ? "+" : ""}
              {stat.change}%
            </span>
          </div>
          <p className="text-2xl font-bold text-primary">{stat.value}</p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

// Main Dashboard Component
export function Dashboard() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Review quarterly report",
      completed: false,
      priority: "high",
      dueDate: "Today",
    },
    {
      id: 2,
      title: "Update user documentation",
      completed: true,
      priority: "medium",
      dueDate: "Tomorrow",
    },
    {
      id: 3,
      title: "Fix navigation bug",
      completed: false,
      priority: "high",
      dueDate: "Today",
    },
    {
      id: 4,
      title: "Prepare team meeting",
      completed: false,
      priority: "low",
      dueDate: "Tomorrow",
    },
    {
      id: 5,
      title: "Deploy latest updates",
      completed: true,
      priority: "medium",
      dueDate: "Yesterday",
    },
  ]);

  const [activities] = useState([
    {
      type: "user",
      title: "New user registered",
      description: "John Doe joined the platform",
      timestamp: new Date(now - 1000 * 60 * 15).toISOString(),
      status: "completed",
    },
    {
      type: "document",
      title: "Document uploaded",
      description: "Q4 Report.pdf was uploaded",
      timestamp: new Date(now - 1000 * 60 * 45).toISOString(),
      status: "completed",
    },
    {
      type: "comment",
      title: "New comment",
      description: "Sarah commented on your post",
      timestamp: new Date(now - 1000 * 60 * 120).toISOString(),
      status: "pending",
    },
    {
      type: "view",
      title: "High traffic alert",
      description: "Page views increased by 150%",
      timestamp: new Date(now - 1000 * 60 * 180).toISOString(),
    },
    {
      type: "user",
      title: "Subscription renewed",
      description: "Premium plan renewed by Acme Corp",
      timestamp: new Date(now - 1000 * 60 * 240).toISOString(),
      status: "completed",
    },
  ]);

  const [chartData] = useState([
    { label: "Mon", value: 45 },
    { label: "Tue", value: 62 },
    { label: "Wed", value: 78 },
    { label: "Thu", value: 55 },
    { label: "Fri", value: 89 },
    { label: "Sat", value: 42 },
    { label: "Sun", value: 38 },
  ]);

  const quickStats = [
    { icon: Star, label: "Rating", value: "4.8", change: 12 },
    { icon: Clock, label: "Response Time", value: "2.4m", change: -8 },
    { icon: CheckCircle, label: "Completion", value: "94%", change: 5 },
    { icon: AlertCircle, label: "Issues", value: "3", change: -15 },
  ];

  const handleToggleTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  return (
    <div className="space-y-8 font-inter">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1 font-serif italic">
            Welcome back! Here&apos;s what&apos;s happening with your platform today.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-primary bg-white border border-primary/20 rounded-full hover:bg-primary/5 transition-all shadow-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white bg-primary rounded-full hover:bg-primary/90 transition-all shadow-[0_4px_12px_rgba(13,56,125,0.2)]">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value="12,345"
          icon={Users}
          trend="up"
          trendValue="+12.5%"
          color="blue"
        />
        <StatCard
          title="Total Documents"
          value="1,234"
          icon={FileText}
          trend="up"
          trendValue="+8.2%"
          color="purple"
        />
        <StatCard
          title="Total Views"
          value="89.2K"
          icon={Eye}
          trend="up"
          trendValue="+23.1%"
          color="green"
        />
        <StatCard
          title="Revenue"
          value="$45,678"
          icon={DollarSign}
          trend="up"
          trendValue="+15.3%"
          color="orange"
        />
      </div>

      {/* Charts and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SimpleBarChart data={chartData} title="Weekly Activity" />
        </div>
        <div className="lg:col-span-1">
          <QuickStats stats={quickStats} />
        </div>
      </div>

      {/* Tasks and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TasksList tasks={tasks} onToggleTask={handleToggleTask} />
        <RecentActivity activities={activities} />
      </div>

      {/* Additional Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-primary rounded-2xl p-6 text-white shadow-[0_8px_30px_rgba(13,56,125,0.15)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-24 h-24 -mr-8 -mt-8" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-secondary" />
              <span className="text-3xl font-bold">+47%</span>
            </div>
            <h4 className="text-lg font-bold tracking-tight mb-1">Growth Rate</h4>
            <p className="text-white/70 text-xs font-serif italic">Month over month growth</p>
            <div className="mt-6 pt-4 border-t border-white/10">
              <button className="text-xs font-bold uppercase tracking-widest hover:text-secondary transition-colors flex items-center gap-1">
                View Details
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-border/40 rounded-2xl p-6 shadow-sm group hover:border-secondary/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold text-primary">12</span>
          </div>
          <h4 className="text-lg font-bold tracking-tight text-primary mb-1">Upcoming Events</h4>
          <p className="text-muted-foreground text-xs font-serif italic">Events scheduled this week</p>
          <div className="mt-6 pt-4 border-t border-border/20">
            <button className="text-xs font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors flex items-center gap-1">
              View Calendar
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-secondary rounded-2xl p-6 text-white shadow-[0_8px_30px_rgba(19,135,215,0.15)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <MessageCircle className="w-24 h-24 -mr-8 -mt-8" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <MessageCircle className="w-8 h-8 text-primary" />
              <span className="text-3xl font-bold">24</span>
            </div>
            <h4 className="text-lg font-bold tracking-tight mb-1">New Messages</h4>
            <p className="text-white/70 text-xs font-serif italic">Unread conversations</p>
            <div className="mt-6 pt-4 border-t border-white/10">
              <button className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-1">
                View Messages
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
