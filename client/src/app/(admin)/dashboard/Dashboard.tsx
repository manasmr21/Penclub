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
  AlertCircle
} from "lucide-react";
import { useState, useEffect } from "react";

// Stat Card Component
function StatCard({ title, value, icon: Icon, trend, trendValue, color }) {
  const isPositive = trend === 'up';
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 hover:border-gray-200 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {isPositive ? (
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trendValue}
              </span>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-xl bg-${color}-50`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );
}

// Recent Activity Component
function RecentActivity({ activities }) {
  const getActivityIcon = (type) => {
    switch(type) {
      case 'user': return <Users className="w-4 h-4 text-blue-500" />;
      case 'document': return <FileText className="w-4 h-4 text-purple-500" />;
      case 'comment': return <MessageCircle className="w-4 h-4 text-green-500" />;
      case 'view': return <Eye className="w-4 h-4 text-orange-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
      hour: 3600,
      minute: 60
    };
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Recent Activity</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All
          </button>
        </div>
      </div>
      
      <div className="divide-y divide-gray-100">
        {activities.map((activity, index) => (
          <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-50 rounded-lg">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {getTimeAgo(activity.timestamp)}
                </p>
              </div>
              {activity.status && (
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  activity.status === 'completed' ? 'bg-green-50 text-green-700' :
                  activity.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                  'bg-red-50 text-red-700'
                }`}>
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
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      
      <div className="flex items-end justify-between gap-2 h-48">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div 
              className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-lg transition-all duration-500 hover:opacity-80"
              style={{ height: `${(item.value / maxValue) * 100}%`, minHeight: '4px' }}
            />
            <span className="text-xs text-gray-500">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Tasks Component
function TasksList({ tasks, onToggleTask }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Today's Tasks</h3>
            <p className="text-xs text-gray-500 mt-1">
              {tasks.filter(t => t.completed).length} of {tasks.length} completed
            </p>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Add Task
          </button>
        </div>
      </div>
      
      <div className="divide-y divide-gray-100">
        {tasks.map((task) => (
          <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleTask(task.id)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1">
                <p className={`text-sm font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                  {task.title}
                </p>
                {task.dueDate && (
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Due {task.dueDate}
                  </p>
                )}
              </div>
              {task.priority && (
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  task.priority === 'high' ? 'bg-red-50 text-red-700' :
                  task.priority === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                  'bg-green-50 text-green-700'
                }`}>
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
        <div key={index} className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <stat.icon className="w-4 h-4 text-gray-400" />
            <span className={`text-xs font-medium ${
              stat.change > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.change > 0 ? '+' : ''}{stat.change}%
            </span>
          </div>
          <p className="text-xl font-bold text-gray-900">{stat.value}</p>
          <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

// Main Dashboard Component
export function Dashboard() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Review quarterly report", completed: false, priority: "high", dueDate: "Today" },
    { id: 2, title: "Update user documentation", completed: true, priority: "medium", dueDate: "Tomorrow" },
    { id: 3, title: "Fix navigation bug", completed: false, priority: "high", dueDate: "Today" },
    { id: 4, title: "Prepare team meeting", completed: false, priority: "low", dueDate: "Tomorrow" },
    { id: 5, title: "Deploy latest updates", completed: true, priority: "medium", dueDate: "Yesterday" },
  ]);

  const [activities] = useState([
    {
      type: "user",
      title: "New user registered",
      description: "John Doe joined the platform",
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      status: "completed"
    },
    {
      type: "document",
      title: "Document uploaded",
      description: "Q4 Report.pdf was uploaded",
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      status: "completed"
    },
    {
      type: "comment",
      title: "New comment",
      description: "Sarah commented on your post",
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      status: "pending"
    },
    {
      type: "view",
      title: "High traffic alert",
      description: "Page views increased by 150%",
      timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    },
    {
      type: "user",
      title: "Subscription renewed",
      description: "Premium plan renewed by Acme Corp",
      timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
      status: "completed"
    }
  ]);

  const [chartData] = useState([
    { label: "Mon", value: 45 },
    { label: "Tue", value: 62 },
    { label: "Wed", value: 78 },
    { label: "Thu", value: 55 },
    { label: "Fri", value: 89 },
    { label: "Sat", value: 42 },
    { label: "Sun", value: 38 }
  ]);

  const quickStats = [
    { icon: Star, label: "Rating", value: "4.8", change: 12 },
    { icon: Clock, label: "Response Time", value: "2.4m", change: -8 },
    { icon: CheckCircle, label: "Completion", value: "94%", change: 5 },
    { icon: AlertCircle, label: "Issues", value: "3", change: -15 }
  ];

  const handleToggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back! Here's what's happening with your platform today.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:opacity-90 transition-all">
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
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">+47%</span>
          </div>
          <h4 className="text-lg font-semibold mb-1">Growth Rate</h4>
          <p className="text-blue-100 text-sm">Month over month growth</p>
          <div className="mt-4 pt-4 border-t border-blue-400">
            <button className="text-sm font-medium hover:underline flex items-center gap-1">
              View Details
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">12</span>
          </div>
          <h4 className="text-lg font-semibold mb-1">Upcoming Events</h4>
          <p className="text-purple-100 text-sm">Events scheduled this week</p>
          <div className="mt-4 pt-4 border-t border-purple-400">
            <button className="text-sm font-medium hover:underline flex items-center gap-1">
              View Calendar
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <MessageCircle className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">24</span>
          </div>
          <h4 className="text-lg font-semibold mb-1">New Messages</h4>
          <p className="text-green-100 text-sm">Unread conversations</p>
          <div className="mt-4 pt-4 border-t border-green-400">
            <button className="text-sm font-medium hover:underline flex items-center gap-1">
              View Messages
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}