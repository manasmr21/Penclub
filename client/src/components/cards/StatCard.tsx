import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: "up" | "down";
  trendValue?: string;
  theme?: "blue" | "purple" | "green" | "gold" | "coral" | "ocean" | "red" | "gray";
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  theme = "blue",
}: StatCardProps) {
  const isPositive = trend === "up";

  const themeVariables = {
    blue: { from: "--stat-blue-from", to: "--stat-blue-to" },
    purple: { from: "--stat-purple-from", to: "--stat-purple-to" },
    green: { from: "--stat-green-from", to: "--stat-green-to" },
    gold: { from: "--stat-gold-from", to: "--stat-gold-to" },
    coral: { from: "--stat-coral-from", to: "--stat-coral-to" },
    ocean: { from: "--stat-ocean-from", to: "--stat-ocean-to" },
    red: { from: "--stat-red-from", to: "--stat-red-to" },
    gray: { from: "--stat-gray-from", to: "--stat-gray-to" },
  };

  const selectedTheme = themeVariables[theme] || themeVariables.blue;

  return (
    <div 
      className="rounded-none border p-6 hover:brightness-110 transition-all duration-300 relative overflow-hidden group text-white shadow-lg"
      style={{
        background: `linear-gradient(135deg, var(${selectedTheme.from}), var(${selectedTheme.to}))`,
        borderColor: `rgba(255, 255, 255, 0.12)`
      }}
    >
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
        <Icon className="w-24 h-24 -mr-6 -mt-6" />
      </div>
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 mb-2">{title}</p>
          <h3 className="text-3xl font-serif font-bold tracking-tight">{value}</h3>

          {trend && (
            <div className="flex items-center gap-1.5 mt-3">
              {isPositive ? (
                <ArrowUpRight className="w-4 h-4 text-green-400 font-bold" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-400 font-bold" />
              )}
              <span
                className={`text-xs font-bold ${isPositive ? "text-green-400" : "text-red-400"}`}
              >
                {trendValue}
              </span>
              <span className="text-[9px] uppercase tracking-widest opacity-60">vs last month</span>
            </div>
          )}
        </div>

        <div className="p-3 rounded-none bg-white/10 text-white border border-white/20">
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
