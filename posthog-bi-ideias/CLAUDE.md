# PostHog: company BI and innovation database

Pasta dedicada ao projeto do Linear **P-THR-59**:
https://linear.app/threadless/project/posthog-company-bi-and-innovation-database-d85ecef05ae5

Este trabalho é da Threadless e não tem relação com o restante deste repositório (o bundle do EcommPilot em `app/`, `project/` e `chats/`). Não misture os dois.

## Fonte da verdade

O Linear é a fonte da verdade sobre escopo e decisões. Antes de trabalhar aqui, leia a descrição atual do projeto pelo conector do Linear (`get_project` com `P-THR-59`) e as issues do projeto (`list_issues` com `project: P-THR-59`). O `README.md` desta pasta é só uma cópia resumida e pode estar desatualizada.

## Regras do projeto

- **Board de ideias + banco próprio** guardam ideias, votos, comentários, status e moderação. Esses registros são editados, então não ficam como eventos no PostHog.
- **PostHog** mede a participação no board e o resultado de cada ideia lançada (experimentos, dashboards, antes e depois).
- **Linear** recebe uma issue só quando uma ideia é aprovada para ser construída. O número da ideia e a chave da issue ligam os dois.
- Coleta de eventos (eventos, identidade, filtro de bots, volume e custo) é do projeto "PostHog: the shopper journey", liderado pelo Igor. Se uma ideia precisa de um evento novo, o pedido vai para lá.
- Shopify e Klaviyo têm dados pessoais: importe só as tabelas e colunas que uma pergunta precisa.
- Nada das fases propostas está aprovado. Cada fase precisa da própria issue com custo e ganho.

## Estrutura

- `docs/` — notas, decisões e rascunhos de especificação
- `board/` — protótipo e código do board de ideias
- `bi/` — consultas, dashboards e configuração de fontes do PostHog
