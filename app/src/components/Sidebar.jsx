import { Link, useLocation } from 'react-router-dom';
import { I } from '../icons/index.jsx';
import { Avatar } from './shared.jsx';
import { CLIENT, USER, CARDS } from '../data/mockData.js';

export default function Sidebar() {
  const location = useLocation();
  const openCount = CARDS.filter(c => c.state === "open").length;

  const active = location.pathname === '/' || location.pathname === '/visao-geral'
    ? 'visao'
    : location.pathname.includes('board') || location.pathname.includes('alertas')
    ? 'board'
    : location.pathname.includes('result')
    ? 'result'
    : location.pathname.includes('admin')
    ? 'admin'
    : '';

  const items = [
    { key: "visao",  label: "Visão geral", to: "/",          icon: "Dashboard" },
    { key: "board",  label: "Alertas",     to: "/alertas",   icon: "Columns", badge: openCount },
    { key: "result", label: "Resultados",  to: "/resultados", icon: "Results" },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">E</div>
        <div className="brand-name">EcommPilot<sup>®</sup></div>
      </div>

      <Link className="store-switcher" to="/admin">
        <span className="store-avatar">{CLIENT.initials}</span>
        <div className="store-meta">
          <div className="store-name">{CLIENT.name}</div>
          <div className="store-url">{CLIENT.account_ref}</div>
        </div>
        <I.ChevronDown size={14} className="store-chevron" />
      </Link>

      <div className="nav-section-label">Espaço de trabalho</div>
      {items.map((it) => (
        <Link key={it.key} className={"nav-item" + (active === it.key ? " active" : "")} to={it.to}>
          {I[it.icon] && I[it.icon]({ size: 15, className: "icon" })}
          {it.label}
          {it.badge > 0 && <span className="badge">{it.badge}</span>}
        </Link>
      ))}

      <div className="nav-section-label">Configuração</div>
      <Link className={"nav-item" + (active === "admin" ? " active" : "")} to="/admin">
        <I.Settings size={15} className="icon" />
        Admin
        <span className="badge muted">3</span>
      </Link>

      <div className="nav-spacer" />

      <div className="brief-card">
        <div className="brief-pill">✦ Pilot</div>
        <div className="brief-title">Regras detectam, IA humaniza</div>
        <div className="brief-sub">Cada card já vem com hipótese e primeira ação escritas. Sem pedir análise em tempo real.</div>
        <Link className="brief-btn" to="/alertas">Ver o board</Link>
      </div>

      <div className="nav-footer">
        <Avatar initials={USER.initials} size={30} grad="amber-rose" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="user-name">{USER.name}</div>
          <div className="user-role">{USER.role}</div>
        </div>
        <I.More size={14} style={{ color: "var(--ink-4)" }} />
      </div>
    </aside>
  );
}
