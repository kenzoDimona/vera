import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { I } from '../../icons/index.jsx';
import { Avatar, Sparkline, SevTag, VectorChip, PlatformGlyph, SEV_GLYPH } from '../../components/shared.jsx';
import { TweaksPanel, TweakSection, TweakToggle, TweakRadio, useTweaks } from '../../components/TweaksPanel/index.jsx';
import MobileHeader from '../../components/MobileHeader.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import Tour from './Tour.jsx';
import { CLIENT, METRICS, REVENUE_DAYS, CONNECTIONS, CARDS, ASSERTIVIDADE } from '../../data/mockData.js';
import '../../styles/dashboard.css';

const TWEAK_DEFAULTS = { theme: "light", density: "regular", periodo: "7 dias", metaLine: true };

export default function VisaoGeral() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    document.documentElement.dataset.theme = t.theme;
    document.documentElement.dataset.density = t.density;
  }, [t.theme, t.density]);

  const openCards = useMemo(() => CARDS.filter(c => c.state === "open"), []);
  const recent = openCards.slice(0, 3);

  const [tourOn, setTourOn] = useState(false);
  useEffect(() => {
    const seen = localStorage.getItem("ecp_tour_seen");
    if (!seen) { const id = setTimeout(() => setTourOn(true), 650); return () => clearTimeout(id); }
  }, []);
  const closeTour = () => { setTourOn(false); localStorage.setItem("ecp_tour_seen", "1"); };

  return (
    <div className="app">
      <MobileHeader title="Visão geral" />
      <Sidebar />

      <main className="main">
        <div className="topbar">
          <div className="topbar-left">
            <Avatar initials={CLIENT.initials} size={40} grad="teal-sky" />
            <div>
              <h1>{CLIENT.name}</h1>
              <div className="topbar-sub">{CLIENT.account_ref} · visão geral dos últimos {t.periodo}</div>
            </div>
          </div>
          <div className="topbar-actions">
            <div className="seg-pill">
              {["Hoje", "7 dias", "30 dias"].map(r => (
                <button key={r} className={t.periodo === r ? "active" : ""} onClick={() => setTweak("periodo", r)}>{r}</button>
              ))}
            </div>
            <span className="live-text"><span className="live-dot" /> ao vivo</span>
            <button className="tour-cta" onClick={() => setTourOn(true)}><span className="tour-pulse" /> Tour</button>
            <button className="btn-primary-pill" data-tour="pilot"><I.Sparkle size={13} sw={2.2} /> Perguntar ao Pilot</button>
          </div>
        </div>

        <div className="metrics" data-tour="metrics">
          {METRICS.map(m => <MetricCard key={m.key} m={m} />)}
        </div>

        <div className="grid-2">
          <RevenueBlock />
          <ConnectionsBlock />
        </div>

        <AssertivenessBlock showMeta={t.metaLine} />

        <div data-tour="alertas">
          <RecentAlerts recent={recent} total={openCards.length} />
        </div>
      </main>

      {tourOn && <Tour onClose={closeTour} />}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Aparência" />
        <TweakRadio label="Tema" value={t.theme} options={["light", "dark"]} onChange={(v) => setTweak("theme", v)} />
        <TweakRadio label="Densidade" value={t.density} options={["compact", "regular", "comfy"]} onChange={(v) => setTweak("density", v)} />
        <TweakSection label="Período" />
        <TweakRadio label="Janela" value={t.periodo} options={["Hoje", "7 dias", "30 dias"]} onChange={(v) => setTweak("periodo", v)} />
        <TweakSection label="Assertividade" />
        <TweakToggle label="Linha de meta" value={t.metaLine} onChange={(v) => setTweak("metaLine", v)} />
      </TweaksPanel>
    </div>
  );
}

function MetricCard({ m }) {
  const tint = { receita: "", pedidos: "teal", roas: "amber", cpa: "rose" }[m.key];
  const Icon = I[m.icon];
  return (
    <div className="metric-card">
      <div className="metric-head">
        <div className={"metric-icon " + tint}><Icon size={14} sw={2} /></div>
        <div className="metric-label">{m.label}</div>
      </div>
      <div className="metric-value">{m.value}</div>
      <div className="metric-foot">
        <div className={"metric-delta " + (m.good ? "up" : "down")}>
          <I.ArrowUp size={11} sw={2.4} />{m.deltaText}
        </div>
        <Sparkline series={m.series} width={64} height={26}
                   stroke={m.good ? "var(--teal)" : "var(--rose)"}
                   fill={m.good ? "var(--teal)" : "var(--rose)"} />
      </div>
    </div>
  );
}

function RevenueBlock() {
  const max = Math.max(...REVENUE_DAYS.map(d => d.v));
  const peakIdx = REVENUE_DAYS.findIndex(d => d.v === max);
  const total = REVENUE_DAYS.reduce((s, d) => s + d.v, 0);
  const fmt = (v) => "R$ " + (v / 1000).toFixed(1).replace(".", ",") + " mil";
  return (
    <section className="block">
      <div className="block-head">
        <div className="block-title">Receita por dia <span className="sub">total {fmt(total)}</span></div>
        <span className="meta-chip">últimos 7 dias</span>
      </div>
      <div className="bars">
        {REVENUE_DAYS.map((d, i) => (
          <div key={d.d} className={"bar-col" + (i === peakIdx ? " peak" : "")}>
            <div className="bar-val">{fmt(d.v)}</div>
            <div className="bar" style={{ height: `${(d.v / max) * 100}%` }} />
            <div className="bar-day">{d.d}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ConnectionsBlock() {
  const statusMap = {
    conectado: { cls: "ok",   label: "conectado" },
    atraso:    { cls: "warn", label: "atraso na sincronização" },
    erro:      { cls: "err",  label: "erro de conexão" },
  };
  return (
    <section className="block" data-tour="conexoes">
      <div className="block-head">
        <div className="block-title">Conexões <span className="sub">7 vetores de crescimento</span></div>
        <Link className="link-btn" to="/admin">Gerenciar <I.ArrowRight size={12} /></Link>
      </div>
      <div>
        {CONNECTIONS.map(cx => {
          const s = statusMap[cx.status] || statusMap.conectado;
          return (
            <div key={cx.id} className="cx-row">
              <PlatformGlyph icon={cx.icon} size={34} r={10} />
              <div className="cx-meta">
                <div className="cx-name">{cx.platform}</div>
                <div className="cx-sync">{cx.vector && <VectorChip vector={cx.vector} />} <span className="cx-sync-t">sincronizado {cx.last_sync}</span></div>
              </div>
              <span className={"status-badge " + s.cls}><span className="status-dot" />{s.label}</span>
            </div>
          );
        })}
      </div>
      <div className="cx-note">
        <I.Eye size={13} /> Apenas leitura — o status é gerenciado no Admin.
      </div>
    </section>
  );
}

function AssertivenessBlock({ showMeta }) {
  const A = ASSERTIVIDADE;
  const serie = A.serie, n = serie.length;
  const W = 600, H = 230, padL = 8, padR = 36, padT = 18, padB = 26;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const yMin = 50, yMax = 95;
  const xFor = (i) => padL + (i / (n - 1)) * plotW;
  const yFor = (v) => padT + (1 - (v - yMin) / (yMax - yMin)) * plotH;
  const baseY = padT + plotH;
  const pts = serie.map((d, i) => ({ ...d, x: xFor(i), y: yFor(d.v) }));
  const line = pts.map((p, i) => (i ? "L" : "M") + p.x.toFixed(1) + " " + p.y.toFixed(1)).join(" ");
  const area = `M ${pts[0].x.toFixed(1)} ${baseY} ` + pts.map(p => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ") + ` L ${pts[n - 1].x.toFixed(1)} ${baseY} Z`;
  const gridVals = [60, 70, 80, 90];
  const last = pts[n - 1];

  return (
    <section className="block" data-tour="assertividade">
      <div className="block-head">
        <div className="block-title">Assertividade do Pilot <span className="sub">aprende a cada resultado apurado</span></div>
        <span className="meta-chip">{A.apurados} hipóteses apuradas</span>
      </div>

      <div className="assert-grid">
        <div className="assert-left">
          <div className="assert-kpi-row">
            <div className="assert-kpi">{A.atual}<span className="pct">%</span></div>
            <span className="assert-delta"><I.ArrowUp size={11} sw={2.6} />{A.deltaPts} pts vs. mês anterior</span>
          </div>
          <div className="assert-cap">Das hipóteses aplicadas, % que se confirmou efetiva após a ação.</div>

          <svg className="assert-chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img"
               aria-label="Assertividade média por mês, em tendência de alta">
            <defs>
              <linearGradient id="assertGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--violet)" stopOpacity="0.18" />
                <stop offset="100%" stopColor="var(--violet)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {gridVals.map(g => (
              <line key={g} className="grid-ln" x1={padL} x2={padL + plotW} y1={yFor(g)} y2={yFor(g)} />
            ))}
            {showMeta && (
              <g>
                <line className="meta-ln" x1={padL} x2={padL + plotW} y1={yFor(A.meta)} y2={yFor(A.meta)} />
                <text className="meta-tag" x={padL + plotW + 4} y={yFor(A.meta) + 3.5}>meta {A.meta}%</text>
              </g>
            )}
            <path className="area-fill" d={area} />
            <path className="line-pth" d={line} />
            {pts.map((p, i) => (
              i === n - 1
                ? <circle key={i} className="dot-last" cx={p.x} cy={p.y} r={4.5} />
                : <circle key={i} className="dot" cx={p.x} cy={p.y} r={3} />
            ))}
            <text className="val-tag" x={last.x + 6} y={last.y - 7}>{last.v}%</text>
            {pts.map((p, i) => (
              <text key={i} className="axis-lbl" x={p.x} y={H - 7} textAnchor="middle">{p.m}</text>
            ))}
          </svg>

          <div className="assert-legend">
            <span className="li"><span className="sw line" /> assertividade média/mês</span>
            {showMeta && <span className="li"><span className="sw meta" /> meta de calibração</span>}
          </div>
        </div>

        <div className="calib">
          <div className="calib-h">Calibração por confiança</div>
          <div className="calib-sub">Quando o card declara um nível, quanto de fato se confirmou efetivo pós-aplicação.</div>
          {A.calib.map(c => (
            <div className="calib-row" key={c.tier}>
              <div className="calib-top">
                <span className="calib-tier"><span className={"conf-dot " + c.cls} />{c.tier} confiança</span>
                <span className="calib-n">n={c.n}</span>
              </div>
              <div className="calib-track">
                <div className={"calib-fill " + c.cls} style={{ width: c.real + "%" }} />
                <div className="calib-mark" style={{ left: c.declarado + "%" }} title={"declarado " + c.declarado + "%"} />
              </div>
              <div className="calib-legend-row">
                <span className="calib-real">acerta {c.real}%</span>
                <span className="calib-claim">declara {c.declarado}%</span>
              </div>
            </div>
          ))}
          <div className="calib-foot">
            A cada hipótese resolvida, o Pilot reajusta os gatilhos — <b>a barra se aproxima do marcador</b>, e a média sobe ao longo do tempo.
          </div>
        </div>
      </div>
    </section>
  );
}

function RecentAlerts({ recent, total }) {
  const GLYPH = { critico: I.Lightning, alto: I.TrendDown, medio: I.TrendDown, oportunidade: I.TrendUp };
  return (
    <section className="block">
      <div className="block-head">
        <div className="block-title">Alertas recentes <span className="sub">{total} em aberto</span></div>
        <Link className="btn-pill dark" to="/alertas">
          Ver o board <I.ArrowRight size={13} />
        </Link>
      </div>
      <div>
        {recent.map(c => {
          const G = GLYPH[c.severity];
          return (
            <Link key={c.id} className="recent-row" to={`/alertas?card=${c.id}`}>
              <span className="recent-glyph" data-sev={c.severity}>
                <G size={16} sw={2.1} />
              </span>
              <div className="recent-body">
                <div className="recent-head">{c.headline}</div>
                <div className="recent-meta">
                  <SevTag sev={c.severity} />
                  <span className="meta-chip">{c.trigger_id}</span>
                  {c.vector && <VectorChip vector={c.vector} />}
                  <span className="meta-src">{c.platform}</span>
                </div>
              </div>
              <span className="recent-time">{c.timeAgo}</span>
              <I.ChevronRight size={16} style={{ color: "var(--ink-4)" }} />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
