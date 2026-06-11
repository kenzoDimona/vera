// Sparkline + chart components and alert card components.

// ── Sparkline ────────────────────────────────────────────────
function Sparkline({ series, width = 80, height = 24, stroke = "currentColor", fill = null, domain = null }) {
  const min = domain ? domain[0] : Math.min(...series);
  const max = domain ? domain[1] : Math.max(...series);
  const range = max - min || 1;
  const stepX = width / (series.length - 1);
  const points = series.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * height;
    return [x, y];
  });
  const d = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const areaD = `${d} L${width},${height} L0,${height} Z`;
  const last = points[points.length - 1];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block", overflow: "visible" }}>
      {fill && <path d={areaD} fill={fill} opacity="0.18" />}
      <path d={d} stroke={stroke} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="2.2" fill={stroke} />
    </svg>
  );
}

// ── Detail chart (bigger, with axis grid) ────────────────────
function DetailChart({ series, domain, severity = "critical", height = 140 }) {
  const width = 480;
  const min = domain ? domain[0] : Math.min(...series);
  const max = domain ? domain[1] : Math.max(...series);
  const range = max - min || 1;
  const stepX = width / (series.length - 1);
  const points = series.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * height;
    return [x, y];
  });
  const d = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const areaD = `${d} L${width},${height} L0,${height} Z`;

  const colorMap = {
    critical: "var(--rose)",
    warning: "var(--amber)",
    good: "var(--teal)",
    info: "var(--sky)",
  };
  const color = colorMap[severity];

  // Detect anomaly point — biggest single-step delta
  let anomalyIdx = -1;
  let maxDelta = 0;
  for (let i = 1; i < series.length; i++) {
    const delta = Math.abs(series[i] - series[i - 1]);
    if (delta > maxDelta) { maxDelta = delta; anomalyIdx = i; }
  }
  const anomalyPt = anomalyIdx >= 0 ? points[anomalyIdx] : null;

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height + 24}`} style={{ display: "block", overflow: "visible" }}>
      {/* Grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
        <line key={i} x1="0" x2={width} y1={t * height} y2={t * height}
              stroke="var(--line)" strokeWidth="1" strokeDasharray={i === 0 || i === 4 ? "" : "2 3"} />
      ))}
      {/* Area + line */}
      <path d={areaD} fill={color} opacity="0.10" />
      <path d={d} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Anomaly marker */}
      {anomalyPt && (
        <>
          <line x1={anomalyPt[0]} x2={anomalyPt[0]} y1="0" y2={height}
                stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
          <circle cx={anomalyPt[0]} cy={anomalyPt[1]} r="5" fill="var(--bg-elev)" stroke={color} strokeWidth="2" />
        </>
      )}
      {/* X labels */}
      <text x="0" y={height + 16} fontSize="10" fill="var(--ink-3)" fontFamily="Geist Mono, monospace">14d ago</text>
      <text x={width / 2} y={height + 16} fontSize="10" fill="var(--ink-3)" fontFamily="Geist Mono, monospace" textAnchor="middle">7d ago</text>
      <text x={width} y={height + 16} fontSize="10" fill="var(--ink-3)" fontFamily="Geist Mono, monospace" textAnchor="end">today</text>
    </svg>
  );
}

// ── Render a narrative string with {label|value} interpolation ──
// up = green, down = red, plain = neutral; "now" implicit by direction inferred from the surrounding context
function Narrative({ text, direction, className = "alert-narrative" }) {
  const parts = [];
  const re = /\{(prev|now)\|([^}]+)\}/g;
  let last = 0;
  let m;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push({ kind: "txt", v: text.slice(last, m.index) });
    parts.push({ kind: "num", role: m[1], v: m[2] });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ kind: "txt", v: text.slice(last) });
  return (
    <p className={className}>
      {parts.map((p, i) => {
        if (p.kind === "txt") return <span key={i}>{p.v}</span>;
        const cls = p.role === "now"
          ? (direction === "down" ? "num down" : direction === "up" ? "num up" : "num")
          : "num";
        return <span key={i} className={cls}>{p.v}</span>;
      })}
    </p>
  );
}

// ── Card chart (medium sparkline with current value) ────────
function CardChart({ alert }) {
  const colorMap = {
    critical: "var(--rose)",
    warning: "var(--amber)",
    good: "var(--teal)",
    info: "var(--sky)",
  };
  const color = colorMap[alert.severity];
  return (
    <div className="alert-chart">
      <div className="chart-label-row">
        <span className="chart-metric">{alert.chartLabel}</span>
        <span className="chart-current">{alert.chartCurrent}</span>
      </div>
      <Sparkline series={alert.series} width={200} height={44} stroke={color} fill={color} domain={alert.chartDomain} />
    </div>
  );
}

// ── Alert Card ──────────────────────────────────────────────
function AlertCard({ alert, onOpen, resolved, showChart }) {
  const sevLabels = { critical: "Critical", warning: "Warning", good: "Opportunity", info: "Insight" };
  const directionFromSev = { critical: "down", warning: "down", good: "up", info: "neutral" };
  const glyphMap = {
    critical: <I.Lightning size={16} sw={2.2} />,
    warning:  <I.TrendDown size={15} sw={2} />,
    good:     <I.TrendUp size={15} sw={2} />,
    info:     <I.Sparkle size={15} sw={2} />,
  };
  return (
    <article className={"alert" + (resolved ? " resolved" : "")} data-severity={alert.severity}
             onClick={onOpen} role="button" tabIndex="0">
      <div className="alert-glyph">{glyphMap[alert.severity]}</div>
      <div className="alert-body">
        <div className="alert-meta">
          <span className="sev-tag">{sevLabels[alert.severity]}</span>
          <span className="alert-source">{alert.source}</span>
          <span className="alert-dot" />
          <span className="alert-time">{alert.timeAgo}</span>
        </div>
        <h3 className="alert-headline">{alert.headline}</h3>
        <Narrative text={alert.narrative} direction={directionFromSev[alert.severity]} />
        <div className="alert-cta-row">
          <button className="alert-cta primary" onClick={(e) => { e.stopPropagation(); onOpen(); }}>
            View details <I.ArrowRight size={12} />
          </button>
          {alert.actions[0] && (
            <button className="alert-cta" onClick={(e) => e.stopPropagation()}>
              {alert.actions[0].cta}
            </button>
          )}
        </div>
      </div>
      {showChart && <CardChart alert={alert} />}
    </article>
  );
}

// ── Metric tile with sparkline ───────────────────────────────
function MetricTile({ metric, showSpark }) {
  const isUp = metric.direction === "up";
  const iconColorMap = {
    revenue: "violet",
    sessions: "sky",
    conv: "teal",
    aov: "amber",
    cac: "pink",
  };
  const iconMap = {
    revenue: <I.Coin size={14} sw={2} />,
    sessions: <I.Users size={14} sw={2} />,
    conv: <I.Target size={14} sw={2} />,
    aov: <I.Cart size={14} sw={2} />,
    cac: <I.Megaphone size={14} sw={2} />,
  };
  return (
    <div className="metric-card">
      <div className="metric-head">
        <div className={"metric-icon " + iconColorMap[metric.key]}>{iconMap[metric.key]}</div>
        <div className="metric-label">{metric.label}</div>
      </div>
      <div className="metric-value">{metric.value}</div>
      <div className="metric-foot">
        <div className={"metric-delta " + (isUp ? "up" : "down")}>
          {isUp ? <I.ArrowUp size={11} sw={2.4} /> : <I.ArrowDown size={11} sw={2.4} />}
          {metric.deltaText}
        </div>
        {showSpark && (
          <Sparkline series={metric.series} width={70} height={26}
                     stroke={isUp ? "var(--teal)" : "var(--rose)"}
                     fill={isUp ? "var(--teal)" : "var(--rose)"} />
        )}
      </div>
    </div>
  );
}

Object.assign(window, { Sparkline, DetailChart, Narrative, CardChart, AlertCard, MetricTile });
