// EcommPilot Ops — Visão geral / saúde do sistema (tela-coração).

function OperatorSummary() {
  // Princípio do produto: regras detectam, IA escreve. Texto pré-gerado.
  return (
    <div className="op-summary">
      <div className="op-glow" />
      <div className="op-head">
        <span className="op-pill"><I.Sparkles size={12} /> Resumo do operador</span>
        <span className="op-time">gerado às 09:12 · últimos 7 dias</span>
      </div>
      <p className="op-text">
        O sistema está <strong>saudável no geral</strong> — 48 clientes ativos, MRR em alta de 6,2% e acerto
        da hipótese em 82%. A atenção da semana é a <strong>saúde das conexões</strong>, que caiu para 91%:
        três contas concentram as falhas e podem parar de gerar cards.
      </p>
      <div className="op-callouts">
        <button className="op-call rose">
          <span className="oc-ic"><I.Activity size={15} /></span>
          <span className="oc-tt"><b>FitMove com 4 conexões fora</b><span>conta pausada — engine sem dados há 9 dias</span></span>
          <I.ChevronRight size={15} className="oc-go" />
        </button>
        <button className="op-call amber">
          <span className="oc-ic"><I.Database size={15} /></span>
          <span className="oc-tt"><b>MA-004 disparou 38× em 7d</b><span>maior volume do catálogo — revisar limiar</span></span>
          <I.ChevronRight size={15} className="oc-go" />
        </button>
        <button className="op-call teal">
          <span className="oc-ic"><I.Coin size={15} /></span>
          <span className="oc-tt"><b>Casa Decor subiu para Scale</b><span>+R$ 1.200 de MRR no período</span></span>
          <I.ChevronRight size={15} className="oc-go" />
        </button>
      </div>
    </div>
  );
}

function StateFunnel() {
  const max = Math.max(...SYS.cardsByState.map(s => s.value));
  const total = SYS.cardsByState.reduce((a, s) => a + s.value, 0);
  return (
    <div className="panel">
      <div className="panel-head">
        <div className="panel-title">Cards por estado</div>
        <div className="panel-sub">{total.toLocaleString("pt-BR")} no período</div>
      </div>
      <div className="funnel">
        {SYS.cardsByState.map(s => (
          <div key={s.state} className="fn-row">
            <span className="fn-label">{s.label}</span>
            <div className="fn-track">
              <div className="fn-bar" style={{ width: (s.value / max * 100) + "%", background: "var(--" + s.tint + ")" }} />
            </div>
            <span className="fn-val mono">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function VectorVolume() {
  const max = Math.max(...SYS.cardsByVector.map(v => v.value));
  return (
    <div className="panel">
      <div className="panel-head">
        <div className="panel-title">Volume por vetor</div>
        <div className="panel-sub">origem dos cards</div>
      </div>
      <div className="vecvol">
        {SYS.cardsByVector.map(v => {
          const meta = VECTORS[v.vector];
          return (
            <div key={v.vector} className="vv-row">
              <div className="vv-head"><VectorChip vector={v.vector} /><span className="vv-val mono">{v.value}</span></div>
              <div className="vv-track"><div className="vv-bar" style={{ width: (v.value / max * 100) + "%", background: "var(--" + meta.tint + ")" }} /></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ConnHealth() {
  const { ok, warn, err } = SYS.connHealth;
  const total = ok + warn + err;
  const seg = [
    { k: "ok",   v: ok,   tint: "teal",  label: "Saudáveis" },
    { k: "warn", v: warn, tint: "amber", label: "Em atraso" },
    { k: "err",  v: err,  tint: "rose",  label: "Com falha" },
  ];
  return (
    <div className="panel">
      <div className="panel-head">
        <div className="panel-title">Saúde das conexões</div>
        <div className="panel-sub">{total} integrações</div>
      </div>
      <div className="conn-stack">
        {seg.map(s => <div key={s.k} className="cs-seg" style={{ flex: s.v, background: "var(--" + s.tint + ")" }} title={s.label} />)}
      </div>
      <div className="conn-legend">
        {seg.map(s => (
          <div key={s.k} className="cl-item">
            <span className="cl-dot" style={{ background: "var(--" + s.tint + ")" }} />
            <span className="cl-label">{s.label}</span>
            <span className="cl-val mono">{s.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClientsAtRisk({ go }) {
  const risk = CLIENTS.filter(c => c.health !== "ok").sort((a, b) => (a.health === "err" ? -1 : 1) - (b.health === "err" ? -1 : 1)).slice(0, 4);
  return (
    <div className="panel">
      <div className="panel-head">
        <div className="panel-title">Clientes em risco</div>
        <button className="link-btn" onClick={() => go("clients")}>Ver todos <I.ChevronRight size={12} /></button>
      </div>
      <div className="risk-list">
        {risk.map(c => (
          <button key={c.id} className="risk-row" onClick={() => go("clients")}>
            <Avatar initials={initialsOf(c.name)} size={32} grad="teal-sky" />
            <div className="risk-meta">
              <div className="risk-name">{c.name}</div>
              <div className="risk-sub">{c.connsOk}/{c.conns} conexões · {c.openCards} novos</div>
            </div>
            <StatusPill status={c.health} label={c.health === "err" ? "falha" : "atraso"} />
          </button>
        ))}
      </div>
    </div>
  );
}

function ActivityFeed({ go }) {
  const ICONS = { trigger: "Database", conn: "Activity", client: "Building", user: "Users", billing: "Card" };
  return (
    <div className="panel">
      <div className="panel-head">
        <div className="panel-title">Atividade recente</div>
        <button className="link-btn" onClick={() => go("logs")}>Logs completos <I.ChevronRight size={12} /></button>
      </div>
      <div className="feed">
        {LOGS.slice(0, 6).map(l => {
          const Icon = I[ICONS[l.type]] || I.Dot;
          return (
            <div key={l.id} className="feed-row">
              <span className={"feed-ic lvl-" + l.level}><Icon size={13} /></span>
              <span className="feed-txt">
                <b>{l.actor}</b> {l.action} <span className="feed-target">{l.target}</span>
              </span>
              <span className="feed-time">{l.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Overview({ go, period, setPeriod }) {
  return (
    <div className="page">
      <Topbar title="Visão geral" sub="Saúde do sistema · todos os clientes">
        <div className="seg-pill">
          {["24 h", "7 dias", "30 dias"].map(p => (
            <button key={p} className={period === p ? "active" : ""} onClick={() => setPeriod(p)}>{p}</button>
          ))}
        </div>
        <button className="icon-btn" title="Atualizar"><I.Refresh size={16} /></button>
      </Topbar>

      <div className="tiles-grid">
        {SYS.tiles.map(t => <StatTile key={t.id} tile={t} />)}
      </div>

      <OperatorSummary />

      <div className="ov-grid">
        <div className="ov-col">
          <StateFunnel />
          <VectorVolume />
        </div>
        <div className="ov-col">
          <ConnHealth />
          <ClientsAtRisk go={go} />
        </div>
      </div>

      <ActivityFeed go={go} />
    </div>
  );
}

window.Overview = Overview;
