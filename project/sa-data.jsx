// EcommPilot Ops — superadmin back-office. Mock data.
// Field names mirror the Supabase ERD from the briefing.

// ── sparkline series helpers ────────────────────────────────
const _s = (arr) => arr;
const sUp   = _s([42, 45, 44, 49, 52, 51, 58, 61, 64, 70, 73, 79]);
const sUp2  = _s([18, 19, 22, 21, 25, 28, 27, 31, 33, 36, 38, 41]);
const sFlat = _s([30, 31, 29, 32, 30, 33, 31, 32, 30, 33, 32, 34]);
const sDip  = _s([62, 60, 61, 57, 55, 56, 52, 50, 51, 48, 47, 49]);
const sWob  = _s([20, 28, 18, 34, 22, 30, 26, 38, 24, 33, 29, 40]);

// ── 7 vetores de crescimento ────────────────────────────────
const VECTORS = {
  midia_paga: { label: "Mídia paga", icon: "Megaphone", tint: "violet" },
  social:     { label: "Social",     icon: "SocialV",   tint: "pink" },
  seo:        { label: "SEO",        icon: "Search",    tint: "sky" },
  email:      { label: "Email",      icon: "Mail",      tint: "amber" },
  ga4:        { label: "GA4",        icon: "Analytics", tint: "indigo" },
  retencao:   { label: "Retenção",   icon: "Repeat",    tint: "teal" },
  atribuicao: { label: "Atribuição", icon: "Link",      tint: "slate" },
};
const VECTOR_ORDER = ["midia_paga", "social", "seo", "email", "ga4", "retencao", "atribuicao"];

// ── operador logado ─────────────────────────────────────────
const OPERATOR = {
  name: "RenataKi",
  email: "renata@ecommpilot.com",
  role: "Superadmin",
  initials: "RK",
};

// ── métricas do sistema (Visão geral) ───────────────────────
const SYS = {
  period: "7 dias",
  tiles: [
    { id: "clients",  label: "Clientes ativos",     value: "48",        delta: +3,    deltaLabel: "+3 no período", dir: "up",   icon: "Building", series: sUp,   tint: "violet" },
    { id: "mrr",      label: "MRR",                  value: "R$ 71,4 mil", delta: +6.2, deltaLabel: "vs. período ant.", dir: "up", icon: "Coin", series: sUp2, tint: "teal" },
    { id: "cards",    label: "Cards gerados",        value: "1.284",     delta: +12.4, deltaLabel: "últimos 7d",   dir: "up",   icon: "Columns", series: sUp,   tint: "indigo" },
    { id: "acerto",   label: "Acerto da hipótese",   value: "82%",       delta: +1.5,  deltaLabel: "loop de regras", dir: "up", icon: "Target", series: sUp2,  tint: "teal" },
    { id: "health",   label: "Saúde das conexões",   value: "91%",       delta: -2.0,  deltaLabel: "6 com falha",  dir: "down", icon: "Activity", series: sDip, tint: "amber" },
    { id: "triggers", label: "Triggers ativos",      value: "63",        delta: +2,    deltaLabel: "de 71 no catálogo", dir: "up", icon: "Database", series: sFlat, tint: "slate" },
  ],
  // cards por estado (agregado de todos os clientes)
  cardsByState: [
    { state: "open",        label: "Novos",        value: 312, tint: "violet" },
    { state: "in_progress", label: "Em andamento", value: 148, tint: "sky" },
    { state: "resolved",    label: "Resolvidos",   value: 706, tint: "teal" },
    { state: "ignored",     label: "Ignorados",    value: 118, tint: "slate" },
  ],
  // volume por vetor (cards no período)
  cardsByVector: [
    { vector: "midia_paga", value: 418 },
    { vector: "ga4",        value: 232 },
    { vector: "email",      value: 196 },
    { vector: "seo",        value: 174 },
    { vector: "retencao",   value: 121 },
    { vector: "social",     value: 88 },
    { vector: "atribuicao", value: 55 },
  ],
  connHealth: { ok: 281, warn: 18, err: 9 },
};

// ── clientes ────────────────────────────────────────────────
const CLIENTS = [
  { id: "cl_lumen", name: "Lumen Skincare",    account_ref: "lumen.com.br",      plan: "Scale",   status: "ativo",   mrr: 2490, cards7d: 38, openCards: 9, health: "ok",   acerto: 86, conns: 7, connsOk: 7, created: "mar/2024", owner: "Kenzo M." },
  { id: "cl_vesti", name: "Vestio Moda",       account_ref: "vestio.com.br",     plan: "Growth",  status: "ativo",   mrr: 1290, cards7d: 24, openCards: 6, health: "warn", acerto: 78, conns: 7, connsOk: 6, created: "jan/2024", owner: "Bruna L." },
  { id: "cl_caza",  name: "Caza & Lar",        account_ref: "cazaelar.com",      plan: "Growth",  status: "ativo",   mrr: 1290, cards7d: 31, openCards: 11, health: "err", acerto: 71, conns: 6, connsOk: 4, created: "set/2023", owner: "Kenzo M." },
  { id: "cl_nutri", name: "NutriVita",         account_ref: "nutrivita.com.br",  plan: "Scale",   status: "ativo",   mrr: 2490, cards7d: 42, openCards: 7, health: "ok",   acerto: 84, conns: 7, connsOk: 7, created: "nov/2023", owner: "Diego F." },
  { id: "cl_petz",  name: "PetClube",          account_ref: "petclube.com.br",   plan: "Growth",  status: "ativo",   mrr: 1290, cards7d: 19, openCards: 4, health: "ok",   acerto: 80, conns: 6, connsOk: 6, created: "fev/2024", owner: "Bruna L." },
  { id: "cl_aurora",name: "Aurora Joias",      account_ref: "aurorajoias.com",   plan: "Starter", status: "ativo",   mrr: 590,  cards7d: 12, openCards: 3, health: "ok",   acerto: 76, conns: 5, connsOk: 5, created: "abr/2024", owner: "Diego F." },
  { id: "cl_verde", name: "Verde Cosméticos",  account_ref: "verde.com.br",      plan: "Growth",  status: "trial",   mrr: 0,    cards7d: 16, openCards: 8, health: "warn", acerto: 69, conns: 6, connsOk: 5, created: "mai/2024", owner: "Kenzo M." },
  { id: "cl_tecno", name: "TecnoShop",         account_ref: "tecnoshop.com.br",  plan: "Scale",   status: "ativo",   mrr: 2490, cards7d: 55, openCards: 14, health: "warn", acerto: 81, conns: 7, connsOk: 6, created: "ago/2023", owner: "Diego F." },
  { id: "cl_bella", name: "Bella Calçados",    account_ref: "bellacalcados.com", plan: "Starter", status: "ativo",   mrr: 590,  cards7d: 9,  openCards: 2, health: "ok",   acerto: 74, conns: 5, connsOk: 5, created: "abr/2024", owner: "Bruna L." },
  { id: "cl_organ", name: "Organico Direto",   account_ref: "organicodireto.com",plan: "Growth",  status: "ativo",   mrr: 1290, cards7d: 27, openCards: 6, health: "ok",   acerto: 83, conns: 7, connsOk: 7, created: "out/2023", owner: "Kenzo M." },
  { id: "cl_fit",   name: "FitMove",           account_ref: "fitmove.com.br",    plan: "Growth",  status: "pausado", mrr: 0,    cards7d: 0,  openCards: 5, health: "err",  acerto: 70, conns: 6, connsOk: 2, created: "jul/2023", owner: "Diego F." },
  { id: "cl_decor", name: "Casa Decor",        account_ref: "casadecor.com.br",  plan: "Scale",   status: "ativo",   mrr: 2490, cards7d: 47, openCards: 10, health: "ok",  acerto: 85, conns: 7, connsOk: 7, created: "dez/2023", owner: "Bruna L." },
];

const PLAN_PRICE = { Starter: 590, Growth: 1290, Scale: 2490 };

// ── usuários (auth_users) ───────────────────────────────────
const USERS = [
  { id: "u1", name: "Kenzo Maeda",   email: "kenzo@lumen.com.br",    role: "Gestor",  role_type: "performance_marketer", exp: "advanced",     client: "Lumen Skincare",   lastActive: "há 3 min",  status: "ativo" },
  { id: "u2", name: "Bruna Lima",    email: "bruna@ecommpilot.com",  role: "Operador",role_type: "agency",               exp: "advanced",     client: "— interno",        lastActive: "há 1 h",    status: "ativo" },
  { id: "u3", name: "Diego Farias",  email: "diego@ecommpilot.com",  role: "Operador",role_type: "agency",               exp: "advanced",     client: "— interno",        lastActive: "há 22 min", status: "ativo" },
  { id: "u4", name: "Marina Souza",  email: "marina@vestio.com.br",  role: "Gestor",  role_type: "entrepreneur",         exp: "intermediate", client: "Vestio Moda",      lastActive: "há 2 dias", status: "ativo" },
  { id: "u5", name: "Paulo Reis",    email: "paulo@cazaelar.com",    role: "Gestor",  role_type: "entrepreneur",         exp: "beginner",     client: "Caza & Lar",       lastActive: "há 5 h",    status: "ativo" },
  { id: "u6", name: "Renata Ki",     email: "renata@ecommpilot.com", role: "Superadmin", role_type: "agency",            exp: "advanced",     client: "— interno",        lastActive: "agora",     status: "ativo" },
  { id: "u7", name: "Lucas Antunes", email: "lucas@tecnoshop.com.br",role: "Gestor",  role_type: "performance_marketer", exp: "advanced",     client: "TecnoShop",        lastActive: "há 4 h",    status: "ativo" },
  { id: "u8", name: "Helena Costa",  email: "helena@nutrivita.com.br",role: "Analista",role_type: "performance_marketer",exp: "intermediate", client: "NutriVita",        lastActive: "há 1 dia",  status: "convidado" },
  { id: "u9", name: "Rafael Pinto",  email: "rafael@fitmove.com.br", role: "Gestor",  role_type: "entrepreneur",         exp: "beginner",     client: "FitMove",          lastActive: "há 14 dias",status: "suspenso" },
];

const ROLE_TYPE_LABEL = { performance_marketer: "Performance mkt", entrepreneur: "Empreendedor", agency: "Agência" };
const EXP_LABEL = { beginner: "Iniciante", intermediate: "Intermediário", advanced: "Avançado" };

// ── catálogo de triggers (trigger_catalog) ──────────────────
const TRIGGERS = [
  { trigger_id: "MA-004", name: "ROAS abaixo da meta por 3 dias",        vector: "midia_paga", severity: "critico",      version: "v4", status: "ativo",  fires7d: 38, alert_type: "alerta",       sql: "SELECT campaign_id FROM ad_perf\nWHERE roas < target_roas\nGROUP BY campaign_id\nHAVING count(*) >= 3;", fallback: "Seu ROAS em {campaign} ficou abaixo da meta por {days} dias seguidos." },
  { trigger_id: "MA-011", name: "Frequência de anúncio acima de 4",      vector: "midia_paga", severity: "alto",         version: "v2", status: "ativo",  fires7d: 21, alert_type: "alerta",       sql: "SELECT adset_id FROM ad_perf\nWHERE frequency > 4;", fallback: "A frequência em {adset} passou de 4 — risco de fadiga criativa." },
  { trigger_id: "EM-012", name: "Queda na taxa de abertura de email",    vector: "email",      severity: "alto",         version: "v3", status: "ativo",  fires7d: 17, alert_type: "alerta",       sql: "SELECT campaign FROM email_metrics\nWHERE open_rate < 0.7 * avg_open_rate;", fallback: "A abertura de {campaign} caiu {delta}% vs. média." },
  { trigger_id: "EM-019", name: "Bounce rate de entrega acima de 5%",    vector: "email",      severity: "critico",      version: "v1", status: "ativo",  fires7d: 4,  alert_type: "alerta",       sql: "SELECT * FROM email_metrics\nWHERE bounce_rate > 0.05;", fallback: "Bounce de entrega em {campaign} passou de 5%." },
  { trigger_id: "SEO-008",name: "Queda de posição em keyword principal", vector: "seo",        severity: "medio",        version: "v2", status: "ativo",  fires7d: 12, alert_type: "alerta",       sql: "SELECT keyword FROM gsc_rankings\nWHERE position_delta > 3;", fallback: "A keyword {keyword} caiu {delta} posições na busca." },
  { trigger_id: "G4-002", name: "Queda de conversão no checkout",        vector: "ga4",        severity: "critico",      version: "v5", status: "ativo",  fires7d: 23, alert_type: "alerta",       sql: "SELECT step FROM ga4_funnel\nWHERE conv_rate < 0.7 * baseline;", fallback: "A conversão no checkout caiu {delta}% — possível fricção." },
  { trigger_id: "G4-031", name: "Pico de tráfego direto sem conversão",  vector: "ga4",        severity: "medio",        version: "v1", status: "ativo",  fires7d: 6,  alert_type: "alerta",       sql: "SELECT date FROM ga4_sessions\nWHERE direct_sessions > 2 * avg AND conv = 0;", fallback: "Pico de tráfego direto sem conversão em {date}." },
  { trigger_id: "RT-006", name: "Aumento de churn de assinantes",        vector: "retencao",   severity: "alto",         version: "v2", status: "ativo",  fires7d: 8,  alert_type: "alerta",       sql: "SELECT cohort FROM retention\nWHERE churn_rate > 1.3 * baseline;", fallback: "O churn da coorte {cohort} subiu {delta}%." },
  { trigger_id: "RT-014", name: "Oportunidade de winback de inativos",   vector: "retencao",   severity: "oportunidade", version: "v1", status: "ativo",  fires7d: 5,  alert_type: "oportunidade", sql: "SELECT segment FROM customers\nWHERE days_since_last > 90;", fallback: "{count} clientes inativos prontos para campanha de winback." },
  { trigger_id: "SO-003", name: "Engajamento social acima da média",     vector: "social",     severity: "oportunidade", version: "v1", status: "ativo",  fires7d: 7,  alert_type: "oportunidade", sql: "SELECT post FROM social_metrics\nWHERE engagement > 2 * avg;", fallback: "O post {post} engajou 2x acima da média — considere impulsionar." },
  { trigger_id: "AT-009", name: "Canal subvalorizado na atribuição",     vector: "atribuicao", severity: "oportunidade", version: "v2", status: "rascunho",fires7d: 0, alert_type: "oportunidade", sql: "SELECT channel FROM attribution\nWHERE assisted_conv > 3 * last_click;", fallback: "{channel} assiste muitas conversões mas recebe pouco crédito." },
  { trigger_id: "MA-021", name: "CPA acima do teto por categoria",       vector: "midia_paga", severity: "alto",         version: "v1", status: "pausado", fires7d: 0,  alert_type: "alerta",       sql: "SELECT category FROM ad_perf\nWHERE cpa > category_ceiling;", fallback: "O CPA em {category} passou do teto definido." },
];

const TRIG_STATUS_LABEL = { ativo: "Ativo", rascunho: "Rascunho", pausado: "Pausado" };

// ── saúde das conexões (global, por cliente × vetor) ────────
const CONN_ROWS = [
  { client: "Caza & Lar",      platform: "Instagram · TikTok", vector: "social",     status: "erro",  last_sync: "há 2 dias",  access: "Analista" },
  { client: "Caza & Lar",      platform: "Atribuição",         vector: "atribuicao", status: "erro",  last_sync: "há 3 dias",  access: "Editor" },
  { client: "FitMove",         platform: "Meta Ads",           vector: "midia_paga", status: "erro",  last_sync: "há 9 dias",  access: "Partner" },
  { client: "FitMove",         platform: "GA4",                vector: "ga4",        status: "erro",  last_sync: "há 9 dias",  access: "Editor" },
  { client: "FitMove",         platform: "Klaviyo · email",    vector: "email",      status: "erro",  last_sync: "há 9 dias",  access: "Manager" },
  { client: "FitMove",         platform: "Search Console",     vector: "seo",        status: "erro",  last_sync: "há 9 dias",  access: "Proprietário" },
  { client: "Vestio Moda",     platform: "GA4",                vector: "ga4",        status: "atraso",last_sync: "há 11 h",    access: "Editor" },
  { client: "TecnoShop",       platform: "Search Console",     vector: "seo",        status: "atraso",last_sync: "há 14 h",    access: "Proprietário" },
  { client: "Verde Cosméticos",platform: "Atribuição",         vector: "atribuicao", status: "atraso",last_sync: "há 9 h",     access: "Editor" },
  { client: "Lumen Skincare",  platform: "Meta Ads",           vector: "midia_paga", status: "ok",    last_sync: "há 3 min",   access: "Partner" },
  { client: "NutriVita",       platform: "Google Ads",         vector: "midia_paga", status: "ok",    last_sync: "há 6 min",   access: "Gerente" },
  { client: "Casa Decor",      platform: "Klaviyo · email",    vector: "email",      status: "ok",    last_sync: "há 12 min",  access: "Manager" },
];

// ── faturamento ─────────────────────────────────────────────
const BILLING = {
  mrr: 71400, arr: 856800, churn: 2.1, arpa: 1487,
  plans: [
    { plan: "Starter", price: 590,  clients: 9,  tint: "slate" },
    { plan: "Growth",  price: 1290, clients: 24, tint: "violet" },
    { plan: "Scale",   price: 2490, clients: 15, tint: "teal" },
  ],
  invoices: [
    { id: "INV-2041", client: "Lumen Skincare", plan: "Scale",   amount: 2490, date: "01 jun", status: "pago" },
    { id: "INV-2040", client: "TecnoShop",      plan: "Scale",   amount: 2490, date: "01 jun", status: "pago" },
    { id: "INV-2039", client: "Caza & Lar",     plan: "Growth",  amount: 1290, date: "01 jun", status: "pendente" },
    { id: "INV-2038", client: "Casa Decor",     plan: "Scale",   amount: 2490, date: "01 jun", status: "pago" },
    { id: "INV-2037", client: "Vestio Moda",    plan: "Growth",  amount: 1290, date: "01 jun", status: "pago" },
    { id: "INV-2036", client: "FitMove",        plan: "Growth",  amount: 1290, date: "28 mai", status: "falhou" },
    { id: "INV-2035", client: "Aurora Joias",   plan: "Starter", amount: 590,  date: "28 mai", status: "pago" },
  ],
};

// ── logs / auditoria ────────────────────────────────────────
const LOGS = [
  { id: "lg1", actor: "Renata Ki",   action: "atualizou trigger", target: "MA-004 → v4",            type: "trigger", time: "há 8 min",  level: "info" },
  { id: "lg2", actor: "sistema",     action: "conexão falhou",    target: "FitMove · Meta Ads",     type: "conn",    time: "há 22 min", level: "erro" },
  { id: "lg3", actor: "Diego Farias",action: "pausou cliente",    target: "FitMove",                type: "client", time: "há 1 h",    level: "warn" },
  { id: "lg4", actor: "Bruna Lima",  action: "reconectou",        target: "Vestio · GA4",           type: "conn",    time: "há 2 h",    level: "info" },
  { id: "lg5", actor: "Renata Ki",   action: "criou trigger",     target: "AT-009 (rascunho)",      type: "trigger", time: "há 3 h",    level: "info" },
  { id: "lg6", actor: "sistema",     action: "fatura falhou",     target: "INV-2036 · FitMove",     type: "billing", time: "há 5 h",    level: "erro" },
  { id: "lg7", actor: "Diego Farias",action: "convidou usuário",  target: "helena@nutrivita.com.br",type: "user",    time: "há 6 h",    level: "info" },
  { id: "lg8", actor: "Renata Ki",   action: "alterou plano",     target: "Casa Decor → Scale",     type: "billing", time: "há 1 dia",  level: "info" },
  { id: "lg9", actor: "sistema",     action: "dedup acionada",    target: "G4-002 · 14 cards",      type: "trigger", time: "há 1 dia",  level: "info" },
  { id: "lg10",actor: "Bruna Lima",  action: "suspendeu usuário", target: "rafael@fitmove.com.br",  type: "user",    time: "há 2 dias", level: "warn" },
];

Object.assign(window, {
  VECTORS, VECTOR_ORDER, OPERATOR, SYS, CLIENTS, PLAN_PRICE, USERS,
  ROLE_TYPE_LABEL, EXP_LABEL, TRIGGERS, TRIG_STATUS_LABEL, CONN_ROWS, BILLING, LOGS,
  sUp, sUp2, sFlat, sDip, sWob,
});
