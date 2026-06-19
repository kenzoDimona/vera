// Lucide-style stroke icons + brand platform marks

const Ico = ({ d, size = 16, sw = 1.6, children, ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
       fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round"
       strokeLinejoin="round" {...rest}>
    {d ? <path d={d} /> : children}
  </svg>
);

export const I = {
  // nav
  Dashboard: (p) => <Ico {...p}><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></Ico>,
  Columns: (p) => <Ico {...p}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18M15 3v18" /></Ico>,
  Bell: (p) => <Ico {...p}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></Ico>,
  Results: (p) => <Ico {...p}><path d="M3 3v18h18" /><path d="m7 14 3-3 3 3 5-6" /><circle cx="7" cy="14" r="0.6" fill="currentColor" /></Ico>,
  Settings: (p) => <Ico {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></Ico>,

  // chevrons / arrows
  ChevronDown: (p) => <Ico {...p} d="m6 9 6 6 6-6" />,
  ChevronRight: (p) => <Ico {...p} d="m9 18 6-6-6-6" />,
  ChevronUp: (p) => <Ico {...p} d="m18 15-6-6-6 6" />,
  ArrowUp: (p) => <Ico {...p}><path d="M12 19V5" /><path d="m5 12 7-7 7 7" /></Ico>,
  ArrowDown: (p) => <Ico {...p}><path d="M12 5v14" /><path d="m19 12-7 7-7-7" /></Ico>,
  ArrowRight: (p) => <Ico {...p}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></Ico>,
  Close: (p) => <Ico {...p}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></Ico>,

  // status / signal
  TrendUp: (p) => <Ico {...p}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></Ico>,
  TrendDown: (p) => <Ico {...p}><polyline points="22 17 13.5 8.5 8.5 13.5 2 7" /><polyline points="16 17 22 17 22 11" /></Ico>,
  Sparkle: (p) => <Ico {...p}><path d="M12 3v18" /><path d="M3 12h18" /><path d="m5.6 5.6 12.8 12.8" /><path d="m18.4 5.6-12.8 12.8" /></Ico>,
  Lightning: (p) => <Ico {...p} d="m13 2-9 13h7l-1 7 9-13h-7l1-7z" />,
  Check: (p) => <Ico {...p} d="M20 6 9 17l-5-5" />,
  CircleCheck: (p) => <Ico {...p}><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 4.5-5" /></Ico>,
  Triangle: (p) => <Ico {...p}><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></Ico>,
  Clock: (p) => <Ico {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Ico>,
  Snooze: (p) => <Ico {...p}><circle cx="12" cy="13" r="8" /><path d="M5 3 2 6M22 6l-3-3M9 10h6l-6 6h6" /></Ico>,
  Flag: (p) => <Ico {...p}><path d="M4 22V4M4 4h13l-2 4 2 4H4" /></Ico>,
  Inbox: (p) => <Ico {...p}><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.7 4H7.3a2 2 0 0 0-1.8 1.1z" /></Ico>,

  // controls / actions
  Search: (p) => <Ico {...p}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></Ico>,
  Filter: (p) => <Ico {...p} d="M3 6h18M6 12h12M10 18h4" />,
  Refresh: (p) => <Ico {...p}><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></Ico>,
  Eye: (p) => <Ico {...p}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7" /><circle cx="12" cy="12" r="3" /></Ico>,
  More: (p) => <Ico {...p}><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></Ico>,
  Plus: (p) => <Ico {...p}><path d="M12 5v14M5 12h14" /></Ico>,
  Pencil: (p) => <Ico {...p}><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" /></Ico>,
  Download: (p) => <Ico {...p}><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></Ico>,
  Calendar: (p) => <Ico {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></Ico>,
  User: (p) => <Ico {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" /></Ico>,
  Mail: (p) => <Ico {...p}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 6 10-6" /></Ico>,
  Link: (p) => <Ico {...p}><path d="M9 17H7A5 5 0 0 1 7 7h2M15 7h2a5 5 0 0 1 0 10h-2M8 12h8" /></Ico>,
  Unlink: (p) => <Ico {...p}><path d="M9 17H7A5 5 0 0 1 7 7M15 7h2a5 5 0 0 1 3.5 8.5M2 2l20 20" /></Ico>,
  Hand: (p) => <Ico {...p}><path d="M18 11V6a2 2 0 0 0-4 0M14 10V4a2 2 0 0 0-4 0v2M10 10.5V6a2 2 0 0 0-4 0v8" /><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2a8 8 0 0 1-7.7-6L3.2 13a2 2 0 0 1 3.6-1.7L8 14" /></Ico>,

  // metrics
  Coin: (p) => <Ico {...p}><circle cx="12" cy="12" r="9" /><path d="M14.5 9.5a3 3 0 1 0 0 5h-5a3 3 0 0 1 0-5z" /></Ico>,
  Cart: (p) => <Ico {...p}><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /><path d="M3 4h2.5l2.7 11.2a2 2 0 0 0 2 1.5h7.6a2 2 0 0 0 2-1.5L21 8H6" /></Ico>,
  Target: (p) => <Ico {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></Ico>,
  Gauge: (p) => <Ico {...p}><path d="M12 14 15 9" /><path d="M3.6 16a9 9 0 1 1 16.8 0" /><circle cx="12" cy="14" r="1.4" fill="currentColor" stroke="none" /></Ico>,

  // platform marks
  Meta: (p) => <Ico {...p} sw={p.sw || 1.8}><path d="M2 14c0-4 2-7 4.5-7 3.5 0 5 10 8.5 10 2 0 3-2 3-5s-1-5-3-5c-3.5 0-5 10-8.5 10C4 17 2 16 2 14z" /></Ico>,
  Google: (p) => <Ico {...p}><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></Ico>,
  Analytics: (p) => <Ico {...p}><rect x="3" y="12" width="4" height="9" rx="1.5" /><rect x="10" y="7" width="4" height="14" rx="1.5" /><rect x="17" y="3" width="4" height="18" rx="1.5" /></Ico>,
  Megaphone: (p) => <Ico {...p}><path d="M3 11v2a1 1 0 0 0 1 1h2l9 5V5L6 10H4a1 1 0 0 0-1 1z" /><path d="M18.5 8a4 4 0 0 1 0 8" /></Ico>,
  SocialV: (p) => <Ico {...p}><circle cx="18" cy="5" r="2.6" /><circle cx="6" cy="12" r="2.6" /><circle cx="18" cy="19" r="2.6" /><path d="m8.4 13.4 7.2 4.2M15.6 6.4 8.4 10.6" /></Ico>,
  Repeat: (p) => <Ico {...p}><path d="m17 2 4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><path d="m7 22-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></Ico>,
  Chat: (p) => <Ico {...p}><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" /></Ico>,
  Send: (p) => <Ico {...p}><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4 20-7z" /></Ico>,
  Sparkles: (p) => <Ico {...p}><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" /><path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14z" /></Ico>,
  Users: (p) => <Ico {...p}><circle cx="9" cy="8" r="3.4" /><path d="M3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1" /><path d="M16 4.2a3.4 3.4 0 0 1 0 6.6M21 20v-1a5 5 0 0 0-3.5-4.8" /></Ico>,
  ThumbsUp: (p) => <Ico {...p}><path d="M7 10v11H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z" /><path d="M7 10l4-7a2 2 0 0 1 2 2v3h5.5a2 2 0 0 1 2 2.4l-1.4 7A2 2 0 0 1 17 21H7" /></Ico>,
  ThumbsDown: (p) => <Ico {...p}><path d="M17 14V3h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1z" /><path d="M17 14l-4 7a2 2 0 0 1-2-2v-3H5.5a2 2 0 0 1-2-2.4l1.4-7A2 2 0 0 1 7 3h10" /></Ico>,

  // onboarding / contexto
  Rocket: (p) => <Ico {...p}><path d="M5 16c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2 0-2.8a2 2 0 0 0-3 0z" /><path d="M9 12a14 14 0 0 1 7-9c2.5 0 5 2.5 5 5a14 14 0 0 1-9 7" /><path d="M9 12l3 3" /><circle cx="15" cy="9" r="1.4" /></Ico>,
  Shield: (p) => <Ico {...p}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" /><path d="m9 12 2 2 4-4" /></Ico>,
  Shield2: (p) => <Ico {...p}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" /></Ico>,
  Scissors: (p) => <Ico {...p}><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12" /></Ico>,
  Launch: (p) => <Ico {...p}><path d="M12 3v6M9 6l3-3 3 3" /><rect x="4" y="9" width="16" height="12" rx="2" /><path d="M4 14h16" /></Ico>,
  Anchor: (p) => <Ico {...p}><circle cx="12" cy="5" r="2.4" /><path d="M12 7.4V21M5 12a7 7 0 0 0 14 0M5 12H3m16 0h2" /></Ico>,
  Lock: (p) => <Ico {...p}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></Ico>,
  ArrowLeft: (p) => <Ico {...p}><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></Ico>,
};
