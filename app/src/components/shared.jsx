import { I } from '../icons/index.jsx';
import { VECTORS, SEV_LABEL } from '../data/mockData.js';

export const SEV_COLOR = {
  critico: "var(--sev-critico)", alto: "var(--sev-alto)",
  medio: "var(--sev-medio)", oportunidade: "var(--sev-oportunidade)",
};
export const SEV_GLYPH = {
  critico: (p) => <I.Lightning {...p} />,
  alto: (p) => <I.TrendDown {...p} />,
  medio: (p) => <I.TrendDown {...p} />,
  oportunidade: (p) => <I.TrendUp {...p} />,
};

export function SevTag({ sev, glyph = false, size = 12 }) {
  const G = SEV_GLYPH[sev];
  return (
    <span className="sev-tag" data-sev={sev}>
      {glyph && <G size={size - 1} sw={2.1} />}
      {SEV_LABEL[sev]}
    </span>
  );
}

export function PlatformGlyph({ icon, size = 30, r = 9 }) {
  const Comp = I[icon] || I.Analytics;
  const tint = { Meta: "sky", Google: "amber", Analytics: "violet", Mail: "amber", Search: "sky", SocialV: "pink", Link: "teal" }[icon] || "violet";
  return (
    <span className={"plat-glyph plat-" + tint} style={{ width: size, height: size, borderRadius: r }}>
      <Comp size={Math.round(size * 0.5)} sw={1.9} />
    </span>
  );
}

export function Avatar({ initials, size = 26, grad = "amber-rose" }) {
  const grads = {
    "amber-rose": "linear-gradient(135deg, var(--amber), var(--rose))",
    "teal-sky": "linear-gradient(135deg, var(--teal), var(--sky))",
    "violet-pink": "linear-gradient(135deg, var(--violet), var(--pink))",
    "indigo-violet": "linear-gradient(135deg, var(--indigo), var(--violet))",
  };
  return (
    <span className="avatar" style={{ width: size, height: size, fontSize: Math.round(size * 0.4), background: grads[grad] }}>
      {initials}
    </span>
  );
}

export function Sparkline({ series, width = 120, height = 32, stroke = "currentColor", fill = null, domain = null, sw = 1.6 }) {
  const min = domain ? domain[0] : Math.min(...series);
  const max = domain ? domain[1] : Math.max(...series);
  const range = max - min || 1;
  const stepX = width / (series.length - 1);
  const pts = series.map((v, i) => [i * stepX, height - ((v - min) / range) * height]);
  const d = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const last = pts[pts.length - 1];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block", overflow: "visible" }}>
      {fill && <path d={`${d} L${width},${height} L0,${height} Z`} fill={fill} opacity="0.16" />}
      <path d={d} stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="2.4" fill={stroke} />
    </svg>
  );
}

export function Narrative({ text, dir, className = "narrative" }) {
  const parts = [];
  const re = /\{(prev|now)\|([^}]+)\}/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push({ k: "t", v: text.slice(last, m.index) });
    parts.push({ k: "n", role: m[1], v: m[2] });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ k: "t", v: text.slice(last) });
  return (
    <p className={className}>
      {parts.map((p, idx) => {
        if (p.k === "t") return <span key={idx}>{p.v}</span>;
        const cls = p.role === "now"
          ? (dir === "down" ? "num down" : dir === "up" ? "num up" : "num")
          : "num";
        return <span key={idx} className={cls}>{p.v}</span>;
      })}
    </p>
  );
}

export function VectorChip({ vector, size = "sm" }) {
  const v = VECTORS[vector];
  if (!v) return null;
  const Icon = I[v.icon] || I.Analytics;
  return (
    <span className={"vec-chip vec-" + v.tint + (size === "lg" ? " lg" : "")}>
      <Icon size={size === "lg" ? 13 : 11} sw={1.9} />{v.label}
    </span>
  );
}
