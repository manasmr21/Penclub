import { LucideIcon } from "lucide-react";

interface QuickStatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  change: number;
}

export function QuickStatCard({ icon: Icon, label, value, change }: QuickStatCardProps) {
  return (
    <div className="bg-card rounded-none border border-primary/20 p-5 group hover:border-primary/40 transition-all">
      <div className="flex items-center justify-between mb-3">
        <Icon className="w-4 h-4 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
        <span
          className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border ${
            change > 0 ? "border-green-600/30 text-green-600" : "border-red-600/30 text-red-600"
          }`}
        >
          {change > 0 ? "+" : ""}
          {change}%
        </span>
      </div>
      <p className="text-2xl font-serif font-bold text-primary">{value}</p>
      <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-primary/45 mt-1">{label}</p>
    </div>
  );
}
