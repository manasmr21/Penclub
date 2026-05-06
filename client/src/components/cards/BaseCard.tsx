import { ReactNode } from "react";

interface BaseCardProps {
  title?: string;
  subtitle?: string;
  extra?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

export function BaseCard({
  title,
  subtitle,
  extra,
  children,
  className = "",
  headerClassName = "",
  bodyClassName = "",
}: BaseCardProps) {
  return (
    <div className={`bg-card rounded-none border border-primary/20 overflow-hidden ${className}`}>
      {(title || subtitle || extra) && (
        <div className={`p-5 border-b border-primary/15 bg-primary/5 flex items-center justify-between ${headerClassName}`}>
          <div>
            {subtitle && (
              <p className="text-[9px] text-primary/45 uppercase font-bold tracking-widest mb-0.5">
                {subtitle}
              </p>
            )}
            {title && (
              <h3 className="font-serif font-bold text-primary uppercase tracking-widest text-xs">
                {title}
              </h3>
            )}
          </div>
          {extra && <div className="flex items-center gap-2">{extra}</div>}
        </div>
      )}
      <div className={`p-6 ${bodyClassName}`}>{children}</div>
    </div>
  );
}
