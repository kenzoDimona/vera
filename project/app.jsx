// EcommPilot Dashboard — main app.

const { useState, useEffect, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "density": "regular",
  "showSparklines": true,
  "layout": "list",
  "range": "Week"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [openAlertId, setOpenAlertId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [resolved, setResolved] = useState({});
  const [feedback, setFeedback] = useState({});

  useEffect(() => {
    document.documentElement.dataset.theme = t.theme;
    document.documentElement.dataset.density = t.density;
    document.documentElement.dataset.layout = t.layout;
  }, [t.theme, t.density, t.layout]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setOpenAlertId(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const counts = useMemo(() => ({
    total:    ALERTS.length,
    critical: ALERTS.filter(a => a.severity === "critical").length,
    warning:  ALERTS.filter(a => a.severity === "warning").length,
    good:     ALERTS.filter(a => a.severity === "good").length,
    info:     ALERTS.filter(a => a.severity === "info").length,
  }), []);

  const visibleAlerts = useMemo(() => {
    if (filter === "all") return ALERTS;
    if (filter === "open") return ALERTS.filter(a => !resolved[a.id]);
    return ALERTS.filter(a => a.severity === filter);
  }, [filter, resolved]);

  const openAlert = openAlertId ? ALERTS.find(a => a.id === openAlertId) : null;

  return (
    <div className="app">
      <MobileHeader title="Dashboard" />
      <Sidebar counts={counts} />
      <main className="main">
        <Topbar range={t.range} setRange={(v) => setTweak("range", v)} />
        <Greeting counts={counts} />
        <Metrics showSpark={t.showSparklines} />
        <FeedCard
          visibleAlerts={visibleAlerts}
          counts={counts}
          filter={filter}
          setFilter={setFilter}
          resolved={resolved}
          showSpark={t.showSparklines}
          onOpen={setOpenAlertId}
        />
      </main>

      <DetailPanel
        alert={openAlert}
        onClose={() => setOpenAlertId(null)}
        resolved={openAlert ? !!resolved[openAlert.id] : false}
        feedback={openAlert ? feedback[openAlert.id] : null}
        onResolve={() => {
          if (!openAlert) return;
          setResolved(prev => ({ ...prev, [openAlert.id]: !prev[openAlert.id] }));
        }}
        onFeedback={(v) => {
          if (!openAlert) return;
          setFeedback(prev => ({ ...prev, [openAlert.id]: prev[openAlert.id] === v ? null : v }));
        }}
      />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Appearance" />
        <TweakRadio label="Theme" value={t.theme} options={["light", "dark"]}
                    onChange={(v) => setTweak("theme", v)} />
        <TweakRadio label="Density" value={t.density} options={["compact", "regular", "comfy"]}
                    onChange={(v) => setTweak("density", v)} />
        <TweakSection label="Feed" />
        <TweakRadio label="Layout" value={t.layout} options={["list", "grid"]}
                    onChange={(v) => setTweak("layout", v)} />
        <TweakToggle label="Sparklines" value={t.showSparklines}
                     onChange={(v) => setTweak("showSparklines", v)} />
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
      <div className="nav-item active">
        <I.Dashboard size={15} className="icon" />
        Dashboard
      </div>
      <div className="nav-item">
        <I.Bell size={15} className="icon" />
        Alerts
        <span className="badge">{counts.critical + counts.warning}</span>
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

      <div className="upgrade-card">
        <div className="upgrade-pill">✦ Pro</div>
        <div className="upgrade-title">Unlock Co-pilot</div>
        <div className="upgrade-sub">Get AI-driven actions that resolve alerts automatically.</div>
        <button className="upgrade-btn">Upgrade now</button>
      </div>

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

// ── Topbar ──
function Topbar({ range, setRange }) {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <h1>Overview</h1>
        <div className="seg-pill">
          {["Today", "Week", "Month", "Custom"].map(r => (
            <button key={r} className={range === r ? "active" : ""} onClick={() => setRange(r)}>{r}</button>
          ))}
        </div>
      </div>
      <div className="topbar-actions">
        <span className="live-text"><span className="live-dot" /> Live</span>
        <button className="icon-btn" aria-label="Search"><I.Search size={15} /></button>
        <button className="icon-btn" aria-label="Notifications"><I.Bell size={15} /><span className="ping" /></button>
        <button className="btn-primary-pill"><I.Sparkle size={13} sw={2.2} /> Ask Pilot</button>
      </div>
    </div>
  );
}

// ── Greeting ──
function Greeting({ counts }) {
  const hour = new Date().getHours();
  const partOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  return (
    <section className="greeting-card">
      <div>
        <div className="greeting-eyebrow"><I.Sparkle size={11} sw={2.2} /> Pilot brief · today</div>
        <h2>
          Good {partOfDay}, Mara. <span className="em">{counts.critical} things</span> need your attention, and there are <span className="em green">{counts.good} opportunities</span> worth exploring.
        </h2>
        <div className="greeting-sub">
          The biggest issue right now is a mobile checkout drop that started at 9:47am — likely tied to the Apple Pay deploy. I’d look at that first.
        </div>
      </div>
      <div className="greeting-summary">
        <div className="greeting-stat">
          <div className="num crit">{counts.critical + counts.warning}</div>
          <div className="lbl">Need attention</div>
        </div>
        <div className="greeting-stat">
          <div className="num opp">{counts.good}</div>
          <div className="lbl">Opportunities</div>
        </div>
      </div>
    </section>
  );
}

// ── Metrics ──
function Metrics({ showSpark }) {
  return (
    <div className="metrics">
      {METRICS.map(m => <MetricTile key={m.key} metric={m} showSpark={showSpark} />)}
    </div>
  );
}

// ── Feed ──
function FeedCard({ visibleAlerts, counts, filter, setFilter, resolved, showSpark, onOpen }) {
  const options = [
    { key: "all",      label: "All",           pill: counts.total },
    { key: "critical", label: "Critical",      pill: counts.critical },
    { key: "warning",  label: "Warnings",      pill: counts.warning },
    { key: "good",     label: "Opportunities", pill: counts.good },
    { key: "info",     label: "Insights",      pill: counts.info },
  ];
  return (
    <section className="feed-card">
      <div className="feed-header">
        <div className="feed-title">
          Alert feed <span className="count">{visibleAlerts.length} of {counts.total}</span>
        </div>
        <div className="filters">
          {options.map(o => (
            <button key={o.key}
                    className={"filter-btn" + (filter === o.key ? " active" : "")}
                    onClick={() => setFilter(o.key)}>
              {o.label} <span className="pill">{o.pill}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="feed-list">
        {visibleAlerts.map(a => (
          <AlertCard
            key={a.id}
            alert={a}
            resolved={!!resolved[a.id]}
            showChart={showSpark}
            onOpen={() => onOpen(a.id)}
          />
        ))}
        {visibleAlerts.length === 0 && (
          <div className="empty">
            <div className="em-mark"><I.Check size={20} sw={2.4} /></div>
            <div className="empty-title">All clear</div>
            <div className="empty-sub">No alerts match this filter right now.</div>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Detail Panel ──
function DetailPanel({ alert, onClose, onResolve, resolved, feedback, onFeedback }) {
  const open = !!alert;
  const sevLabels = { critical: "Critical", warning: "Warning", good: "Opportunity", info: "Insight" };
  const directionFromSev = { critical: "down", warning: "down", good: "up", info: "neutral" };

  return (
    <>
      <div className={"scrim" + (open ? " open" : "")} onClick={onClose} />
      <aside className={"panel" + (open ? " open" : "")} aria-hidden={!open}>
        {alert && (
          <>
            <div className="panel-header">
              <div className="alert-meta" style={{ margin: 0 }}>
                <span className="sev-tag" style={{
                  background: alert.severity === "critical" ? "var(--rose-soft)"
                            : alert.severity === "warning" ? "var(--amber-soft)"
                            : alert.severity === "good" ? "var(--teal-soft)"
                            : "var(--sky-soft)",
                  color: alert.severity === "critical" ? "var(--rose)"
                       : alert.severity === "warning" ? "var(--amber)"
                       : alert.severity === "good" ? "var(--teal)"
                       : "var(--sky)",
                }}>{sevLabels[alert.severity]}</span>
                <span className="alert-source">{alert.source}</span>
                <span className="alert-dot" />
                <span className="alert-time">{alert.timeAgo}</span>
              </div>
              <button className="panel-close" onClick={onClose} aria-label="Close">
                <I.Close size={14} />
              </button>
            </div>

            <div className="panel-body">
              <h2 className="panel-headline">{alert.headline}</h2>
              <Narrative text={alert.narrative} direction={directionFromSev[alert.severity]} />

              <section className="panel-section">
                <h4>Trend</h4>
                <div className="panel-chart-card">
                  <div className="chart-stat-row">
                    <div className="chart-stat">
                      <div className="label">{alert.chartLabel}</div>
                      <div className={"value " + (directionFromSev[alert.severity] === "down" ? "down" : "up")}>
                        {alert.chartCurrent}
                      </div>
                    </div>
                    <div className="chart-stat">
                      <div className="label">14-day window</div>
                      <div className="value" style={{ color: "var(--ink-2)" }}>
                        {alert.chartDomain[0]}–{alert.chartDomain[1]}
                      </div>
                    </div>
                  </div>
                  <DetailChart series={alert.series} domain={alert.chartDomain} severity={alert.severity} />
                </div>
              </section>

              <section className="panel-section">
                <h4>Possible causes</h4>
                <ul className="cause-list">
                  {alert.causes.map((c, i) => (
                    <li key={i} className="cause">
                      <span className="cause-conf">{c.confidence}</span>
                      <span className="cause-text">{c.text}</span>
                      <I.ChevronRight size={14} className="cause-icon" />
                    </li>
                  ))}
                </ul>
              </section>

              <section className="panel-section">
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

              <div className="feedback-row">
                <div className="feedback-q">Was this alert useful?</div>
                <div className="feedback-btns">
                  <button className={"fb-btn up" + (feedback === "up" ? " active" : "")}
                          onClick={() => onFeedback("up")}><I.ThumbsUp size={14} /></button>
                  <button className={"fb-btn down" + (feedback === "down" ? " active" : "")}
                          onClick={() => onFeedback("down")}><I.ThumbsDown size={14} /></button>
                </div>
              </div>

              <div className="panel-footer-actions">
                <button className="alert-cta primary" onClick={onResolve}>
                  <I.Check size={12} sw={2.4} />
                  {resolved ? "Marked resolved" : "Mark as resolved"}
                </button>
                <button className="alert-cta">
                  <I.EyeOff size={12} /> Ignore
                </button>
                <button className="alert-cta" style={{ marginLeft: "auto" }}>
                  Snooze 24h
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
