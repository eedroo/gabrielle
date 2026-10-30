export function Paragraphs({ items, className = "" }: { items: readonly string[]; className?: string }) {
  return (
    <div className={`body-copy space-y-4 ${className}`}>
      {items.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  );
}
