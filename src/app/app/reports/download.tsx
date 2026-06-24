"use client";

export function DownloadButton({
  data,
  filename,
  format,
  label,
}: {
  data: any[];
  filename: string;
  format: "csv" | "json";
  label: string;
}) {
  const download = () => {
    let content = "";
    let mime = "text/plain";
    if (format === "csv") {
      if (data.length === 0) {
        content = "";
      } else {
        const headers = Object.keys(data[0]);
        const rows = data.map((row) =>
          headers
            .map((h) => {
              const v = row[h];
              const s = v == null ? "" : String(v);
              if (/[",\n]/.test(s)) {
                return `"${s.replace(/"/g, '""')}"`;
              }
              return s;
            })
            .join(",")
        );
        content = [headers.join(","), ...rows].join("\n");
      }
      mime = "text/csv";
    } else {
      content = JSON.stringify(data, null, 2);
      mime = "application/json";
    }
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <button
      onClick={download}
      disabled={data.length === 0}
      className="flex-1 h-8 rounded border border-border bg-card text-xs hover:bg-card-2 hover:border-blood-bright disabled:opacity-40 disabled:pointer-events-none"
    >
      {label}
    </button>
  );
}
