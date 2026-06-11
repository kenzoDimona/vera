// Mobile header — shared across all EcommPilot pages.
// Renders a sticky top bar that opens the sidebar drawer on small screens.
// Body data-nav-open="true" is what triggers the drawer slide-in.

const MobileHeader = ({ title }) => {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    document.body.dataset.navOpen = open ? "true" : "false";
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div className="mobile-header">
        <button className="menu-btn" aria-label="Open menu" onClick={() => setOpen(true)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
        <div className="brand-mark">E</div>
        <div className="brand-name">{title || "EcommPilot"}</div>
        <div className="spacer" />
        <button className="right-btn" aria-label="Notifications">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <span className="ping" />
        </button>
      </div>
      {open && <div className="sidebar-backdrop" onClick={() => setOpen(false)} />}
    </>
  );
};

window.MobileHeader = MobileHeader;
