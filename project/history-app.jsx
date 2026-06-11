// EcommPilot History page

const { useState, useEffect, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "groupBy": "day"
}/*EDITMODE-END*/;

// Build a richer history dataset by augmenting ALERTS with outcome metadata.
// We synthesize past events spanning the last ~30 days.
const TEAM = [
  { id: "ms", name: "Mara Souza",   initials: "MS", color: "linear-gradient(135deg, #F59E0B, #F43F5E)" },
  { id: "jc", name: "Júlio Castro", initials: "JC", color: "linear-gradient(135deg, #14B8A6, #38BDF8)" },
  { id: "rl", name: "Rafa Lima",    initials: "RL", color: "linear-gradient(135deg, #6D5BFF, #FF6B9B)" },
  { id: "auto", name: "EcommPilot",  initials: "AI", color: "linear-gradient(135deg, #6D5BFF, #4458F5)" },
];

// Week / day labels for synthetic dates (last 30 days)
function makeHistory() {
  // Pull alert templates and replay them across past days
  const templates = ALERTS;
  const today = new Date(2026, 3, 27); // April 27, 2026
  const items = [];

  const recipes = [
    // dayOffset, alertIndex, outcome, who, ttrMin, action
    [0, 0, "resolved", "ms", 14, "Rolled back Apple Pay deploy. Conv. recovered to 3.0% within an hour."],
    [0, 1, "acted", "jc", 38, "Raised daily budget on Vitamin C campaign from $2k → $5k."],
    [0, 5, "ignored", "ms", 4, "Already aware — no action needed yet."],
    [1, 2, "resolved", "jc", 92, "Filed brand-bidding complaint with Google. Brand bid raised 15%."],
    [1, 3, "snoozed", "rl", 2, "Snoozed for 7 days while we monitor SERP changes."],
    [1, 4, "resolved", "ms", 22, "Promoted Glow Set to homepage hero. Bundle attach +6pp Day 1."],
    [2, 6, "resolved", "auto", 0, "Auto-closed: trend confirmed, archived to insights."],
    [3, 0, "resolved", "rl", 41, "Reverted experimental checkout copy. Conversion stabilized."],
    [4, 2, "ignored", "ms", 3, "False positive — competitor activity was a 1-day spike."],
    [5, 5, "resolved", "jc", 18, "Acknowledged. Email channel split surfaced in weekly report."],
    [6, 4, "resolved", "rl", 64, "Built bundle-and-save email flow in Klaviyo. +$3.40 LTV/recipient projected."],
    [7, 1, "resolved", "ms", 27, "Duplicated UGC creative to TikTok. ROAS 3.8× on TikTok in 48h."],
    [9, 3, "resolved", "jc", 55, "Added Product schema. Inclusion in Google Shop module pending."],
    [10, 0, "auto-closed", "auto", 720, "Auto-closed after 12h: metric returned to baseline without intervention."],
    [12, 2, "resolved", "ms", 30, "Submitted brand complaint. Brand bid increased temporarily."],
    [14, 5, "resolved", "rl", 12, "Logged. Used in Q1 channel mix review."],
    [16, 1, "resolved", "ms", 45, "Restocked SKU LUM-VITC-30 ahead of breakout."],
    [18, 4, "ignored", "jc", 1, "Bundle attach was a one-day promo spike — expected."],
    [21, 0, "resolved", "rl", 19, "Hot-fix on payment SDK. Caught in pre-deploy QA next time."],
    [25, 6, "resolved", "auto", 0, "Auto-closed: structural mobile-share trend, no action required."],
    [28, 3, "resolved", "ms", 88, "Pitched 4 publications. 1 placement secured (Allure)."],
  ];

  recipes.forEach(([dayOff, idx, outcome, who, ttrMin, action], i) => {
    const t = templates[idx];
    const date = new Date(today); date.setDate(today.getDate() - dayOff);
    const hour = ((i * 7) % 11) + 7;  // varied hour 7am–6pm
    const min  = ((i * 17) % 60);
    items.push({
      id: `h${i}`,
      date,
      time: `${String(hour).padStart(2,"0")}:${String(min).padStart(2,"0")}`,
      severity: t.severity,
      source: t.source,
      metric: t.metric,
      headline: t.headline,
      outcome, who, ttrMin, action,
    });
  });
  return items.sort((a, b) => b.date - a.date || b.time.localeCompare(a.time));
}

const HISTORY = makeHistory();

// Generate a 90-day activity heatmap — alerts handled per day
function makeHeatmap() {
  const today = new Date(2026, 3, 27);
  const cells = [];
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today); d.setDate(today.getDate() - i);
    // pseudo-deterministic count — varied
    const seed = (d.getDate() * 7 + d.getMonth() * 13) % 11;
    const count = seed > 8 ? 0 : seed > 6 ? 1 : seed > 3 ? 2 : seed > 1 ? 3 : 4;
    const level = count === 0 ? 0 : count <= 1 ? 1 : count <= 2 ? 2 : count <= 3 ? 3 : 4;
    cells.push({ date: d, count, level, dow: d.getDay() });
  }
  return cells;
}

const HEATMAP = makeHeatmap();

const personById = (id) => TEAM.find(p => p.id === id) || TEAM[0];

const fmtTTR = (mins) => {
  if (mins === 0) return "auto";
  if (mins < 60) return `${mins}m`;
  if (mins < 60 * 24) return `${Math.round(mins / 60 * 10) / 10}h`;
  return `${Math.round(mins / 60 / 24)}d`;
};

const dayLabel = (d) => {
  const today = new Date(2026, 3, 27);
  const diff = Math.round((today - d) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff}d ago`;
  return d.toLocaleDateString("en-US", { weekday: "short" });
};

const monthDay = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();

function HistoryApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [outcomeFilter, setOutcomeFilter] = useState(null);
  const [severityFilter, setSeverityFilter] = useState(null);
  const [whoFilter, setWhoFilter] = useState(null);
  const [search, setSearch] = useState("");
  const [range, setRange] = useState("30d");

  useEffect(() => {
    document.documentElement.dataset.theme = t.theme;
  }, [t.theme]);

  const filtered = useMemo(() => {
    let list = HISTORY;
    if (outcomeFilter) list = list.filter(h => h.outcome === outcomeFilter);
    if (severityFilter) list = list.filter(h => h.severity === severityFilter);
    if (whoFilter) list = list.filter(h => h.who === whoFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(h => h.headline.toLowerCase().includes(q) || h.action.toLowerCase().includes(q));
    }
    return list;
  }, [outcomeFilter, severityFilter, whoFilter, search]);

  // group by day
  const groups = useMemo(() => {
    const m = new Map();
    filtered.forEach(h => {
      const key = h.date.toISOString().slice(0, 10);
      if (!m.has(key)) m.set(key, { date: h.date, events: [] });
      m.get(key).events.push(h);
    });
    return Array.from(m.values());
  }, [filtered]);

  const counts = useMemo(() => ({
    handled:    HISTORY.filter(h => h.outcome === "resolved" || h.outcome === "acted").length,
    resolved:   HISTORY.filter(h => h.outcome === "resolved").length,
    ignored:    HISTORY.filter(h => h.outcome === "ignored").length,
    snoozed:    HISTORY.filter(h => h.outcome === "snoozed").length,
    autoClosed: HISTORY.filter(h => h.outcome === "auto-closed").length,
    total:      HISTORY.length,
  }), []);

  const avgTTR = useMemo(() => {
    const list = HISTORY.filter(h => h.who !== "auto" && h.ttrMin > 0);
    return Math.round(list.reduce((s, h) => s + h.ttrMin, 0) / list.length);
  }, []);

  const resolutionRate = Math.round((counts.handled / counts.total) * 100);

  // Sidebar nav reuse — minimal version
  return (
    <div className="app">
      <MobileHeader title="History" />
      <Sidebar openCount={3} />

      <main className="main">
        {/* Topbar */}
        <div className="topbar">
          <div>
            <h1>History</h1>
            <div className="topbar-sub">
              {counts.total} alerts in the last 30 days · {counts.handled} handled · avg time-to-resolve {fmtTTR(avgTTR)}
            </div>
          </div>
          <div className="topbar-actions">
            <button className="btn-pill"><I.Download size={13} /> Export CSV</button>
            <button className="icon-btn" aria-label="Notifications"><I.Bell size={15} /><span className="ping" /></button>
            <button className="btn-primary-pill"><I.Sparkle size={13} sw={2.2} /> Ask Pilot</button>
          </div>
        </div>

        {/* Stat strip */}
        <div className="stats-row">
          <StatCard glyph="opp"  icon={<I.Check size={15} sw={2.4} />} num={counts.resolved} label="Resolved" trend="up" trendText={`${resolutionRate}% rate`} />
          <StatCard glyph="info" icon={<I.Clock size={15} />} num={fmtTTR(avgTTR)} label="Avg time-to-resolve" trend="up" trendText="−14% vs prior 30d" />
          <StatCard glyph="warn" icon={<I.EyeOff size={15} />} num={counts.ignored} label="Ignored" trend="flat" trendText={`${Math.round(counts.ignored/counts.total*100)}%`} />
          <StatCard glyph="crit" icon={<I.Sparkle size={15} sw={2} />} num={counts.autoClosed} label="Auto-closed" trend="flat" trendText="No action needed" />
        </div>

        {/* Activity heatmap */}
        <div className="panel-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h3>Activity · last 90 days</h3>
              <p className="muted-sub">Alerts triggered per day. Darker = more alerts.</p>
            </div>
            <div className="heat-legend">
              <span>Less</span>
              <span className="lc" />
              <span className="lc" style={{ background: "color-mix(in oklab, var(--violet) 20%, var(--card))", borderColor: "transparent" }} />
              <span className="lc" style={{ background: "color-mix(in oklab, var(--violet) 40%, var(--card))", borderColor: "transparent" }} />
              <span className="lc" style={{ background: "color-mix(in oklab, var(--violet) 65%, var(--card))", borderColor: "transparent" }} />
              <span className="lc" style={{ background: "var(--violet)", borderColor: "transparent" }} />
              <span>More</span>
            </div>
          </div>

          <div className="heat-months"><span>Feb</span><span>Mar</span><span>Apr</span></div>
          <div className="heat">
            <div className="heat-days">
              <span>Mon</span><span /><span>Wed</span><span /><span>Fri</span><span /><span /></div>
            <div className="heat-cells">
              {HEATMAP.map((c, i) => (
                <div key={i}
                     className="heat-cell"
                     data-level={c.level}
                     style={{ gridRow: c.dow + 1 }}
                     title={`${c.date.toLocaleDateString()} — ${c.count} alert${c.count === 1 ? "" : "s"}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="toolbar-card">
          <div className="toolbar-row">
            <div className="search-input">
              <I.Search size={14} style={{ color: "var(--ink-4)" }} />
              <input type="text" placeholder="Search past alerts and actions…" value={search} onChange={(e) => setSearch(e.target.value)} />
              <span className="kbd">⌘K</span>
            </div>
            <div className="seg" style={{ display: "inline-flex", background: "var(--card-muted)", border: "1px solid var(--line)", borderRadius: 999, padding: 3 }}>
              {["7d", "30d", "90d", "All"].map(r => (
                <button key={r} onClick={() => setRange(r)}
                        style={{
                          appearance: "none", border: 0,
                          padding: "5px 12px", borderRadius: 999,
                          fontFamily: "inherit", fontSize: 12, fontWeight: 600,
                          cursor: "pointer",
                          background: range === r ? "var(--card)" : "transparent",
                          color: range === r ? "var(--ink)" : "var(--ink-3)",
                          boxShadow: range === r ? "0 1px 3px rgba(15,17,22,0.08)" : "none",
                        }}>{r}</button>
              ))}
            </div>
          </div>

          <div className="toolbar-row">
            <span style={{ fontSize: 11.5, color: "var(--ink-3)", fontWeight: 500, marginRight: 4 }}>OUTCOME</span>
            {[
              { k: "resolved", label: "Resolved", count: counts.resolved },
              { k: "acted", label: "Acted on", count: HISTORY.filter(h => h.outcome === "acted").length },
              { k: "ignored", label: "Ignored", count: counts.ignored },
              { k: "snoozed", label: "Snoozed", count: counts.snoozed },
              { k: "auto-closed", label: "Auto-closed", count: counts.autoClosed },
            ].map(o => (
              <button key={o.k}
                      className={"chip" + (outcomeFilter === o.k ? " active" : "")}
                      onClick={() => setOutcomeFilter(p => p === o.k ? null : o.k)}>
                {o.label} <span style={{ opacity: 0.6 }}>{o.count}</span>
                {outcomeFilter === o.k && <I.Close size={10} className="x" />}
              </button>
            ))}
            <span style={{ width: 1, height: 18, background: "var(--line)", margin: "0 4px" }} />
            <span style={{ fontSize: 11.5, color: "var(--ink-3)", fontWeight: 500, marginRight: 4 }}>WHO</span>
            {TEAM.map(p => (
              <button key={p.id}
                      className={"chip" + (whoFilter === p.id ? " active" : "")}
                      onClick={() => setWhoFilter(prev => prev === p.id ? null : p.id)}
                      style={{ paddingLeft: 4 }}>
                <span style={{ width: 16, height: 16, borderRadius: "50%", background: p.color, color: "white", fontSize: 8, fontWeight: 700, display: "grid", placeItems: "center" }}>{p.initials}</span>
                {p.name.split(" ")[0]}
                {whoFilter === p.id && <I.Close size={10} className="x" />}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline + insights */}
        <div className="history-grid">
          <section className="timeline-card">
            {groups.length === 0 ? (
              <div className="empty-history">
                <div className="em-icon"><I.Search size={22} /></div>
                <div className="em-title" style={{ fontSize: 15, color: "var(--ink)", fontWeight: 600, marginBottom: 4 }}>No matches</div>
                <div className="em-sub" style={{ fontSize: 13 }}>Try clearing filters to see more history.</div>
              </div>
            ) : groups.map(g => (
              <div key={g.date.toISOString()} className="timeline-day">
                <div className="timeline-date">
                  <div className="day-num">{g.date.getDate()}</div>
                  <div className="day-label">{monthDay(g.date)} · {dayLabel(g.date)}</div>
                  <div className="day-count">
                    <strong>{g.events.length}</strong> alert{g.events.length === 1 ? "" : "s"}
                  </div>
                </div>
                <div className="timeline-events">
                  {g.events.map((ev, i) => {
                    const person = personById(ev.who);
                    const isOnly = g.events.length === 1;
                    return (
                      <div key={ev.id} className={"event" + (isOnly ? " event-only" : "")} data-severity={ev.severity}>
                        <div className="event-dot" />
                        <div className="event-body">
                          <div className="event-meta">
                            <span className="time">{ev.time}</span>
                            <span className="dot-sep" />
                            <span className="src">{ev.source}</span>
                            <span className="dot-sep" />
                            <span>{ev.metric}</span>
                            <span className="dot-sep" />
                            <span className={"outcome-pill " + ev.outcome}>
                              {ev.outcome === "resolved" && <I.Check size={10} sw={2.4} />}
                              {ev.outcome === "ignored" && <I.EyeOff size={10} />}
                              {ev.outcome === "snoozed" && <I.Clock size={10} />}
                              {ev.outcome === "auto-closed" && <I.Sparkle size={10} sw={2} />}
                              {ev.outcome === "acted" && <I.Lightning size={10} sw={2.2} />}
                              {ev.outcome.replace("-", " ")}
                            </span>
                          </div>
                          <div className="event-headline">{ev.headline}</div>
                          <div className="event-action">
                            <span className="who-avatar" style={{ background: person.color }}>{person.initials}</span>
                            <span><span className="who-name">{person.name}</span> · {ev.action}</span>
                          </div>
                        </div>
                        <div className="event-side">
                          <span className={"ttr-pill" + (ev.ttrMin > 0 && ev.ttrMin < 30 ? " fast" : "")}>
                            <I.Clock size={9} /> {fmtTTR(ev.ttrMin)}
                          </span>
                          <button className="alert-cta" style={{ padding: "4px 10px", fontSize: 11 }}>
                            View <I.ArrowRight size={10} sw={2} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>

          {/* Insight column */}
          <aside>
            <div className="insight-card feature">
              <h3>Resolution win-rate</h3>
              <p className="muted-sub">When your team acted on Pilot's recommendation</p>
              <div className="insight-stat">76%</div>
              <div className="insight-foot">
                Of opportunities you acted on this month, <strong>76%</strong> lifted the targeted metric within 7 days. Critical alerts resolved in under 1 hour had a <strong>3.2× higher</strong> recovery rate.
              </div>
            </div>

            <div className="insight-card">
              <h3>By outcome</h3>
              <p className="muted-sub">Last 30 days</p>
              <div className="breakdown">
                <BreakRow label="Resolved" pct={Math.round(counts.resolved/counts.total*100)} num={counts.resolved} color="var(--teal)" />
                <BreakRow label="Acted on" pct={Math.round(HISTORY.filter(h=>h.outcome==="acted").length/counts.total*100)} num={HISTORY.filter(h=>h.outcome==="acted").length} color="var(--violet)" />
                <BreakRow label="Auto-closed" pct={Math.round(counts.autoClosed/counts.total*100)} num={counts.autoClosed} color="var(--sky)" />
                <BreakRow label="Snoozed" pct={Math.round(counts.snoozed/counts.total*100)} num={counts.snoozed} color="var(--amber)" />
                <BreakRow label="Ignored" pct={Math.round(counts.ignored/counts.total*100)} num={counts.ignored} color="var(--ink-4)" />
              </div>
            </div>

            <div className="insight-card">
              <h3>Most common source</h3>
              <p className="muted-sub">Where alerts originated</p>
              <div className="breakdown">
                {(() => {
                  const bySrc = {};
                  HISTORY.forEach(h => {
                    const src = h.source.split(" · ")[0];
                    bySrc[src] = (bySrc[src] || 0) + 1;
                  });
                  const sorted = Object.entries(bySrc).sort((a, b) => b[1] - a[1]);
                  const palette = ["var(--violet)", "var(--teal)", "var(--amber)", "var(--sky)", "var(--rose)"];
                  return sorted.map(([s, n], i) => (
                    <BreakRow key={s} label={s} pct={Math.round(n/counts.total*100)} num={n} color={palette[i % palette.length]} />
                  ));
                })()}
              </div>
            </div>

            <div className="insight-card">
              <h3>Fastest responses</h3>
              <p className="muted-sub">Quickest critical-alert handlers</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 6 }}>
                {TEAM.filter(p => p.id !== "auto").map((p, i) => {
                  const personEvents = HISTORY.filter(h => h.who === p.id && h.ttrMin > 0);
                  if (!personEvents.length) return null;
                  const avg = Math.round(personEvents.reduce((s, h) => s + h.ttrMin, 0) / personEvents.length);
                  return (
                    <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span className="who-avatar" style={{ background: p.color, width: 26, height: 26, fontSize: 10 }}>{p.initials}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 600 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{personEvents.length} resolved</div>
                      </div>
                      <span className="ttr-pill fast"><I.Clock size={9} /> {fmtTTR(avg)} avg</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Appearance" />
        <TweakRadio label="Theme" value={t.theme} options={["light", "dark"]}
                    onChange={(v) => setTweak("theme", v)} />
        <TweakRadio label="Group by" value={t.groupBy} options={["day", "week"]}
                    onChange={(v) => setTweak("groupBy", v)} />
      </TweaksPanel>
    </div>
  );
}

function BreakRow({ label, pct, num, color }) {
  return (
    <div className="breakdown-row">
      <div className="breakdown-label">{label}</div>
      <div className="breakdown-bar">
        <div className="breakdown-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="breakdown-num">{num}</div>
    </div>
  );
}

// Sidebar — History page active
function Sidebar({ openCount }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">E</div>
        <div className="brand-name">EcommPilot<sup>®</sup></div>
      </div>

      <div className="store-switcher">
        <div className="store-avatar">{STORE.initials}</div>
        <div className="store-meta">
          <div className="store-name">{STORE.name}</div>
          <div className="store-url">{STORE.url}</div>
        </div>
        <I.ChevronDown size={14} className="store-chevron" />
      </div>

      <div className="nav-section-label">Workspace</div>
      <a className="nav-item" href="Dashboard.html">
        <I.Dashboard size={15} className="icon" />
        Dashboard
      </a>
      <a className="nav-item" href="Alerts.html">
        <I.Bell size={15} className="icon" />
        Alerts
        <span className="badge">{openCount}</span>
      </a>
      <div className="nav-item active">
        <I.History size={15} className="icon" />
        History
      </div>
      <div className="nav-item">
        <I.Box size={15} className="icon" />
        Catalog
      </div>

      <div className="nav-section-label">Setup</div>
      <div className="nav-item">
        <I.Plug size={15} className="icon" />
        Integrations
        <span className="badge muted">4</span>
      </div>
      <div className="nav-item">
        <I.Settings size={15} className="icon" />
        Settings
      </div>

      <div className="nav-spacer" />

      <div className="nav-footer">
        <div className="user-avatar">MS</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="user-name">Mara Souza</div>
          <div className="user-role">Growth Lead</div>
        </div>
        <I.More size={14} style={{ color: "var(--ink-4)" }} />
      </div>
    </aside>
  );
}

function StatCard({ glyph, icon, num, label, trend, trendText }) {
  return (
    <div className="stat-card">
      <div className={"stat-glyph " + glyph}>{icon}</div>
      <div>
        <div className="stat-num">{num}</div>
        <div className="stat-lbl">{label}</div>
      </div>
      <div className={"stat-trend " + trend}>
        {trend === "up" && <I.ArrowUp size={10} sw={2.4} />}
        {trend === "down" && <I.ArrowDown size={10} sw={2.4} />}
        {trendText}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<HistoryApp />);
