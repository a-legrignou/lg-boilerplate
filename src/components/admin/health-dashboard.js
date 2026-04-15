"use client";

import { useEffect, useState } from "react";
import { RefreshCw, CheckCircle, AlertTriangle, XCircle, Clock, Server } from "lucide-react";

// ── Status helpers ────────────────────────────────────────────

const STATUS = {
  ok:   { icon: CheckCircle,    color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "OK" },
  warn: { icon: AlertTriangle,  color: "text-amber-400",   bg: "bg-amber-400/10",   border: "border-amber-400/20",  label: "Avertissement" },
  fail: { icon: XCircle,        color: "text-red-500",     bg: "bg-red-500/10",     border: "border-red-500/20",    label: "Erreur" },
};

function StatusBadge({ status }) {
  const s = STATUS[status] ?? STATUS.warn;
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${s.color} ${s.bg} ${s.border}`}>
      <Icon size={12} />
      {s.label}
    </span>
  );
}

function CheckRow({ check }) {
  const s = STATUS[check.status] ?? STATUS.warn;
  const Icon = s.icon;
  return (
    <div className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
      <Icon size={16} className={`mt-0.5 shrink-0 ${s.color}`} />
      <span className="text-sm text-muted-foreground">{check.message}</span>
    </div>
  );
}

function SectionCard({ section }) {
  const hasFailure = section.checks.some(c => c.status === "fail");
  const hasWarn    = section.checks.some(c => c.status === "warn");
  const status     = hasFailure ? "fail" : hasWarn ? "warn" : "ok";
  const s          = STATUS[status];

  return (
    <div className={`rounded-xl border p-5 ${s.border} ${s.bg}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-sm">{section.label}</h3>
        <StatusBadge status={status} />
      </div>
      <div>
        {section.checks.map((check, i) => (
          <CheckRow key={i} check={check} />
        ))}
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────

export default function HealthDashboard() {
  const [report, setReport]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/health");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      setReport(await res.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <main className="min-h-screen px-4 py-16 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <Server size={22} className="text-muted-foreground" />
          <h1 className="text-xl font-semibold tracking-tight">Diagnostic serveur</h1>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Actualiser
        </button>
      </div>

      {/* États */}
      {loading && (
        <div className="flex items-center justify-center py-24 text-muted-foreground text-sm gap-2">
          <RefreshCw size={16} className="animate-spin" />
          Chargement du rapport…
        </div>
      )}

      {error && !loading && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-400">
          {error}
        </div>
      )}

      {report && !loading && (
        <>
          {/* Résumé global */}
          <div className={`rounded-xl border p-6 mb-8 ${STATUS[report.status]?.border} ${STATUS[report.status]?.bg}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <StatusBadge status={report.status} />
                  <span className="text-sm font-medium">{report.host}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} />
                    {new Date(report.timestamp).toLocaleString("fr-FR")}
                  </span>
                  <span>{report.duration_ms}ms</span>
                </div>
              </div>
              <div className="flex gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-emerald-500">{report.summary.ok}</div>
                  <div className="text-xs text-muted-foreground">OK</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-400">{report.summary.warn}</div>
                  <div className="text-xs text-muted-foreground">Avert.</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-500">{report.summary.fail}</div>
                  <div className="text-xs text-muted-foreground">Erreurs</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="grid gap-4 sm:grid-cols-2">
            {report.sections.map((section, i) => (
              <SectionCard key={i} section={section} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
