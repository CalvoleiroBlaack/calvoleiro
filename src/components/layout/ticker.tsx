export function Ticker() {
  const items = [
    "▶ REC",
    "SYS: OPERATIONAL",
    "UPLOAD TO YT STUDIO",
    "THUMBNAIL A/B ACTIVE",
    "CTR TARGET: 8%+",
    "RETENTION TARGET: 55%+",
    "FNAF FANGAMES HOT",
    "ANALOG HORROR TRENDING",
    "PUPPET COMBO WATCHLIST",
  ];
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border border-border rounded-md bg-card py-1.5 font-mono text-[10px] text-muted uppercase tracking-widest">
      <div className="flex whitespace-nowrap cb-ticker gap-10 px-6">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-2">
            <span className="text-blood-bright">●</span>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
