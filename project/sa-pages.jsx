// EcommPilot Ops — seções: Clientes, Usuários, Triggers, Conexões, Faturamento, Logs.

function Toolbar({ q, setQ, placeholder, children }) {
  return (
    <div className="toolbar">
      <div className="search">
        <I.Search size={15} />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder={placeholder || "Buscar…"} />
      </div>
      <div className="toolbar-right">{children}</div>
    </div>
  );
}

function Chips({ opts, value, onChange }) {
  return (
    <div className="chips">
      {opts.map(o => (
        <button key={o.v} className={"chip" + (value === o.v ? " on" : "")} onClick={() => onChange(o.v)}>{o.label}</button>
      ))}
    </div>
  );
}

const PLAN_TINT = { Starter: "slate", Growth: "violet", Scale: "teal" };

// ── Clientes ────────────────────────────────────────────────
function Clients() {
  const [q, setQ] = useState("");
  const [plan, setPlan] = useState("all");
  const rows = CLIENTS.filter(c =>
    (plan === "all" || c.plan === plan) &&
    (c.name.toLowerCase().includes(q.toLowerCase()) || c.account_ref.includes(q.toLowerCase())));
  return (
    <div className="page">
      <Topbar title="Clientes" sub={`${CLIENTS.length} contas · ${CLIENTS.filter(c=>c.status==="ativo").length} ativas`}>
        <button className="btn-primary"><I.Plus size={15} /> Novo cliente</button>
      </Topbar>
      <Toolbar q={q} setQ={setQ} placeholder="Buscar por nome ou domínio…">
        <Chips value={plan} onChange={setPlan} opts={[{v:"all",label:"Todos"},{v:"Starter",label:"Starter"},{v:"Growth",label:"Growth"},{v:"Scale",label:"Scale"}]} />
      </Toolbar>
      <div className="card-table">
        <table className="tbl">
          <thead><tr>
            <th>Cliente</th><th>Plano</th><th>Status</th><th className="num">MRR</th>
            <th className="num">Cards 7d</th><th className="num">Acerto</th><th>Conexões</th><th>Responsável</th><th></th>
          </tr></thead>
          <tbody>
            {rows.map(c => (
              <tr key={c.id}>
                <td><div className="cell-client"><Avatar initials={initialsOf(c.name)} size={32} grad="teal-sky" />
                  <div><div className="ct-name">{c.name}</div><div className="ct-sub">{c.account_ref}</div></div></div></td>
                <td><span className={"plan-tag pt-" + PLAN_TINT[c.plan]}>{c.plan}</span></td>
                <td><StatusPill status={c.status} /></td>
                <td className="num mono">{c.mrr ? brl(c.mrr) : "—"}</td>
                <td className="num mono">{c.cards7d}</td>
                <td className="num"><span className="acerto" data-good={c.acerto >= 80}>{c.acerto}%</span></td>
                <td><span className={"conn-frac" + (c.connsOk < c.conns ? " warn" : "")}><I.Activity size={12} /> {c.connsOk}/{c.conns}</span></td>
                <td className="muted-cell">{c.owner}</td>
                <td><button className="row-go"><I.ChevronRight size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Usuários ────────────────────────────────────────────────
function Users() {
  const [q, setQ] = useState("");
  const rows = USERS.filter(u => u.name.toLowerCase().includes(q.toLowerCase()) || u.email.includes(q.toLowerCase()) || u.client.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="page">
      <Topbar title="Usuários" sub={`${USERS.length} contas · auth_users`}>
        <button className="btn-primary"><I.Plus size={15} /> Convidar usuário</button>
      </Topbar>
      <Toolbar q={q} setQ={setQ} placeholder="Buscar por nome, email ou cliente…" />
      <div className="card-table">
        <table className="tbl">
          <thead><tr><th>Usuário</th><th>Papel</th><th>Persona</th><th>Experiência</th><th>Cliente</th><th>Última atividade</th><th>Status</th></tr></thead>
          <tbody>
            {rows.map(u => (
              <tr key={u.id}>
                <td><div className="cell-client"><Avatar initials={initialsOf(u.name)} size={32} grad={u.role==="Superadmin"?"indigo-violet":"amber-rose"} />
                  <div><div className="ct-name">{u.name}</div><div className="ct-sub">{u.email}</div></div></div></td>
                <td>{u.role === "Superadmin"
                  ? <span className="role-super"><I.Shield size={12} /> Superadmin</span>
                  : <span className="role-plain">{u.role}</span>}</td>
                <td className="muted-cell">{ROLE_TYPE_LABEL[u.role_type]}</td>
                <td><span className="exp-tag" data-exp={u.exp}>{EXP_LABEL[u.exp]}</span></td>
                <td className="muted-cell">{u.client}</td>
                <td className="muted-cell">{u.lastActive}</td>
                <td><StatusPill status={u.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Triggers (catálogo) + detalhe ───────────────────────────
function TriggerDrawer({ trig, onClose }) {
  if (!trig) return null;
  return (
    <div className="drawer-scrim" onClick={e => { if (e.target.classList.contains("drawer-scrim")) onClose(); }}>
      <div className="drawer">
        <div className="drawer-head">
          <div>
            <div className="dh-id mono">{trig.trigger_id} <span className="ver">{trig.version}</span></div>
            <h2 className="dh-name">{trig.name}</h2>
          </div>
          <button className="icon-btn" onClick={onClose}><I.Close size={16} /></button>
        </div>
        <div className="drawer-body">
          <div className="dr-meta">
            <div className="dm-item"><span className="dm-k">Severidade</span><SevTag sev={trig.severity} /></div>
            <div className="dm-item"><span className="dm-k">Vetor</span><VectorChip vector={trig.vector} /></div>
            <div className="dm-item"><span className="dm-k">Tipo</span><span className="dm-v">{trig.alert_type}</span></div>
            <div className="dm-item"><span className="dm-k">Status</span><StatusPill status={trig.status} label={TRIG_STATUS_LABEL[trig.status]} /></div>
            <div className="dm-item"><span className="dm-k">Disparos 7d</span><span className="dm-v mono">{trig.fires7d}</span></div>
          </div>

          <div className="dr-section">
            <div className="dr-label"><I.Code size={13} /> SQL de detecção <span className="ro">somente leitura</span></div>
            <pre className="code-block">{trig.sql}</pre>
          </div>

          <div className="dr-section">
            <div className="dr-label"><I.Sparkles size={13} /> Template de fallback</div>
            <div className="template">{trig.fallback}</div>
            <p className="dr-note">Usado quando a IA não consegue humanizar o card. Variáveis entre {"{ }"} são preenchidas pelo engine.</p>
          </div>
        </div>
        <div className="drawer-foot">
          <button className="btn-ghost">{trig.status === "ativo" ? <><I.Pause size={14} /> Pausar</> : <><I.Check size={14} /> Ativar</>}</button>
          <button className="btn-primary"><I.Code size={14} /> Editar regra</button>
        </div>
      </div>
    </div>
  );
}

function Triggers() {
  const [q, setQ] = useState("");
  const [vec, setVec] = useState("all");
  const [open, setOpen] = useState(null);
  const rows = TRIGGERS.filter(t =>
    (vec === "all" || t.vector === vec) &&
    (t.trigger_id.toLowerCase().includes(q.toLowerCase()) || t.name.toLowerCase().includes(q.toLowerCase())));
  const vecOpts = [{ v: "all", label: "Todos os vetores" }, ...VECTOR_ORDER.map(v => ({ v, label: VECTORS[v].label }))];
  return (
    <div className="page">
      <Topbar title="Catálogo de triggers" sub={`${TRIGGERS.length} regras · ${TRIGGERS.filter(t=>t.status==="ativo").length} ativas`}>
        <button className="btn-primary"><I.Plus size={15} /> Nova regra</button>
      </Topbar>
      <Toolbar q={q} setQ={setQ} placeholder="Buscar por ID ou nome…">
        <select className="select" value={vec} onChange={e => setVec(e.target.value)}>
          {vecOpts.map(o => <option key={o.v} value={o.v}>{o.label}</option>)}
        </select>
      </Toolbar>
      <div className="card-table">
        <table className="tbl">
          <thead><tr><th>ID</th><th>Regra</th><th>Vetor</th><th>Severidade</th><th>Versão</th><th className="num">Disparos 7d</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {rows.map(t => (
              <tr key={t.trigger_id} className="clickable" onClick={() => setOpen(t)}>
                <td className="mono trig-id">{t.trigger_id}</td>
                <td className="trig-name">{t.name}</td>
                <td><VectorChip vector={t.vector} /></td>
                <td><SevTag sev={t.severity} /></td>
                <td className="mono muted-cell">{t.version}</td>
                <td className="num mono">{t.fires7d || "—"}</td>
                <td><StatusPill status={t.status} label={TRIG_STATUS_LABEL[t.status]} /></td>
                <td><button className="row-go"><I.ChevronRight size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TriggerDrawer trig={open} onClose={() => setOpen(null)} />
    </div>
  );
}

// ── Saúde das conexões ──────────────────────────────────────
function Conns() {
  const [status, setStatus] = useState("all");
  const order = { erro: 0, atraso: 1, ok: 2 };
  const rows = CONN_ROWS.filter(c => status === "all" || c.status === status).sort((a, b) => order[a.status] - order[b.status]);
  const counts = { erro: CONN_ROWS.filter(c=>c.status==="erro").length, atraso: CONN_ROWS.filter(c=>c.status==="atraso").length, ok: CONN_ROWS.filter(c=>c.status==="ok").length };
  return (
    <div className="page">
      <Topbar title="Saúde das conexões" sub="Fonte única do status · todas as contas">
        <button className="icon-btn" title="Atualizar"><I.Refresh size={16} /></button>
      </Topbar>
      <Toolbar q="" setQ={()=>{}} placeholder="">
        <Chips value={status} onChange={setStatus} opts={[
          {v:"all",label:"Todas"},
          {v:"erro",label:`Com falha · ${counts.erro}`},
          {v:"atraso",label:`Em atraso · ${counts.atraso}`},
          {v:"ok",label:`Saudáveis · ${counts.ok}`},
        ]} />
      </Toolbar>
      <div className="card-table">
        <table className="tbl">
          <thead><tr><th>Cliente</th><th>Plataforma</th><th>Vetor</th><th>Acesso</th><th>Última sync</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {rows.map((c, i) => (
              <tr key={i}>
                <td className="ct-name">{c.client}</td>
                <td>{c.platform}</td>
                <td><VectorChip vector={c.vector} /></td>
                <td className="muted-cell">{c.access}</td>
                <td className="mono muted-cell">{c.last_sync}</td>
                <td><StatusPill status={c.status} label={c.status === "ok" ? "conectado" : c.status === "atraso" ? "atraso" : "falha"} /></td>
                <td>{c.status !== "ok"
                  ? <button className="btn-mini"><I.Refresh size={12} /> Reconectar</button>
                  : <button className="row-go"><I.ChevronRight size={16} /></button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Faturamento ─────────────────────────────────────────────
function Billing() {
  const STAT = [
    { label: "MRR", value: brl(BILLING.mrr), tint: "teal" },
    { label: "ARR projetado", value: brl(BILLING.arr), tint: "violet" },
    { label: "ARPA", value: brl(BILLING.arpa), tint: "indigo" },
    { label: "Churn mensal", value: BILLING.churn + "%", tint: "amber" },
  ];
  return (
    <div className="page">
      <Topbar title="Faturamento" sub="Planos, receita e faturas">
        <button className="btn-ghost"><I.ExternalLink size={14} /> Abrir no Stripe</button>
      </Topbar>
      <div className="bill-stats">
        {STAT.map(s => (
          <div key={s.label} className="bstat">
            <div className="bstat-val" style={{ color: "var(--" + s.tint + ")" }}>{s.value}</div>
            <div className="bstat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="bill-grid">
        <div className="panel">
          <div className="panel-head"><div className="panel-title">Distribuição por plano</div></div>
          <div className="plan-list">
            {BILLING.plans.map(p => (
              <div key={p.plan} className="plan-row">
                <span className={"plan-tag pt-" + p.tint}>{p.plan}</span>
                <span className="plan-price mono">{brl(p.price)}/mês</span>
                <div className="plan-bar-track"><div className="plan-bar" style={{ width: (p.clients / 24 * 100) + "%", background: "var(--" + p.tint + ")" }} /></div>
                <span className="plan-count mono">{p.clients}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><div className="panel-title">Faturas recentes</div></div>
          <div className="card-table flush">
            <table className="tbl">
              <thead><tr><th>Fatura</th><th>Cliente</th><th className="num">Valor</th><th>Venc.</th><th>Status</th></tr></thead>
              <tbody>
                {BILLING.invoices.map(inv => (
                  <tr key={inv.id}>
                    <td className="mono trig-id">{inv.id}</td>
                    <td>{inv.client}</td>
                    <td className="num mono">{brl(inv.amount)}</td>
                    <td className="muted-cell">{inv.date}</td>
                    <td><StatusPill status={inv.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Logs / auditoria ────────────────────────────────────────
function Logs() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const rows = LOGS.filter(l => (type === "all" || l.type === type) &&
    (l.actor.toLowerCase().includes(q.toLowerCase()) || l.target.toLowerCase().includes(q.toLowerCase()) || l.action.includes(q.toLowerCase())));
  const ICONS = { trigger: "Database", conn: "Activity", client: "Building", user: "Users", billing: "Card" };
  return (
    <div className="page">
      <Topbar title="Logs & auditoria" sub="Eventos do sistema e de operadores">
        <button className="btn-ghost"><I.ExternalLink size={14} /> Exportar</button>
      </Topbar>
      <Toolbar q={q} setQ={setQ} placeholder="Buscar por ator, ação ou alvo…">
        <Chips value={type} onChange={setType} opts={[
          {v:"all",label:"Tudo"},{v:"trigger",label:"Triggers"},{v:"conn",label:"Conexões"},
          {v:"client",label:"Clientes"},{v:"user",label:"Usuários"},{v:"billing",label:"Faturamento"},
        ]} />
      </Toolbar>
      <div className="card-table">
        <table className="tbl">
          <tbody>
            {rows.map(l => {
              const Icon = I[ICONS[l.type]] || I.Dot;
              return (
                <tr key={l.id} className="log-row">
                  <td style={{ width: 44 }}><span className={"feed-ic lvl-" + l.level}><Icon size={13} /></span></td>
                  <td><span className="log-actor">{l.actor}</span> <span className="log-action">{l.action}</span></td>
                  <td className="log-target mono">{l.target}</td>
                  <td className="num muted-cell" style={{ width: 110 }}>{l.time}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

Object.assign(window, { Clients, Users, Triggers, Conns, Billing, Logs });
