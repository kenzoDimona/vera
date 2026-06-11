// EcommPilot Alerts page

const { useState, useEffect, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "density": "regular"
}/*EDITMODE-END*/;

// Augment alert data with status + read state
const enrichAlert = (a, i) => ({
  ...a,
  status: i === 6 ? "resolved" : i === 5 ? "ignored" : "open",
  read: i > 2,
});

function AlertsApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const all = useMemo(() => ALERTS.map(enrichAlert), []);
  const [statusTab, setStatusTab] = useState("open");
  const [activeFilters, setActiveFilters] = useState({ severity: null, source: null });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("priority");
  const [selected, setSelected] = useState(new Set());
  const [activeId, setActiveId] = useState(all[0]?.id);
  const [feedback, setFeedback] = useState({});

  useEffect(() => {
    document.documentElement.dataset.theme = t.theme;
    document.documentElement.dataset.density = t.density;
  }, [t.theme, t.density]);

  const counts = useMemo(() => ({
    open:    all.filter(a => a.status === "open").length,
    resolved:all.filter(a => a.status === "resolved").length,
    ignored: all.filter(a => a.status === "ignored").length,
    all:     all.length,
    critical:all.filter(a => a.severity === "critical").length,
    warning: all.filter(a => a.severity === "warning").length,
    good:    all.filter(a => a.severity === "good").length,
    info:    all.filter(a => a.severity === "info").length,
  }), [all]);

  const visible = useMemo(() => {
    let list = all;
    if (statusTab !== "all") list = list.filter(a => a.status === statusTab);
    if (activeFilters.severity) list = list.filter(a => a.severity === activeFilters.severity);
    if (activeFilters.source) list = list.filter(a => a.source.includes(activeFilters.source));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a => a.headline.toLowerCase().includes(q) || a.narrative.toLowerCase().includes(q) || a.source.toLowerCase().includes(q));
    }
    const sevWeight = { critical: 0, warning: 1, good: 2, info: 3 };
    if (sort === "priority") list = [...list].sort((a, b) => sevWeight[a.severity] - sevWeight[b.severity]);
    if (sort === "recent") list = [...list];
    return list;
  }, [all, statusTab, activeFilters, search, sort]);

  const active = useMemo(() => all.find(a => a.id === activeId) || visible[0] || null, [all, activeId, visible]);

  const toggleSelect = (id) => {
    setSelected(prev => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };
  const toggleAll = () => {
    if (selected.size === visible.length) setSelected(new Set());
    else setSelected(new Set(visible.map(a => a.id)));
  };
  const allChecked = selected.size > 0 && selected.size === visible.length;
  const someChecked = selected.size > 0 && selected.size < visible.length;

  const sevGlyph = (sev) => {
    if (sev === "critical") return <I.Lightning size={15} sw={2.2} />;
    if (sev === "warning") return <I.TrendDown size={14} sw={2} />;
    if (sev === "good") return <I.TrendUp size={14} sw={2} />;
    return <I.Sparkle size={14} sw={2} />;
  };

  return (
    <div className="app">
      <MobileHeader title="Alerts" />
      <Sidebar counts={counts} />

      <main className="main">
        {/* Topbar */}
        <div className="topbar">
          <div>
            <h1>Alerts</h1>
            <div className="topbar-sub">
              {counts.open} open · {counts.critical} critical · last sync 2 min ago
            </div>
          </div>
          <div className="topbar-actions">
            <button className="btn-pill"><I.Filter size={13} /> Saved views <I.ChevronDown size={11} /></button>
            <button className="icon-btn" aria-label="Notifications"><I.Bell size={15} /><span className="ping" /></button>
            <button className="btn-primary-pill"><I.Sparkle size={13} sw={2.2} /> Ask Pilot</button>
          </div>
        </div>

        {/* Stat strip */}
        <div className="stats-row">
          <StatCard glyph="crit" icon={<I.Lightning size={16} sw={2.2} />} num={counts.critical} label="Critical" trend="up" trendText="+2 vs yesterday" />
          <StatCard glyph="warn" icon={<I.TrendDown size={15} sw={2} />} num={counts.warning} label="Warnings" trend="flat" trendText="No change" />
          <StatCard glyph="opp" icon={<I.TrendUp size={15} sw={2} />} num={counts.good} label="Opportunities" trend="up" trendText="+1 today" />
          <StatCard glyph="info" icon={<I.Sparkle size={15} sw={2} />} num={counts.info} label="Insights" trend="flat" trendText="Steady" />
        </div>

        {/* Toolbar */}
        <div className="toolbar-card">
          <div className="toolbar-row">
            <div className="search-input">
              <I.Search size={14} style={{ color: "var(--ink-4)" }} />
              <input type="text" placeholder="Search alerts, sources, metrics…" value={search} onChange={(e) => setSearch(e.target.value)} />
              <span className="kbd">⌘K</span>
            </div>
            <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="priority">Sort: Priority</option>
              <option value="recent">Sort: Most recent</option>
              <option value="metric">Sort: By metric</option>
            </select>
          </div>
          <div className="toolbar-row">
            <span style={{ fontSize: 11.5, color: "var(--ink-3)", fontWeight: 500, marginRight: 4 }}>FILTER</span>
            {[
              { k: "critical", label: "Critical", count: counts.critical },
              { k: "warning",  label: "Warnings", count: counts.warning },
              { k: "good",     label: "Opportunities", count: counts.good },
              { k: "info",     label: "Insights", count: counts.info },
            ].map(o => (
              <button key={o.k}
                      className={"chip" + (activeFilters.severity === o.k ? " active" : "")}
                      onClick={() => setActiveFilters(p => ({ ...p, severity: p.severity === o.k ? null : o.k }))}>
                {o.label} <span style={{ opacity: 0.6 }}>{o.count}</span>
                {activeFilters.severity === o.k && <I.Close size={10} className="x" />}
              </button>
            ))}
            <span style={{ width: 1, height: 18, background: "var(--line)", margin: "0 4px" }} />
            {[
              { k: "GA4",      label: "GA4" },
              { k: "Meta",     label: "Meta Ads" },
              { k: "Google Ads", label: "Google Ads" },
              { k: "Shopify",  label: "Shopify" },
            ].map(o => (
              <button key={o.k}
                      className={"chip" + (activeFilters.source === o.k ? " active" : "")}
                      onClick={() => setActiveFilters(p => ({ ...p, source: p.source === o.k ? null : o.k }))}>
                {o.label}
                {activeFilters.source === o.k && <I.Close size={10} className="x" />}
              </button>
            ))}
            <button className="chip" style={{ marginLeft: "auto" }}>
              <I.Calendar size={12} /> Last 7 days <I.ChevronDown size={10} />
            </button>
          </div>

          {/* Status tabs */}
          <div className="status-tabs">
            {[
              { k: "open",     label: "Open",     count: counts.open },
              { k: "resolved", label: "Resolved", count: counts.resolved },
              { k: "ignored",  label: "Ignored",  count: counts.ignored },
              { k: "all",      label: "All",      count: counts.all },
            ].map(o => (
              <button key={o.k}
                      className={"status-tab" + (statusTab === o.k ? " active" : "")}
                      onClick={() => { setStatusTab(o.k); setSelected(new Set()); }}>
                {o.label} <span className="tab-pill">{o.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bulk action bar (conditional) */}
        {selected.size > 0 && (
          <div className="bulk-bar">
            <I.Check size={14} sw={2.4} />
            <span className="bulk-count">{selected.size} selected</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span style={{ opacity: 0.7 }}>Bulk actions:</span>
            <div className="bulk-actions">
              <button className="bulk-btn"><I.Check size={11} sw={2.4} /> Resolve</button>
              <button className="bulk-btn"><I.EyeOff size={11} /> Ignore</button>
              <button className="bulk-btn">Snooze 24h</button>
              <button className="bulk-btn" onClick={() => setSelected(new Set())}>Clear</button>
            </div>
          </div>
        )}

        {/* Master / detail split */}
        <div className="split">
          {/* List */}
          <section className="list-card">
            <div className="list-toolbar">
              <label className="list-checkall">
                <input type="checkbox" className={"checkbox" + (someChecked ? " indeterminate" : "")}
                       checked={allChecked} onChange={toggleAll} />
                {selected.size > 0 ? `${selected.size} of ${visible.length}` : `${visible.length} alerts`}
              </label>
              <button className="icon-btn-sm" aria-label="More"><I.More size={14} /></button>
            </div>

            <div className="list-rows">
              {visible.map(a => (
                <div key={a.id}
                     className={"row" + (a.id === active?.id ? " selected" : "") + (a.read ? " read" : "")}
                     data-severity={a.severity}
                     onClick={() => setActiveId(a.id)}>
                  <input type="checkbox" className="checkbox"
                         checked={selected.has(a.id)}
                         onChange={() => toggleSelect(a.id)}
                         onClick={(e) => e.stopPropagation()} />
                  <div className="row-glyph">{sevGlyph(a.severity)}</div>
                  <div className="row-body">
                    <div className="row-meta">
                      <span className="pill">{a.severity === "good" ? "Opportunity" : a.severity === "info" ? "Insight" : a.severity === "warning" ? "Warning" : "Critical"}</span>
                      <span className="src">{a.source}</span>
                      <span className="dot" />
                      <span>{a.metric}</span>
                    </div>
                    <div className="row-headline">{a.headline}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <div className="row-spark">
                      <Sparkline series={a.series} width={64} height={20}
                                 stroke={a.severity === "critical" ? "var(--rose)" : a.severity === "warning" ? "var(--amber)" : a.severity === "good" ? "var(--teal)" : "var(--sky)"}
                                 fill={a.severity === "critical" ? "var(--rose)" : a.severity === "warning" ? "var(--amber)" : a.severity === "good" ? "var(--teal)" : "var(--sky)"}
                                 domain={a.chartDomain} />
                    </div>
                    <div className="row-time">{a.timeAgo}</div>
                  </div>
                </div>
              ))}
              {visible.length === 0 && (
                <div className="empty-detail">
                  <div className="em-icon"><I.Check size={20} sw={2.4} /></div>
                  <div className="em-title">Nothing here</div>
                  <div className="em-sub">No alerts match your filters. Try clearing them or switching tabs.</div>
                </div>
              )}
            </div>
          </section>

          {/* Detail pane */}
          <section className="detail-card">
            {active ? <DetailPane alert={active} feedback={feedback[active.id]}
                                  onFeedback={(v) => setFeedback(p => ({ ...p, [active.id]: p[active.id] === v ? null : v }))} />
                    : <EmptyDetail />}
          </section>
        </div>
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Appearance" />
        <TweakRadio label="Theme" value={t.theme} options={["light", "dark"]}
                    onChange={(v) => setTweak("theme", v)} />
        <TweakRadio label="Density" value={t.density} options={["compact", "regular", "comfy"]}
                    onChange={(v) => setTweak("density", v)} />
      </TweaksPanel>
    </div>
  );
}

// ── Sidebar ──
function Sidebar({ counts }) {
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
      <div className="nav-item active">
        <I.Bell size={15} className="icon" />
        Alerts
        <span className="badge">{counts.open}</span>
      </div>
      <div className="nav-item">
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

// ── Detail pane ──
function DetailPane({ alert, feedback, onFeedback }) {
  const sevLabels = { critical: "Critical", warning: "Warning", good: "Opportunity", info: "Insight" };
  const direction = { critical: "down", warning: "down", good: "up", info: "neutral" }[alert.severity];

  return (
    <>
      <div className="detail-head">
        <div className="detail-head-row">
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <span className={"sev-tag " + alert.severity}>{sevLabels[alert.severity]}</span>
            <span className="src-time">
              {alert.source}<span className="dot">·</span>{alert.timeAgo}
            </span>
          </div>
          <div className="detail-actions">
            <button className={"icon-btn-sm" + (feedback === "up" ? " active up" : "")} onClick={() => onFeedback("up")} aria-label="Useful">
              <I.ThumbsUp size={13} />
            </button>
            <button className={"icon-btn-sm" + (feedback === "down" ? " active down" : "")} onClick={() => onFeedback("down")} aria-label="Not useful">
              <I.ThumbsDown size={13} />
            </button>
            <button className="icon-btn-sm" aria-label="More"><I.More size={14} /></button>
          </div>
        </div>
      </div>

      <div className="detail-body">
        <h2 className="detail-headline">{alert.headline}</h2>
        <Narrative text={alert.narrative} direction={direction} className="detail-narrative" />

        <section className="detail-section">
          <h4>Trend · {alert.chartLabel}</h4>
          <div className="panel-chart-card">
            <div className="chart-stat-row">
              <div className="chart-stat">
                <div className="label">Current</div>
                <div className={"value " + (direction === "down" ? "down" : "up")}>{alert.chartCurrent}</div>
              </div>
              <div className="chart-stat">
                <div className="label">14-day range</div>
                <div className="value" style={{ color: "var(--ink-2)" }}>{alert.chartDomain[0]}–{alert.chartDomain[1]}</div>
              </div>
            </div>
            <DetailChart series={alert.series} domain={alert.chartDomain} severity={alert.severity} />
          </div>
        </section>

        <section className="detail-section">
          <h4>Possible causes</h4>
          <ul className="cause-list">
            {alert.causes.map((c, i) => (
              <li key={i} className="cause">
                <span className="cause-conf">{c.confidence}</span>
                <span className="cause-text">{c.text}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="detail-section">
          <h4>Recommended actions</h4>
          <div className="actions-list">
            {alert.actions.map((a, i) => (
              <div key={i} className="action">
                <div className="action-num">{i + 1}</div>
                <div className="action-body">
                  <div className="action-title">{a.title}</div>
                  <div className="action-desc">{a.desc}</div>
                </div>
                <button className="action-cta">{a.cta} <I.ArrowRight size={11} sw={2} /></button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="detail-foot">
        <button className="alert-cta primary"><I.Check size={12} sw={2.4} /> Mark as resolved</button>
        <button className="alert-cta"><I.EyeOff size={12} /> Ignore</button>
        <button className="alert-cta" style={{ marginLeft: "auto" }}>Snooze 24h</button>
      </div>
    </>
  );
}

function EmptyDetail() {
  return (
    <div className="empty-detail">
      <div className="em-icon"><I.Bell size={20} sw={2} /></div>
      <div className="em-title">Select an alert</div>
      <div className="em-sub">Choose an alert from the list to see causes, trends, and recommended actions.</div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AlertsApp />);
