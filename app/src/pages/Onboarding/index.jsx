import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { I } from '../../icons/index.jsx';
import { CLIENT } from '../../data/mockData.js';
import '../../styles/onboarding.css';

const NOTE_MAX = 280;

const OBJETIVOS = [
  { value: "escalar_receita", icon: "Rocket",   name: "Escalar receita", desc: "Crescer volume, mesmo pressionando a eficiência." },
  { value: "proteger_margem", icon: "Shield",   name: "Proteger margem / ROAS", desc: "Eficiência acima de volume." },
  { value: "reduzir_cac",     icon: "Scissors", name: "Reduzir CAC", desc: "Baixar o custo de aquisição." },
  { value: "lancar_produto",  icon: "Launch",   name: "Lançar produto / coleção", desc: "Empurrar um lançamento planejado." },
  { value: "estabilizar",     icon: "Anchor",   name: "Estabilizar após mudança", desc: "Reencontrar o ritmo depois de uma virada." },
];
const RISCOS = [
  { value: 1, name: "Conservador" }, { value: 2, name: "Moderado" },
  { value: 3, name: "Ousado" }, { value: 4, name: "Agressivo" },
];
const DATAS = [
  { value: "black_friday", name: "Black Friday" }, { value: "lancamento", name: "Lançamento" },
  { value: "liquidacao", name: "Liquidação" }, { value: "alta_sazonal", name: "Alta sazonal" },
  { value: "outro", name: "Outro" },
];
const RESTRICOES = [
  { value: "budget_travado", name: "Budget travado" }, { value: "estoque", name: "Problema de estoque" },
  { value: "dependencia_canal", name: "Dependência de um canal" }, { value: "atribuicao_quebrada", name: "Atribuição quebrada" },
  { value: "capi_instavel", name: "CAPI instável" }, { value: "nenhuma", name: "Nenhuma" },
];
const PLATAFORMAS = [{ value: "meta", name: "Meta Ads" }, { value: "google", name: "Google Ads" }, { value: "ga4", name: "GA4" }];
const TICKET = [{ value: "ate_80", name: "até R$ 80" }, { value: "80_200", name: "R$ 80–200" }, { value: "200_500", name: "R$ 200–500" }, { value: "500_mais", name: "R$ 500+" }];
const MARGEM = [{ value: "ate_20", name: "até 20%" }, { value: "20_40", name: "20–40%" }, { value: "40_60", name: "40–60%" }, { value: "60_mais", name: "60%+" }];

function ObjOption({ o, selected, onClick }) {
  const Icon = I[o.icon];
  return (
    <button className={"opt" + (selected ? " sel" : "")} onClick={onClick}>
      <span className="opt-ic"><Icon size={18} sw={1.9} /></span>
      <span className="opt-tt">
        <span className="opt-name">{o.name}</span>
        <span className="opt-desc">{o.desc}</span>
      </span>
    </button>
  );
}
function Chip({ label, selected, onClick }) {
  return (
    <button className={"ob-chip" + (selected ? " sel" : "")} onClick={onClick}>
      <span className="ck"><I.Check size={10} sw={3} /></span>{label}
    </button>
  );
}
function Seg({ opts, value, onPick }) {
  return (
    <div className="seg">
      {opts.map(o => (
        <button key={o.value} className={value === o.value ? "sel" : ""} onClick={() => onPick(o.value)}>{o.name}</button>
      ))}
    </div>
  );
}

// datas salvas guardam {evento, data_inicio, data_fim}; remapeia para o shape do form ({value,...})
function priorDatasToForm(cal) {
  if (!Array.isArray(cal)) return [];
  return cal.map(c => {
    const known = DATAS.find(d => d.name === c.evento);
    return { value: known ? known.value : "outro", evento: c.evento || "", data_inicio: c.data_inicio || "", data_fim: c.data_fim || "" };
  });
}

export default function Onboarding() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  // Modo: novo cliente (primeiro acesso) vs. revisão (reabre pré-preenchido, versiona)
  const REVISAR = params.get("revisar") === "1";
  const PRIOR = (() => { try { return JSON.parse(localStorage.getItem("ecp_context")); } catch (e) { return null; } })();
  const seed = REVISAR && PRIOR ? PRIOR : null;

  const [step, setStep] = useState(1);
  const [objetivo, setObjetivo] = useState(seed?.objetivo_primario ?? null);
  const [risco, setRisco] = useState(seed?.tolerancia_risco ?? 2);
  const [datas, setDatas] = useState(seed ? priorDatasToForm(seed.calendario) : []); // [{value, evento, data_inicio, data_fim}]
  const [restr, setRestr] = useState(seed?.constraints ?? []);
  const [plataforma, setPlataforma] = useState(seed?.plataforma_principal ?? "meta"); // pré-preenchido das conexões (Meta = principal conectada)
  const [ticket, setTicket] = useState(seed?.ticket_faixa ?? null);
  const [margem, setMargem] = useState(seed?.margem_faixa ?? null);
  const [note, setNote] = useState(seed?.context_note ?? "");

  // o onboarding é tela cheia, sem o tema escuro do shell — mantém o tema salvo, mas força densidade regular
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.dataset.density;
    html.dataset.density = "regular";
    return () => { if (prev) html.dataset.density = prev; };
  }, []);

  const toggleData = (o) => setDatas(prev => prev.find(d => d.value === o.value)
    ? prev.filter(d => d.value !== o.value)
    : [...prev, { value: o.value, evento: o.value === "outro" ? "" : o.name, data_inicio: "", data_fim: "" }]);
  const setDataField = (value, field, v) => setDatas(prev => prev.map(d => d.value === value ? { ...d, [field]: v } : d));

  const toggleRestr = (v) => {
    if (v === "nenhuma") { setRestr(restr.includes("nenhuma") ? [] : ["nenhuma"]); return; }
    setRestr(prev => { const base = prev.filter(x => x !== "nenhuma"); return base.includes(v) ? base.filter(x => x !== v) : [...base, v]; });
  };

  const overLimit = note.length > NOTE_MAX;
  const canFinish = ticket && margem && plataforma && !overLimit;

  const finish = () => {
    const now = new Date().toISOString();
    let history = [];
    try { history = JSON.parse(localStorage.getItem("ecp_context_history")) || []; } catch (e) { history = []; }
    // Append-only: a versão ativa nunca é editada — vira superseded e uma nova entra.
    const nextVersion = REVISAR && PRIOR ? (PRIOR.version || history.length || 1) + 1 : 1;
    const ctx = {
      version: nextVersion, status: "active", valid_from: now, valid_until: null,
      objetivo_primario: objetivo, tolerancia_risco: risco, plataforma_principal: plataforma,
      ticket_faixa: ticket, margem_faixa: margem,
      constraints: restr,
      calendario: datas.map(d => ({ evento: d.evento || DATAS.find(x => x.value === d.value)?.name || "Evento", data_inicio: d.data_inicio, data_fim: d.data_fim })),
      context_note: note.trim(),
    };
    let nextHistory;
    if (REVISAR && PRIOR) {
      const superseded = history.map(h => h.version === PRIOR.version ? { ...h, status: "superseded", valid_until: now } : h);
      nextHistory = [...superseded, ctx];
    } else {
      nextHistory = [ctx];
    }
    localStorage.setItem("ecp_context", JSON.stringify(ctx));
    localStorage.setItem("ecp_context_history", JSON.stringify(nextHistory));
    localStorage.setItem("ecp_context_reviewed_at", now);
    navigate(REVISAR ? "/admin" : "/visao-geral");
  };

  return (
    <div className="ob-wrap">
      <div className="ob-shell">
        <div className="ob-top">
          <div className="ob-brand-mark">eP</div>
          <div className="ob-brand-name">EcommPilot<sup>v1</sup></div>
          <div className="ob-steps">
            {[1, 2, 3].map(s => <i key={s} className={s === step ? "on" : s < step ? "done" : ""} />)}
          </div>
        </div>

        {/* ───────────── STEP 1 — objetivo + risco ───────────── */}
        {step === 1 && (
          <div className="ob-card fade">
            <div className="ctx-head">
              <div className="ctx-avatar">{CLIENT.initials}</div>
              <div>
                <div className="ob-eyebrow">{REVISAR ? "Revisar contexto" : "Contexto do negócio"}</div>
                <div className="ctx-store" style={{ marginTop: 4 }}>{REVISAR ? <>Nova versão para <b>{CLIENT.name}</b>{PRIOR ? " · revisando a v" + PRIOR.version : ""}</> : <>Configurando <b>{CLIENT.name}</b> · {CLIENT.account_ref}</>}</div>
              </div>
            </div>
            <h1 className="ob-h">{REVISAR ? "Vamos atualizar o contexto" : "Conte o contexto do seu negócio"}</h1>
            <p className="ob-sub">{REVISAR
              ? "Suas respostas atuais já estão preenchidas. Ajuste o que mudou — ao salvar, criamos uma nova versão sem apagar a anterior. Os cards guardam qual versão usaram."
              : "Isso ajuda a Vera a interpretar seus números do jeito certo — um CPA subindo num lançamento não é o mesmo que num mês estável. Leva 2 minutos e pode ser revisado depois."}</p>

            <div className="q">
              <div className="q-label"><span className="q-num">1</span> Qual o seu objetivo primário no período?</div>
              <div className="q-body">
                <div className="opt-grid">
                  {OBJETIVOS.map(o => <ObjOption key={o.value} o={o} selected={objetivo === o.value} onClick={() => setObjetivo(o.value)} />)}
                </div>
              </div>
            </div>

            <div className="q">
              <div className="q-label"><span className="q-num">2</span> Qual sua tolerância a risco de teste?</div>
              <div className="q-hint">Define o quanto a Vera sugere apostas mais ousadas vs. movimentos seguros.</div>
              <div className="q-body">
                <div className="risk-track">
                  {RISCOS.map(r => (
                    <button key={r.value} className={risco === r.value ? "sel" : ""} onClick={() => setRisco(r.value)}>
                      <div className="risk-bars">
                        {[1, 2, 3, 4].map(b => <i key={b} className={b <= r.value ? "on" : ""} style={{ height: 5 + b * 3 }} />)}
                      </div>
                      <div className="risk-name">{r.name}</div>
                    </button>
                  ))}
                </div>
                <div className="risk-ends"><span>Conservador</span><span>Agressivo</span></div>
              </div>
            </div>

            <div className="ob-foot">
              <span className="step-count">Passo 1 de 3</span>
              <button className="btn-next" disabled={!objetivo} onClick={() => setStep(2)}>Continuar <I.ArrowRight size={16} /></button>
            </div>
          </div>
        )}

        {/* ───────────── STEP 2 — calendário + restrições ───────────── */}
        {step === 2 && (
          <div className="ob-card fade">
            <div className="ob-eyebrow">Contexto do negócio</div>
            <h1 className="ob-h">O momento do seu negócio</h1>
            <p className="ob-sub">O que está no horizonte e o que limita suas jogadas. Pode deixar em branco se nada se aplica agora.</p>

            <div className="q">
              <div className="q-label"><span className="q-num">3</span> Datas críticas no horizonte</div>
              <div className="q-hint">Selecione o que vem aí — a Vera passa a ler picos e quedas nessas janelas com outro olhar.</div>
              <div className="q-body">
                <div className="ob-chips">
                  {DATAS.map(o => <Chip key={o.value} label={o.name} selected={!!datas.find(d => d.value === o.value)} onClick={() => toggleData(o)} />)}
                </div>
                {datas.length > 0 && (
                  <div className="cal-rows">
                    {datas.map(d => (
                      <div key={d.value} className="cal-row">
                        {d.value === "outro" ? (
                          <div className="cal-name-input">
                            <input type="text" placeholder="Nome do evento" value={d.evento} onChange={e => setDataField(d.value, "evento", e.target.value)} />
                          </div>
                        ) : (
                          <div className="cal-evt"><span className="vd" />{DATAS.find(x => x.value === d.value)?.name}</div>
                        )}
                        <div className="cal-dates">
                          <input type="date" value={d.data_inicio} onChange={e => setDataField(d.value, "data_inicio", e.target.value)} />
                          <span>até</span>
                          <input type="date" value={d.data_fim} onChange={e => setDataField(d.value, "data_fim", e.target.value)} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="q">
              <div className="q-label"><span className="q-num">4</span> Restrições conhecidas</div>
              <div className="q-hint">O que a Vera deve assumir como limite ao escrever uma recomendação.</div>
              <div className="q-body">
                <div className="ob-chips">
                  {RESTRICOES.map(o => <Chip key={o.value} label={o.name} selected={restr.includes(o.value)} onClick={() => toggleRestr(o.value)} />)}
                </div>
              </div>
            </div>

            <div className="ob-foot">
              <button className="btn-back" onClick={() => setStep(1)}><I.ArrowLeft size={15} /> Voltar</button>
              <button className="btn-next" onClick={() => setStep(3)}>Continuar <I.ArrowRight size={16} /></button>
            </div>
          </div>
        )}

        {/* ───────────── STEP 3 — faixas + plataforma + nota ───────────── */}
        {step === 3 && (
          <div className="ob-card fade">
            <div className="ob-eyebrow">Contexto do negócio</div>
            <h1 className="ob-h">Faixas e contexto livre</h1>
            <p className="ob-sub">Capturamos só faixas — nunca valores exatos. No fim, um campo aberto para o que o questionário não previu.</p>

            <div className="q">
              <div className="q-label"><span className="q-num">5</span> Plataforma principal</div>
              <div className="q-hint">Pré-preenchida pelas suas conexões. Confirme ou ajuste.</div>
              <div className="q-body"><Seg opts={PLATAFORMAS} value={plataforma} onPick={setPlataforma} /></div>
            </div>

            <div className="q">
              <div className="q-label"><span className="q-num">6</span> Ticket médio aproximado</div>
              <div className="q-body"><Seg opts={TICKET} value={ticket} onPick={setTicket} /></div>
            </div>

            <div className="q">
              <div className="q-label"><span className="q-num">7</span> Margem aproximada</div>
              <div className="q-body"><Seg opts={MARGEM} value={margem} onPick={setMargem} /></div>
            </div>

            <div className="q">
              <div className="q-label"><span className="q-num">8</span> Algo mais que a Vera precisa saber?</div>
              <div className="q-hint">Tem algo do seu negócio que a Vera precisa saber pra interpretar os números do jeito certo?</div>
              <div className="q-body">
                <textarea className="note-area" maxLength={NOTE_MAX + 40}
                  placeholder="Ex.: público majoritariamente masculino 18–24; dependemos de um fornecedor único de moletom; trocamos de gateway mês passado."
                  value={note} onChange={e => setNote(e.target.value)} />
                <div className="note-foot">
                  <div className="note-warn"><I.Lock size={13} /> Não inclua dados pessoais, números de cartão ou nomes de clientes.</div>
                  <div className={"note-count mono" + (overLimit ? " over" : "")}>{note.length}/{NOTE_MAX}</div>
                </div>
              </div>
            </div>

            <div className="priv">
              <I.Shield2 size={14} />
              <span>Tudo isso entra na <b>allowlist</b> tipada que vai à IA — em faixas e enums, versionado a cada revisão. Nada é sobrescrito.</span>
            </div>

            <div className="ob-foot">
              <button className="btn-back" onClick={() => setStep(2)}><I.ArrowLeft size={15} /> Voltar</button>
              <button className="btn-next" disabled={!canFinish} onClick={finish}>{REVISAR ? "Salvar nova versão" : "Concluir e ver meu painel"} <I.ArrowRight size={16} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
