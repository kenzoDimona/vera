import { useState, useEffect, useMemo } from 'react';
import { I } from '../../icons/index.jsx';
import { SevTag, VectorChip } from '../../components/shared.jsx';
import { TweaksPanel, TweakSection, TweakRadio, useTweaks } from '../../components/TweaksPanel/index.jsx';
import MobileHeader from '../../components/MobileHeader.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { CARDS, OUTCOME_STATS } from '../../data/mockData.js';
import '../../styles/resultados.css';

const TWEAK_DEFAULTS = { theme: "light", density: "regular" };

const STATUS_GLYPH = {
  sucesso:  (p) => <I.CircleCheck {...p} />,
  parcial:  (p) => <I.Triangle {...p} />,
  apurando: (p) => <I.Clock {...p} />,
};

export default function Resultados() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    document.documentElement.dataset.theme = t.theme;
    document.documentElement.dataset.density = t.density;
  }, [t.theme, t.density]);

  const apurados = useMemo(() => CARDS.filter(c => c.state === "resolved" && c.outcome), []);

  return (
    <div className="app">
      <MobileHeader title="Resultados" />
      <Sidebar />

      <main className="main">
        <div className="topbar">
          <div>
            <h1>Resultados apurados</h1>
            <div className="topbar-sub">O que aconteceu depois que cada alerta foi resolvido — esperado vs. real</div>
          </div>
          <div className="topbar-actions">
            <div className="seg-pill">
              {["30 dias", "90 dias", "Tudo"].map((r, i) => (
                <button key={r} className={i === 1 ? "active" : ""}>{r}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="stats3">
          <div className="stat-big">
            <div className="sg violet"><I.CircleCheck size={17} sw={1.9} /></div>
            <div className="sv">{OUTCOME_STATS.apurados}</div>
            <div className="sl">Cards apurados</div>
            <div className="sd">resolvidos com efeito medido</div>
          </div>
          <div className="stat-big">
            <div className="sg teal"><I.Target size={17} sw={1.9} /></div>
            <div className="sv" style={{ color: "var(--teal)" }}>{OUTCOME_STATS.acerto}</div>
            <div className="sl">Acerto da hipótese</div>
            <div className="sd">quão bem as regras previram o desfecho real</div>
          </div>
          <div className="stat-big">
            <div className="sg amber"><I.Coin size={17} sw={1.9} /></div>
            <div className="sv">{OUTCOME_STATS.impacto}</div>
            <div className="sl">Impacto total apurado</div>
            <div className="sd">receita protegida + incremental no período</div>
          </div>
        </div>

        <div className="overlap-note">
          <I.Columns size={15} className="oi" />
          <span>Um card resolvido também aparece na coluna <strong>Resolvidos</strong> do board. Aqui a leitura é só de desfecho — o board segue como o fluxo de trabalho.</span>
        </div>

        <section className="panel-card">
          <div className="pc-head">
            <div className="pc-title">Cards apurados <span className="sub">{apurados.length} no período</span></div>
            <button className="btn-pill"><I.Download size={13} /> Exportar</button>
          </div>
          {apurados.map(c => <OutcomeRow key={c.id} card={c} />)}
        </section>
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Aparência" />
        <TweakRadio label="Tema" value={t.theme} options={["light", "dark"]} onChange={(v) => setTweak("theme", v)} />
        <TweakRadio label="Densidade" value={t.density} options={["compact", "regular", "comfy"]} onChange={(v) => setTweak("density", v)} />
      </TweaksPanel>
    </div>
  );
}

function OutcomeRow({ card }) {
  const o = card.outcome;
  const G = STATUS_GLYPH[o.status];
  return (
    <article className="outcome-row">
      <div className="or-top">
        <div className={"or-status " + o.status}><G size={18} sw={1.9} /></div>
        <div className="or-main">
          <div className="or-headline">{card.headline}</div>
          <div className="or-meta">
            <SevTag sev={card.severity} />
            <span className="meta-chip">{card.trigger_id}</span>
            {card.vector && <VectorChip vector={card.vector} />}
            <span className="meta-src">{card.platform}</span>
          </div>
        </div>
        <span className="or-ago">{o.resolvedAgo}</span>
      </div>

      <div className="ev-grid">
        <div className="ev-block">
          <div className="ev-k"><I.Target size={11} /> Esperado</div>
          <div className="ev-v">{o.expected}</div>
          <div className="ev-sub">{o.metricLabel}: {o.before}</div>
        </div>
        <div className={"ev-block real " + o.status}>
          <div className="ev-k"><G size={11} sw={2} /> Real</div>
          <div className="ev-v">{o.real}</div>
          <div className="ev-sub">{o.before} → {o.after}</div>
        </div>
      </div>

      <div className="or-note"><I.Sparkle size={13} className="ni" sw={1.8} /> {o.note}</div>
    </article>
  );
}
