import { useState, useEffect, useMemo } from 'react';
import { I } from '../../icons/index.jsx';
import { Avatar, PlatformGlyph, VectorChip } from '../../components/shared.jsx';
import { TweaksPanel, TweakSection, TweakRadio, useTweaks } from '../../components/TweaksPanel/index.jsx';
import MobileHeader from '../../components/MobileHeader.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { CLIENT, USER, CONNECTIONS, CARDS } from '../../data/mockData.js';
import '../../styles/admin.css';

const TWEAK_DEFAULTS = { theme: "light", density: "regular" };

const ACCESS_ROLE = {
  "Meta Ads": "Partner", "Google Ads": "Gerente", "GA4": "Editor",
  "Klaviyo · email": "Manager", "Search Console": "Proprietário",
  "Instagram · TikTok": "Analista", "Atribuição": "Editor",
};

const ROLE_OPTS = [
  { value: "performance_marketer", label: "Performance marketer" },
  { value: "growth",               label: "Growth" },
  { value: "founder",              label: "Fundador(a)" },
  { value: "analyst",              label: "Analista" },
];
const EXP_OPTS = [
  { value: "beginner",     label: "Iniciante" },
  { value: "intermediate", label: "Intermediário" },
  { value: "advanced",     label: "Avançado" },
];
const roleLabel = (v) => (ROLE_OPTS.find(o => o.value === v) || {}).label || "—";
const expLabel  = (v) => (EXP_OPTS.find(o => o.value === v) || {}).label || "—";

export default function Admin() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [conns, setConns] = useState(() => CONNECTIONS.map(c => ({ ...c })));
  const savedPersona = (() => { try { return JSON.parse(localStorage.getItem("ecp_persona")) || {}; } catch (e) { return {}; } })();
  const [persona, setPersona] = useState({
    role_type: savedPersona.role_type || USER.role_type,
    experience_level: savedPersona.experience_level || USER.experience_level,
  });
  const [editing, setEditing] = useState(false);

  const savePersona = (next) => {
    setPersona(next);
    localStorage.setItem("ecp_persona", JSON.stringify(next));
  };

  useEffect(() => {
    document.documentElement.dataset.theme = t.theme;
    document.documentElement.dataset.density = t.density;
  }, [t.theme, t.density]);

  const reconnect = (id) => setConns(prev => prev.map(c =>
    c.id === id ? { ...c, status: "conectado", last_sync: "há instantes" } : c
  ));

  return (
    <div className="app">
      <MobileHeader title="Admin" />
      <Sidebar />

      <main className="main">
        <div className="topbar">
          <div>
            <h1>Admin</h1>
            <div className="topbar-sub">Perfil e conexões da conta {CLIENT.name}</div>
          </div>
        </div>

        <div className="admin-grid">
          <section className="block">
            <div className="block-pad profile">
              <Avatar initials={USER.initials} size={60} grad="amber-rose" />
              <div className="pmeta">
                <div className="pname">{USER.name}</div>
                <div className="pmail"><I.Mail size={13} /> {USER.email}</div>
                <span className="role-badge"><I.User size={12} /> {USER.role}</span>
              </div>
              <button className="btn-edit" onClick={() => setEditing(v => !v)}>
                <I.Pencil size={13} /> {editing ? "Fechar" : "Editar"}
              </button>
            </div>
            <div className="persona-pad">
              <div className="persona-cap">Como o Conselheiro IA fala com você</div>
              {!editing ? (
                <div className="persona-view">
                  <div className="persona-field">
                    <span className="pf-k">Papel</span>
                    <span className="pf-v">{roleLabel(persona.role_type)}</span>
                  </div>
                  <div className="persona-field">
                    <span className="pf-k">Experiência</span>
                    <span className="pf-v">{expLabel(persona.experience_level)}</span>
                  </div>
                  <p className="persona-note"><I.Sparkles size={12} /> As respostas do Conselheiro se ajustam ao seu nível e à sua função.</p>
                </div>
              ) : (
                <div className="persona-edit">
                  <div className="pe-group">
                    <div className="pe-label">Seu papel</div>
                    <div className="pe-seg">
                      {ROLE_OPTS.map(o => (
                        <button key={o.value} className={persona.role_type === o.value ? "on" : ""}
                                onClick={() => savePersona({ ...persona, role_type: o.value })}>{o.label}</button>
                      ))}
                    </div>
                  </div>
                  <div className="pe-group">
                    <div className="pe-label">Seu nível de experiência</div>
                    <div className="pe-seg">
                      {EXP_OPTS.map(o => (
                        <button key={o.value} className={persona.experience_level === o.value ? "on" : ""}
                                onClick={() => savePersona({ ...persona, experience_level: o.value })}>{o.label}</button>
                      ))}
                    </div>
                  </div>
                  <p className="persona-note"><I.Check size={12} sw={2.4} /> Salvo — vale para o Conselheiro em todos os alertas.</p>
                </div>
              )}
            </div>
          </section>

          <section className="block">
            <div className="block-head">
              <div className="block-title">Conexões <span className="sub">uma linha por plataforma</span></div>
              <span className="source-flag"><I.Check size={12} sw={2.4} /> fonte única do status</span>
            </div>

            {conns.map(cx => {
              const warn = cx.status !== "conectado";
              return (
                <div key={cx.id} className="conn-row">
                  <PlatformGlyph icon={cx.icon} size={42} r={12} />
                  <div className="conn-meta">
                    <div className="conn-name">
                      {cx.platform}
                      <span className="conn-access">{ACCESS_ROLE[cx.platform]}</span>
                    </div>
                    {cx.vector && <div style={{ margin: "5px 0 2px" }}><VectorChip vector={cx.vector} /></div>}
                    <div className={"conn-sync" + (warn ? " warn" : "")}>
                      {cx.status === "erro" ? "erro de conexão — última às " + cx.last_sync
                       : warn ? "atraso na sincronização — última às " + cx.last_sync
                       : "sincronizado " + cx.last_sync}
                    </div>
                  </div>
                  {warn
                    ? <button className="btn-reconnect" onClick={() => reconnect(cx.id)}><I.Refresh size={13} /> Reconectar</button>
                    : <span className="status-badge ok"><span className="status-dot" /> conectado</span>}
                </div>
              );
            })}

            <div className="access-note">
              <span className="ai"><I.Link size={15} /></span>
              <span>
                Acesso <strong>high-touch v1</strong>, sem OAuth. A conta da agência foi adicionada como
                Partner / Gerente / Editor nas contas do cliente — "conectado" significa vínculo por acesso de
                agência, não por fluxo OAuth.
              </span>
            </div>
            <div style={{ height: 18 }} />
          </section>
        </div>
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Aparência" />
        <TweakRadio label="Tema" value={t.theme} options={["light", "dark"]} onChange={(v) => setTweak("theme", v)} />
        <TweakRadio label="Densidade" value={t.density} options={["compact", "regular", "comfy"]} onChange={(v) => setTweak("density", v)} />
      </TweaksPanel>
    </div>
  );
}
