import { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { I } from '../../icons/index.jsx';
import { Avatar, SevTag, VectorChip, Sparkline, Narrative, SEV_COLOR } from '../../components/shared.jsx';
import { TweaksPanel, TweakSection, TweakRadio, useTweaks } from '../../components/TweaksPanel/index.jsx';
import MobileHeader from '../../components/MobileHeader.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { CARDS, USER, VECTORS, SEV_LABEL } from '../../data/mockData.js';
import '../../styles/board.css';

const TWEAK_DEFAULTS = { theme: "light", density: "regular", blocosSecundarios: "colapsados" };

const COLUMNS = [
  { state: "open",        title: "Novos",        dot: "novos" },
  { state: "in_progress", title: "Em andamento", dot: "andamento" },
  { state: "resolved",    title: "Resolvidos",   dot: "resolvido" },
  { state: "ignored",     title: "Ignorados",    dot: "ignorado" },
];

const SEV_CHIPS = [
  { sev: "critico",      label: "Crítico" },
  { sev: "alto",         label: "Alto" },
  { sev: "medio",        label: "Médio" },
  { sev: "oportunidade", label: "Oportunidade" },
];

export default function Board() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [cards, setCards] = useState(() => CARDS.map(c => ({ ...c })));
  const [sevFilter, setSevFilter] = useState(null);
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState(null);
  const [dragId, setDragId] = useState(null);
  const [dropState, setDropState] = useState(null);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.dataset.theme = t.theme;
    document.documentElement.dataset.density = t.density;
  }, [t.theme, t.density]);

  useEffect(() => {
    const id = new URLSearchParams(location.search).get("card");
    if (id) setOpenId(id);
  }, [location.search]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setOpenId(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const visible = useMemo(() => cards.filter(c => {
    if (sevFilter && c.severity !== sevFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!(c.headline.toLowerCase().includes(q) || c.trigger_id.toLowerCase().includes(q) || c.platform.toLowerCase().includes(q))) return false;
    }
    return true;
  }), [cards, sevFilter, search]);

  const byState = (st) => visible.filter(c => c.state === st);
  const openCount = cards.filter(c => c.state === "open").length;
  const openCard = openId ? cards.find(c => c.id === openId) : null;

  const moveCard = (id, toState) => {
    setCards(prev => prev.map(c => {
      if (c.id !== id) return c;
      const next = { ...c, state: toState };
      if (toState === "in_progress" && !next.assignee) next.assignee = { name: USER.name, initials: USER.initials };
      return next;
    }));
  };

  const onDrop = (toState) => {
    if (dragId) moveCard(dragId, toState);
    setDragId(null); setDropState(null);
  };

  return (
    <div className="app">
      <MobileHeader title="Alertas" />
      <Sidebar />

      <main className="main">
        <div className="topbar">
          <div>
            <h1>Alertas</h1>
            <div className="topbar-sub">
              {openCount} em aberto · {cards.filter(c => c.severity === "critico" && c.state !== "resolved" && c.state !== "ignored").length} crítico · arraste os cards entre as colunas
            </div>
          </div>
          <div className="topbar-actions">
            <span className="live-text"><span className="live-dot" /> ao vivo</span>
            <button className="btn-primary-pill"><I.Sparkle size={13} sw={2.2} /> Perguntar ao Pilot</button>
          </div>
        </div>

        <div className="board-toolbar">
          <div className="search-input">
            <I.Search size={14} style={{ color: "var(--ink-4)" }} />
            <input type="text" placeholder="Buscar por headline, gatilho ou plataforma…"
                   value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <span style={{ fontSize: 11.5, color: "var(--ink-3)", fontWeight: 500 }}>Severidade</span>
          {SEV_CHIPS.map(s => (
            <button key={s.sev} data-sev={s.sev}
                    className={"chip" + (sevFilter === s.sev ? " active" : "")}
                    onClick={() => setSevFilter(sevFilter === s.sev ? null : s.sev)}>
              <span className="cdot" style={{ background: SEV_COLOR[s.sev] }} />{s.label}
            </button>
          ))}
          {sevFilter && (
            <button className="chip" onClick={() => setSevFilter(null)}>
              <I.Close size={11} /> limpar
            </button>
          )}
        </div>

        <div className="board">
          {COLUMNS.map(col => {
            const list = byState(col.state);
            return (
              <div key={col.state}
                   className={"column" + (dropState === col.state ? " drop-target" : "")}
                   onDragOver={(e) => { e.preventDefault(); if (dropState !== col.state) setDropState(col.state); }}
                   onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDropState(s => s === col.state ? null : s); }}
                   onDrop={() => onDrop(col.state)}>
                <div className="col-head">
                  <span className={"col-dot " + col.dot} />
                  <span className="col-title">{col.title}</span>
                  <span className="col-count">{list.length}</span>
                </div>
                <div className="col-list">
                  {list.map(c => (
                    <BoardCard key={c.id} card={c}
                               dragging={dragId === c.id}
                               onDragStart={() => setDragId(c.id)}
                               onDragEnd={() => { setDragId(null); setDropState(null); }}
                               onClick={() => setOpenId(c.id)} />
                  ))}
                  {list.length === 0 && (
                    <div className="col-empty">
                      {col.state === "open" ? "Nenhum alerta novo agora." :
                       col.state === "in_progress" ? "Nada em andamento." :
                       col.state === "resolved" ? "Nenhum resolvido ainda." : "Nada ignorado."}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <div className={"scrim" + (openCard ? " open" : "")} onClick={() => setOpenId(null)} />
      <DetailPanel card={openCard} defaultOpen={t.blocosSecundarios === "abertos"}
                   onClose={() => setOpenId(null)}
                   onAssumir={() => openCard && moveCard(openCard.id, "in_progress")}
                   onResolver={() => { openCard && moveCard(openCard.id, "resolved"); setOpenId(null); }}
                   onSoneca={() => { openCard && moveCard(openCard.id, "ignored"); setOpenId(null); }} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Aparência" />
        <TweakRadio label="Tema" value={t.theme} options={["light", "dark"]} onChange={(v) => setTweak("theme", v)} />
        <TweakRadio label="Densidade" value={t.density} options={["compact", "regular", "comfy"]} onChange={(v) => setTweak("density", v)} />
        <TweakSection label="Card detalhe" />
        <TweakRadio label="Blocos secundários" value={t.blocosSecundarios}
                    options={[{ value: "colapsados", label: "Colapsados" }, { value: "abertos", label: "Abertos" }]}
                    onChange={(v) => setTweak("blocosSecundarios", v)} />
      </TweaksPanel>
    </div>
  );
}

function BoardCard({ card, dragging, onDragStart, onDragEnd, onClick }) {
  const muted = card.state === "ignored";
  return (
    <article className={"kard" + (dragging ? " dragging" : "") + (muted ? " muted" : "")}
             data-sev={card.severity} draggable
             onDragStart={onDragStart} onDragEnd={onDragEnd} onClick={onClick}
             role="button" tabIndex="0">
      <div className="kard-top">
        <SevTag sev={card.severity} glyph />
        <span className="kard-spacer" />
        {card.state === "in_progress" && card.assignee &&
          <Avatar initials={card.assignee.initials} size={22} grad="indigo-violet" />}
        {card.state === "resolved" && card.outcome &&
          <span className={"seal " + (card.outcome.status === "sucesso" ? "apurado" : card.outcome.status === "parcial" ? "parcial" : "apurando")}>
            {card.outcome.status === "sucesso" ? <><I.Check size={11} sw={2.4} /> apurado</>
             : card.outcome.status === "parcial" ? <><I.Triangle size={11} /> parcial</>
             : <><I.Clock size={11} /> apurando</>}
          </span>}
      </div>
      <h3 className="kard-title">{card.headline}</h3>
      {card.vector && <div style={{ margin: "2px 0 8px" }}><VectorChip vector={card.vector} /></div>}
      <div className="kard-foot">
        <span className="meta-chip">{card.trigger_id}</span>
        <span className="meta-src">{card.platform}</span>
        {card.state === "ignored"
          ? <span className="ignore-mark">
              {card.ignoreKind === "snooze"
                ? <><I.Snooze size={12} /> <span className="em">{card.snooze.label}</span> · {card.snooze.returns}</>
                : <><I.EyeOff size={12} /> <span className="em">{card.dismissed.label}</span> · {card.dismissed.reason}</>}
            </span>
          : <span className="kard-time">{card.timeAgo}</span>}
      </div>
    </article>
  );
}

function personaLine() {
  let p = {};
  try { p = JSON.parse(localStorage.getItem("ecp_persona")) || {}; } catch (e) {}
  const role_type = p.role_type || USER.role_type;
  const experience_level = p.experience_level || USER.experience_level;
  const role = { performance_marketer: "performance marketer sênior", growth: "growth lead", founder: "fundador(a)", analyst: "analista de dados" }[role_type] || "gestor de e-commerce";
  const lvl = { advanced: "avançado — pode usar termos técnicos (ROAS, MER, CAC, atribuição, incrementalidade) sem explicar o básico", intermediate: "intermediário — explique siglas na primeira menção", beginner: "iniciante — evite jargão, explique tudo em linguagem simples" }[experience_level] || "intermediário";
  return { role, lvl };
}

function renderRich(text) {
  return text.split(/\n{2,}/).map((para, i) => {
    const html = para
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br/>");
    return <p key={i} dangerouslySetInnerHTML={{ __html: html }} />;
  });
}

function Advisor({ card }) {
  const [on, setOn] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const threadRef = useRef(null);
  const vec = card.vector ? (VECTORS[card.vector] || {}).label : null;

  useEffect(() => {
    if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [msgs, busy]);

  const suggestions = [
    "Por que isso aconteceu?",
    "Qual a primeira ação prática?",
    "Como mensuro se resolveu?",
    card.impact && card.impact.value !== "—" ? "Vale priorizar agora?" : "Isso é urgente?",
  ];

  async function ask(question) {
    if (!question.trim() || busy) return;
    const { role, lvl } = personaLine();
    const history = [...msgs, { role: "user", text: question }];
    setMsgs(history); setDraft(""); setBusy(true); setErr(null);

    const context = [
      `Você é o Conselheiro IA do ecommPilot, um copiloto de e-commerce. Fale em português do Brasil, com tom direto, prático e confiável — nada de floreio.`,
      `Seu interlocutor é ${USER.name}, ${role}. Nível: ${lvl}.`,
      `Responda curto (no máx. ~110 palavras). Use **negrito** para destacar a ação ou número-chave. Nunca invente dados além dos do alerta.`,
      ``,
      `ALERTA EM ANÁLISE:`,
      `• Severidade: ${SEV_LABEL[card.severity]}`,
      `• Gatilho: ${card.trigger_id} (${card.platform})`,
      vec ? `• Vetor de crescimento: ${vec}` : null,
      `• Título: ${card.headline}`,
      card.subline ? `• Contexto: ${card.subline}` : null,
      card.hypothesis ? `• Hipótese do sistema (confiança ${card.hypothesis.confidence}): ${card.hypothesis.text}` : null,
      card.firstAction ? `• Primeira ação sugerida: ${card.firstAction.text} (dono: ${card.firstAction.owner}, prazo: ${card.firstAction.eta})` : null,
      card.impact && card.impact.value !== "—" ? `• Impacto estimado: ${card.impact.value}` : null,
      ``,
      `CONVERSA:`,
      ...history.map(m => `${m.role === "user" ? USER.name : "Conselheiro"}: ${m.text}`),
      `Conselheiro:`,
    ].filter(Boolean).join("\n");

    try {
      const reply = await window.claude.complete(context);
      setMsgs(m => [...m, { role: "ai", text: (reply || "").trim() || "Não consegui formular uma resposta agora." }]);
    } catch (e) {
      setErr("Não consegui falar com a IA agora. Tente de novo.");
      setMsgs(m => m.slice(0, -1));
    } finally { setBusy(false); }
  }

  const { role } = personaLine();

  return (
    <div className={"advisor" + (on ? " on" : "")}>
      <button className="advisor-head" onClick={() => setOn(v => !v)}>
        <span className="advisor-spark"><I.Sparkles size={17} /></span>
        <span className="ad-tt">
          <span className="ad-name">Conselheiro IA <span className="live">ao vivo</span></span>
          <span className="ad-sub">{on ? "Pergunte sobre este alerta" : "Tire dúvidas sobre este alerta com a IA"}</span>
        </span>
        <I.ChevronRight size={16} className="chev" />
      </button>
      <div className="advisor-body">
        <div className="ad-persona">
          <span className="pchip"><I.Users size={11} /> {role}</span>
          {vec && <span className="pchip"><I.Sparkles size={11} /> {vec}</span>}
          <span className="pchip"><I.Sparkles size={11} /> respostas calibradas</span>
        </div>
        <div className="ad-thread" ref={threadRef}>
          {msgs.length === 0 && !busy && (
            <div className="ad-msg ai">
              <span className="ad-ava ai"><I.Sparkles size={13} /></span>
              <div className="ad-bubble">{renderRich(`Oi, ${USER.name.split(" ")[0]}. Li este alerta inteiro — **hipótese, primeira ação e impacto**. Pergunte o que quiser, ou escolha um atalho abaixo.`)}</div>
            </div>
          )}
          {msgs.map((m, i) => (
            <div key={i} className={"ad-msg " + m.role}>
              {m.role === "ai"
                ? <span className="ad-ava ai"><I.Sparkles size={13} /></span>
                : <Avatar initials={USER.initials} size={26} grad="amber-rose" />}
              <div className="ad-bubble">{renderRich(m.text)}</div>
            </div>
          ))}
          {busy && (
            <div className="ad-msg ai">
              <span className="ad-ava ai"><I.Sparkles size={13} /></span>
              <div className="ad-bubble"><span className="ad-typing"><i></i><i></i><i></i></span></div>
            </div>
          )}
        </div>
        {err && <div className="ad-err">{err}</div>}
        {msgs.length === 0 && !busy && (
          <div className="ad-chips">
            {suggestions.map((s, i) => <button key={i} className="ad-chip" onClick={() => ask(s)}>{s}</button>)}
          </div>
        )}
        <form className="ad-form" onSubmit={e => { e.preventDefault(); ask(draft); }}>
          <input className="ad-input" value={draft} onChange={e => setDraft(e.target.value)}
                 placeholder="Pergunte ao Conselheiro…" disabled={busy} />
          <button className="ad-send" type="submit" disabled={busy || !draft.trim()} aria-label="Enviar"><I.Send size={15} /></button>
        </form>
      </div>
    </div>
  );
}

function DetailPanel({ card, defaultOpen, onClose, onAssumir, onResolver, onSoneca }) {
  const open = !!card;
  return (
    <aside className={"panel" + (open ? " open" : "")} aria-hidden={!open}>
      {card && <DetailContent key={card.id + ":" + defaultOpen} card={card} defaultOpen={defaultOpen}
                              onClose={onClose} onAssumir={onAssumir} onResolver={onResolver} onSoneca={onSoneca} />}
    </aside>
  );
}

function DetailContent({ card, defaultOpen, onClose, onAssumir, onResolver, onSoneca }) {
  const [open48, setOpen48] = useState(defaultOpen);
  const [openAlt, setOpenAlt] = useState(defaultOpen);
  const inProgress = card.state === "in_progress";
  const impactNeutral = !card.impact || card.impact.value === "—";

  return (
    <>
      <div className="panel-header">
        <SevTag sev={card.severity} glyph />
        <span className="meta-chip">{card.trigger_id}</span>
        {card.vector && <VectorChip vector={card.vector} />}
        <span className="meta-src">{card.platform}</span>
        <span className="meta-dot" />
        <span className="meta-time">{card.timeAgo}</span>
        <button className="panel-close" onClick={onClose} aria-label="Fechar"><I.Close size={14} /></button>
      </div>

      <div className="panel-body">
        <div style={{ marginBottom: 18 }}>
          {inProgress && card.assignee
            ? <span className="assignee-line"><Avatar initials={card.assignee.initials} size={20} grad="indigo-violet" /> Em andamento com {card.assignee.name}</span>
            : <button className="assumir-btn" onClick={onAssumir}><I.Hand size={13} /> Assumir alerta</button>}
        </div>

        <h2 className="detail-headline">{card.headline}</h2>
        <Narrative text={card.subline} dir={card.dir} className="detail-sub" />

        <section className="d-section">
          <div className="d-label">Hipótese principal
            <span className="conf-badge" data-conf={card.hypothesis.confidence}>confiança {card.hypothesis.confidence}</span>
          </div>
          <div className="hypothesis">
            <Sparkline series={card.series} domain={card.domain} width={180} height={30}
                       stroke={SEV_COLOR[card.severity]} fill={SEV_COLOR[card.severity]} />
            <p>{card.hypothesis.text}</p>
          </div>
        </section>

        <section className="d-section">
          <div className="d-label fa-label">Primeira ação</div>
          <div className="first-action">
            <p className="fa-action">{card.firstAction.text}</p>
            <div className="fa-meta">
              <div className="fa-cell">
                <div className="k"><I.User size={11} /> dono sugerido</div>
                <div className="v">{card.firstAction.owner}</div>
              </div>
              <div className="fa-cell">
                <div className="k"><I.Clock size={11} /> estimativa</div>
                <div className="v">{card.firstAction.eta}</div>
              </div>
            </div>
            <button className="fa-cta">Iniciar primeira ação <I.ArrowRight size={13} /></button>
          </div>
        </section>

        {card.followUps && card.followUps.length > 0 && (
          <div className={"collapse" + (open48 ? " open" : "")}>
            <button className="collapse-head" onClick={() => setOpen48(v => !v)}>
              <I.Clock size={14} style={{ color: "var(--ink-4)" }} /> Se não resolver em 48h
              <span className="collapse-count">{card.followUps.length}</span>
              <I.ChevronRight size={15} className="chev" />
            </button>
            <div className="collapse-body">
              {card.followUps.map((f, i) => (
                <div key={i} className="followup"><span className="dot" />{f}</div>
              ))}
            </div>
          </div>
        )}

        {card.altCauses && card.altCauses.length > 0 && (
          <div className={"collapse" + (openAlt ? " open" : "")}>
            <button className="collapse-head" onClick={() => setOpenAlt(v => !v)}>
              <I.Filter size={14} style={{ color: "var(--ink-4)" }} /> Causas alternativas
              <span className="collapse-count">{card.altCauses.length}</span>
              <I.ChevronRight size={15} className="chev" />
            </button>
            <div className="collapse-body">
              {card.altCauses.map((c, i) => (
                <div key={i} className="altcause">
                  <span className="conf-badge" data-conf={c.confidence}>{c.confidence}</span>
                  <span>{c.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <section className="d-section">
          <Advisor card={card} />
        </section>
      </div>

      <div className="panel-footer">
        <div className="impact">
          <span className="k">{impactNeutral ? "impacto" : "impacto estimado"}</span>
          <span className={"v" + (impactNeutral ? " neutral" : "")}>{card.impact ? card.impact.value : "—"}</span>
        </div>
        <div className="footer-btns">
          {card.state !== "ignored" && <button className="btn-ghost" onClick={onSoneca}><I.Snooze size={13} /> Soneca</button>}
          {card.state !== "resolved"
            ? <button className="btn-solid" onClick={onResolver}><I.Check size={13} sw={2.4} /> Resolver</button>
            : <button className="btn-ghost" onClick={onClose}><I.Check size={13} sw={2.4} /> Resolvido</button>}
        </div>
      </div>
    </>
  );
}
