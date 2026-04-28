"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MarketingDashboard } from "@/components/ui/dashboard-1";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { UsernameSetupModal } from "@/components/dashboard/UsernameSetupModal";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const barsData = [
  { d: "S", v: 2 },
  { d: "M", v: 5 },
  { d: "T", v: 3 },
  { d: "W", v: 7 },
  { d: "T", v: 6 },
  { d: "F", v: 9 },
  { d: "S", v: 4 },
];
const MAX_V = 9;

const checklistTasks = [
  { id: 1, title: "Client Meeting", time: "Sep 13, 04:30" },
  { id: 2, title: "Design Review", time: "Sep 14, 10:40" },
  { id: 3, title: "Project Update", time: "Sep 15, 13:00" },
  { id: 4, title: "Discuss Q3 Goals", time: "Sep 18, 14:48" },
  { id: 5, title: "HR Policy Review", time: "Sep 19, 16:00" },
];

const pillsData = [
  { label: "Pending", w: 25 },
  { label: "In Review", w: 50 },
  { label: "Completed", w: 46 },
  { label: "Output", w: 65 },
];

const cBarsData = [
  { label: "Task", fill: "#fff", w: 42 },
  { label: "Review", fill: "rgba(255,255,255,.55)", w: 25 },
  { label: "Done", fill: "rgba(255,255,255,.22)", w: 5 },
];

// ─── InfoRow subcomponent ─────────────────────────────────────────────────────

function InfoRow({ icon, label, count, isLast }: { icon: string; label: string; count: string; isLast: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid", gridTemplateColumns: "40px 1fr auto",
        alignItems: "center", gap: "16px", padding: "14px 16px",
        background: hovered ? "rgba(255,255,255,0.05)" : "transparent",
        borderRadius: "14px",
        cursor: "pointer",
        transition: "all 0.2s",
        marginBottom: isLast ? "0" : "6px",
      }}
    >
      <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "18px" }}>{icon}</span>
      </div>
      <span style={{ fontSize: "15px", color: "#ffffff", fontWeight: 600, fontFamily: "Titillium Web, sans-serif" }}>{label}</span>
      <span style={{ fontSize: "15px", color: "#ffffff", fontWeight: 700, fontFamily: "Share Tech, monospace" }}>{count}</span>
    </div>
  );
}

// ─── Counter hook ─────────────────────────────────────────────────────────────

function useCounter(target: number, active: boolean, duration = 1500) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / (1000 / 60));
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(t); }
      else setVal(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(t);
  }, [active, target, duration]);
  return val;
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function HomeDashboardContent() {
  const [ready, setReady] = useState(false);
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [barHeights, setBarHeights] = useState<number[]>(barsData.map(() => 0));
  const [pillWidths, setPillWidths] = useState<number[]>(pillsData.map(() => 0));
  const [cBarWidths, setCBarWidths] = useState<number[]>(cBarsData.map(() => 0));
  const [statAnim, setStatAnim] = useState([false, false, false]);

  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [mounted, setMounted] = useState(false);

  // Guard: don't render anything on server — prevents ALL Dark Reader hydration mismatches
  useEffect(() => { setMounted(true); }, []);

  // Initialize displayName from session once loaded
  useEffect(() => {
    if (session?.user?.name) setDisplayName(session.user.name);
  }, [session]);

  // Show modal on first visit (new device/browser = no localStorage flag)
  // Also show when coming from signup with ?new_user=1
  useEffect(() => {
    const isNewUser = searchParams.get('new_user') === '1';
    const hasSetName = localStorage.getItem('opal_name_set');

    if (isNewUser) {
      // Clean URL immediately — refresh won't re-trigger
      window.history.replaceState({}, '', '/dashboard');
    }

    if (!hasSetName || isNewUser) {
      const t = setTimeout(() => setShowModal(true), 800);
      return () => clearTimeout(t);
    }
  }, [searchParams]);

  const handleNameSet = (newName: string) => {
    localStorage.setItem('opal_name_set', 'true');
    setDisplayName(newName);
    setShowModal(false);
    // Notify all avatar components across the dashboard
    window.dispatchEvent(new CustomEvent('opal:nameUpdated', { detail: { name: newName } }));
  };

  const handleSkip = () => {
    localStorage.setItem('opal_name_set', 'true'); // mark as seen even if skipped
    setShowModal(false);
  };

  // Timer
  const [timerSecs, setTimerSecs] = useState(225);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const c1 = useCounter(92, ready);
  const c2 = useCounter(75, ready);
  const c3 = useCounter(315, ready);

  // GSAP ScrollTrigger and text reveal animations
  const containerRef = useRef<HTMLDivElement>(null);
  const greetingRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mounted) return; // wait until real UI is rendered
    const ctx = gsap.context(() => {
      // Initial load animation
      const tl = gsap.timeline({ delay: 0.2 });

      // Text reveal for greeting
      tl.fromTo(
        ".greeting-text",
        { y: 60, opacity: 0, clipPath: "inset(100% 0 0 0)" },
        { y: 0, opacity: 1, clipPath: "inset(0% 0 0 0)", duration: 1, ease: "power3.out" }
      )
        .fromTo(
          ".sub-greeting",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
          "-=0.6"
        )
        .fromTo(
          ".stat-number",
          { y: 40, opacity: 0, scale: 0.8 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)" },
          "-=0.4"
        )
        .fromTo(
          ".stat-label",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
          "-=0.3"
        )
        .fromTo(
          ".pill-row",
          { x: -30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
          "-=0.4"
        );

      // ScrollTrigger animations for grid cards
      gsap.utils.toArray<HTMLElement>(".gsap-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 60, opacity: 0, rotateX: 15 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "top 50%",
              toggleActions: "play none none reverse",
            },
            delay: i * 0.08,
          }
        );
      });

      // Text reveal for section headers
      gsap.utils.toArray<HTMLElement>(".section-header").forEach((header) => {
        gsap.fromTo(
          header,
          { y: 30, opacity: 0, clipPath: "inset(0 100% 0 0)" },
          {
            y: 0,
            opacity: 1,
            clipPath: "inset(0 0% 0 0)",
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: header,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Number counter animation with text reveal
      gsap.utils.toArray<HTMLElement>(".counter-number").forEach((num) => {
        const target = parseInt(num.dataset.value || "0");
        gsap.fromTo(
          num,
          { textContent: 0, opacity: 0, scale: 0.5 },
          {
            textContent: target,
            opacity: 1,
            scale: 1,
            duration: 2,
            ease: "power2.out",
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: num,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Stagger list items
      gsap.fromTo(
        ".list-item",
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".list-container",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Bar chart animation
      gsap.fromTo(
        ".bar-item",
        { scaleY: 0, transformOrigin: "bottom" },
        {
          scaleY: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".bar-chart",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Set ready state
      setReady(true);

      // Existing animations
      [0, 1, 2].forEach((i) => {
        setTimeout(() => {
          setStatAnim((prev) => { const n = [...prev]; n[i] = true; return n; });
        }, 800 + i * 120);
      });

      pillsData.forEach((p, i) => {
        setTimeout(() => {
          setPillWidths((prev) => { const n = [...prev]; n[i] = p.w; return n; });
        }, 800 + i * 90);
      });

      cBarsData.forEach((_, i) => {
        setTimeout(() => {
          setCBarWidths((prev) => { const n = [...prev]; n[i] = cBarsData[i].w; return n; });
        }, 1000 + i * 100);
      });

      barsData.forEach((b, i) => {
        setTimeout(() => {
          setBarHeights((prev) => { const n = [...prev]; n[i] = (b.v / MAX_V) * 100; return n; });
        }, 800 + i * 65);
      });
    }, containerRef);

    return () => ctx.revert();
  }, [mounted]);

  // Timer logic
  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setTimerSecs((s) => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running]);

  const toggleTimer = () => setRunning((r) => !r);
  const resetTimer = () => {
    setRunning(false);
    setTimerSecs(0);
  };

  const toggleTask = (id: number) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const doneCount = Object.values(checked).filter(Boolean).length;
  const circ = 263.9;
  const timerPct = (timerSecs % 3600) / 3600;
  const strokeOffset = circ - timerPct * circ;
  const timerDisplay = `${String(Math.floor(timerSecs / 60)).padStart(2, "0")}:${String(timerSecs % 60).padStart(2, "0")}`;

  // Prevent hydration mismatch by using consistent font-family string
  const fontPrimary = "Share Tech, monospace";
  const fontSecondary = "Titillium Web, sans-serif";

  // Server renders nothing — Dark Reader can't mutate what doesn't exist
  if (!mounted) {
    return <div suppressHydrationWarning style={{ background: '#000000', minHeight: '100vh', width: '100%' }} />;
  }

  return (
    <div suppressHydrationWarning style={{ fontFamily: `${fontPrimary}, ${fontSecondary}, system-ui, sans-serif`, background: "#000000", height: "100vh", width: "100vw", display: "flex", flexDirection: "column", overflow: "hidden", color: "#ffffff" }}>
      <div style={{ width: "100%", flex: 1, overflow: "auto" }}>
        {/* ── BODY ── */}
        <div style={{ padding: "40px 48px", width: "100%", boxSizing: "border-box" }}>

          {/* ── WELCOME ROW ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", alignItems: "start", gap: "24px", marginBottom: "24px" }}>

            {/* Greeting */}
            <div ref={greetingRef}>
              <h1 className="greeting-text" style={{
                fontSize: "clamp(40px, 4vw, 56px)", fontWeight: 400, letterSpacing: "0.05em", color: "#ffffff", lineHeight: 1.1,
                fontFamily: "Share Tech, monospace",
                textTransform: "uppercase",
                willChange: "transform, opacity, clip-path",
              }}>
                WELCOME BACK{displayName ? `, ${displayName.toUpperCase()}` : ''}
              </h1>
              <p className="sub-greeting" style={{
                fontSize: "16px", fontWeight: 400, color: "rgba(255,255,255,0.6)", marginTop: "12px",
                fontFamily: "Titillium Web, sans-serif",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                willChange: "transform, opacity",
              }}>
                HERE&apos;S YOUR TASK OVERVIEW FOR TODAY.
              </p>
            </div>

            {/* Pills */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: "250px" }}>
              {pillsData.map((p, i) => (
                <div key={p.label} className="pill-row" style={{ display: "grid", gridTemplateColumns: "76px 1fr 34px", alignItems: "center", gap: "8px", willChange: "transform, opacity" }}>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "Titillium Web, sans-serif" }}>{p.label}</span>
                  <div style={{ height: "28px", background: "rgba(255,255,255,0.1)", borderRadius: "14px", overflow: "hidden" }}>
                    <div style={{ height: "100%", background: "#ffffff", borderRadius: "14px", width: `${pillWidths[i]}%`, transition: "width 1s cubic-bezier(0.22,1,0.36,1)" }} />
                  </div>
                  <span className="counter-number" data-value={p.w} style={{ fontSize: "14px", color: "#ffffff", fontWeight: 700, textAlign: "right", fontFamily: "Share Tech, monospace" }}>{p.w}%</span>
                </div>
              ))}
            </div>

            {/* Big Stats */}
            <div ref={statsRef} style={{ display: "flex", gap: "22px", alignItems: "flex-start" }}>
              {[
                { icon: "✓", num: c1, label: "Tasks Done", id: 0 },
                { icon: "○", num: c2, label: "In Progress", id: 1 },
                { icon: "◆", num: c3, label: "Total Tasks", id: 2 },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: "center", minWidth: "80px" }}>
                  <div className="stat-label" style={{ fontSize: "20px", color: statAnim[s.id] ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.3)", marginBottom: "6px", transition: "color 0.5s" }}>{s.icon}</div>
                  <span className="stat-number counter-number" data-value={s.num} style={{ fontSize: "clamp(48px, 5vw, 64px)", fontWeight: 400, letterSpacing: "0.02em", color: "#ffffff", lineHeight: 1, fontFamily: "Share Tech, monospace", display: "block", willChange: "transform, opacity" }}>{s.num}</span>
                  <p className="stat-label" style={{ fontSize: "13px", color: statAnim[s.id] ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.4)", marginTop: "8px", transition: "color 0.5s", fontFamily: "Titillium Web, sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</p>
                </div>
              ))}
            </div>

          </div>

          {/* ── MAIN GRID ── */}
          <div ref={gridRef} style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "auto auto auto",
            gap: "24px",
            alignItems: "start"
          }}>

            {/* PROFILE AVATAR CARD */}
            <div style={{ gridColumn: "1", gridRow: "1", background: "#0a0a0a", borderRadius: "28px", border: "1px solid rgba(255,255,255,0.1)", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "280px", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", gap: "16px" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-8px)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(14,165,233,0.25)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "none"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
            >
              {/* Large Avatar Circle */}
              <div style={{ position: "relative" }}>
                <div style={{
                  width: "120px", height: "120px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #0284c7, #0ea5e9)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "Share Tech, monospace", fontSize: "2.4rem",
                  color: "#ffffff", letterSpacing: "0.05em",
                  boxShadow: "0 0 0 4px rgba(14,165,233,0.15), 0 0 40px rgba(14,165,233,0.25)",
                  transition: "all 0.3s ease",
                }}>
                  {displayName ? displayName.trim().split(/\s+/).map((w: string) => w[0].toUpperCase()).slice(0, 2).join('') : '?'}
                </div>
                {/* Online indicator */}
                <div style={{
                  position: "absolute", bottom: "6px", right: "6px",
                  width: "18px", height: "18px", borderRadius: "50%",
                  background: "#22c55e", border: "3px solid #0a0a0a",
                }} />
              </div>

              {/* Name */}
              <div style={{ textAlign: "center" }}>
                <p style={{
                  fontSize: "1.1rem", fontWeight: 400, color: "#ffffff",
                  fontFamily: "Share Tech, monospace", letterSpacing: "0.08em",
                  textTransform: "uppercase", margin: 0,
                }}>
                  {displayName || 'Your Name'}
                </p>
                <p style={{
                  fontSize: "0.75rem", color: "rgba(14,165,233,0.7)",
                  fontFamily: "Titillium Web, sans-serif", margin: "4px 0 0 0",
                  letterSpacing: "0.15em", textTransform: "uppercase",
                }}>
                  ● Active Now
                </p>
              </div>

              {/* Accent line */}
              <div style={{
                height: "1px", width: "60%",
                background: "linear-gradient(90deg, transparent, rgba(14,165,233,0.4), transparent)",
              }} />

              {/* Stats row */}
              <div style={{ display: "flex", gap: "24px" }}>
                {[{ val: "92", label: "Done" }, { val: "23", label: "Active" }, { val: "★", label: "Top" }].map(s => (
                  <div key={s.label} style={{ textAlign: "center" }}>
                    <p style={{ fontSize: "1.1rem", color: "#ffffff", fontFamily: "Share Tech, monospace", margin: 0 }}>{s.val}</p>
                    <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", fontFamily: "Titillium Web, sans-serif", margin: "2px 0 0 0", textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* PROGRESS */}
            <div style={{ gridColumn: "2", gridRow: "1", background: "#0a0a0a", borderRadius: "28px", border: "1px solid rgba(255,255,255,0.1)", padding: "32px", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", minHeight: "280px" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-8px)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.2)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "none"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#ffffff", fontFamily: "Titillium Web, sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>PROGRESS</h3>
                <span style={{ fontSize: "20px", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>↗</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "16px" }}>
                <span style={{ fontSize: "40px", fontWeight: 400, letterSpacing: "0.02em", color: "#ffffff", fontFamily: "Share Tech, monospace" }}>6.1H</span>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.6)", lineHeight: 1.3, fontFamily: "Titillium Web, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>FOCUS TIME</p>
                  <p style={{ fontSize: "13px", fontWeight: 400, color: "rgba(255,255,255,0.4)", lineHeight: 1.3, fontFamily: "Titillium Web, sans-serif" }}>THIS WEEK</p>
                </div>
              </div>
              <div style={{ display: "inline-block", background: "#ffffff", color: "#000000", fontSize: "11px", fontWeight: 700, padding: "6px 14px", borderRadius: "24px", marginBottom: "16px", letterSpacing: "0.1em", fontFamily: "Titillium Web, sans-serif" }}>PEAK: FRI ↑</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "90px" }}>
                {barsData.map((b, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: "6px", height: "100%" }}>
                    <div style={{ width: "100%", borderRadius: "6px 6px 0 0", minHeight: "4px", background: i === 5 ? "#ffffff" : "rgba(255,255,255,0.2)", height: `${barHeights[i]}%`, transition: "height 0.7s cubic-bezier(0.22,1,0.36,1)" }} />
                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", fontWeight: 600, fontFamily: "Titillium Web, sans-serif" }}>{b.d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FOCUS TIMER */}
            <div style={{ gridColumn: "3", gridRow: "1", background: "#0a0a0a", borderRadius: "28px", border: "1px solid rgba(255,255,255,0.1)", padding: "32px", display: "flex", flexDirection: "column", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", minHeight: "280px" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-8px)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.2)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "none"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#ffffff", fontFamily: "Titillium Web, sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>FOCUS TIMER</h3>
                <span style={{ fontSize: "20px", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>↗</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", flex: 1, justifyContent: "center" }}>
                <svg width="120" height="120" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#ffffff" strokeWidth="8"
                    strokeLinecap="round" strokeDasharray="263.9"
                    strokeDashoffset={strokeOffset}
                    style={{ transformOrigin: "center", transform: "rotate(-90deg)", transition: "stroke-dashoffset 0.6s ease" }}
                  />
                  <text x="50" y="55" textAnchor="middle" fontSize="16" fontWeight="400" fill="#ffffff" fontFamily="Share Tech, monospace">{timerDisplay}</text>
                </svg>
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", fontWeight: 600, fontFamily: "Titillium Web, sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>FOCUS TIME</span>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button onClick={toggleTimer} style={{ background: "#ffffff", color: "#000000", border: "none", borderRadius: "50%", width: "44px", height: "44px", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Titillium Web, sans-serif" }}>
                    {running ? "⏸" : "▶"}
                  </button>
                  <button onClick={resetTimer} style={{ background: "rgba(255,255,255,0.1)", color: "#ffffff", border: "none", borderRadius: "50%", width: "44px", height: "44px", fontSize: "18px", cursor: "pointer", fontFamily: "inherit" }}>↺</button>
                </div>
              </div>
            </div>

            {/* COMPLETION + CHECKLIST */}
            <div style={{ gridColumn: "4", gridRow: "span 2", background: "#0a0a0a", borderRadius: "28px", border: "1px solid rgba(255,255,255,0.1)", padding: "32px", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", minHeight: "580px" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-8px)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.2)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "none"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#ffffff", fontFamily: "Titillium Web, sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>ONBOARDING TASK</h3>
                <span style={{ fontSize: "32px", fontWeight: 400, color: "#ffffff", fontFamily: "Share Tech, monospace" }}>{doneCount}/{checklistTasks.length}</span>
              </div>
              {/* Checklist */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {checklistTasks.map((t) => (
                  <div key={t.id} onClick={() => toggleTask(t.id)}
                    style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", background: checked[t.id] ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", transition: "all 0.2s" }}
                  >
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: checked[t.id] ? "#ffffff" : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "14px", color: checked[t.id] ? "#000000" : "#ffffff", transition: "all 0.2s", fontFamily: "Share Tech, monospace" }}>
                      {checked[t.id] ? "✓" : t.id}
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: "15px", fontWeight: 600, color: "#ffffff", display: "block", textDecoration: checked[t.id] ? "line-through" : "none", opacity: checked[t.id] ? 0.6 : 1, transition: "all 0.22s", fontFamily: "Titillium Web, sans-serif" }}>{t.title}</span>
                      <span style={{ fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,0.5)", marginTop: "2px", display: "block", fontFamily: "Titillium Web, sans-serif" }}>{t.time}</span>
                    </div>
                    {checked[t.id] && <span style={{ color: "#ffffff", fontSize: "18px" }}>✓</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* MARKETING DASHBOARD */}
            <div style={{ gridColumn: "4", gridRow: "3", marginTop: "-290px" }}>
              <MarketingDashboard
                title="Team Activities"
                teamActivities={{
                  totalHours: 16.5,
                  stats: [
                    { label: "Productive", value: 45, color: "bg-green-400" },
                    { label: "Middle", value: 25, color: "bg-lime-300" },
                    { label: "Break", value: 15, color: "bg-yellow-300" },
                    { label: "Idle", value: 15, color: "bg-slate-600" },
                  ],
                }}
                team={{
                  memberCount: 235,
                  members: [
                    { id: "1", name: "Olivia Martin", avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026024d" },
                    { id: "2", name: "Jackson Lee", avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
                    { id: "3", name: "Isabella Nguyen", avatarUrl: "https://i.pravatar.cc/150?u=a04258114e29026302d" },
                    { id: "4", name: "William Kim", avatarUrl: "https://i.pravatar.cc/150?u=a04258114e29026702d" },
                  ],
                }}
                cta={{
                  text: "Manage your activities and team members",
                  buttonText: "See All",
                  onButtonClick: () => alert("See All clicked!"),
                }}
                onFilterClick={() => alert("Filter clicked!")}
              />
            </div>

            {/* INFO ROWS */}
            <div style={{ gridColumn: "1", gridRow: "2", background: "#0a0a0a", borderRadius: "28px", border: "1px solid rgba(255,255,255,0.1)", padding: "28px", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", minHeight: "280px" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-8px)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.2)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "none"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
            >
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#ffffff", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "Titillium Web, sans-serif" }}>QUICK ACCESS</div>
              {[
                { icon: "↺", label: "Recurring Tasks", count: "4" },
                { icon: "⚡", label: "Upcoming Deadlines", count: "3" },
                { icon: "◆", label: "Team Workload", count: "72%" },
                { icon: "★", label: "Task Rewards", count: "1,500 pts" },
              ].map((row, i, arr) => (
                <InfoRow key={row.label} {...row} isLast={i === arr.length - 1} />
              ))}
            </div>

            {/* CALENDAR */}
            <div style={{ gridColumn: "2 / 4", gridRow: "2", background: "#0a0a0a", borderRadius: "28px", border: "1px solid rgba(255,255,255,0.1)", padding: "32px", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", minHeight: "280px", marginTop: "50px" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-8px)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.2)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "none"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
            >
              {/* Cal header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <button style={{ background: "none", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "12px", padding: "8px 16px", fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.6)", cursor: "pointer", fontFamily: "inherit" }}>‹ AUG</button>
                <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#ffffff", fontFamily: "Titillium Web, sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>SEPTEMBER 2024</h3>
                <button style={{ background: "none", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "12px", padding: "8px 16px", fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.6)", cursor: "pointer", fontFamily: "inherit" }}>OCT ›</button>
              </div>
              {/* Day headers */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: "6px", marginBottom: "16px" }}>
                {[
                  { dname: "Mon", dnum: "22", today: false },
                  { dname: "Tue", dnum: "23", today: false },
                  { dname: "Wed", dnum: "24", today: true },
                  { dname: "Thu", dnum: "25", today: false },
                  { dname: "Fri", dnum: "26", today: false },
                  { dname: "Sat", dnum: "27", today: false },
                ].map((d) => (
                  <div key={d.dnum} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", padding: "10px 6px", borderRadius: "12px", background: d.today ? "#ffffff" : "transparent" }}>
                    <span style={{ fontSize: "13px", color: d.today ? "#000000" : "rgba(255,255,255,0.5)", fontWeight: 600, fontFamily: "Titillium Web, sans-serif" }}>{d.dname}</span>
                    <span style={{ fontSize: "18px", color: d.today ? "#000000" : "#ffffff", fontWeight: 700, fontFamily: "Share Tech, monospace" }}>{d.dnum}</span>
                  </div>
                ))}
              </div>
              {/* Events */}
              <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                {/* 8am */}
                <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", alignItems: "center", minHeight: "44px", gap: "12px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.4)", textAlign: "right", fontFamily: "Titillium Web, sans-serif" }}>8:00 AM</span>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: "4px", minHeight: "44px", alignItems: "center" }}>
                    <div style={{ borderLeft: "1px dashed rgba(255,255,255,0.1)", height: "100%" }} />
                    <div style={{ borderLeft: "1px dashed rgba(255,255,255,0.1)", height: "100%" }} />
                    <div style={{ gridColumn: "span 2", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "10px 14px", cursor: "pointer" }}>
                      <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, lineHeight: 1.3, color: "#ffffff", fontFamily: "Titillium Web, sans-serif" }}>WEEKLY TEAM SYNC</p>
                      <p style={{ margin: 0, fontSize: "12px", fontWeight: 500, lineHeight: 1.3, color: "rgba(255,255,255,0.5)", fontFamily: "Titillium Web, sans-serif" }}>Discuss progress on projects</p>
                      <div style={{ display: "flex", gap: "4px", marginTop: "6px" }}>
                        {["A", "B", "C"].map(l => <span key={l} style={{ width: "20px", height: "20px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", color: "#ffffff", fontSize: "9px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Share Tech, monospace" }}>{l}</span>)}
                      </div>
                    </div>
                    <div style={{ borderLeft: "1px dashed rgba(255,255,255,0.1)", height: "100%" }} />
                  </div>
                </div>
                {/* 9am */}
                <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", alignItems: "center", minHeight: "44px", gap: "12px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.4)", textAlign: "right", fontFamily: "Titillium Web, sans-serif" }}>9:00 AM</span>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: "4px", minHeight: "44px", alignItems: "center" }}>
                    {[0, 1, 2, 3, 4, 5].map(i => <div key={i} style={{ borderLeft: "1px dashed rgba(255,255,255,0.1)", height: "100%" }} />)}
                  </div>
                </div>
                {/* 10am */}
                <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", alignItems: "center", minHeight: "44px", gap: "12px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.4)", textAlign: "right", fontFamily: "Titillium Web, sans-serif" }}>10:00 AM</span>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: "4px", minHeight: "44px", alignItems: "center" }}>
                    <div style={{ borderLeft: "1px dashed rgba(255,255,255,0.1)", height: "100%" }} />
                    <div style={{ borderLeft: "1px dashed rgba(255,255,255,0.1)", height: "100%" }} />
                    <div style={{ borderLeft: "1px dashed rgba(255,255,255,0.1)", height: "100%" }} />
                    <div style={{ gridColumn: "span 2", background: "#ffffff", borderRadius: "12px", padding: "10px 14px", cursor: "pointer" }}>
                      <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, lineHeight: 1.3, color: "#000000", fontFamily: "Titillium Web, sans-serif" }}>ONBOARDING SESSION</p>
                      <p style={{ margin: 0, fontSize: "12px", fontWeight: 500, lineHeight: 1.3, color: "rgba(0,0,0,0.6)", fontFamily: "Titillium Web, sans-serif" }}>Introduction for new hires</p>
                      <div style={{ display: "flex", gap: "4px", marginTop: "6px" }}>
                        {["D", "E"].map(l => <span key={l} style={{ width: "20px", height: "20px", borderRadius: "50%", background: "rgba(0,0,0,0.2)", color: "#ffffff", fontSize: "9px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Share Tech, monospace" }}>{l}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
                {/* 11am */}
                <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", alignItems: "center", minHeight: "44px", gap: "12px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.4)", textAlign: "right", fontFamily: "Titillium Web, sans-serif" }}>11:00 AM</span>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: "4px", minHeight: "44px", alignItems: "center" }}>
                    {[0, 1, 2, 3, 4, 5].map(i => <div key={i} style={{ borderLeft: "1px dashed rgba(255,255,255,0.1)", height: "100%" }} />)}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <UsernameSetupModal
        isOpen={showModal}
        onSuccess={handleNameSet}
        onSkip={handleSkip}
      />
    </div>
  );
}

export default function HomeDashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeDashboardContent />
    </Suspense>
  );
}
