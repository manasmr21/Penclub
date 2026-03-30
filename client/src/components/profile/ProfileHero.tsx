import Link from "next/link";
import { Mail, Pencil, Phone } from "lucide-react";

type ProfileHeroProps = {
  label: string;
  displayName: string;
  bio?: string;
  email?: string;
  phoneNumber?: string;
  initials: string;
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
              <div className={`${compact ? "mt-2.5" : "mt-4"} flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-blue-50/90`}>
                {stats.map((stat) => (
                  <p key={stat.label} className="inline-flex items-center gap-1.5">
                    <span className="font-semibold text-white">{stat.value}</span>
                    <span className="text-blue-100/80">{stat.label}</span>
                  </p>
                ))}
              </div>
            ) : null}
            {bio ? (
              <p className={`${compact ? "mt-2.5" : "mt-3"} max-w-3xl text-sm leading-6 text-blue-50/85`}>
                {bio}
              </p>
            ) : null}
          </div>
        </div>

        {action ? <div className="flex flex-wrap gap-2.5">{action}</div> : null}
      </div>
    </div>
  );
}
