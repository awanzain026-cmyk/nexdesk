import { cn } from "@/lib/utils";

interface AvatarProps { name: string; size?: "sm" | "md" | "lg"; src?: string | null; }

export function Avatar({ name, size = "md", src }: AvatarProps) {
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const sizes = { sm: "h-6 w-6 text-[10px]", md: "h-8 w-8 text-xs", lg: "h-10 w-10 text-sm" };
  if (src) return <img src={src} alt={name} className={cn("rounded-full object-cover", sizes[size])} />;
  return (
    <div className={cn("rounded-full bg-gradient-to-br from-cyan/20 to-violet/20 border border-cyan/20 flex items-center justify-center font-semibold text-cyan flex-shrink-0", sizes[size])}>
      {initials}
    </div>
  );
}
