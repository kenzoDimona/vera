# PostHog: company BI and innovation database

Projeto no Linear: [P-THR-59](https://linear.app/threadless/project/posthog-company-bi-and-innovation-database-d85ecef05ae5) · Time: Threadless Dev · Status: Planned

> Resumo copiado do Linear em 2026-11-23. Em caso de dúvida, vale o que está no Linear.

## O que é

Um board de ideias amigável, onde ideias são enviadas, votadas e moderadas, com o PostHog como motor de métricas e como BI da empresa. Dois papéis para o PostHog, além da coleta de eventos:

1. **BI da empresa.** Um lugar só para responder perguntas de negócio, juntando o comportamento no site com pedidos, busca, anúncios e e-mail.
2. **Banco de inovação.** Cada ideia guarda evidência, teste, decisão e resultado medido. Referência: IdeaScale, adaptado ao que já usamos.

## Divisão de responsabilidades

| Peça | Guarda |
| -- | -- |
| Board de ideias + banco próprio | Ideias, votos, comentários, status, moderação |
| PostHog | Participação no board e resultado das ideias lançadas |
| Linear | Uma issue por ideia aprovada para construção |

## Etapas do IdeaScale aqui

| Etapa | Onde vive |
| -- | -- |
| Coletar ideias | Board de ideias |
| Selecionar | Votos e moderação no board, mais evidência do PostHog, GSC e busca, com custo e ganho esperado |
| Planejar | Issue no Linear com dono, custo e resultado esperado |
| Construir e testar | Experimento no PostHog, ou antes e depois datado |
| Escalar ou parar | Decisão com data, na issue e no board |
| Medir o retorno | Dashboard no PostHog, notebook com a conclusão, anotação na data do lançamento |

## Board de ideias (referência de mecânica)

- **Card:** categoria, título, autor com contagem de aplausos, data, número da ideia, texto com "Ler mais", tags, marca de "Editado".
- **Ações:** voto para cima ou para baixo com placar líquido (pode ficar negativo), comentários, estrela, denúncia, menu de opções.
- **Em volta:** lista de moderadores, botões de compartilhar.
- Design próprio, não o visual do IdeaScale.

## Perguntas em aberto

1. Quem participa: time, artistas ou compradores?
2. Se for público, como se encaixa com o projeto Community Forum (Discourse)?
3. Onde vivem o board e o banco dele?
4. Como os eventos do board ficam separados dos dados de compradores no PostHog?
5. Prêmios em dinheiro por trimestre: orçamento, quem julga, votos ou resultado medido, fraude de votos, revisão jurídica e fiscal.

## Fases propostas (nenhuma aprovada)

1. **Alinhar o modelo.** Escopo com o Igor, quem participa, e qual ferramenta decide um teste A/B (PostHog ou GA4).
2. **BI.** Conectar as primeiras fontes e montar um dashboard da empresa.
3. **Board de ideias.** Protótipo e piloto com um grupo pequeno.
4. **Memória da empresa.** Tornar testes e decisões passadas pesquisáveis pelo PostHog AI, se o beta estiver disponível.

## Ponto de partida (2026-11-23)

- Experimentos: 2. Notebooks: 0. Anotações: 0. Surveys: 0.
- Fontes externas conectadas: 0.
- Eventos web desde 2026-11-19; likes, follows, votos, contas e pedidos importados do Maestro.
- Conectar fontes exige uma chave de API com escrita, que ainda não temos.

## Links

- [PostHog: Threadless Main](https://us.posthog.com/project/749718)
- [PostHog: the shopper journey](https://linear.app/threadless/project/posthog-the-shopper-journey-6d9417f843c7) (coleta de eventos)
- [Referência: IdeaScale](https://ideascale.com/pt-br/)
- [Trend Radar](https://linear.app/threadless/project/trend-radar-68126dce0d8d) (possível fonte de ideias)
