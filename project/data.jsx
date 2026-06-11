// Mock data for Lumen Skincare — a DTC skincare brand using EcommPilot.

// Generate semi-realistic series for sparklines.
const seriesUp   = [42, 44, 41, 46, 48, 45, 49, 52, 51, 55, 58, 57, 62, 64];
const seriesDown = [62, 60, 63, 61, 58, 59, 55, 52, 49, 45, 42, 38, 36, 32];
const seriesFlat = [50, 52, 49, 51, 50, 53, 50, 49, 51, 50, 52, 51, 50, 51];
const seriesDip  = [55, 57, 56, 58, 59, 56, 54, 49, 41, 35, 38, 42, 45, 48];
const seriesSpike= [40, 42, 41, 43, 44, 43, 45, 48, 52, 58, 64, 68, 72, 75];
const seriesWobble=[48, 51, 49, 52, 47, 50, 53, 49, 52, 48, 51, 50, 53, 51];

const STORE = {
  name: "Lumen Skincare",
  url: "lumenskincare.com",
  initials: "LS",
};

const METRICS = [
  { key: "revenue",  label: "Revenue 7d",        value: "$184,206", deltaText: "+12.4%", direction: "up",   series: seriesUp,   icon: "Coin" },
  { key: "sessions", label: "Sessions 7d",       value: "248,931",  deltaText: "−4.2%",  direction: "down", series: seriesWobble, icon: "Users" },
  { key: "conv",     label: "Conv. rate",        value: "2.41%",    deltaText: "−0.38pp",direction: "down", series: seriesDip,  icon: "Target" },
  { key: "aov",      label: "Avg. order value",  value: "$78.12",   deltaText: "+$3.04", direction: "up",   series: seriesUp,   icon: "Cart" },
  { key: "cac",      label: "Blended CAC",       value: "$32.18",   deltaText: "+18.6%", direction: "down", series: seriesSpike,icon: "Megaphone" },
];

const ALERTS = [
  {
    id: "a1",
    severity: "critical",
    category: "drop",
    metric: "Conversion Rate",
    source: "Google Analytics 4",
    timeAgo: "12 min ago",
    headline: "Checkout conversion dropped 32% on mobile in the last 6 hours",
    narrative: "Mobile checkout completions fell from {prev|3.1%} to {now|2.1%} between 10am–4pm today. Desktop is unaffected. The drop coincides with a deploy of the new Apple Pay button at 9:47am.",
    chartLabel: "Mobile checkout conv.",
    chartCurrent: "2.1%",
    series: seriesDip,
    chartDomain: [30, 65],
    causes: [
      { confidence: "92%", text: "Apple Pay button deploy at 9:47am — error rate on /checkout/payment up 8.4×" },
      { confidence: "61%", text: "iOS Safari 17.4 release — historically associated with payment SDK regressions" },
      { confidence: "23%", text: "Increased traffic from a paid social campaign with lower-intent visitors" },
    ],
    actions: [
      { title: "Roll back the Apple Pay deploy", desc: "Revert commit a3f8c2 — restores the previous payment flow within 4 minutes.", cta: "Open in Shopify" },
      { title: "Open a Sentry investigation", desc: "47 unique errors captured on /checkout/payment since 9:47am.", cta: "View errors" },
      { title: "Pause Meta mobile campaigns", desc: "Estimated $4,200/day spend going to a broken funnel.", cta: "Pause campaigns" },
    ],
  },
  {
    id: "a2",
    severity: "good",
    category: "opportunity",
    metric: "Revenue",
    source: "Meta Ads · GA4",
    timeAgo: "1 hr ago",
    headline: "“Vitamin C Serum” is breaking out — ROAS up 2.4× over the last 48 hours",
    narrative: "Spend of {prev|$1,840} on the Vitamin C Serum campaign returned {now|$8,210} (ROAS 4.46). Budget is currently capped at $2,000/day. Lookalike audience LAL-3% is driving 71% of conversions.",
    chartLabel: "Campaign ROAS",
    chartCurrent: "4.46×",
    series: seriesSpike,
    chartDomain: [1.5, 5],
    causes: [
      { confidence: "84%", text: "New UGC creative “before/after 30 days” went live Mon — CTR 4.1% vs. account avg 1.6%" },
      { confidence: "58%", text: "Influencer mention by @skinwithjenna (412k followers) on Sunday" },
      { confidence: "41%", text: "Seasonal — Vitamin C searches up 22% MoM heading into spring" },
    ],
    actions: [
      { title: "Raise daily budget to $5,000", desc: "Projected to capture an additional $14k/day at current ROAS.", cta: "Update in Meta" },
      { title: "Duplicate winning ad to TikTok", desc: "The UGC creative format historically performs 1.8× on TikTok for this account.", cta: "Open creative" },
      { title: "Restock SKU LUM-VITC-30", desc: "At current pace, inventory runs out in 6 days.", cta: "Notify ops" },
    ],
  },
  {
    id: "a3",
    severity: "warning",
    category: "anomaly",
    metric: "CAC",
    source: "Google Ads",
    timeAgo: "3 hr ago",
    headline: "Google Ads CPC up 41% on branded keywords since Friday",
    narrative: "Average CPC on the “Lumen Skincare” brand campaign rose from {prev|$0.62} to {now|$0.88}. Impression share lost to rank dropped 14 points. A new competitor is bidding on your brand terms.",
    chartLabel: "Branded CPC",
    chartCurrent: "$0.88",
    series: seriesSpike,
    chartDomain: [0.5, 1.0],
    causes: [
      { confidence: "76%", text: "Competitor “glowmade.co” started bidding on Lumen brand terms Friday 4pm" },
      { confidence: "52%", text: "Google Ads auction-insights data showing 3 new advertisers in the auction" },
      { confidence: "18%", text: "Quality score drop — landing page experience flagged as below average" },
    ],
    actions: [
      { title: "Submit a brand-bidding complaint", desc: "Trademark protection request — typical resolution in 3–5 business days.", cta: "Open form" },
      { title: "Increase brand bid by 15%", desc: "Recover lost impression share while the complaint is pending.", cta: "Update bids" },
      { title: "Add negative match to non-brand", desc: "Prevent your generic campaigns from cannibalizing brand traffic.", cta: "Apply" },
    ],
  },
  {
    id: "a4",
    severity: "warning",
    category: "drop",
    metric: "Sessions",
    source: "GA4 · Search Console",
    timeAgo: "Yesterday",
    headline: "Organic landing-page sessions fell 18% week over week",
    narrative: "Organic traffic to /collections/serums dropped from {prev|14,812} to {now|12,140} sessions WoW. Position for “best vitamin c serum” fell from #4 to #11. The page hasn’t changed; this looks like a SERP layout update.",
    chartLabel: "Organic sessions /serums",
    chartCurrent: "12,140",
    series: seriesDown,
    chartDomain: [10000, 16000],
    causes: [
      { confidence: "68%", text: "Google rolled out a new “Shop” module above organic results for serum queries" },
      { confidence: "44%", text: "Two new editorial articles from Vogue and Allure outranking the collection page" },
      { confidence: "31%", text: "Possible Core Web Vitals regression — LCP up to 2.8s on mobile" },
    ],
    actions: [
      { title: "Add Product schema to /serums", desc: "Get inclusion in Google Shop module — may take 7–14 days to propagate.", cta: "Implement" },
      { title: "Pitch editorial coverage", desc: "Reach out to 4 publications with similar serum roundups.", cta: "Open list" },
      { title: "Run a Lighthouse audit", desc: "Confirm whether mobile LCP regression is contributing.", cta: "Run audit" },
    ],
  },
  {
    id: "a5",
    severity: "good",
    category: "opportunity",
    metric: "AOV",
    source: "Shopify",
    timeAgo: "Yesterday",
    headline: "Bundle attach rate climbing — “Glow Set” drove +$12 AOV on Friday",
    narrative: "The recently-launched “Glow Set” bundle now appears on {now|34%} of carts vs. {prev|11%} last week. Customers buying the bundle have a {now|$96} AOV vs. {prev|$71} for non-bundle orders.",
    chartLabel: "Bundle attach rate",
    chartCurrent: "34%",
    series: seriesUp,
    chartDomain: [10, 40],
    causes: [
      { confidence: "81%", text: "PDP cross-sell module added Wednesday is showing 12% click-through" },
      { confidence: "57%", text: "Email campaign “Glow Set Friday” drove 4,200 sessions to bundle PDP" },
      { confidence: "22%", text: "Seasonal demand for multi-product skincare routines" },
    ],
    actions: [
      { title: "Promote bundle on the homepage hero", desc: "Estimated 18% additional bundle attach based on traffic share.", cta: "Open theme" },
      { title: "Build a “bundle and save” email flow", desc: "Trigger after first order completion — expected +$3 LTV per recipient.", cta: "Open Klaviyo" },
    ],
  },
  {
    id: "a6",
    severity: "info",
    category: "trend",
    metric: "Sessions",
    source: "GA4",
    timeAgo: "Yesterday",
    headline: "Email is now your second-largest channel — overtook organic search",
    narrative: "Email-driven sessions reached {now|18.2%} of total traffic over the last 7 days, surpassing organic search ({now|17.4%}) for the first time. Driven by the new welcome flow and a 22% list growth this quarter.",
    chartLabel: "Email share of sessions",
    chartCurrent: "18.2%",
    series: seriesUp,
    chartDomain: [10, 22],
    causes: [
      { confidence: "72%", text: "New 5-step welcome flow launched 6 weeks ago — open rate 58%" },
      { confidence: "49%", text: "List growth +22% from a quiz-based lead magnet" },
    ],
    actions: [
      { title: "Audit deliverability", desc: "Email volume is up — confirm domain reputation and inbox placement.", cta: "Open report" },
    ],
  },
  {
    id: "a7",
    severity: "info",
    category: "trend",
    metric: "Sessions",
    source: "GA4",
    timeAgo: "2 days ago",
    headline: "Mobile share of traffic crossed 80% for the first time",
    narrative: "Mobile sessions reached {now|81.4%} of total traffic this week, up from {prev|74.1%} a year ago. Desktop conversion is still {now|2.1×} higher than mobile — there’s leverage in closing that gap.",
    chartLabel: "Mobile traffic share",
    chartCurrent: "81.4%",
    series: seriesUp,
    chartDomain: [70, 85],
    causes: [
      { confidence: "70%", text: "Continuing structural shift in DTC traffic mix" },
    ],
    actions: [
      { title: "Run mobile checkout teardown", desc: "Identify top 3 friction points contributing to the conv. gap.", cta: "Schedule" },
    ],
  },
];

window.STORE = STORE;
window.METRICS = METRICS;
window.ALERTS = ALERTS;
