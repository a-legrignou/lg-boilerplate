"use client";

import { FileText } from "lucide-react";
import { useState } from "react";

export default function PdfDownloadButton({ slug, endpoint, filename }) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    if (!slug) return;
    setLoading(true);
    try {
      const apiUrl = endpoint ?? `/api/case-study/${slug}/pdf`;
      const downloadName = filename ?? `case-study_${slug}.pdf`;
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = downloadName;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium tracking-wide uppercase border border-border text-t2 hover:border-navy hover:text-navy transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shrink-0">
      <FileText size={13} />
      {loading ? "Génération…" : "Exporter PDF"}
    </button>
  );
}
