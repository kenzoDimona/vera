# ecommPilot — Handoff para Claude Design

> Briefing de produto para prototipagem de interface. Descreve estrutura, fluxo e decisões de produto já tomadas. **Não especifica cores, tipografia ou ID visual** — o design system fica a critério do Claude Design. Fidelidade alvo: mid-fi navegável. Idioma da interface: português (Brasil).

---

## Contexto do produto

ecommPilot é um SaaS de monitoramento e otimização para e-commerce. Detecta problemas e oportunidades de crescimento em sete vetores principais e humaniza o texto de cada card de alerta via IA.

O usuário consome um feed de cards em vez de vigiar múltiplos dashboards manualmente.

**Princípio central:** regras detectam, IA escreve. A interface nunca pede análise à IA em tempo real — ela renderiza o texto já gerado e armazenado. A única exceção é o Conselheiro IA contextualizado (Tela 3), que dialoga em tempo real estritamente dentro do escopo de um card.

---

## Sete vetores de crescimento

1. **Mídia paga** — Meta Ads, Google Ads
2. **Social orgânico** — Instagram, TikTok, outras redes
3. **SEO orgânico** — tráfego e conversões via busca
4. **Email marketing** — performance de campanhas, entrega, abertura
5. **GA4 e comportamento** — navegação, funil, sessões
6. **Retenção e repeat purchase** — clientes recorrentes, LTV, churn
7. **Atribuição e análise de coorte** — qual canal realmente converteu

Todos os sete alimentam o engine de regras determinísticas. Cada card que aparece no board vem de um dos sete vetores, e a UI deve sempre exibir de qual vetor o card se originou.

---

## Modelo de dados (referência — ERD do Supabase)

As telas leem destas tabelas. Os nomes de campo aqui são os que a UI exibe.

- `clients` — id, name, account_ref, created_at
- `auth_users` — id, email, role, **role_type** (performance_marketer | entrepreneur | agency), **experience_level** (beginner | intermediate | advanced), **onboarding_completed_at**, **onboarding_tour_completed_at**, **tour_skipped_count**
- `connections` — id, client_id (FK), platform (meta | google | ga4 | email | seo | social | attribution), status, last_sync
- `trigger_catalog` — trigger_id (PK, ex. MA-004, EM-012, SEO-008), severity, alert_type, detection_sql, fallback_template, version, **vector** (qual dos sete)
- `cards` — id, client_id (FK), trigger_id (FK), state, payload_json, ai_output_json, impact_estimate, dedup_key, snoozed_until, created_at
- `card_outcomes` — id, card_id (FK), metric_before, metric_after, measured_at

Relações: um client tem muitos cards; um trigger instancia muitos cards; um card tem zero ou um outcome; um client tem muitas connections.

O `state` do card assume quatro valores: open, in_progress, resolved, ignored. Esses quatro valores são exatamente as quatro colunas do board.

---

## Tela 0A — Onboarding de persona (pós-login, primeira vez)

Aparece uma única vez logo após o primeiro login, antes do Dashboard. Calibra o comportamento de toda a aplicação: tom do Conselheiro IA, complexidade dos cards, profundidade dos tooltips do tour.

**Layout:** página simples, centralizada, largura útil estreita.

**Topo:** logo ecommPilot + headline "Vamos começar" + subtítulo "Ajude a gente a personalizar sua experiência".

### Pergunta 1 — Papel (obrigatória)

"Qual é o seu papel principal?" — três opções de seleção, uma por linha, cada uma com ícone + label + descrição curta:

- **Performance Marketer** — "Trabalho com anúncios, otimização de campanhas e ROAS" → persona avançado
- **Dono do negócio / Empreendedor** — "Dirijo um e-commerce, não sou especialista em marketing" → persona júnior
- **Agência / Gestor de múltiplas contas** — "Trabalho com vários clientes ou contas" → persona avançado

### Pergunta 2 — Experiência (obrigatória)

"Como você se descreve em relação a crescimento de e-commerce?" — três opções de seleção:

- **Iniciante** — "Sou novo nisso, ainda estou aprendendo" → conselheiro muito didático, cards simplificados
- **Intermediário** — "Tenho experiência, mas sempre aprendo coisas novas" → conselheiro balanceado
- **Avançado** — "Tenho experiência consolidada, quero insights profundos" → conselheiro técnico

### Rodapé

- Aviso pequeno: "Você pode mudar essas preferências a qualquer momento nas settings."
- Botão primário "Começar" — desabilitado até as duas perguntas estarem respondidas.
- Botão secundário "Pular por agora" — usa defaults (avançado / intermediário) e a tela reaparece no próximo login.

### Dados salvos

`role_type`, `experience_level`, `onboarding_completed_at`. Toda chamada ao Conselheiro IA usa esses valores para calibrar o system prompt.

### Decisões para o Claude Design propor

- Os três botões de seleção devem ser visualmente distintos entre si ou iguais com ícone diferente?
- Animação ao selecionar vs. estado visual simples.
- Manter ou remover o "Pular por agora" (forçar resposta produz dados falsos).

---

## Tela 0B — Tour interativo (primeiro acesso ao Dashboard)

Aparece apenas na primeira vez que o usuário acessa o Dashboard, logo após o onboarding de persona. Nunca reaparece, mas pode ser reacionado manualmente via "Ajuda" → "Mostrar tour novamente".

**Mecanismo:** overlay com highlights + tooltips que guiam o usuário pelos elementos principais, um por um. Avança com "Próximo" ou Enter.

**Estrutura de cada step:**
- **Target** — elemento da tela em destaque (overlay escurecido ao redor, elemento realçado).
- **Tooltip** — explicação curta (2–3 frases), posição auto-ajustável, tom adaptado à persona.
- **Botões** — "Anterior" (desabilitado no primeiro step), "Próximo", "Pular tour" (sempre disponível).

**Sequência de steps:**

1. **Métricas principais** — Receita, Pedidos, ROAS, CPA: o que significam e por que importam.
2. **Gráfico de receita por dia** — como identificar padrões e anomalias.
3. **Card de conexões** — status das fontes de dados dos sete vetores; como reconectar se cair.
4. **Card de alertas recentes** — alertas detectados podem vir de qualquer um dos sete vetores; como filtrar por severidade.
5. **Botão "Ver board"** — como ir para a visão kanban completa.
6. **Encerramento** — parabéns, agora navegue pelo board.

**Texto adaptado à persona** (mesmo step, tom diferente):
- *Júnior:* linguagem simples, com analogia ("se está verde, ótimo — você ganhou mais").
- *Avançado:* técnico e direto ("delta período-over-período da semana anterior; use para detectar anomalias").

**Comportamento:**
- Próximo: botão ou Enter. Anterior: botão. Pular/Esc: encerra o tour silenciosamente, leva ao dashboard normal.
- **Mobile (< 768px):** tour desabilitado; em vez disso, modal simplificado "Bem-vindo" com 3 dicas principais em accordion.

**Dados salvos:** `onboarding_tour_completed_at`, `tour_skipped_count`.

Condição de disparo:
```
if (user.onboarding_completed_at && !user.onboarding_tour_completed_at) {
  initTour();
}
```

**Decisões para o Claude Design propor:**
- Opacidade do overlay (foco máximo vs. contexto visível).
- Highlight estático vs. animado (pulse).
- Mobile: modal simplificado vs. desabilitar de vez.

---

## Tela 1 — Dashboard

Visão geral do cliente. Topo: avatar + nome do cliente + seletor de período (7d / 30d / custom).

**Métricas:** quatro metric cards em linha — Receita, Pedidos, ROAS, CPA médio. Cada um com valor grande e delta percentual. Os deltas respeitam direção semântica: CPA subindo é ruim, receita subindo é boa (a cor fica a critério do design system, mas a semântica bom/ruim deve ficar inequívoca).

**Grid de duas colunas:**
- **Esquerda (maior):** gráfico de barras "Receita por dia" (7 barras).
- **Direita:** card "Conexões" — resumo em LEITURA do status dos sete vetores (de `connections`), com link "Gerenciar" que leva à Admin. Aqui é só espelho; a fonte única de verdade é a Admin. Não permitir editar conexão a partir do Dashboard.

**Rodapé:** card "Alertas recentes" — 3 linhas de `cards` ordenadas por created_at desc. Cada linha: badge de severidade + headline + vetor de origem + tempo relativo. Botão "Ver board" leva à Tela 2.

---

## Tela 2 — Board de alertas (núcleo do produto)

Kanban de quatro colunas mapeadas 1:1 ao campo `cards.state`:

1. **Novos** — state = open
2. **Em andamento** — state = in_progress (mostrar avatar do responsável)
3. **Resolvidos** — state = resolved (mostrar selo "apurado" ou "apurando…")
4. **Ignorados** — state = ignored

**Cada card no board mostra:** badge de severidade, headline curta (de ai_output_json), ícone + label do vetor de origem, rodapé com trigger_id + tempo. Borda lateral esquerda colorida pela severidade.

**Subestados em "Ignorados":**
- **Snooze** — `snoozed_until` preenchido. Mostrar "snooze 7d · volta em 4d". O card reaparece em "Novos" quando o prazo vence. Uso típico: público pequeno agora, reavaliar depois.
- **Dispensado** — descartado de vez, sem prazo. Mostrar "dispensado · não recorrente".

Ambos alimentam a deduplicação. Cards em "Ignorados" aparecem com opacidade reduzida.

**Topo da tela:** filtro por severidade + filtro por vetor (qual dos sete) + busca.

**Interação:** arrastar card entre colunas muda o `state`. Clicar no card abre a Tela 3.

---

## Tela 3 — Card detalhe + Conselheiro IA

Modal ou página de um card. **Layout de dois painéis lado a lado** (desktop); empilhados em tablet/mobile.

### Painel esquerdo (maior) — saída da IA vira interface

Segue a hierarquia do schema de saída da IA, nesta ordem exata (a ordem É a priorização):

1. **Cabeçalho** — badge severidade + trigger_id + vetor de origem + plataforma + tempo + botão "Assumir" (muda state para in_progress e atribui ao usuário).
2. **Headline** (título grande) + subtítulo de uma linha com o número que disparou.
3. **Hipótese principal** — badge de confiança (alta / média / baixa) + 1–2 frases.
4. **Primeira ação** — DESTACADA. É o único elemento em evidência máxima. Mostra a ação + dono sugerido + estimativa de tempo. Maior peso visual da tela.
5. **"Se não resolver em 48h"** — colapsável (fechado por padrão), com follow-ups.
6. **"Causas alternativas"** — colapsável (fechado por padrão), lista curta.
7. **Rodapé** — impacto estimado (número grande) + botões "Snooze" e "Resolver".

"Resolver" muda state para resolved e cria o vínculo com `card_outcomes`, que alimenta a Tela 4.

### Painel direito — Conselheiro IA contextualizado

Chat sempre disponível, contextualizado **estritamente** ao card aberto. Permite que o usuário (especialmente o júnior) discuta a recomendação, peça alternativas viáveis ("não tenho orçamento", "não entendi esse passo") e adapte a ação à sua realidade — sem nunca virar uma IA de uso genérico.

**Estrutura:**
- Topo — ícone + "Conselheiro".
- Histórico — scroll vertical; mensagens do usuário de um lado, respostas da IA do outro.
- Rodapé — input "Pergunte sobre este alerta…" + botão enviar.
- Estado inicial — vazio, com prompt convidativo ("Tem dúvida sobre este alerta? Eu ajudo.").

**Contexto passado à IA (backend):** headline, trigger_id, vetor, hipótese + confiança, primeira ação, impacto estimado, plataforma e período — **mais** `role_type` e `experience_level` do usuário.

**Calibração por persona:**
- *Júnior (entrepreneur, beginner/intermediate):* tom quente e didático; evita jargão; usa analogias; ao ouvir restrição de orçamento/tempo, oferece alternativas mais baratas/simples; quebra em passos numerados; respostas curtas (2–3 frases).
- *Avançado (performance_marketer, agency):* tom técnico; explica mecanismo causal/estatístico quando relevante; sugere testes, segmentações e análises multivariadas; desafia hipóteses com respeito.

**Guardrails de saída (ambas as personas):**
- Nunca sai do escopo do card aberto; não responde temas não relacionados.
- Nunca instrui cliques diretos nem alterações diretas em contas ("considere pausar a campanha", nunca "clique aqui e pause"). Conselho, não execução.
- Foco em negócio; bom senso; modelo Claude mais recente.

**Feedback loop:** botão "Este conselho foi útil?" (sim / não / neutro) abaixo de cada resposta da IA, para medir a qualidade do tom por persona ao longo do tempo (conversa com a métrica "Acerto da hipótese").

**Persistência:** o histórico vive enquanto o card está aberto; ao fechar o card, o chat é descartado (não persiste no banco).

### Decisões para o Claude Design propor

- Painel Conselheiro aberto por padrão (sugestão recomendada, "tem ajuda aqui") vs. fechado (menos clutter).
- Largura do Conselheiro sem espremer o bloco "Primeira ação".
- Blocos 5 e 6 colapsáveis (mantém foco na primeira ação) vs. sempre abertos (completude para revisão rápida) — propor as duas versões.

---

## Tela 4 — Resultados apurados (follow-up do resolvido)

Lê de `card_outcomes` join `cards`. Mostra o que aconteceu DEPOIS que cada alerta foi resolvido — esperado vs. real lado a lado.

**Topo:** três metric cards — Cards apurados (contagem), Acerto da hipótese (%), Impacto total (R$).

A métrica **"Acerto da hipótese"** é um diferencial: cruzando metric_before/after com o impacto esperado, mede a qualidade das próprias regras ao longo do tempo. É um loop de validação do produto, não só do cliente.

**Lista de cards apurados.** Cada linha:
- Ícone de status (check / triângulo / relógio) + headline + trigger_id + vetor de origem + "resolvido há Xd".
- Dois sub-blocos lado a lado: **"Esperado"** (de impact_estimate) e **"Real"** (de card_outcomes). O bloco Real é colorido pelo desfecho: bateu/superou, efeito parcial, ou ainda apurando.

**Decisão para o Claude Design propor:** há sobreposição entre a coluna "Resolvidos" (Tela 2) e esta tela. Avaliar se "Apurados" é uma aba separada na navegação ou um filtro/visão dentro do próprio board, para não duplicar navegação.

---

## Tela 5 — Admin (fonte única do status das conexões)

**Topo:** card de perfil do usuário — avatar, nome, email, role (de auth_users). Botão "Editar". Inclui também acesso para editar `role_type` e `experience_level` definidos no onboarding.

**Card "Conexões"** — FONTE ÚNICA DE VERDADE do status (de `connections`). Uma linha por vetor de crescimento (Meta Ads, Google Ads, GA4, Email marketing, SEO, Social, Atribuição). Cada linha:
- Ícone do vetor + nome + "sincronizado há X" (de last_sync).
- Badge "conectado" quando ok.
- Quando atraso/erro: texto de alerta + botão "Reconectar" no lugar do badge.

**Modelo de acesso v1:** high-touch, sem OAuth. O operador é adicionado como Manager/Partner/Editor nas contas do cliente. "Conectado" significa que a conta foi vinculada via acesso de agência, não via fluxo OAuth.

---

## Decisões travadas (para o Claude Design respeitar)

1. Quatro colunas no board = quatro valores de `cards.state`. Não inventar quinta.
2. "Ignorados" separa snooze (com prazo, reaparece) de dispensado (permanente).
3. Status de conexão tem fonte única na Admin; Dashboard só espelha em leitura.
4. Card detalhe: "Primeira ação" é o único elemento em destaque; resto é secundário.
5. "Resolver" cria o outcome que alimenta a Tela 4; o vínculo card→resultado é explícito.
6. A semântica de severidade e de desfecho (bom/ruim/atenção/neutro) é consistente entre telas. As **cores específicas ficam a critério do design system** — o que é obrigatório é a consistência e a clareza da semântica.
7. O Conselheiro IA é contextualizado e restrito ao card aberto; nunca é uma IA de uso geral.
8. Todo card exibe o vetor de crescimento de origem (um dos sete).

## Pontos para o Claude Design decidir/propor

- Navegação global entre as telas (sidebar vs. topbar) — ainda não definida.
- Conselheiro aberto vs. fechado por padrão; blocos colapsáveis vs. abertos na Tela 3.
- "Apurados" como aba separada vs. filtro dentro do board (Telas 2/4).
- Tratamento mobile do tour e do painel Conselheiro.
- Todo o design system: cores, tipografia, espaçamento, cantos, ícones, estética geral.
