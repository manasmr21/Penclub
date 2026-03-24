import { type UserRole } from "@/src/lib/auth";

type RoleToggleProps = {
  role: UserRole;
  onChange: (role: UserRole) => void;
};

export default function RoleToggle({ role, onChange }: RoleToggleProps) {
  return (
    <div className="mb-3 flex rounded-full bg-[#f4efcf] p-1">
      <button
        type="button"
        onClick={() => onChange("reader")}
        suppressHydrationWarning
        className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
          role === "reader" ? "bg-primary text-white shadow-sm" : "text-primary"
        }`}
      >
        Reader
      </button>
      <button
        type="button"
        onClick={() => onChange("author")}
        suppressHydrationWarning
        className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
          role === "author" ? "bg-primary text-white shadow-sm" : "text-primary"
        }`}
      >
        Author
      </button>
    </div>
  );
}
