import Link from "next/link";
import { AlertCircle, BadgeCheck, Mail, Pencil, Phone } from "lucide-react";

type ProfileHeroProps = {
  label: string;
  displayName: string;
  bio?: string;
  email?: string;
  phoneNumber?: string;
  initials: string;
  verified: boolean;
  compact?: boolean;
  stats?: Array<{ label: string; value: string | number }>;
  action?: React.ReactNode;
};

export function ProfileHero({
  label,
  displayName,
  bio,
  email,
  phoneNumber,
  initials,
  verified,
  compact = false,
  stats,
  action,
}: ProfileHeroProps) {
  return (
    <div className={`profile-hero ${compact ? "px-5 py-5 sm:px-6 lg:px-8 lg:py-6" : "px-5 py-6 sm:px-7 lg:px-10 lg:py-8"}`}>
      <div className={`flex flex-col ${compact ? "gap-4" : "gap-5"} xl:flex-row xl:items-end xl:justify-between`}>
        <div className="flex items-end gap-5">
          <div className="relative shrink-0">
            <div className={`flex items-center justify-center overflow-hidden rounded-[1.2rem] bg-white/15 font-semibold text-white ring-2 ring-white/20 shadow-xl ${compact ? "h-[4.5rem] w-[4.5rem] text-xl sm:h-20 sm:w-20 sm:text-2xl lg:h-24 lg:w-24 lg:text-[1.7rem]" : "h-20 w-20 text-2xl sm:h-24 sm:w-24 sm:text-3xl lg:h-28 lg:w-28 lg:text-[2rem]"}`}>
              {initials}
            </div>
            <Link
              href="/profile/edit"
              className={`absolute -bottom-2 -right-2 flex items-center justify-center rounded-xl bg-card text-primary shadow-xl transition hover:bg-accent ${compact ? "h-8 w-8" : "h-9 w-9"}`}
            >
              <Pencil size={compact ? 14 : 15} />
            </Link>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-200/80">
              {label}
            </p>
            <h1 className={`${compact ? "mt-1.5 text-xl sm:text-2xl lg:text-[2rem]" : "mt-2 text-2xl sm:text-3xl lg:text-[2.35rem]"} font-semibold tracking-tight text-white`}>
              {displayName}
            </h1>
            {email || phoneNumber ? (
              <div className={`${compact ? "mt-2 space-y-1.5" : "mt-3 space-y-2"} text-sm text-blue-50/90`}>
                {email ? (
                  <p className="inline-flex items-center gap-2">
                    <Mail size={15} className="shrink-0" />
                    <span className="break-all">{email}</span>
                  </p>
                ) : null}
                {phoneNumber ? (
                  <p className="inline-flex items-center gap-2">
                    <Phone size={15} className="shrink-0" />
                    <span>{phoneNumber}</span>
                  </p>
                ) : null}
              </div>
            ) : null}
            {stats?.length ? (
              <div className={`${compact ? "mt-2.5" : "mt-4"} grid grid-cols-2 gap-2 sm:grid-cols-4`}>
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-white/10 px-2.5 py-1.5 ring-1 ring-white/10">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-blue-100/70">{stat.label}</p>
                    <p className="mt-0.5 text-sm font-semibold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            ) : null}
            <p className={`${compact ? "mt-2.5" : "mt-3"} max-w-3xl text-sm leading-6 text-blue-50/85`}>
              {bio}
            </p>
            <span
              className={`mt-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                verified
                  ? "bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/25"
                  : "bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/25"
              }`}
            >
              {verified ? <BadgeCheck size={12} /> : <AlertCircle size={12} />}
              {verified ? "Verified" : "Pending verification"}
            </span>
          </div>
        </div>

        {action ? <div className="flex flex-wrap gap-2.5">{action}</div> : null}
      </div>
    </div>
  );
}
