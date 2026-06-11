// Lucide-style stroke icons. Inline SVGs, currentColor stroke.
const Ico = ({ d, size = 16, sw = 1.6, children, ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
       fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round"
       strokeLinejoin="round" {...rest}>
    {d ? <path d={d} /> : children}
  </svg>
);

const I = {
  Dashboard: (p) => <Ico {...p}><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></Ico>,
  Bell: (p) => <Ico {...p}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></Ico>,
  History: (p) => <Ico {...p}><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l3 2" /></Ico>,
  Plug: (p) => <Ico {...p}><path d="M9 2v6" /><path d="M15 2v6" /><path d="M6 8h12v4a6 6 0 0 1-12 0z" /><path d="M12 18v4" /></Ico>,
  Settings: (p) => <Ico {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></Ico>,
  ChevronDown: (p) => <Ico {...p} d="m6 9 6 6 6-6" />,
  ChevronRight: (p) => <Ico {...p} d="m9 18 6-6-6-6" />,
  Close: (p) => <Ico {...p}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></Ico>,
  ArrowUp: (p) => <Ico {...p}><path d="M12 19V5" /><path d="m5 12 7-7 7 7" /></Ico>,
  ArrowDown: (p) => <Ico {...p}><path d="M12 5v14" /><path d="m19 12-7 7-7-7" /></Ico>,
  ArrowRight: (p) => <Ico {...p}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></Ico>,
  TrendUp: (p) => <Ico {...p}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></Ico>,
  TrendDown: (p) => <Ico {...p}><polyline points="22 17 13.5 8.5 8.5 13.5 2 7" /><polyline points="16 17 22 17 22 11" /></Ico>,
  Sparkle: (p) => <Ico {...p}><path d="M12 3v18" /><path d="M3 12h18" /><path d="m5.6 5.6 12.8 12.8" /><path d="m18.4 5.6-12.8 12.8" /></Ico>,
  Search: (p) => <Ico {...p}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></Ico>,
  Filter: (p) => <Ico {...p} d="M3 6h18M6 12h12M10 18h4" />,
  Refresh: (p) => <Ico {...p}><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></Ico>,
  Check: (p) => <Ico {...p} d="M20 6 9 17l-5-5" />,
  Eye: (p) => <Ico {...p}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7" /><circle cx="12" cy="12" r="3" /></Ico>,
  EyeOff: (p) => <Ico {...p}><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 8 10 8a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 8 10 8a9.74 9.74 0 0 0 5.39-1.61" /><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" /><path d="m2 2 20 20" /></Ico>,
  ThumbsUp: (p) => <Ico {...p}><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.34-7.16a1 1 0 0 1 1.66.18Z" /></Ico>,
  ThumbsDown: (p) => <Ico {...p}><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.34 7.16a1 1 0 0 1-1.66-.18Z" /></Ico>,
  Cart: (p) => <Ico {...p}><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /><path d="M3 4h2.5l2.7 11.2a2 2 0 0 0 2 1.5h7.6a2 2 0 0 0 2-1.5L21 8H6" /></Ico>,
  Users: (p) => <Ico {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></Ico>,
  Coin: (p) => <Ico {...p}><circle cx="12" cy="12" r="9" /><path d="M14.5 9.5a3 3 0 1 0 0 5h-5a3 3 0 0 1 0-5z" /></Ico>,
  Target: (p) => <Ico {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></Ico>,
  Megaphone: (p) => <Ico {...p}><path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></Ico>,
  Box: (p) => <Ico {...p}><path d="M21 8 12 3 3 8v8l9 5 9-5z" /><path d="M3 8 12 13 21 8" /><path d="M12 13v8" /></Ico>,
  More: (p) => <Ico {...p}><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></Ico>,
  Lightning: (p) => <Ico {...p} d="m13 2-9 13h7l-1 7 9-13h-7l1-7z" />,
  Calendar: (p) => <Ico {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></Ico>,
  Pause: (p) => <Ico {...p}><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></Ico>,
  Play: (p) => <Ico {...p} d="M6 4v16l14-8z" />,
  Download: (p) => <Ico {...p}><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></Ico>,
  Clock: (p) => <Ico {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Ico>,
};

window.I = I;
