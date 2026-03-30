import { type ReactNode } from "react";
import { Card, CardContent } from "@/src/components/ui/card";

export function ProfileStatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <Card className="profile-panel gap-0 py-0">
      <CardContent className="p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-3 text-2xl font-semibold text-card-foreground sm:text-[1.75rem]">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

export function ProfileSectionCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={`profile-panel gap-0 py-0 ${className}`}>
      <CardContent className="p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {title}
        </h2>
        <div className="mt-3">{children}</div>
      </CardContent>
    </Card>
  );
}

export function ProfileSummaryCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Card className="profile-panel-dark gap-0 py-0">
      <CardContent className="p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-foreground/70">
          {title}
        </h2>
        <div className="mt-4">{children}</div>
      </CardContent>
    </Card>
  );
}
