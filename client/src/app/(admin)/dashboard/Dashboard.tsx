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
  MoreVertical,
  Download,
  RefreshCw,
  ChevronRight,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { BaseCard, StatCard, QuickStatCard } from "@/src/components/cards";

const now = Date.now();

// Shimmering Skeleton Components for Dashboard loading state
function StatCardSkeleton() {
  return (
    <div className="bg-[#FAF9F5] border border-primary/10 p-6 rounded-none animate-pulse relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div className="h-4 w-24 bg-primary/10 rounded-none" />
        <div className="h-8 w-8 bg-primary/10 rounded-none" />
      </div>
      <div className="h-8 w-32 bg-primary/10 rounded-none mb-3" />
      <div className="h-3.5 w-20 bg-primary/10 rounded-none" />
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/5" />
    </div>
  );
}

function ChartSkeleton({ title }) {
  return (
    <div className="bg-[#FAF9F5] border border-primary/10 p-6 rounded-none animate-pulse h-[352px] flex flex-col justify-between relative overflow-hidden">
      <div>
        <div className="h-5 w-32 bg-primary/10 rounded-none mb-2" />
        <div className="h-3.5 w-48 bg-primary/10 rounded-none" />
      </div>
      <div className="flex items-end justify-between gap-4 h-44 pt-4">
        {[40, 60, 30, 80, 50, 70, 45].map((h, i) => (
          <div key={i} className="flex-1 bg-primary/[0.06] rounded-none" style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="flex justify-between mt-4 border-t border-primary/5 pt-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-3 w-8 bg-primary/10 rounded-none" />
        ))}
      </div>
    </div>
  );
}

function ListSkeleton({ title }) {
  return (
    <div className="bg-[#FAF9F5] border border-primary/10 p-6 rounded-none animate-pulse h-80 flex flex-col justify-between relative overflow-hidden">
      <div>
        <div className="h-5 w-32 bg-primary/10 rounded-none mb-2" />
        <div className="h-3.5 w-48 bg-primary/10 rounded-none mb-6" />
      </div>
      <div className="space-y-4 flex-1">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-8 w-8 bg-[#FAF9F5] border border-primary/10 rounded-none" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-3/4 bg-primary/10 rounded-none" />
              <div className="h-2.5 w-1/2 bg-primary/10 rounded-none" />
            </div>
          </div>
        ))}
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
        return <Activity className="w-4 h-4 text-primary/60" />;
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
    <BaseCard
      title="Recent Activity"
      subtitle="System Logs"
      bodyClassName="p-0"
      extra={
        <button className="text-[10px] text-secondary hover:text-primary font-bold uppercase tracking-widest transition-colors">
          View All
        </button>
      }
    >
      <div className="divide-y divide-primary/10">
        {activities.map((activity, index) => (
          <div key={index} className="p-4 hover:bg-primary/[0.02] transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-primary/5 border border-primary/10 rounded-none text-primary">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-primary">
                  {activity.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 font-serif italic">
                  {activity.description}
                </p>
                <p className="text-[9px] text-primary/45 mt-1.5 font-bold uppercase tracking-wider">
                  {getTimeAgo(activity.timestamp)}
                </p>
              </div>
              {activity.status && (
                <div
                  className={`px-2.5 py-1 rounded-none text-[9px] font-bold uppercase tracking-widest border bg-transparent ${activity.status === "completed"
                    ? "border-green-600/30 text-green-600"
                    : activity.status === "pending"
                      ? "border-orange-600/30 text-orange-600"
                      : "border-red-600/30 text-red-600"
                    }`}
                >
                  {activity.status}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </BaseCard>
  );
}

function SimpleBarChart({ data, title }) {
  const maxValue = Math.max(...data.map((d) => d.value));

  const barColor = "linear-gradient(180deg, var(--stat-blue-from) 0%, var(--stat-blue-to) 100%)";

  return (
    <BaseCard
      title={title}
      subtitle="Weekly traffic metrics"
      extra={
        <span className="text-xs font-bold uppercase tracking-wider text-primary/40 font-mono bg-primary/[0.04] px-2.5 py-1 border border-primary/5">LIVE FEED</span>
      }
    >
      <div className="relative h-64 w-full pt-6 px-2 font-sans">
        {/* Background dotted guide lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-14 pt-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="border-b border-primary/[0.05] w-full" />
          ))}
        </div>

        {/* Chart Bars */}
        <div className="relative h-48 flex items-end justify-between gap-4 z-10">
          {data.map((item, index) => {
            const percentage = (item.value / maxValue) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer">
                {/* Narrow centered solid bar wrapper */}
                <div className="w-full h-40 flex items-end justify-center">
                  <div 
                    className="w-6 rounded-none transition-all duration-500 ease-out relative"
                    style={{
                      height: `${percentage}%`,
                      background: barColor,
                      boxShadow: "0 4px 12px rgba(15, 76, 156, 0.15)"
                    }}
                  >
                    {/* Value indicator on hover */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2.5 py-1.5 rounded-none opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none tracking-widest font-bold whitespace-nowrap shadow-xl border border-white/10">
                      {item.value} UNITS
                    </div>
                  </div>
                </div>

                <span className="text-xs font-bold uppercase tracking-wider text-primary/60 mt-4 group-hover:text-primary transition-colors">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </BaseCard>
  );
}

// Line Chart Component
function SimpleLineChart({ data, title }) {
  const maxValue = Math.max(...data.map((d) => d.value));
  
  const width = 500;
  const height = 200;
  const padding = 20;
  
  // Calculate SVG coordinates
  const points = data.map((d, index) => {
    const x = padding + (index * (width - padding * 2)) / (data.length - 1);
    const y = height - padding - (d.value / maxValue) * (height - padding * 2);
    return { x, y, value: d.value, label: d.label };
  });

  const pathD = points.map((p, index) => {
    return `${index === 0 ? 'M' : 'L'} ${p.x} ${p.y}`;
  }).join(" ");

  // Create a closed path for the gradient area fill below the line
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <BaseCard
      title={title}
      subtitle="Monthly Visitor Analytics"
      extra={
        <span className="text-xs font-bold uppercase tracking-wider text-primary/40 font-mono bg-primary/[0.04] px-2.5 py-1 border border-primary/5">TREND</span>
      }
    >
      <div className="relative w-full pt-4 font-sans px-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-60 overflow-visible">
          <defs>
            {/* Soft, beautiful fade-out area gradient */}
            <linearGradient id="lineAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0F4C9C" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0F4C9C" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Dotted horizontal guides */}
          {[0, 0.33, 0.66, 1].map((ratio, idx) => {
            const y = padding + ratio * (height - padding * 2);
            return (
              <line
                key={idx}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="currentColor"
                className="text-primary/[0.06]"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Fading area fill beneath the trend line */}
          <path d={areaD} fill="url(#lineAreaGradient)" />

          {/* Gorgeous trend stroke path */}
          <path
            d={pathD}
            fill="none"
            stroke="#0F4C9C"
            strokeWidth="3.2"
            strokeLinecap="round"
            className="drop-shadow-[0_4px_8px_rgba(15,76,156,0.3)]"
          />

          {/* Interactive node group */}
          {points.map((p, index) => (
            <g key={index} className="group cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r="4.5"
                className="fill-white stroke-[#0F4C9C] stroke-[2.5]"
              />
              <circle
                cx={p.x}
                cy={p.y}
                r="9"
                className="fill-[#0F4C9C]/10 opacity-0 group-hover:opacity-100 transition-opacity"
              />
              {/* Tooltip above node */}
              <foreignObject x={p.x - 30} y={p.y - 36} width="60" height="24" className="overflow-visible opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                <div className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-none text-center font-bold tracking-wider uppercase border border-white/10 shadow-lg transform translate-y-1 group-hover:translate-y-0 duration-300">
                  {p.value}K
                </div>
              </foreignObject>
            </g>
          ))}
        </svg>

        <div className="flex justify-between px-5 mt-4">
          {points.map((p, index) => (
            <span key={index} className="text-xs font-bold uppercase tracking-wider text-primary/60">{p.label}</span>
          ))}
        </div>
      </div>
    </BaseCard>
  );
}

// Tasks Component
function TasksList({ tasks, onToggleTask }) {
  return (
    <BaseCard
      title="Today's Tasks"
      subtitle={`${tasks.filter((t) => t.completed).length} of ${tasks.length} completed`}
      bodyClassName="p-0"
      extra={
        <button className="text-[10px] text-secondary hover:text-primary font-bold uppercase tracking-widest transition-colors">
          Add Task
        </button>
      }
    >
      <div className="divide-y divide-primary/10">
        {tasks.map((task) => (
          <div key={task.id} className="p-4 hover:bg-primary/[0.02] transition-colors">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleTask(task.id)}
                className="w-4 h-4 rounded-none border-primary/30 text-primary accent-primary cursor-pointer"
              />
              <div className="flex-1">
                <p
                  className={`text-sm font-bold ${task.completed ? "text-primary/30 line-through" : "text-primary"}`}
                >
                  {task.title}
                </p>
                {task.dueDate && (
                  <p className="text-[9px] text-primary/45 mt-0.5 flex items-center gap-1 font-bold uppercase tracking-widest">
                    <Clock className="w-3 h-3" />
                    Due {task.dueDate}
                  </p>
                )}
              </div>
              {task.priority && (
                <div
                  className={`px-2.5 py-1 rounded-none text-[9px] font-bold uppercase tracking-widest border bg-transparent ${task.priority === "high"
                    ? "border-red-600/30 text-red-600"
                    : task.priority === "medium"
                      ? "border-orange-600/30 text-orange-600"
                      : "border-green-600/30 text-green-600"
                    }`}
                >
                  {task.priority}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </BaseCard>
  );
}

// Quick Stats Component
function QuickStats({ stats }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <QuickStatCard
          key={index}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          change={stat.change}
        />
      ))}
    </div>
  );
}

// Main Dashboard Component
export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

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

  const [lineChartData] = useState([
    { label: "Jan", value: 34 },
    { label: "Feb", value: 45 },
    { label: "Mar", value: 62 },
    { label: "Apr", value: 50 },
    { label: "May", value: 78 },
    { label: "Jun", value: 92 },
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
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-primary/20 pb-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
            Editorial Control
          </span>
          <h1 className="text-3xl font-serif font-bold text-primary mt-1 tracking-tight">Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-1.5 font-serif italic">
            Welcome back! Here&apos;s a detailed digest of your platform's activity today.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-primary bg-white border border-primary/20 rounded-none hover:bg-primary/5 transition-all">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 1000);
            }}
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white bg-primary border border-primary rounded-none hover:opacity-90 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-8 animate-fadeIn duration-500">
          {/* Stats Skeletons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>

          {/* Charts Skeletons */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ChartSkeleton title="Weekly Activity" />
            </div>
            <div className="lg:col-span-2">
              <ChartSkeleton title="Engagement Trend" />
            </div>
          </div>

          {/* Lists Skeletons */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ListSkeleton title="Today's Tasks" />
            <ListSkeleton title="Recent Activity" />
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-fadeIn duration-700">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Users"
              value="12,345"
              icon={Users}
              trend="up"
              trendValue="+12.5%"
              theme="blue"
            />
            <StatCard
              title="Total Documents"
              value="1,234"
              icon={FileText}
              trend="up"
              trendValue="+8.2%"
              theme="purple"
            />
            <StatCard
              title="Total Views"
              value="89.2K"
              icon={Eye}
              trend="up"
              trendValue="+23.1%"
              theme="ocean"
            />
            <StatCard
              title="Revenue"
              value="$45,678"
              icon={DollarSign}
              trend="up"
              trendValue="+15.3%"
              theme="coral"
            />
          </div>

          {/* Charts and Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <SimpleBarChart data={chartData} title="Weekly Activity" />
            </div>
            <div className="lg:col-span-2">
              <SimpleLineChart data={lineChartData} title="Engagement Trend" />
            </div>
          </div>

          {/* Tasks and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TasksList tasks={tasks} onToggleTask={handleToggleTask} />
            <RecentActivity activities={activities} />
          </div>

          {/* Additional Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-primary rounded-none p-6 text-white border border-primary relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-15 transition-opacity">
                <TrendingUp className="w-24 h-24 -mr-8 -mt-8" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-8 h-8 text-secondary" />
                  <span className="text-3xl font-serif font-bold">+47%</span>
                </div>
                <h4 className="text-lg font-serif font-bold tracking-tight mb-1">Growth Rate</h4>
                <p className="text-white/70 text-xs font-serif italic">Month over month growth</p>
                <div className="mt-6 pt-4 border-t border-white/10">
                  <button className="text-xs font-bold uppercase tracking-widest hover:text-secondary transition-colors flex items-center gap-1">
                    View Details
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-card border border-primary/20 rounded-none p-6 group hover:border-primary/40 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-secondary/10 border border-secondary/10 rounded-none text-secondary">
                  <Calendar className="w-6 h-6" />
                </div>
                <span className="text-3xl font-serif font-bold text-primary">12</span>
              </div>
              <h4 className="text-lg font-serif font-bold tracking-tight text-primary mb-1">Upcoming Events</h4>
              <p className="text-muted-foreground text-xs font-serif italic">Events scheduled this week</p>
              <div className="mt-6 pt-4 border-t border-primary/10">
                <button className="text-xs font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors flex items-center gap-1">
                  View Calendar
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-secondary rounded-none p-6 text-white border border-secondary relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-15 transition-opacity">
                <MessageCircle className="w-24 h-24 -mr-8 -mt-8" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <MessageCircle className="w-8 h-8 text-primary" />
                  <span className="text-3xl font-serif font-bold">24</span>
                </div>
                <h4 className="text-lg font-serif font-bold tracking-tight mb-1">New Messages</h4>
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
      )}
    </div>
  );
}
