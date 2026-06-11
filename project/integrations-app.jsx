// EcommPilot Integrations page

const { useState, useEffect, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light"
}/*EDITMODE-END*/;

// ── Connected + available integrations ──
const CONNECTED = [
  {
    id: "ga4",
    name: "Google Analytics 4",
    cat: "Analytics",
    logo: { letter: "G", bg: "linear-gradient(135deg, #F9AB00, #E37400)" },
    status: "ok",
    statusLabel: "Healthy",
    lastSync: "2 min ago",
    syncEvery: "15 min",
    account: "lumen-skincare-ga4@analytics.google.com",
    property: "GA4 · 287413920",
    metrics: ["Sessions", "Conversion rate", "Revenue", "Engagement", "Bounce rate", "Source / medium"],
    enabled: true,
    rowsToday: "2.4M",
  },
  {
    id: "meta",
    name: "Meta Ads",
    cat: "Paid Media",
    logo: { letter: "M", bg: "linear-gradient(135deg, #0866FF, #C13584)" },
    status: "ok",
    statusLabel: "Healthy",
    lastSync: "5 min ago",
    syncEvery: "15 min",
    account: "Lumen Skincare · Ads Manager",
    property: "Account 8821-4406-2275",
    metrics: ["Spend", "ROAS", "CTR", "CPM", "Conversions", "Frequency"],
    enabled: true,
    rowsToday: "184k",
  },
  {
    id: "gads",
    name: "Google Ads",
    cat: "Paid Media",
    logo: { letter: "A", bg: "linear-gradient(135deg, #4285F4, #34A853)" },
    status: "warn",
    statusLabel: "Token expiring",
    lastSync: "12 min ago",
    syncEvery: "15 min",
    account: "lumen-skincare-ads@gmail.com",
    property: "Customer ID 412-885-9930",
    metrics: ["Spend", "CPC", "Impression share", "Quality score", "Conversions"],
    enabled: true,
    rowsToday: "62k",
  },
  {
    id: "shopify",
    name: "Shopify",
    cat: "Storefront",
    logo: { letter: "S", bg: "linear-gradient(135deg, #95BF47, #5E8E3E)" },
    status: "ok",
    statusLabel: "Healthy",
    lastSync: "Just now",
    syncEvery: "Real-time",
    account: "lumenskincare.myshopify.com",
    property: "Plan: Shopify Plus",
    metrics: ["Orders", "AOV", "Inventory", "Bundle attach", "Refunds", "Cart abandonment"],
    enabled: true,
    rowsToday: "9,412",
  },
];

const AVAILABLE = [
  { id: "klaviyo",  name: "Klaviyo",      cat: "Email & SMS",   logo: { letter: "K", bg: "linear-gradient(135deg, #6F47EB, #00C2A8)" }, desc: "Pull email & SMS performance into the alert engine." },
  { id: "tiktok",   name: "TikTok Ads",   cat: "Paid Media",    logo: { letter: "T", bg: "linear-gradient(135deg, #00F2EA, #FF0050)" }, desc: "Track TikTok campaign ROAS, CPM, and creative fatigue." },
  { id: "pinterest",name: "Pinterest Ads",cat: "Paid Media",    logo: { letter: "P", bg: "linear-gradient(135deg, #E60023, #BD081C)" }, desc: "Monitor Pinterest spend and pin performance." },
  { id: "stripe",   name: "Stripe",       cat: "Payments",      logo: { letter: "S", bg: "linear-gradient(135deg, #635BFF, #0A2540)" }, desc: "Watch checkout failure rates and chargebacks." },
  { id: "amazon",   name: "Amazon Seller",cat: "Marketplace",   logo: { letter: "a", bg: "linear-gradient(135deg, #FF9900, #232F3E)" }, desc: "Track Amazon revenue, BSR, and ad ACOS." },
  { id: "gsc",      name: "Search Console",cat: "SEO",          logo: { letter: "g", bg: "linear-gradient(135deg, #4285F4, #DB4437)" }, desc: "Catch organic ranking and click-through drops." },
  { id: "slack",    name: "Slack",        cat: "Notifications", logo: { letter: "#", bg: "linear-gradient(135deg, #ECB22E, #E01E5A)" }, desc: "Push priority alerts directly to a Slack channel." },
  { id: "looker",   name: "Looker Studio",cat: "Analytics",     logo: { letter: "L", bg: "linear-gradient(135deg, #4285F4, #0F9D58)" }, desc: "Embed EcommPilot insights in Looker dashboards." },
];

const SYNC_LOG = [
  { time: "08:42", status: "ok",   msg: "Sessions, revenue, conversion synced",  rows: "84,210 rows" },
  { time: "08:27", status: "ok",   msg: "Sessions, revenue, conversion synced",  rows: "81,997 rows" },
  { time: "08:12", status: "warn", msg: "Backfill triggered for missing dimensions", rows: "+2,400 rows" },
  { time: "07:57", status: "ok",   msg: "Sessions, revenue, conversion synced",  rows: "78,143 rows" },
  { time: "07:42", status: "ok",   msg: "Sessions, revenue, conversion synced",  rows: "76,824 rows" },
  { time: "07:27", status: "ok",   msg: "Sessions, revenue, conversion synced",  rows: "75,508 rows" },
  { time: "07:12", status: "err",  msg: "API 429 — rate limited (auto-retry succeeded)", rows: "0 rows" },
];

function IntegrationsApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [activeId, setActiveId] = useState("ga4");
  const [tab, setTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [enabledMetrics, setEnabledMetrics] = useState({});
  const [allEnabled, setAllEnabled] = useState({ ga4: true, meta: true, gads: true, shopify: true });

  useEffect(() => {
    document.documentElement.dataset.theme = t.theme;
  }, [t.theme]);

  const active = CONNECTED.find(c => c.id === activeId);

  const filterText = search.toLowerCase().trim();
  const fc = CONNECTED.filter(i =>
    !filterText || i.name.toLowerCase().includes(filterText) || i.cat.toLowerCase().includes(filterText));
  const fa = AVAILABLE.filter(i =>
    !filterText || i.name.toLowerCase().includes(filterText) || i.cat.toLowerCase().includes(filterText));

  const counts = {
    connected: CONNECTED.length,
    healthy: CONNECTED.filter(c => c.status === "ok").length,
    warn: CONNECTED.filter(c => c.status === "warn").length,
    rows: "2.7M",
  };

  const toggleMetric = (id) => setEnabledMetrics(p => ({ ...p, [id]: !p[id] }));

  return (
    <div className="app">
      <MobileHeader title="Integrations" />
      <Sidebar />

      <main className="main">
        <div className="topbar">
          <div>
            <h1>Integrations</h1>
            <div className="topbar-sub">
              {counts.connected} connected · {counts.healthy} healthy · {counts.rows} rows synced today
            </div>
          </div>
          <div className="topbar-actions">
            <button className="btn-pill"><I.Refresh size={13} /> Sync all now</button>
            <button className="icon-btn" aria-label="Notifications"><I.Bell size={15} /><span className="ping" /></button>
            <button className="btn-primary-pill"><I.Sparkle size={13} sw={2.2} /> Browse marketplace</button>
          </div>
        </div>

        <div className="stats-row">
          <StatCard glyph="opp"  icon={<I.Plug size={15} />}   num={counts.connected} label="Connected sources" trend="up" trendText="+1 this month" />
          <StatCard glyph="info" icon={<I.Refresh size={14} />} num={counts.rows}      label="Rows synced today" trend="up" trendText="On schedule" />
          <StatCard glyph="warn" icon={<I.TrendDown size={14} />} num={counts.warn}    label="Need attention" trend="flat" trendText="1 token expiring" />
          <StatCard glyph="crit" icon={<I.Lightning size={15} sw={2.2} />} num="99.4%" label="Sync uptime · 30d" trend="up" trendText="+0.2pp" />
        </div>

        {/* Search + filter */}
        <div className="toolbar-card">
          <div className="toolbar-row">
            <div className="search-input">
              <I.Search size={14} style={{ color: "var(--ink-4)" }} />
              <input type="text" placeholder="Search integrations…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <button className="btn-pill"><I.Filter size={13} /> All categories <I.ChevronDown size={11} /></button>
          </div>
        </div>

        {/* Two-column: cards on left, detail on right */}
        <div className="split">
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Connected */}
            <section>
              <div className="section-head">
                <div>
                  <h2 style={{ display: "inline" }}>Connected</h2>
                  <span className="count">{fc.length}</span>
                </div>
                <a className="link">Manage all →</a>
              </div>
              <div className="grid-cards">
                {fc.map(i => (
                  <ConnectedCard key={i.id} i={i} active={i.id === activeId} onClick={() => setActiveId(i.id)} />
                ))}
              </div>
            </section>

            {/* Available */}
            <section>
              <div className="section-head">
                <div>
                  <h2 style={{ display: "inline" }}>Available to connect</h2>
                  <span className="count">{fa.length}</span>
                </div>
                <a className="link">View all 40+ →</a>
              </div>
              <div className="grid-cards">
                {fa.map(i => <AvailableCard key={i.id} i={i} />)}
              </div>
            </section>
          </div>

          {/* Detail */}
          <section className="detail-card">
            {active && (
              <>
                <div className="int-detail-head">
                  <div className="int-logo" style={{ background: active.logo.bg }}>{active.logo.letter}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2>{active.name}</h2>
                    <div className="sub">{active.cat} · {active.property}</div>
                  </div>
                  <button className="icon-btn-sm" aria-label="More"><I.More size={14} /></button>
                </div>

                <div className="int-tabs">
                  {["overview", "metrics", "sync log", "settings"].map(k => (
                    <button key={k} className={"int-tab" + (tab === k ? " active" : "")} onClick={() => setTab(k)}>
                      {k.charAt(0).toUpperCase() + k.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="detail-body">
                  {tab === "overview" && (
                    <>
                      <section className="detail-section">
                        <h4>Status</h4>
                        <div className="panel-chart-card">
                          <div className="chart-stat-row" style={{ marginBottom: 0 }}>
                            <div className="chart-stat">
                              <div className="label">Last sync</div>
                              <div className="value" style={{ fontSize: 14 }}>{active.lastSync}</div>
                            </div>
                            <div className="chart-stat">
                              <div className="label">Sync interval</div>
                              <div className="value" style={{ fontSize: 14 }}>{active.syncEvery}</div>
                            </div>
                            <div className="chart-stat">
                              <div className="label">Rows today</div>
                              <div className="value up" style={{ fontSize: 14 }}>{active.rowsToday}</div>
                            </div>
                          </div>
                        </div>
                      </section>

                      <section className="detail-section">
                        <h4>Connected account</h4>
                        <div className="panel-chart-card" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div className="user-avatar" style={{ width: 32, height: 32, fontSize: 11 }}>
                            {active.logo.letter}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12.5, fontWeight: 600 }}>{active.account}</div>
                            <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>Connected by Mara Souza · 14 Mar 2026</div>
                          </div>
                          <button className="alert-cta">Reauthorize</button>
                        </div>
                      </section>

                      <section className="detail-section">
                        <h4>Monitored metrics ({active.metrics.length})</h4>
                        <div>
                          {active.metrics.map(m => (
                            <span key={m} className="metric-chip on">
                              <I.Check size={10} sw={2.4} /> {m}
                            </span>
                          ))}
                        </div>
                      </section>
                    </>
                  )}

                  {tab === "metrics" && (
                    <section className="detail-section">
                      <h4>Toggle which metrics Pilot watches</h4>
                      <div>
                        {active.metrics.map(m => (
                          <div key={m} className="toggle-row">
                            <div>
                              <div className="lbl">{m}</div>
                              <div className="desc">Anomaly detection · daily baseline · 14-day window</div>
                            </div>
                            <input type="checkbox" className="switch"
                                   checked={enabledMetrics[m] !== false}
                                   onChange={() => toggleMetric(m)} />
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {tab === "sync log" && (
                    <section className="detail-section">
                      <h4>Recent syncs · last 2 hours</h4>
                      <div className="sync-log">
                        {SYNC_LOG.map((r, i) => (
                          <div key={i} className="sync-log-row">
                            <span className={"sync-dot " + r.status} />
                            <span className="sync-time">{r.time}</span>
                            <span className="sync-msg">{r.msg}</span>
                            <span className="sync-rows">{r.rows}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {tab === "settings" && (
                    <>
                      <section className="detail-section">
                        <h4>Sync configuration</h4>
                        <div>
                          <div className="toggle-row">
                            <div>
                              <div className="lbl">Auto-sync enabled</div>
                              <div className="desc">Pilot pulls fresh data on a schedule.</div>
                            </div>
                            <input type="checkbox" className="switch"
                                   checked={allEnabled[active.id]}
                                   onChange={(e) => setAllEnabled(p => ({ ...p, [active.id]: e.target.checked }))} />
                          </div>
                          <div className="toggle-row">
                            <div>
                              <div className="lbl">Backfill missing data</div>
                              <div className="desc">Re-pull the last 7 days when schemas change.</div>
                            </div>
                            <input type="checkbox" className="switch" defaultChecked />
                          </div>
                          <div className="toggle-row">
                            <div>
                              <div className="lbl">Slack notifications on errors</div>
                              <div className="desc">Ping #ops if a sync fails twice in a row.</div>
                            </div>
                            <input type="checkbox" className="switch" />
                          </div>
                        </div>
                      </section>

                      <section className="detail-section">
                        <h4 style={{ color: "var(--rose)" }}>Danger zone</h4>
                        <div className="panel-chart-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--rose)" }}>Disconnect {active.name}</div>
                            <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 2 }}>Pilot will stop pulling data. Past alerts are kept.</div>
                          </div>
                          <button className="alert-cta" style={{ borderColor: "var(--rose)", color: "var(--rose)" }}>
                            Disconnect
                          </button>
                        </div>
                      </section>
                    </>
                  )}
                </div>

                <div className="detail-foot">
                  <button className="alert-cta primary"><I.Refresh size={12} /> Sync now</button>
                  <button className="alert-cta">View raw data</button>
                  <button className="alert-cta" style={{ marginLeft: "auto" }}><I.Settings size={12} /> Open in {active.cat}</button>
                </div>
              </>
            )}
          </section>
        </div>
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Appearance" />
        <TweakRadio label="Theme" value={t.theme} options={["light", "dark"]}
                    onChange={(v) => setTweak("theme", v)} />
      </TweaksPanel>
    </div>
  );
}

function ConnectedCard({ i, active, onClick }) {
  return (
    <div className={"int-card" + (active ? " selected" : "")} onClick={onClick}>
      <div className="int-head">
        <div className="int-logo" style={{ background: i.logo.bg }}>{i.logo.letter}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="int-name">{i.name}</div>
          <div className="int-cat">{i.cat}</div>
        </div>
        <span className={"int-status " + i.status}>
          <span className="blink" />
          {i.statusLabel}
        </span>
      </div>

      <div className="int-meta">
        <div>
          <div className="label">Last sync</div>
          <div className="value mono">{i.lastSync}</div>
        </div>
        <div>
          <div className="label">Interval</div>
          <div className="value">{i.syncEvery}</div>
        </div>
        <div>
          <div className="label">Metrics</div>
          <div className="value">{i.metrics.length} watched</div>
        </div>
        <div>
          <div className="label">Rows today</div>
          <div className="value mono">{i.rowsToday}</div>
        </div>
      </div>

      <div className="int-foot">
        <span className="int-account" title={i.account}>{i.account}</span>
      </div>
    </div>
  );
}

function AvailableCard({ i }) {
  return (
    <div className="int-card available">
      <div className="int-head">
        <div className="int-logo" style={{ background: i.logo.bg }}>{i.logo.letter}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="int-name">{i.name}</div>
          <div className="int-cat">{i.cat}</div>
        </div>
      </div>
      <div style={{ fontSize: 12, color: "var(--ink-3)", lineHeight: 1.5, flex: 1 }}>{i.desc}</div>
      <div className="int-foot">
        <a className="link" style={{ fontSize: 11.5, color: "var(--ink-3)", textDecoration: "none" }}>Learn more</a>
        <button className="connect-btn"><I.Plug size={11} /> Connect</button>
      </div>
    </div>
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

function Sidebar() {
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
        <span className="badge">3</span>
      </a>
      <a className="nav-item" href="History.html">
        <I.History size={15} className="icon" />
        History
      </a>
      <div className="nav-item">
        <I.Box size={15} className="icon" />
        Catalog
      </div>

      <div className="nav-section-label">Setup</div>
      <div className="nav-item active">
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

ReactDOM.createRoot(document.getElementById("root")).render(<IntegrationsApp />);
