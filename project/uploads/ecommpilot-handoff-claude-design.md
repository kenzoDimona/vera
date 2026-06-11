# ecommPilot — briefing de handoff para o Claude Design

Cole este documento no Claude Design. Ele descreve cinco telas desktop (app web)
para prototipar, com os campos de dados de cada uma, os estados, os tokens visuais
e as decisões de produto já tomadas. Fidelidade alvo: mid-fi navegável.

---

## Contexto do produto

ecommPilot é um SaaS de monitoramento para anunciantes de e-commerce. Regras
determinísticas detectam problemas nos dados de Meta Ads / Google Ads / GA4; a IA
escreve o texto de cada card de alerta. O usuário consome um feed de cards em vez
de vigiar dashboards manualmente.

Princípio central: regras detectam, IA humaniza. A interface nunca pede análise à
IA em tempo real — ela renderiza o texto já gerado e armazenado.

---

## Sistema visual

- Layout: desktop, largura útil ~1200px, conteúdo em grid.
- Estética: flat, superfícies brancas, bordas finas (0.5px), bastante respiro.
  Sem gradiente, sem sombra decorativa. Deve parecer um app limpo e nativo.
- Tipografia: sans-serif. Dois pesos só (regular 400, medium 500). Sentence case
  em tudo — nunca Title Case nem CAIXA ALTA.
- Cantos: radius médio (8px) na maioria, radius grande (12px) em cards.
- Idioma da interface: português (Brasil).

### Cores por severidade (usar consistente em todas as telas)

| Severidade   | Fill (badge)        | Texto badge | Borda lateral card |
|--------------|---------------------|-------------|--------------------|
| crítico      | vermelho claro      | vermelho escuro | vermelho forte |
| alto         | âmbar claro         | âmbar escuro    | âmbar forte    |
| médio        | cinza claro         | cinza escuro    | cinza médio    |
| oportunidade | verde-água claro    | verde escuro    | verde-água     |

### Cores por estado de resultado

- sucesso / resolvido com efeito → verde
- efeito parcial / atenção → âmbar
- apurando / neutro → cinza

---

## Modelo de dados (referência — ERD do Supabase)

As telas leem destas tabelas. Os nomes de campo aqui são os que a UI exibe.

- `clients` — id, name, account_ref, created_at
- `auth_users` — id, email, role (Supabase Auth nativo; nunca guardar senha)
- `connections` — id, client_id (FK), platform, status, last_sync
- `trigger_catalog` — trigger_id (PK, ex. MA-004), severity, alert_type,
  detection_sql, fallback_template, version
- `cards` — id, client_id (FK), trigger_id (FK), state, payload_json,
  ai_output_json, impact_estimate, dedup_key, snoozed_until, created_at
- `card_outcomes` — id, card_id (FK), metric_before, metric_after, measured_at

Relações: um client tem muitos cards; um trigger instancia muitos cards; um card
tem zero ou um outcome; um client tem muitas connections.

O `state` do card assume quatro valores: open, in_progress, resolved, ignored.
Esses quatro valores são exatamente as quatro colunas do board.

---

## Tela 1 — Dashboard

Visão geral do cliente. Topo: avatar + nome do cliente + seletor de período (7d).

Quatro metric cards em linha: Receita, Pedidos, ROAS, CPA médio — cada um com valor
grande e delta percentual (verde se melhora, vermelho se piora). Os deltas devem
respeitar a direção semântica: CPA subindo é ruim (vermelho), receita subindo é
boa (verde).

Abaixo, grid de duas colunas:
- Esquerda (maior): gráfico de barras "Receita por dia" (7 barras).
- Direita: card "Conexões" — resumo em LEITURA do status (de `connections`), com
  link "Gerenciar" que leva à tela Admin. Importante: aqui é só espelho; a fonte
  única de verdade é a Admin. Não permitir editar conexão a partir do Dashboard.

Rodapé: card "Alertas recentes" — 3 linhas vindas de `cards` ordenadas por
created_at desc, cada uma com badge de severidade + headline + tempo relativo.
Botão "Ver board" leva à Tela 2.

---

## Tela 2 — Board de alertas (núcleo do produto)

Kanban de quatro colunas mapeadas 1:1 ao campo `cards.state`:

1. Novos (state = open)
2. Em andamento (state = in_progress) — mostrar avatar do responsável no card
3. Resolvidos (state = resolved) — mostrar selo "apurado" ou "apurando…"
4. Ignorados (state = ignored)

Cada card no board mostra: badge de severidade, headline curta (de
ai_output_json), e rodapé com trigger_id + plataforma + tempo. Borda lateral
esquerda colorida pela severidade.

DECISÃO DE PRODUTO — a coluna "Ignorados" distingue dois subestados:
- snooze: campo `snoozed_until` preenchido. Mostrar "snooze 7d · volta em 4d".
  O card reaparece em "Novos" quando o prazo vence. Uso típico: público pequeno
  agora, reavaliar depois.
- dispensado: descartado de vez, sem prazo. Mostrar "dispensado · não recorrente".

Ambos alimentam a deduplicação: o sistema sabe o que já foi visto e por que foi
descartado. Cards em Ignorados aparecem com opacidade reduzida (~0.7).

Topo da tela: filtro por severidade e busca.

Interação: arrastar card entre colunas muda o `state`. Clicar no card abre a Tela 3.

---

## Tela 3 — Card detalhe (saída da IA vira interface)

Modal ou página de um card. Segue a hierarquia do schema de saída da IA, nesta
ordem exata (de cima pra baixo), porque a ordem é a priorização:

1. Cabeçalho: badge severidade + trigger_id + plataforma + tempo + botão "Assumir"
   (muda state para in_progress e atribui ao usuário).
2. Headline (título grande) + uma linha de subtítulo com o número que disparou.
3. Bloco "Hipótese principal" com badge de confiança (alta/média/baixa). Texto de
   1–2 frases. Vem de ai_output_json.
4. Bloco "Primeira ação" — DESTACADO (fundo azul claro, borda azul). Esta é a única
   ação em evidência. Mostra a ação + dono sugerido + estimativa de tempo. É o
   elemento de maior peso visual da tela.
5. "Se não resolver em 48h" — colapsável (fechado por padrão), com follow-ups.
6. "Causas alternativas" — colapsável (fechado por padrão), lista curta.
7. Rodapé: impacto estimado (número grande, verde) + botões "Snooze" e "Resolver".

DECISÃO EM ABERTO (deixar o Claude Design propor as duas versões): os blocos 5 e 6
estão colapsáveis. Avaliar versão alternativa com eles sempre abertos para revisão
rápida. A versão colapsada mantém a primeira ação como único foco; a aberta troca
foco por completude.

"Resolver" muda state para resolved e cria o vínculo com `card_outcomes`, que
alimenta a Tela 4.

---

## Tela 4 — Resultados apurados (follow-up do resolvido)

Lê de `card_outcomes` join `cards`. Mostra o que aconteceu DEPOIS que cada alerta
foi resolvido — esperado vs. real lado a lado.

Topo: três metric cards — Cards apurados (contagem), Acerto da hipótese (%),
Impacto total (R$).

A métrica "Acerto da hipótese" é um diferencial: cruzando metric_before/after com
o impacto esperado, mede a qualidade das próprias regras ao longo do tempo. É um
loop de validação do produto, não só do cliente.

Lista de cards apurados. Cada linha:
- Ícone de status (check verde / triângulo âmbar / relógio cinza) + headline +
  trigger_id + "resolvido há Xd".
- Dois sub-blocos lado a lado: "Esperado" (do impact_estimate) e "Real" (de
  card_outcomes). O bloco Real é colorido pelo desfecho: verde se bateu/superou,
  âmbar se efeito parcial, cinza se ainda apurando.

DECISÃO EM ABERTO (deixar o Claude Design considerar): há sobreposição entre a
coluna "Resolvidos" da Tela 2 e esta tela — um card resolvido aparece nas duas.
Avaliar se "Apurados" é uma aba separada na navegação ou um filtro/visão dentro do
próprio board, para não duplicar navegação.

---

## Tela 5 — Admin (fonte única do status das conexões)

Topo: card de perfil do usuário — avatar, nome, email, role (de auth_users).
Botão "Editar".

Card "Conexões" — esta é a FONTE ÚNICA DE VERDADE do status (de `connections`).
Uma linha por plataforma (Meta Ads, Google Ads, GA4). Cada linha:
- Ícone da plataforma + nome + "sincronizado há X" (de last_sync).
- Badge de status à direita: "conectado" (verde) quando ok.
- Quando o status é atraso/erro: texto âmbar + botão "Reconectar" no lugar do badge.

Modelo de acesso v1: high-touch, sem OAuth. Kenzo é adicionado como
Manager/Partner/Editor nas contas do cliente. A tela reflete isso — "conectado"
significa que a conta foi vinculada via acesso de agência, não via fluxo OAuth.

---

## Resumo das decisões travadas (para o Claude Design respeitar)

1. Quatro colunas no board = quatro valores de `cards.state`. Não inventar quinta.
2. "Ignorados" separa snooze (com prazo, reaparece) de dispensado (permanente).
3. Status de conexão tem fonte única na Admin; Dashboard só espelha em leitura.
4. Card detalhe: primeira ação é o único elemento em destaque; resto é secundário.
5. "Resolver" cria o outcome que alimenta a Tela 4; o vínculo card→resultado é
   explícito, não implícito.
6. Cores de severidade e de desfecho são fixas e consistentes entre telas.

## Pontos para o Claude Design decidir/propor

- Blocos colapsáveis vs. abertos na Tela 3.
- "Apurados" como aba separada vs. filtro dentro do board (Telas 2/4).
- Navegação global entre as cinco telas (sidebar? topbar?). Não foi definida ainda.
