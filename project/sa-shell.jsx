// EcommPilot Ops — ícones, sidebar e componentes compartilhados.
const { useState, useEffect, useMemo, useRef } = React;

const Ico = ({ size = 16, sw = 1.7, children, ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
       fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round"
       strokeLinejoin="round" {...rest}>{children}</svg>
);

const I = {
  Grid: (p) => <Ico {...p}><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></Ico>,
  Building: (p) => <Ico {...p}><rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M9 16h6" /></Ico>,
  Users: (p) => <Ico {...p}><circle cx="9" cy="8" r="3.4" /><path d="M3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1" /><path d="M16 4.2a3.4 3.4 0 0 1 0 6.6M21 20v-1a5 5 0 0 0-3.5-4.8" /></Ico>,
  Database: (p) => <Ico {...p}><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></Ico>,
  Activity: (p) => <Ico {...p}><path d="M3 12h4l3 8 4-16 3 8h4" /></Ico>,
  Link: (p) => <Ico {...p}><path d="M9 17H7A5 5 0 0 1 7 7h2M15 7h2a5 5 0 0 1 0 10h-2M8 12h8" /></Ico>,
  Card: (p) => <Ico {...p}><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20M6 15h4" /></Ico>,
  Scroll: (p) => <Ico {...p}><path d="M6 3h10a2 2 0 0 1 2 2v12a2 2 0 0 0 2 2H8a2 2 0 0 1-2-2V3z" /><path d="M6 3a2 2 0 0 0-2 2v2h2M10 8h5M10 12h5" /></Ico>,
  Columns: (p) => <Ico {...p}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18M15 3v18" /></Ico>,
  Coin: (p) => <Ico {...p}><circle cx="12" cy="12" r="9" /><path d="M14.5 9.5a3 3 0 1 0 0 5h-5a3 3 0 0 1 0-5z" /></Ico>,
  Target: (p) => <Ico {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></Ico>,
  Search: (p) => <Ico {...p}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></Ico>,
  Filter: (p) => <Ico {...p}><path d="M3 6h18M6 12h12M10 18h4" /></Ico>,
  Refresh: (p) => <Ico {...p}><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></Ico>,
  ChevronRight: (p) => <Ico {...p}><path d="m9 18 6-6-6-6" /></Ico>,
  ChevronDown: (p) => <Ico {...p}><path d="m6 9 6 6 6-6" /></Ico>,
  ArrowUp: (p) => <Ico {...p}><path d="M12 19V5M5 12l7-7 7 7" /></Ico>,
  ArrowDown: (p) => <Ico {...p}><path d="M12 5v14M19 12l-7 7-7-7" /></Ico>,
  ArrowUpRight: (p) => <Ico {...p}><path d="M7 17 17 7M8 7h9v9" /></Ico>,
  ExternalLink: (p) => <Ico {...p}><path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></Ico>,
  Plus: (p) => <Ico {...p}><path d="M12 5v14M5 12h14" /></Ico>,
  More: (p) => <Ico {...p}><circle cx="12" cy="5" r="1.4" /><circle cx="12" cy="12" r="1.4" /><circle cx="12" cy="19" r="1.4" /></Ico>,
  Close: (p) => <Ico {...p}><path d="M18 6 6 18M6 6l12 12" /></Ico>,
  Check: (p) => <Ico {...p}><path d="M20 6 9 17l-5-5" /></Ico>,
  CircleCheck: (p) => <Ico {...p}><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 4.5-5" /></Ico>,
  Triangle: (p) => <Ico {...p}><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></Ico>,
  Clock: (p) => <Ico {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Ico>,
  Bolt: (p) => <Ico {...p}><path d="m13 2-9 13h7l-1 7 9-13h-7l1-7z" /></Ico>,
  Sparkles: (p) => <Ico {...p}><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" /><path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14z" /></Ico>,
  Send: (p) => <Ico {...p}><path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z" /></Ico>,
  Code: (p) => <Ico {...p}><path d="m16 18 6-6-6-6M8 6l-6 6 6 6" /></Ico>,
  Mail: (p) => <Ico {...p}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 6 10-6" /></Ico>,
  Megaphone: (p) => <Ico {...p}><path d="M3 11v2a1 1 0 0 0 1 1h2l9 5V5L6 10H4a1 1 0 0 0-1 1z" /><path d="M18.5 8a4 4 0 0 1 0 8" /></Ico>,
  SocialV: (p) => <Ico {...p}><circle cx="18" cy="5" r="2.6" /><circle cx="6" cy="12" r="2.6" /><circle cx="18" cy="19" r="2.6" /><path d="m8.4 13.4 7.2 4.2M15.6 6.4 8.4 10.6" /></Ico>,
  Repeat: (p) => <Ico {...p}><path d="m17 2 4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><path d="m7 22-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></Ico>,
  Analytics: (p) => <Ico {...p}><rect x="3" y="12" width="4" height="9" rx="1.5" /><rect x="10" y="7" width="4" height="14" rx="1.5" /><rect x="17" y="3" width="4" height="18" rx="1.5" /></Ico>,
  Meta: (p) => <Ico {...p} sw={1.8}><path d="M2 14c0-4 2-7 4.5-7 3.5 0 5 10 8.5 10 2 0 3-2 3-5s-1-5-3-5c-3.5 0-5 10-8.5 10C4 17 2 16 2 14z" /></Ico>,
  Google: (p) => <Ico {...p}><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></Ico>,
  Shield: (p) => <Ico {...p}><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3z" /><path d="m9 12 2 2 4-4" /></Ico>,
  LogOut: (p) => <Ico {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></Ico>,
  Bell: (p) => <Ico {...p}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></Ico>,
  Pause: (p) => <Ico {...p}><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></Ico>,
  Dot: (p) => <Ico {...p}><circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" /></Ico>,
};

// ── Avatar ──────────────────────────────────────────────────
const GRADS = {
  "amber-rose": "linear-gradient(135deg, var(--amber), var(--rose))",
  "teal-sky":   "linear-gradient(135deg, var(--teal), var(--sky))",
  "violet-pink":"linear-gradient(135deg, var(--violet), var(--pink))",
  "indigo-violet":"linear-gradient(135deg, var(--indigo), var(--violet))",
};
function Avatar({ initials, size = 30, grad = "violet-pink" }) {
  return (
    <span className="avatar" style={{ width: size, height: size, background: GRADS[grad] || GRADS["violet-pink"],
      fontSize: Math.round(size * 0.38) }}>{initials}</span>
  );
}
function initialsOf(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

// ── Sparkline ───────────────────────────────────────────────
function Sparkline({ data, w = 84, h = 26, color = "var(--ink-3)", fill = false }) {
  const min = Math.min(...data), max = Math.max(...data), span = max - min || 1;
  const pts = data.map((v, i) => [ (i / (data.length - 1)) * w, h - 3 - ((v - min) / span) * (h - 6) ]);
  const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = d + ` L${w} ${h} L0 ${h} Z`;
  const gid = "sg" + Math.random().toString(36).slice(2, 7);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block", overflow: "visible" }}>
      {fill && <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={color} stopOpacity="0.22" /><stop offset="1" stopColor={color} stopOpacity="0" />
      </linearGradient></defs>}
      {fill && <path d={area} fill={`url(#${gid})`} />}
      <path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Vector chip ─────────────────────────────────────────────
function VectorChip({ vector, size = "sm" }) {
  const v = VECTORS[vector]; if (!v) return null;
  const Icon = I[v.icon] || I.Analytics;
  return (
    <span className={"vec-chip vec-" + v.tint + (size === "lg" ? " lg" : "")}>
      <Icon size={size === "lg" ? 13 : 11} sw={1.9} />{v.label}
    </span>
  );
}

// ── Severity tag ────────────────────────────────────────────
const SEV_LABEL = { critico: "Crítico", alto: "Alto", medio: "Médio", oportunidade: "Oportunidade" };
function SevTag({ sev }) { return <span className="sev-tag" data-sev={sev}>{SEV_LABEL[sev]}</span>; }

// ── Status pill (genérico) ──────────────────────────────────
const STATUS_TINT = {
  ativo: "teal", ok: "teal", pago: "teal", conectado: "teal",
  trial: "violet", convidado: "violet",
  atraso: "amber", warn: "amber", pendente: "amber", pausado: "amber", rascunho: "slate",
  erro: "rose", err: "rose", falhou: "rose", suspenso: "rose",
};
function StatusPill({ status, label }) {
  const tint = STATUS_TINT[status] || "slate";
  return <span className={"status-pill st-" + tint}><span className="st-dot" />{label || status}</span>;
}

// ── Stat tile (Visão geral) ─────────────────────────────────
function StatTile({ tile }) {
  const Icon = I[tile.icon] || I.Activity;
  const up = tile.dir === "up";
  const color = "var(--" + (tile.tint || "violet") + ")";
  return (
    <div className="tile">
      <div className="tile-top">
        <span className="tile-ic" style={{ background: "var(--" + tile.tint + "-soft)", color }}><Icon size={16} /></span>
        <Sparkline data={tile.series} color={color} fill w={70} h={26} />
      </div>
      <div className="tile-val">{tile.value}</div>
      <div className="tile-foot">
        <span className="tile-label">{tile.label}</span>
        <span className={"tile-delta " + (up ? "up" : "down")}>
          {up ? <I.ArrowUp size={11} sw={2.3} /> : <I.ArrowDown size={11} sw={2.3} />}
          {Math.abs(tile.delta)}{tile.id === "mrr" || tile.id === "cards" || tile.id === "acerto" || tile.id === "health" ? "%" : ""}
        </span>
      </div>
      <div className="tile-note">{tile.deltaLabel}</div>
    </div>
  );
}

// ── Sidebar (back-office Ops) ───────────────────────────────
const NAV = [
  { group: "Operação", items: [
    { id: "overview", label: "Visão geral", icon: "Grid" },
    { id: "clients",  label: "Clientes",    icon: "Building", badge: "48" },
    { id: "users",    label: "Usuários",    icon: "Users" },
  ]},
  { group: "Engine", items: [
    { id: "triggers", label: "Catálogo de triggers", icon: "Database", badge: "63" },
    { id: "conns",    label: "Saúde das conexões",   icon: "Activity", badge: "27", badgeTone: "rose" },
  ]},
  { group: "Negócio", items: [
    { id: "billing",  label: "Faturamento",  icon: "Card" },
    { id: "logs",     label: "Logs & auditoria", icon: "Scroll" },
  ]},
];

function Sidebar({ route, setRoute, theme, setTheme }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">eP</div>
        <div>
          <div className="brand-name">EcommPilot</div>
          <div className="brand-ops"><I.Shield size={10} sw={2} /> Ops Console</div>
        </div>
      </div>

      <a className="back-link" href="visao-geral-v2.html">
        <I.ExternalLink size={13} /> Abrir app do cliente
      </a>

      {NAV.map(sec => (
        <div key={sec.group} className="nav-block">
          <div className="nav-label">{sec.group}</div>
          {sec.items.map(it => {
            const Icon = I[it.icon];
            const active = route === it.id;
            return (
              <button key={it.id} className={"nav-item" + (active ? " active" : "")} onClick={() => setRoute(it.id)}>
                <Icon size={16} className="icon" />
                <span>{it.label}</span>
                {it.badge && <span className={"badge" + (it.badgeTone === "rose" ? "" : " muted")}>{it.badge}</span>}
              </button>
            );
          })}
        </div>
      ))}

      <div className="nav-spacer" />

      <button className="nav-item" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        <I.Bolt size={16} className="icon" />
        <span>Tema {theme === "dark" ? "claro" : "escuro"}</span>
      </button>

      <div className="nav-footer">
        <Avatar initials={OPERATOR.initials} size={32} grad="indigo-violet" />
        <div style={{ minWidth: 0 }}>
          <div className="user-name">{OPERATOR.name}</div>
          <div className="user-role">{OPERATOR.role}</div>
        </div>
        <button className="ico-ghost" title="Sair"><I.LogOut size={15} /></button>
      </div>
    </aside>
  );
}

// ── Topbar ──────────────────────────────────────────────────
function Topbar({ title, sub, children }) {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <div>
          <h1>{title}</h1>
          {sub && <div className="topbar-sub">{sub}</div>}
        </div>
      </div>
      <div className="topbar-actions">{children}</div>
    </div>
  );
}

// ── helpers ─────────────────────────────────────────────────
const brl = (n) => "R$ " + n.toLocaleString("pt-BR");

Object.assign(window, {
  Ico, I, Avatar, initialsOf, Sparkline, VectorChip, SevTag, StatusPill, StatTile,
  Sidebar, Topbar, NAV, SEV_LABEL, brl,
});
