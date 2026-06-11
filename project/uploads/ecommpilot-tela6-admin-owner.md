# ecommPilot — Tela 6: Admin operacional (owner)

Bloco para acrescentar ao briefing de handoff do Claude Design. Mesma estética,
mesmos tokens de cor e tipografia das telas 1–5. Idioma da interface: português
(Brasil). Fidelidade alvo: mid-fi navegável.

Esta tela é distinta da Tela 5. A Tela 5 (Admin) é a visão que o **cliente** tem
da conta dele. A Tela 6 é a visão do **owner** da plataforma — você, Kenzo —
gerenciando todos os clientes, regras e a saúde do sistema inteiro, com poder de
intervenção.

---

## Modelo de acesso

Existe um nível de `auth_users.role` acima de qualquer role de cliente: `owner`.
Só o owner enxerga a Tela 6. Toda ação aqui é cross-tenant (afeta um ou todos os
clientes) e por isso é auditada.

### Nova tabela no modelo de dados

- `admin_audit_log` — id, actor_id (FK auth_users), action, target_type
  (client / trigger / card / outcome / pipeline), target_id, value_before (json),
  value_after (json), created_at

Toda ação destrutiva ou cross-client grava uma linha aqui. Sem isso não há como
depurar "por que esse trigger parou de disparar semana passada".

---

## Princípio de confirmação proporcional ao raio de impacto

A intensidade da confirmação escala com quantos clientes a ação atinge:

- Afeta um cliente → clique simples.
- Afeta o card de um cliente → clique simples.
- Afeta todos os clientes (editar `detection_sql`, desativar trigger global) →
  confirmação explícita digitando o `trigger_id`, estilo "delete repo" do GitHub.

Visualmente: ações de raio amplo usam botão de cor de severidade crítica
(vermelho) e abrem modal de confirmação; ações de raio estreito são botões
neutros inline.

---

## Layout geral

Sidebar de navegação à esquerda com cinco seções (cada uma é um sub-painel da
Tela 6, não uma tela separada):

1. Clientes
2. Detection engine
3. Pipeline de IA
4. Billing
5. Audit log

Conteúdo à direita em grid ~1200px. Topo fixo: badge "owner" + busca global
(busca cliente, trigger_id ou card id).

---

## Seção 1 — Clientes (multi-tenant)

Tabela de todos os `clients`. Uma linha por cliente, colunas:

- Nome + `account_ref`
- Status do contrato: badge — ativo (verde) / trial (cinza) / suspenso (vermelho)
- Ad spend gerenciado (R$/mês) — é o eixo de pricing, fica em destaque
- Plano / faixa de cobrança
- Cards: contagem aberto / em andamento / resolvido (mini-stat inline)
- Saúde das conexões: ponto agregado — verde (todas ok) / âmbar (alguma atrasada)
- `last_sync` mais antigo entre as conexões (detecta ingestão quebrada)
- MRR do cliente

Clicar na linha abre o drawer do cliente, de onde saem as **ações**:

- Suspender / reativar cliente (muda status do contrato; corta acesso, não deleta)
- Pausar ingestão da conta (sem desconectar) — toggle
- Forçar re-sync de uma `connection`
- Editar faixa de pricing / plano
- "Entrar como" (impersonar) — abre o board do cliente em modo somente-leitura
  com banner persistente "você está vendo como [cliente]". Crucial para o suporte
  high-touch do estágio atual.

Suspender e impersonar gravam em `admin_audit_log`.

---

## Seção 2 — Detection engine

O coração do diferencial. Mede a qualidade das próprias regras em nível global.

Topo: três metric cards — Triggers ativos (contagem), Acerto da hipótese
agregado (%), Cards gerados 30d (contagem).

Tabela de `trigger_catalog`. Uma linha por `trigger_id`, colunas:

- `trigger_id` (ex. MA-004) + `alert_type` + plataforma
- `severity` (badge nas cores fixas de severidade)
- `version`
- Acerto da hipótese do trigger (%) — ordenável. Quais regras acertam, quais não.
- Volume de cards 30d — quais disparam demais / de menos
- Taxa de dispensa (%) — % de cards que viram "dispensado · não recorrente".
  Taxa alta = sinal de regra ruim. Colorir âmbar acima de um limiar.
- Toggle ativo / inativo

Ações por trigger (com guarda-corpo proporcional ao risco):

- Ativar / desativar (toggle, reversível) — seguro, clique simples.
- Editar `severity` e `fallback_template` — baixo risco, clique simples.
- Versionar: qualquer edição cria nova `version`, nunca sobrescreve. Auditável.
- Editar `detection_sql` → confirmação dupla digitando o `trigger_id` + grava
  before/after em `admin_audit_log`. Um SQL errado polui cards de todos os
  clientes de uma vez.

DECISÃO TRAVADA: editar SQL pelo painel não viola "regras detectam, IA humaniza"
— continua sendo regra determinística. O que o painel nunca faz é pedir detecção
à IA. Mas como o raio é global, o SQL é a ação mais protegida da Tela 6.

---

## Seção 3 — Pipeline de IA

Custo escala com volume porque a IA escreve todo card.

Topo: quatro metric cards — Gasto API Claude no mês (R$), Cache hit rate do system
prompt (%), Cards gerados hoje / mês, Latência média de geração + taxa de erro.

Sub-bloco "Custo por cliente": lista clientes ordenada por custo de IA, para checar
margem por conta (custo de IA vs. faixa de pricing).

Sub-bloco "Fila de erro": cards com `ai_output_json` nulo (falha na pipeline).
Cada linha: card id + client + trigger_id + horário da falha.

Ações:

- Reprocessar um card (re-disparar geração)
- Reprocessar em lote toda a fila de erro
- Forçar regeneração de um card específico (quando o texto saiu ruim)
- Toggle de prompt version / modelo, para testar prompts

Regeneração e troca de prompt version gravam em `admin_audit_log`.

---

## Seção 4 — Billing

Mesmo manual no estágio atual, precisa de visibilidade.

Topo: três metric cards — MRR total (R$), Clientes em atraso (contagem),
Trials / renovações vencendo (contagem nos próximos 7d).

Lista com breakdown de MRR por faixa de spend. Lista separada de clientes com
pagamento em atraso, com ação rápida "suspender" (mesma ação da Seção 1, gravada).

DECISÃO EM ABERTO: quando o Stripe / alternativa brasileira entrar, esta seção
ganha ações de cobrança real. Por ora é leitura + suspender manual.

---

## Seção 5 — Audit log

Renderiza `admin_audit_log` direto. Lista cronológica reversa. Cada linha:

- Quem (actor) + ação + alvo (target_type + target_id) + tempo relativo
- Expandível para ver value_before / value_after lado a lado (mesmo padrão visual
  do "esperado vs. real" da Tela 4)

Filtro por target_type e por actor. Esta é a memória operacional da plataforma.

---

## Ações sobre cards cross-client (transversal, acessível pela busca global)

A partir da busca por card id, o owner pode:

- Mudar `state` de qualquer card de qualquer cliente
- Forçar dedupe / limpar um `dedup_key` travado
- Editar / anular um `card_outcome` mal apurado — atenção: afeta a métrica de
  acerto da hipótese, então sempre grava before/after em `admin_audit_log`

---

## Resumo das decisões travadas (Tela 6)

1. Existe `role = owner` acima de qualquer role de cliente; só ele vê a Tela 6.
2. Toda ação destrutiva ou cross-client grava em `admin_audit_log` (before/after).
3. Confirmação proporcional ao raio: um cliente = clique; todos = digitar o id.
4. Editar trigger nunca sobrescreve — cria nova `version`.
5. Editar SQL é regra determinística (não viola "regras detectam"), mas é a ação
   mais protegida por ter raio global.
6. "Entrar como" abre o board do cliente em somente-leitura, com banner persistente.
7. Cores de severidade e desfecho seguem os mesmos tokens das telas 1–5.

## Pontos para o Claude Design decidir/propor

- Sidebar interna da Tela 6 (5 seções) vs. abas no topo — qual escala melhor.
- Drawer lateral vs. página cheia ao abrir um cliente/trigger.
- Onde mora a busca global cross-client: topbar fixa da Tela 6 ou um command
  palette (Cmd+K) que cobre cliente, trigger e card de uma vez.
- Como sinalizar o modo "impersonando" sem o owner esquecer que saiu da própria
  visão (banner? barra de cor distinta no topo?).
