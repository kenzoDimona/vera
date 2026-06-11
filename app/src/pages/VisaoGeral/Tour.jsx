import { useState, useEffect, useCallback } from 'react';
import { I } from '../../icons/index.jsx';
import { VectorChip } from '../../components/shared.jsx';

const TOUR_STEPS = [
  { sel: null, place: "center", title: "Bem-vindo ao ecommPilot",
    body: "Em 5 passos rápidos: como a Visão geral lê suas lojas e onde agir. Você pode pular a qualquer momento." },
  { sel: '[data-tour="metrics"]', place: "bottom", title: "Seus números do período",
    body: "Receita, pedidos, ROAS e CPA num relance — com tendência dos últimos 7 dias. Troque a janela no canto superior direito." },
  { sel: '[data-tour="conexoes"]', place: "left", title: "7 vetores de crescimento",
    body: "Cada fonte de dados alimenta um vetor — VEC. O ecommPilot cruza todos para encontrar o que move o resultado. Aqui é só leitura; o status mora no Admin." },
  { sel: '[data-tour="alertas"]', place: "top", title: "Alertas que viram ação",
    body: "O sistema destaca o que mudou e por quê. Clique num alerta para abrir o detalhe, com hipótese, primeira ação e o Conselheiro IA." },
  { sel: '[data-tour="pilot"]', place: "bottom", title: "Pergunte ao Pilot",
    body: "Precisa de um recorte que não está na tela? Pergunte em linguagem natural e o Pilot responde com base nos seus dados conectados." },
];

export default function Tour({ onClose }) {
  const [i, setI] = useState(0);
  const [box, setBox] = useState(null);
  const step = TOUR_STEPS[i];
  const last = i === TOUR_STEPS.length - 1;

  const measure = useCallback(() => {
    if (!step.sel) { setBox(null); return; }
    const el = document.querySelector(step.sel);
    if (!el) { setBox(null); return; }
    const r = el.getBoundingClientRect();
    const pad = 8;
    setBox({ top: r.top - pad, left: r.left - pad, width: r.width + pad * 2, height: r.height + pad * 2 });
  }, [step]);

  useEffect(() => {
    const el = step.sel && document.querySelector(step.sel);
    if (el) el.scrollIntoView({ block: "center", behavior: "smooth" });
    const id = setTimeout(measure, el ? 240 : 0);
    window.addEventListener("resize", measure);
    return () => { clearTimeout(id); window.removeEventListener("resize", measure); };
  }, [i, measure, step]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") setI(v => Math.min(v + 1, TOUR_STEPS.length - 1));
      else if (e.key === "ArrowLeft") setI(v => Math.max(v - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const popStyle = (() => {
    const W = 312, vw = window.innerWidth, vh = window.innerHeight, gap = 16;
    if (!box) return { top: vh / 2 - 120, left: vw / 2 - W / 2 };
    let top, left;
    if (step.place === "bottom") { top = box.top + box.height + gap; left = box.left + box.width / 2 - W / 2; }
    else if (step.place === "top") { top = box.top - gap - 180; left = box.left + box.width / 2 - W / 2; }
    else if (step.place === "left") { top = box.top; left = box.left - W - gap; }
    else { top = box.top; left = box.left + box.width + gap; }
    left = Math.max(gap, Math.min(left, vw - W - gap));
    top = Math.max(gap, Math.min(top, vh - 210));
    return { top, left };
  })();

  return (
    <div className="tour-overlay" onClick={(e) => { if (e.target.classList.contains("tour-overlay")) onClose(); }}>
      {box && <div className="tour-spot" style={box} />}
      <div className="tour-pop" style={popStyle} onClick={e => e.stopPropagation()}>
        <div className="tour-step-no">Passo {i + 1} <span className="of">de {TOUR_STEPS.length}</span></div>
        <h3 className="tour-h">{step.title}</h3>
        <p className="tour-p">{step.body.split(/(VEC)/).map((part, k) =>
          part === "VEC"
            ? <span key={k} style={{ display: "inline-flex", verticalAlign: "middle", margin: "0 1px" }}><VectorChip vector="midia_paga" /></span>
            : part)}</p>
        <div className="tour-foot">
          <div className="tour-dots">{TOUR_STEPS.map((_, k) => <i key={k} className={k === i ? "on" : ""} />)}</div>
          {i > 0 && <button className="tour-back" onClick={() => setI(v => v - 1)}>Voltar</button>}
          {!last
            ? <button className="tour-next" onClick={() => setI(v => v + 1)}>Próximo <I.ArrowRight size={13} /></button>
            : <button className="tour-next" onClick={onClose}>Começar <I.ArrowRight size={13} /></button>}
        </div>
        {!last && <button className="tour-skip" onClick={onClose} style={{ position: "absolute", top: 12, right: 12 }}>Pular</button>}
      </div>
    </div>
  );
}
