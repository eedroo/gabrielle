export function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden>
      <span className="h-px flex-1 bg-current opacity-25" />
      <span className="size-1.5 rotate-45 border border-current opacity-50" />
      <span className="h-px flex-1 bg-current opacity-25" />
    </div>
  );
}
