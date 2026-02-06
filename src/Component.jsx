import { useState, useRef, useEffect, useMemo } from "react";
import {
  motion,
  useInView,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
  useScroll,
  useMotionTemplate,
  animate as fmAnimate,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  Eye,
  Layers,
  Shield,
  Zap,
  BrainCircuit,
  Globe,
  BarChart3,
  Link2,
  Check,
  Play,
  Monitor,
  FileText,
  Activity,
  Lock,
  Server,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";

/* ─── Scroll-reveal wrapper ─── */
function Reveal({ children, delay = 0, className = "", y = 32 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Stagger helpers ─── */
function StaggerContainer({ children, className = "", stagger = 0.08 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({ children, className = "" }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Serrated Divider ─── */
function SerratedDivider() {
  return <div className="h-4 w-full bg-warm-charcoal serrated-top" />;
}

/* ─── Custom Cursor ─── */
function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springCfg = { damping: 25, stiffness: 700 };
  const dotX = useSpring(cursorX, springCfg);
  const dotY = useSpring(cursorY, springCfg);
  const ringX = useSpring(cursorX, { damping: 20, stiffness: 300 });
  const ringY = useSpring(cursorY, { damping: 20, stiffness: 300 });
  const [hovered, setHovered] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if ("ontouchstart" in window) { setIsTouch(true); return; }
    const move = (e) => { cursorX.set(e.clientX); cursorY.set(e.clientY); };
    window.addEventListener("mousemove", move);
    const over = (e) => { if (e.target.closest("a,button,[role=button]")) setHovered(true); };
    const out = (e) => { if (e.target.closest("a,button,[role=button]")) setHovered(false); };
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    return () => { window.removeEventListener("mousemove", move); document.removeEventListener("mouseover", over); document.removeEventListener("mouseout", out); };
  }, []);

  if (isTouch) return null;
  return (
    <>
      <motion.div className="fixed top-0 left-0 pointer-events-none z-[10000] rounded-full mix-blend-difference" style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%", width: hovered ? 48 : 12, height: hovered ? 48 : 12, backgroundColor: "#D4F268", transition: "width 0.3s, height 0.3s" }} />
      <motion.div className="fixed top-0 left-0 pointer-events-none z-[10000] rounded-full border border-white/20" style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%", width: hovered ? 64 : 40, height: hovered ? 64 : 40, transition: "width 0.3s, height 0.3s" }} />
    </>
  );
}

/* ─── Scroll Progress Bar ─── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return <motion.div className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left" style={{ scaleX, background: "linear-gradient(90deg, #D4F268, #a8e063, #D4F268)" }} />;
}

/* ─── Click Ripple Effect ─── */
function ClickRippleEffect() {
  const [ripples, setRipples] = useState([]);
  useEffect(() => {
    const handle = (e) => {
      const id = Date.now();
      setRipples((p) => [...p, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setRipples((p) => p.filter((r) => r.id !== id)), 900);
    };
    window.addEventListener("click", handle);
    return () => window.removeEventListener("click", handle);
  }, []);
  return (
    <div className="fixed inset-0 pointer-events-none z-[9998]">
      {ripples.map((r) => (
        <motion.div key={r.id} className="absolute rounded-full" style={{ left: r.x - 20, top: r.y - 20, width: 40, height: 40 }} initial={{ scale: 0, opacity: 0.5 }} animate={{ scale: 8, opacity: 0 }} transition={{ duration: 0.9, ease: "easeOut" }}>
          <div className="w-full h-full rounded-full bg-acid-lime/25" />
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Page Loader ─── */
function PageLoader() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1600); return () => clearTimeout(t); }, []);
  return (
    <AnimatePresence>
      {loading && (
        <motion.div className="fixed inset-0 z-[10001] bg-stone-black flex items-center justify-center" exit={{ y: "-100%" }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} transition={{ duration: 0.5 }} className="relative flex items-center gap-3">
            <motion.div className="absolute inset-0 rounded-full border border-acid-lime/30" animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }} transition={{ duration: 2, repeat: Infinity }} style={{ left: -20, top: -20, right: -20, bottom: -20 }} />
            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} className="w-12 h-12 rounded-full bg-acid-lime flex items-center justify-center">
              <Activity className="w-6 h-6 text-stone-black" strokeWidth={2.5} />
            </motion.div>
            <span className="font-serif text-3xl font-light text-off-white tracking-tight">TitanRad</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Floating Particles ─── */
function FloatingParticles({ count = 25 }) {
  const particles = useMemo(() => Array.from({ length: count }, (_, i) => ({ id: i, x: Math.random() * 100, y: Math.random() * 100, size: Math.random() * 2.5 + 1, dur: Math.random() * 20 + 15, delay: Math.random() * 10 })), [count]);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div key={p.id} className="absolute rounded-full bg-acid-lime" style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }} animate={{ y: [0, -30, 10, -20, 0], x: [0, 15, -10, 5, 0], opacity: [0.1, 0.35, 0.15, 0.3, 0.1] }} transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeInOut" }} />
      ))}
    </div>
  );
}

/* ─── Magnetic Button ─── */
function MagneticButton({ children, className = "", strength = 0.3 }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 });
  const sy = useSpring(y, { stiffness: 300, damping: 20 });
  const move = (e) => { const rect = ref.current.getBoundingClientRect(); x.set((e.clientX - rect.left - rect.width / 2) * strength); y.set((e.clientY - rect.top - rect.height / 2) * strength); };
  const leave = () => { x.set(0); y.set(0); };
  return <motion.div ref={ref} onMouseMove={move} onMouseLeave={leave} style={{ x: sx, y: sy }} className={`inline-flex ${className}`}>{children}</motion.div>;
}

/* ─── Mouse Glow ─── */
function MouseGlow({ children, className = "" }) {
  const ref = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const handleMove = (e) => { const rect = ref.current.getBoundingClientRect(); mouseX.set(e.clientX - rect.left); mouseY.set(e.clientY - rect.top); };
  const bg = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(212,242,104,0.04), transparent 80%)`;
  return <motion.div ref={ref} onMouseMove={handleMove} className={`relative ${className}`} style={{ background: bg }}>{children}</motion.div>;
}

/* ─── Animated Counter ─── */
function AnimatedCounter({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [display, setDisplay] = useState(() => value.replace(/[0-9.]+/, "0"));
  const parsed = useRef(null);
  if (!parsed.current) {
    const m = value.match(/^([<>]?)([0-9.]+)(.*)/);
    if (m) parsed.current = { prefix: m[1], target: parseFloat(m[2]), suffix: m[3], dec: m[2].includes(".") ? m[2].split(".")[1].length : 0 };
  }
  useEffect(() => {
    if (!inView || !parsed.current) return;
    const p = parsed.current;
    const mv = { v: 0 };
    const controls = fmAnimate(mv.v, p.target, {
      duration: 2.5,
      ease: [0.25, 0.1, 0.25, 1],
      onUpdate: (v) => setDisplay(`${p.prefix}${p.dec > 0 ? v.toFixed(p.dec) : Math.round(v)}${p.suffix}`),
    });
    return () => controls.stop();
  }, [inView]);
  return <span ref={ref}>{display}</span>;
}

/* ─── Tilt Card ─── */
function TiltCard({ children, className = "", amount = 8 }) {
  const ref = useRef(null);
  const xVal = useMotionValue(0);
  const yVal = useMotionValue(0);
  const rotX = useSpring(useTransform(yVal, [-0.5, 0.5], [amount, -amount]), { stiffness: 300, damping: 30 });
  const rotY = useSpring(useTransform(xVal, [-0.5, 0.5], [-amount, amount]), { stiffness: 300, damping: 30 });
  const move = (e) => { const r = ref.current.getBoundingClientRect(); xVal.set((e.clientX - r.left - r.width / 2) / r.width); yVal.set((e.clientY - r.top - r.height / 2) / r.height); };
  const leave = () => { xVal.set(0); yVal.set(0); };
  return (
    <div className="perspective-1000">
      <motion.div ref={ref} onMouseMove={move} onMouseLeave={leave} style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }} className={className}>{children}</motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════ */
function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const links = ["Platform", "Solutions", "Security", "Pricing"];

  useEffect(() => {
    return scrollY.on("change", (v) => setScrolled(v > 50));
  }, [scrollY]);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-stone-black/80 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/30" : ""}`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 400, damping: 15 }} className="w-10 h-10 rounded-full bg-acid-lime flex items-center justify-center">
              <Activity className="w-5 h-5 text-stone-black" strokeWidth={2.5} />
            </motion.div>
            <span className="font-serif text-2xl font-light text-off-white tracking-tight">
              TitanRad
            </span>
          </a>

          {/* Center pill nav */}
          <div className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-full bg-off-white/5 backdrop-blur-lg border border-white/5">
            {links.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="animated-underline px-5 py-2 text-sm font-medium text-off-white/60 hover:text-stone-black hover:bg-off-white rounded-full transition-all duration-300"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Right CTA cluster */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="animated-underline px-4 py-2 text-sm font-medium text-off-white/60 hover:text-off-white transition-colors duration-300"
            >
              Log in
            </Link>
            <MagneticButton>
              <a
                href="#pricing"
                className="btn-shine inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold bg-acid-lime text-stone-black rounded-full hover:bg-acid-lime-dark transition-all duration-300 hover:-translate-y-0.5"
              >
                Start Free Trial
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </MagneticButton>
          </div>

          {/* Mobile */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-off-white/80 hover:text-off-white p-2"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-stone-black/98 backdrop-blur-xl border-t border-white/5 mt-4"
          >
            <div className="px-6 py-6 space-y-1">
              {links.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-off-white/80 hover:text-off-white hover:bg-white/5 rounded-xl transition font-medium"
                >
                  {link}
                </a>
              ))}
              <div className="pt-4 border-t border-white/10 mt-4 space-y-2">
                <Link to="/login" className="block px-4 py-3 text-off-white/80">Log in</Link>
                <a href="#pricing" className="block text-center px-5 py-3 bg-acid-lime text-stone-black font-semibold rounded-full">
                  Start Free Trial
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

/* ═══════════════════════════════════════════
   HERO — Cloud PACS with DICOM viewer mockup
   ═══════════════════════════════════════════ */
function Hero() {
  const avatars = [
    { initials: "SC", color: "#D4F268" },
    { initials: "RJ", color: "#78716C" },
    { initials: "AL", color: "#A8A29E" },
    { initials: "KP", color: "#57534E" },
  ];

  return (
    <section className="relative min-h-screen pt-32 pb-20 lg:pt-40 lg:pb-28 bg-stone-black overflow-hidden">
      {/* Dot grid bg */}
      <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />
      {/* Floating particles */}
      <FloatingParticles count={25} />
      {/* Morphing blob */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] morphing-blob opacity-[0.07] pointer-events-none" style={{ background: "radial-gradient(circle, #D4F268 0%, transparent 70%)" }} />
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left — 5 cols */}
          <div className="lg:col-span-5 relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-off-white/5 border border-white/5 mb-6">
                <span className="w-2 h-2 rounded-full bg-acid-lime animate-pulse" />
                <span className="text-xs font-medium text-off-white/50 tracking-wide uppercase">
                  Now with AI Diagnostics
                </span>
              </div>

              <h1
                className="font-serif font-extralight leading-[0.95] tracking-[-0.02em] text-off-white"
                style={{ fontSize: "clamp(3rem, 5vw, 4.5rem)" }}
              >
                The{" "}
                <em className="font-light italic text-shimmer">cloud PACS</em>
                <br />
                radiologists
                <br />
                actually love
              </h1>

              <p className="mt-8 text-off-white/50 text-lg leading-relaxed max-w-md">
                Zero-footprint DICOM viewer, AI-powered worklists, and
                structured reporting &mdash; accessible from any browser, on any
                device. No hardware. No VPN. Just radiology.
              </p>

              {/* Social proof */}
              <div className="mt-10 flex items-center gap-4">
                <div className="flex -space-x-3">
                  {avatars.map((a, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-stone-black flex items-center justify-center text-[10px] font-semibold"
                      style={{
                        background: a.color,
                        color: a.color === "#D4F268" ? "#0C0A09" : "#E7E5E4",
                        filter: "grayscale(70%)",
                        opacity: 0.7,
                      }}
                    >
                      {a.initials}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-off-white/40">
                  150+ clinics &amp; health systems
                </span>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <MagneticButton>
                  <a
                    href="#pricing"
                    className="btn-shine breathe inline-flex items-center gap-2 px-8 py-3.5 bg-acid-lime text-stone-black font-semibold rounded-full text-sm hover:bg-acid-lime-dark transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Start Free Trial
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </MagneticButton>
                <MagneticButton>
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/10 text-off-white/70 font-medium rounded-full text-sm hover:bg-white/5 hover:border-white/20 transition-all duration-300"
                  >
                    <Play className="w-4 h-4" />
                    Watch Demo
                  </a>
                </MagneticButton>
              </div>

              {/* Trust badges */}
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
                {["HIPAA Compliant", "SOC 2 Type II", "99.99% Uptime"].map((b) => (
                  <div key={b} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-acid-lime" strokeWidth={3} />
                    <span className="text-xs text-off-white/35 tracking-wide">{b}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — 7 cols: DICOM Viewer Mockup */}
          <div className="lg:col-span-7 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="relative"
            >
              {/* App window — sharp corners, real app feel */}
              <div className="relative w-full rounded-lg overflow-hidden bg-[#0a0f18] border border-white/10 shadow-2xl shadow-black/40">
                {/* Window chrome */}
                <div className="h-10 bg-[#111827] flex items-center px-4 gap-3 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-white/5 rounded-md px-3 py-1 max-w-xs">
                      <span className="text-[10px] font-mono text-off-white/30">viewer.titanrad.health</span>
                    </div>
                  </div>
                  <div className="px-2.5 py-1 rounded-md bg-acid-lime/10 border border-acid-lime/20">
                    <span className="text-[10px] font-mono text-acid-lime/80">AI Active</span>
                  </div>
                </div>

                {/* Viewer toolbar */}
                <div className="h-9 bg-[#0d1520] flex items-center px-4 gap-2 border-b border-white/5">
                  {[Eye, Layers, BrainCircuit, BarChart3].map((Icon, i) => (
                    <div key={i} className={`w-7 h-7 rounded-md flex items-center justify-center ${i === 2 ? "bg-acid-lime/10" : "bg-white/5"}`}>
                      <Icon className={`w-3.5 h-3.5 ${i === 2 ? "text-acid-lime/70" : "text-off-white/30"}`} />
                    </div>
                  ))}
                  <div className="h-5 w-px bg-white/5 mx-1" />
                  <div className="px-2 py-0.5 rounded bg-white/5">
                    <span className="text-[9px] font-mono text-off-white/30">W:1500 L:-500</span>
                  </div>
                  <div className="px-2 py-0.5 rounded bg-white/5">
                    <span className="text-[9px] font-mono text-off-white/30">Lung</span>
                  </div>
                </div>

                {/* Main viewport area */}
                <div className="flex">
                  {/* Thumbnail sidebar */}
                  <div className="w-16 bg-[#080c14] border-r border-white/5 py-2 px-1.5 space-y-1.5 hidden sm:block">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <div
                        key={n}
                        className={`aspect-square rounded-md border flex items-center justify-center ${n === 3 ? "border-acid-lime/40 bg-acid-lime/5" : "border-white/5 bg-white/[0.02]"}`}
                      >
                        <svg width="28" height="28" viewBox="0 0 28 28" className={n === 3 ? "opacity-50" : "opacity-20"}>
                          <ellipse cx="14" cy="13" rx="10" ry="11" fill="none" stroke={n === 3 ? "#D4F268" : "#E7E5E4"} strokeWidth="0.6" />
                          <ellipse cx="10" cy="12" rx="4" ry="6" fill="none" stroke={n === 3 ? "#D4F268" : "#E7E5E4"} strokeWidth="0.4" />
                          <ellipse cx="18" cy="12" rx="4" ry="6" fill="none" stroke={n === 3 ? "#D4F268" : "#E7E5E4"} strokeWidth="0.4" />
                        </svg>
                      </div>
                    ))}
                  </div>

                  {/* Main scan viewport */}
                  <div className="flex-1 relative bg-black/60" style={{ aspectRatio: "4/3" }}>
                    {/* CT Chest scan — clean SVG illustration */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg viewBox="0 0 400 300" className="w-full h-full opacity-60" preserveAspectRatio="xMidYMid meet">
                        {/* Outer body ellipse */}
                        <ellipse cx="200" cy="148" rx="140" ry="120" fill="none" stroke="#E7E5E4" strokeWidth="0.8" opacity="0.3" />
                        {/* Chest wall */}
                        <ellipse cx="200" cy="145" rx="120" ry="105" fill="#E7E5E4" fillOpacity="0.03" stroke="#E7E5E4" strokeWidth="0.5" strokeOpacity="0.2" />
                        {/* Left lung */}
                        <ellipse cx="155" cy="140" rx="48" ry="70" fill="#E7E5E4" fillOpacity="0.04" stroke="#E7E5E4" strokeWidth="0.6" strokeOpacity="0.35" />
                        {/* Right lung */}
                        <ellipse cx="245" cy="140" rx="48" ry="70" fill="#E7E5E4" fillOpacity="0.04" stroke="#E7E5E4" strokeWidth="0.6" strokeOpacity="0.35" />
                        {/* Heart / mediastinum */}
                        <ellipse cx="210" cy="155" rx="28" ry="38" fill="#E7E5E4" fillOpacity="0.06" stroke="#E7E5E4" strokeWidth="0.5" strokeOpacity="0.25" />
                        {/* Spine */}
                        <rect x="196" y="80" width="8" height="140" rx="3" fill="#E7E5E4" opacity="0.08" />
                        {/* Ribs */}
                        {[95, 115, 135, 155, 175, 195].map((y, i) => (
                          <g key={i}>
                            <path d={`M${110 + i * 2} ${y} Q200 ${y - 8} ${290 - i * 2} ${y}`} fill="none" stroke="#E7E5E4" strokeWidth="0.4" opacity="0.15" />
                          </g>
                        ))}
                        {/* Vertebrae markers */}
                        {[90, 110, 130, 150, 170, 190, 210].map((y, i) => (
                          <circle key={i} cx="200" cy={y} r="2" fill="#E7E5E4" opacity="0.08" />
                        ))}
                      </svg>
                    </div>

                    {/* AI detection overlay */}
                    <motion.div
                      animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute rounded-full border-2 border-acid-lime/50"
                      style={{ top: "22%", right: "22%", width: "18%", height: "24%" }}
                    />
                    <div className="absolute px-2 py-0.5 bg-acid-lime/15 rounded-md border border-acid-lime/20" style={{ top: "18%", right: "12%" }}>
                      <span className="text-[9px] font-mono text-acid-lime">NODULE 94.2%</span>
                    </div>

                    {/* Measurement overlay */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <line x1="55%" y1="38%" x2="70%" y2="55%" stroke="#D4F268" strokeWidth="1.2" strokeDasharray="5 3" opacity="0.5" />
                      <circle cx="55%" cy="38%" r="3" fill="#D4F268" opacity="0.6" />
                      <circle cx="70%" cy="55%" r="3" fill="#D4F268" opacity="0.6" />
                    </svg>
                    <div className="absolute font-mono text-acid-lime/70" style={{ top: "45%", left: "65%", fontSize: "10px" }}>
                      24.3mm
                    </div>

                    {/* Scan line effect */}
                    <div className="scan-line" />

                    {/* Corner overlays */}
                    <div className="absolute top-3 left-3 text-[9px] font-mono text-off-white/20 leading-relaxed select-none">
                      <div>CT CHEST W/ CONTRAST</div>
                      <div>512 x 512 &middot; 0.68mm</div>
                    </div>
                    <div className="absolute bottom-3 left-3 text-[9px] font-mono text-off-white/20 leading-relaxed select-none">
                      <div>Axial &middot; Img 147 / 312</div>
                      <div>03 Feb 2025 14:32</div>
                    </div>
                    <div className="absolute bottom-3 right-3 text-[9px] font-mono text-off-white/15 select-none">
                      Zoom 1.4x
                    </div>
                  </div>
                </div>

                {/* Bottom status bar */}
                <div className="h-8 bg-[#0d1520] flex items-center justify-between px-4 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-acid-lime animate-pulse" />
                      <span className="text-[9px] font-mono text-off-white/25">Connected</span>
                    </div>
                    <span className="text-[9px] font-mono text-off-white/15">|</span>
                    <span className="text-[9px] font-mono text-off-white/25">Series 3 of 4</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-mono text-off-white/25">Lung &middot; Axial</span>
                    <span className="text-[9px] font-mono text-off-white/15">|</span>
                    <span className="text-[9px] font-mono text-off-white/25">3D MPR</span>
                  </div>
                </div>
              </div>

              {/* Sticky note badge */}
              <motion.div
                initial={{ opacity: 0, rotate: 10, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 6, scale: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                whileHover={{ rotate: 0, scale: 1.02 }}
                className="absolute -bottom-6 -left-4 lg:-left-10 bg-acid-lime text-stone-black p-5 lg:p-6 rounded-3xl shadow-2xl cursor-default z-20 float-gentle"
                style={{ maxWidth: "200px" }}
              >
                <span className="font-serif text-lg font-light italic leading-snug block">
                  Zero footprint
                </span>
                <span className="font-sans text-sm font-semibold mt-1 block">
                  No installs. Ever.
                </span>
                <div className="mt-3 pt-3 border-t border-stone-black/10">
                  <span className="text-xs font-medium opacity-60">
                    Chrome, Safari, Edge
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Ambient glow */}
      <div
        className="absolute top-1/4 right-0 w-150 h-150 opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(212,242,104,0.08) 0%, transparent 70%)" }}
      />

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-off-white/20 flex items-start justify-center pt-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-acid-lime"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <ChevronDown className="w-3 h-3 text-off-white/20" />
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   LOGO BAR — Trusted By
   ═══════════════════════════════════════════ */
function LogoBar() {
  const logos = [
    "Metro Health System",
    "ClearView Radiology",
    "NorthStar Medical",
    "Pacific Imaging Group",
    "Summit Healthcare",
    "Valley Diagnostics",
  ];
  const doubled = [...logos, ...logos];

  return (
    <section className="py-14 bg-warm-charcoal border-b border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal>
          <p className="text-center text-xs font-medium text-off-white/30 uppercase tracking-[0.2em] mb-10">
            Trusted by leading healthcare institutions
          </p>
        </Reveal>
      </div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-warm-charcoal to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-warm-charcoal to-transparent z-10 pointer-events-none" />
        <div className="flex marquee-track">
          {doubled.map((name, i) => (
            <div key={i} className="flex items-center gap-2 shrink-0 px-10 opacity-40 hover:opacity-70 transition-opacity duration-300">
              <Activity className="w-4 h-4 text-off-white/50" />
              <span className="font-sans text-sm font-medium text-off-white/50 tracking-tight whitespace-nowrap">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FEATURES GRID — 6 capabilities
   ═══════════════════════════════════════════ */
function Features() {
  const features = [
    {
      icon: Zap,
      title: "Instant Access",
      desc: "Open studies in under 3 seconds. Zero-footprint viewer works on any device, any browser &mdash; no plugins, no installs.",
    },
    {
      icon: Shield,
      title: "Bank-Grade Security",
      desc: "End-to-end AES-256 encryption at rest and in transit. HIPAA, GDPR, and SOC 2 Type II certified.",
    },
    {
      icon: BrainCircuit,
      title: "AI-Powered Workflows",
      desc: "Smart worklist prioritization, automated triage, and integrated diagnostic insights from FDA-cleared algorithms.",
    },
    {
      icon: Globe,
      title: "Read From Anywhere",
      desc: "Clinic, home, or on the go. All you need is a browser. Full diagnostic-quality viewing on tablet and desktop.",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      desc: "Real-time turnaround times, volume trends, radiologist productivity, and SLA tracking in a single pane.",
    },
    {
      icon: Link2,
      title: "Seamless Integration",
      desc: "HL7 FHIR, DICOMweb, and EMR connectors out of the box. Bi-directional sync with Epic, Cerner, and MEDITECH.",
    },
  ];

  return (
    <MouseGlow>
    <section id="platform" className="py-24 lg:py-32 bg-stone-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono text-off-white/40 tracking-[0.2em] uppercase block mb-4">
            Fig. 01 — Platform
          </span>
          <h2
            className="font-serif font-extralight tracking-[-0.02em] text-off-white"
            style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}
          >
            Everything you need.
            <br />
            <em className="italic text-shimmer font-light">Nothing</em> you don&rsquo;t.
          </h2>
        </Reveal>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <StaggerItem key={f.title}>
              <TiltCard>
                <div className="group relative bg-warm-charcoal rounded-3xl p-8 border border-white/5 hover:border-acid-lime/20 hover:-translate-y-1 transition-all duration-300 hover-glow">
                  <div className="w-12 h-12 rounded-2xl bg-acid-lime/10 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-acid-lime/20 transition-all duration-300">
                    <f.icon className="w-6 h-6 text-acid-lime" />
                  </div>
                  <h3 className="font-serif text-xl font-light text-off-white mb-3 tracking-[-0.01em]">
                    {f.title}
                  </h3>
                  <p
                    className="text-off-white/45 leading-relaxed text-[15px]"
                    dangerouslySetInnerHTML={{ __html: f.desc }}
                  />
                  <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    <ArrowUpRight className="w-4 h-4 text-acid-lime/50" />
                  </div>
                </div>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
    </MouseGlow>
  );
}

/* ─── Illustration: Radiologist at Workstation ─── */
function IllustrationRadiologist() {
  return (
    <svg viewBox="0 0 300 400" fill="none" className="w-full h-full">
      {/* Background glow */}
      <circle cx="150" cy="180" r="120" fill="#D4F268" opacity="0.04" />
      <circle cx="150" cy="180" r="80" fill="#D4F268" opacity="0.06" />

      {/* Monitor screens */}
      <rect x="60" y="80" width="80" height="60" rx="4" fill="#1C1917" stroke="#E7E5E4" strokeWidth="2.5" />
      <rect x="160" y="80" width="80" height="60" rx="4" fill="#1C1917" stroke="#E7E5E4" strokeWidth="2.5" />
      {/* Screen content - scan imagery */}
      <ellipse cx="100" cy="110" rx="18" ry="22" fill="none" stroke="#D4F268" strokeWidth="1.5" opacity="0.6" />
      <ellipse cx="88" cy="107" rx="7" ry="11" fill="none" stroke="#D4F268" strokeWidth="0.8" opacity="0.4" />
      <ellipse cx="112" cy="107" rx="7" ry="11" fill="none" stroke="#D4F268" strokeWidth="0.8" opacity="0.4" />
      <rect x="170" y="92" width="60" height="3" rx="1" fill="#E7E5E4" opacity="0.15" />
      <rect x="170" y="100" width="45" height="3" rx="1" fill="#E7E5E4" opacity="0.1" />
      <rect x="170" y="108" width="55" height="3" rx="1" fill="#E7E5E4" opacity="0.1" />
      <rect x="170" y="116" width="35" height="3" rx="1" fill="#D4F268" opacity="0.2" />
      <rect x="170" y="124" width="50" height="3" rx="1" fill="#E7E5E4" opacity="0.08" />
      {/* Monitor stands */}
      <rect x="95" y="140" width="10" height="15" fill="#292524" stroke="#E7E5E4" strokeWidth="1.5" />
      <rect x="195" y="140" width="10" height="15" fill="#292524" stroke="#E7E5E4" strokeWidth="1.5" />
      {/* Desk */}
      <rect x="40" y="155" width="220" height="8" rx="2" fill="#292524" stroke="#E7E5E4" strokeWidth="2" />

      {/* Doctor figure - heroic pose, bold lines */}
      {/* Lab coat body */}
      <path d="M130 195 L120 175 Q150 165 180 175 L170 195 L175 280 Q150 290 125 280 Z" fill="#E7E5E4" stroke="#0C0A09" strokeWidth="3" />
      {/* Coat lapels */}
      <path d="M140 175 L150 200 L145 175" fill="none" stroke="#0C0A09" strokeWidth="2" />
      <path d="M160 175 L150 200 L155 175" fill="none" stroke="#0C0A09" strokeWidth="2" />
      {/* Scrubs underneath */}
      <path d="M137 195 L140 240 L160 240 L163 195" fill="#1C1917" stroke="#0C0A09" strokeWidth="1.5" />

      {/* Head */}
      <ellipse cx="150" cy="165" rx="18" ry="20" fill="#A8896A" stroke="#0C0A09" strokeWidth="3" />
      {/* Hair - bold, dynamic */}
      <path d="M132 160 Q130 145 140 142 Q150 138 160 142 Q170 145 168 160 Q165 150 150 148 Q135 150 132 160Z" fill="#1C1917" stroke="#0C0A09" strokeWidth="2.5" />
      {/* Face details */}
      <ellipse cx="143" cy="163" rx="2.5" ry="2" fill="#0C0A09" />
      <ellipse cx="157" cy="163" rx="2.5" ry="2" fill="#0C0A09" />
      <path d="M145 172 Q150 175 155 172" fill="none" stroke="#0C0A09" strokeWidth="1.5" />
      {/* Glasses - bold frames */}
      <rect x="136" y="159" width="12" height="9" rx="2" fill="none" stroke="#D4F268" strokeWidth="2" />
      <rect x="152" y="159" width="12" height="9" rx="2" fill="none" stroke="#D4F268" strokeWidth="2" />
      <line x1="148" y1="163" x2="152" y2="163" stroke="#D4F268" strokeWidth="1.5" />

      {/* Arms - one pointing at screen */}
      <path d="M120 195 L95 175 L85 130 L90 115" fill="none" stroke="#A8896A" strokeWidth="8" strokeLinecap="round" />
      <path d="M120 195 L95 175 L85 130 L90 115" fill="none" stroke="#0C0A09" strokeWidth="10" strokeLinecap="round" opacity="0.15" />
      {/* Pointing hand */}
      <circle cx="90" cy="112" r="5" fill="#A8896A" stroke="#0C0A09" strokeWidth="2" />
      <line x1="88" y1="108" x2="86" y2="102" stroke="#A8896A" strokeWidth="3" strokeLinecap="round" />

      {/* Right arm on desk */}
      <path d="M180 195 L195 210 L210 165" fill="none" stroke="#A8896A" strokeWidth="8" strokeLinecap="round" />
      <circle cx="210" cy="163" r="5" fill="#A8896A" stroke="#0C0A09" strokeWidth="2" />

      {/* Stethoscope */}
      <path d="M142 185 Q130 200 135 220" fill="none" stroke="#D4F268" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="135" cy="222" r="5" fill="none" stroke="#D4F268" strokeWidth="2" />

      {/* Name badge */}
      <rect x="155" y="200" width="14" height="18" rx="2" fill="#D4F268" stroke="#0C0A09" strokeWidth="1.5" />
      <line x1="157" y1="208" x2="167" y2="208" stroke="#0C0A09" strokeWidth="1" />

      {/* Keyboard on desk */}
      <rect x="120" y="158" width="60" height="5" rx="1" fill="#292524" stroke="#E7E5E4" strokeWidth="1" />

      {/* Action lines - comic style */}
      <line x1="70" y1="105" x2="50" y2="95" stroke="#D4F268" strokeWidth="1.5" opacity="0.4" />
      <line x1="68" y1="115" x2="45" y2="112" stroke="#D4F268" strokeWidth="1" opacity="0.3" />
      <line x1="72" y1="125" x2="55" y2="128" stroke="#D4F268" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

/* ─── Illustration: X-Ray Machine ─── */
function IllustrationXRay() {
  return (
    <svg viewBox="0 0 300 400" fill="none" className="w-full h-full">
      <circle cx="150" cy="200" r="100" fill="#D4F268" opacity="0.03" />

      {/* Ceiling mount rail */}
      <rect x="50" y="30" width="200" height="8" rx="2" fill="#292524" stroke="#E7E5E4" strokeWidth="2.5" />
      {/* Arm joint */}
      <rect x="140" y="38" width="20" height="30" rx="3" fill="#292524" stroke="#E7E5E4" strokeWidth="2.5" />
      <circle cx="150" cy="50" r="5" fill="#D4F268" stroke="#0C0A09" strokeWidth="2" />

      {/* Main arm - dynamic diagonal angle */}
      <path d="M150 68 L150 100 L180 140 L180 170" fill="none" stroke="#E7E5E4" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M150 68 L150 100 L180 140 L180 170" fill="none" stroke="#0C0A09" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" opacity="0.1" />

      {/* X-Ray tube head */}
      <rect x="155" y="170" width="50" height="70" rx="8" fill="#1C1917" stroke="#E7E5E4" strokeWidth="3" />
      <rect x="162" y="178" width="36" height="20" rx="4" fill="#292524" stroke="#D4F268" strokeWidth="1.5" />
      {/* Lens / emitter */}
      <circle cx="180" cy="220" r="12" fill="#0C0A09" stroke="#D4F268" strokeWidth="2.5" />
      <circle cx="180" cy="220" r="6" fill="#D4F268" opacity="0.2" />
      <circle cx="180" cy="220" r="3" fill="#D4F268" opacity="0.5" />

      {/* X-ray beam - dramatic cone */}
      <path d="M180 232 L130 340 L230 340 Z" fill="#D4F268" opacity="0.06" />
      <line x1="180" y1="232" x2="130" y2="340" stroke="#D4F268" strokeWidth="1" opacity="0.2" strokeDasharray="4 4" />
      <line x1="180" y1="232" x2="230" y2="340" stroke="#D4F268" strokeWidth="1" opacity="0.2" strokeDasharray="4 4" />

      {/* Patient table */}
      <rect x="60" y="310" width="180" height="12" rx="3" fill="#292524" stroke="#E7E5E4" strokeWidth="2.5" />
      {/* Table pedestal */}
      <rect x="140" y="322" width="20" height="40" rx="2" fill="#292524" stroke="#E7E5E4" strokeWidth="2" />
      <rect x="120" y="358" width="60" height="8" rx="2" fill="#292524" stroke="#E7E5E4" strokeWidth="2" />

      {/* Patient silhouette on table */}
      <ellipse cx="150" cy="300" rx="40" ry="8" fill="#1C1917" stroke="#E7E5E4" strokeWidth="1.5" opacity="0.4" />
      {/* Chest outline visible through beam */}
      <ellipse cx="150" cy="295" rx="25" ry="15" fill="none" stroke="#D4F268" strokeWidth="1" opacity="0.3" />

      {/* Control panel on side */}
      <rect x="30" y="230" width="45" height="60" rx="6" fill="#1C1917" stroke="#E7E5E4" strokeWidth="2.5" />
      <circle cx="45" cy="248" r="4" fill="#D4F268" opacity="0.6" />
      <circle cx="60" cy="248" r="4" fill="#292524" stroke="#E7E5E4" strokeWidth="1" />
      <rect x="38" y="260" width="30" height="4" rx="1" fill="#292524" stroke="#E7E5E4" strokeWidth="1" />
      <rect x="38" y="270" width="20" height="4" rx="1" fill="#D4F268" opacity="0.3" />
      <rect x="38" y="280" width="25" height="4" rx="1" fill="#292524" stroke="#E7E5E4" strokeWidth="1" />

      {/* Energy burst lines */}
      <line x1="168" y1="215" x2="155" y2="210" stroke="#D4F268" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
      <line x1="192" y1="215" x2="205" y2="210" stroke="#D4F268" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
      <line x1="168" y1="225" x2="152" y2="228" stroke="#D4F268" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      <line x1="192" y1="225" x2="208" y2="228" stroke="#D4F268" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />

      {/* Status indicator */}
      <circle cx="37" cy="240" r="2" fill="#D4F268">
        <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

/* ─── Illustration: AI Brain Scan ─── */
function IllustrationAIBrain() {
  return (
    <svg viewBox="0 0 300 400" fill="none" className="w-full h-full">
      {/* Background radial */}
      <circle cx="150" cy="190" r="130" fill="#D4F268" opacity="0.02" />

      {/* Scanning ring - outer */}
      <ellipse cx="150" cy="190" rx="110" ry="115" fill="none" stroke="#E7E5E4" strokeWidth="1" opacity="0.1" />
      <ellipse cx="150" cy="190" rx="95" ry="100" fill="none" stroke="#E7E5E4" strokeWidth="0.8" opacity="0.08" />

      {/* Brain outline - bold comic style */}
      <path d="M150 90 Q190 85 210 110 Q230 140 225 170 Q225 200 210 220 Q195 245 170 260 Q155 268 150 270 Q145 268 130 260 Q105 245 90 220 Q75 200 75 170 Q70 140 90 110 Q110 85 150 90Z" fill="#1C1917" stroke="#E7E5E4" strokeWidth="3" />

      {/* Brain folds - left hemisphere */}
      <path d="M110 130 Q125 120 140 130 Q148 135 145 145" fill="none" stroke="#E7E5E4" strokeWidth="2" opacity="0.4" />
      <path d="M95 160 Q115 150 130 160 Q140 168 135 178" fill="none" stroke="#E7E5E4" strokeWidth="2" opacity="0.35" />
      <path d="M90 195 Q110 185 125 195 Q132 202 128 212" fill="none" stroke="#E7E5E4" strokeWidth="2" opacity="0.3" />

      {/* Brain folds - right hemisphere */}
      <path d="M190 130 Q175 120 160 130 Q152 135 155 145" fill="none" stroke="#E7E5E4" strokeWidth="2" opacity="0.4" />
      <path d="M205 160 Q185 150 170 160 Q160 168 165 178" fill="none" stroke="#E7E5E4" strokeWidth="2" opacity="0.35" />
      <path d="M210 195 Q190 185 175 195 Q168 202 172 212" fill="none" stroke="#E7E5E4" strokeWidth="2" opacity="0.3" />

      {/* Central divide */}
      <line x1="150" y1="95" x2="150" y2="265" stroke="#E7E5E4" strokeWidth="1" opacity="0.15" />

      {/* Neural network nodes - AI overlay */}
      {/* Layer 1 */}
      <circle cx="120" cy="130" r="5" fill="#D4F268" opacity="0.7" stroke="#D4F268" strokeWidth="1.5" />
      <circle cx="180" cy="130" r="5" fill="#D4F268" opacity="0.7" stroke="#D4F268" strokeWidth="1.5" />
      <circle cx="150" cy="115" r="4" fill="#D4F268" opacity="0.5" stroke="#D4F268" strokeWidth="1" />
      {/* Layer 2 */}
      <circle cx="105" cy="175" r="6" fill="#D4F268" opacity="0.8" stroke="#D4F268" strokeWidth="2" />
      <circle cx="150" cy="165" r="5" fill="#D4F268" opacity="0.6" stroke="#D4F268" strokeWidth="1.5" />
      <circle cx="195" cy="175" r="6" fill="#D4F268" opacity="0.8" stroke="#D4F268" strokeWidth="2" />
      {/* Layer 3 */}
      <circle cx="125" cy="220" r="4" fill="#D4F268" opacity="0.5" stroke="#D4F268" strokeWidth="1" />
      <circle cx="175" cy="220" r="4" fill="#D4F268" opacity="0.5" stroke="#D4F268" strokeWidth="1" />
      <circle cx="150" cy="240" r="5" fill="#D4F268" opacity="0.6" stroke="#D4F268" strokeWidth="1.5" />

      {/* Neural connections */}
      <line x1="120" y1="130" x2="105" y2="175" stroke="#D4F268" strokeWidth="1" opacity="0.3" />
      <line x1="120" y1="130" x2="150" y2="165" stroke="#D4F268" strokeWidth="1" opacity="0.25" />
      <line x1="180" y1="130" x2="195" y2="175" stroke="#D4F268" strokeWidth="1" opacity="0.3" />
      <line x1="180" y1="130" x2="150" y2="165" stroke="#D4F268" strokeWidth="1" opacity="0.25" />
      <line x1="150" y1="115" x2="120" y2="130" stroke="#D4F268" strokeWidth="0.8" opacity="0.2" />
      <line x1="150" y1="115" x2="180" y2="130" stroke="#D4F268" strokeWidth="0.8" opacity="0.2" />
      <line x1="105" y1="175" x2="125" y2="220" stroke="#D4F268" strokeWidth="1" opacity="0.25" />
      <line x1="150" y1="165" x2="125" y2="220" stroke="#D4F268" strokeWidth="0.8" opacity="0.2" />
      <line x1="150" y1="165" x2="175" y2="220" stroke="#D4F268" strokeWidth="0.8" opacity="0.2" />
      <line x1="195" y1="175" x2="175" y2="220" stroke="#D4F268" strokeWidth="1" opacity="0.25" />
      <line x1="125" y1="220" x2="150" y2="240" stroke="#D4F268" strokeWidth="0.8" opacity="0.2" />
      <line x1="175" y1="220" x2="150" y2="240" stroke="#D4F268" strokeWidth="0.8" opacity="0.2" />

      {/* Scanning beam effect */}
      <rect x="70" y="185" width="160" height="2" fill="#D4F268" opacity="0.3" rx="1">
        <animate attributeName="y" values="100;270;100" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.1;0.3" dur="4s" repeatCount="indefinite" />
      </rect>

      {/* Detection callouts */}
      <rect x="215" y="120" width="55" height="24" rx="4" fill="#0C0A09" stroke="#D4F268" strokeWidth="1.5" opacity="0.8" />
      <text x="223" y="135" fill="#D4F268" fontSize="8" fontFamily="monospace" opacity="0.9">94.7%</text>
      <line x1="210" y1="132" x2="185" y2="135" stroke="#D4F268" strokeWidth="1" opacity="0.4" strokeDasharray="3 2" />

      <rect x="215" y="200" width="55" height="24" rx="4" fill="#0C0A09" stroke="#D4F268" strokeWidth="1.5" opacity="0.8" />
      <text x="220" y="215" fill="#D4F268" fontSize="8" fontFamily="monospace" opacity="0.9">CLEAR</text>
      <line x1="210" y1="212" x2="200" y2="190" stroke="#D4F268" strokeWidth="1" opacity="0.4" strokeDasharray="3 2" />

      {/* Bottom data readout */}
      <rect x="80" y="310" width="140" height="40" rx="6" fill="#1C1917" stroke="#E7E5E4" strokeWidth="1.5" opacity="0.5" />
      <text x="95" y="328" fill="#E7E5E4" fontSize="7" fontFamily="monospace" opacity="0.4">INFERENCE: 12ms</text>
      <text x="95" y="340" fill="#D4F268" fontSize="7" fontFamily="monospace" opacity="0.5">MODEL: TR-NEURO-v4.2</text>
    </svg>
  );
}

/* ─── Illustration: Analytics Dashboard ─── */
function IllustrationDashboard() {
  return (
    <svg viewBox="0 0 300 400" fill="none" className="w-full h-full">
      <circle cx="150" cy="200" r="120" fill="#D4F268" opacity="0.02" />

      {/* Main monitor frame */}
      <rect x="35" y="60" width="230" height="160" rx="8" fill="#1C1917" stroke="#E7E5E4" strokeWidth="3" />
      {/* Screen bezel */}
      <rect x="45" y="70" width="210" height="140" rx="4" fill="#0C0A09" />

      {/* Dashboard header */}
      <rect x="55" y="78" width="190" height="18" rx="3" fill="#292524" />
      <circle cx="65" cy="87" r="3" fill="#D4F268" opacity="0.6" />
      <rect x="75" y="84" width="40" height="5" rx="1" fill="#E7E5E4" opacity="0.15" />
      <rect x="175" y="84" width="25" height="5" rx="1" fill="#D4F268" opacity="0.2" />
      <rect x="205" y="84" width="30" height="5" rx="1" fill="#E7E5E4" opacity="0.08" />

      {/* Bar chart */}
      <rect x="55" y="105" width="90" height="60" rx="3" fill="#292524" opacity="0.5" />
      {/* Bars */}
      <rect x="63" y="135" width="8" height="22" rx="1" fill="#E7E5E4" opacity="0.2" />
      <rect x="75" y="125" width="8" height="32" rx="1" fill="#E7E5E4" opacity="0.2" />
      <rect x="87" y="115" width="8" height="42" rx="1" fill="#D4F268" opacity="0.5" />
      <rect x="99" y="130" width="8" height="27" rx="1" fill="#E7E5E4" opacity="0.2" />
      <rect x="111" y="120" width="8" height="37" rx="1" fill="#D4F268" opacity="0.4" />
      <rect x="123" y="128" width="8" height="29" rx="1" fill="#E7E5E4" opacity="0.2" />
      {/* Axis */}
      <line x1="60" y1="157" x2="138" y2="157" stroke="#E7E5E4" strokeWidth="0.5" opacity="0.15" />

      {/* Line chart */}
      <rect x="155" y="105" width="90" height="60" rx="3" fill="#292524" opacity="0.5" />
      <polyline points="165,145 178,135 190,140 202,120 215,125 228,110 238,115" fill="none" stroke="#D4F268" strokeWidth="2" opacity="0.6" />
      <polyline points="165,150 178,142 190,148 202,138 215,140 228,132 238,136" fill="none" stroke="#E7E5E4" strokeWidth="1" opacity="0.2" />

      {/* Metric cards row */}
      <rect x="55" y="172" width="42" height="28" rx="3" fill="#292524" opacity="0.5" />
      <text x="62" y="184" fill="#D4F268" fontSize="8" fontFamily="monospace" opacity="0.7">2.1s</text>
      <text x="62" y="194" fill="#E7E5E4" fontSize="5" fontFamily="monospace" opacity="0.25">TAT AVG</text>

      <rect x="103" y="172" width="42" height="28" rx="3" fill="#292524" opacity="0.5" />
      <text x="110" y="184" fill="#D4F268" fontSize="8" fontFamily="monospace" opacity="0.7">847</text>
      <text x="110" y="194" fill="#E7E5E4" fontSize="5" fontFamily="monospace" opacity="0.25">TODAY</text>

      <rect x="151" y="172" width="42" height="28" rx="3" fill="#292524" opacity="0.5" />
      <text x="156" y="184" fill="#D4F268" fontSize="8" fontFamily="monospace" opacity="0.7">99.9%</text>
      <text x="156" y="194" fill="#E7E5E4" fontSize="5" fontFamily="monospace" opacity="0.25">UPTIME</text>

      <rect x="199" y="172" width="46" height="28" rx="3" fill="#292524" opacity="0.5" />
      <text x="205" y="184" fill="#D4F268" fontSize="8" fontFamily="monospace" opacity="0.7">12/12</text>
      <text x="205" y="194" fill="#E7E5E4" fontSize="5" fontFamily="monospace" opacity="0.25">SLA MET</text>

      {/* Monitor stand */}
      <rect x="140" y="220" width="20" height="25" fill="#292524" stroke="#E7E5E4" strokeWidth="2" />
      <ellipse cx="150" cy="248" rx="40" ry="6" fill="#292524" stroke="#E7E5E4" strokeWidth="2" />

      {/* Second monitor (tablet) tilted */}
      <g transform="rotate(-8, 250, 280)">
        <rect x="210" y="250" width="70" height="100" rx="6" fill="#1C1917" stroke="#E7E5E4" strokeWidth="2.5" />
        <rect x="217" y="258" width="56" height="78" rx="3" fill="#0C0A09" />
        {/* Mini chart */}
        <rect x="222" y="264" width="46" height="20" rx="2" fill="#292524" opacity="0.5" />
        <polyline points="228,278 235,272 242,276 249,268 256,271 263,265" fill="none" stroke="#D4F268" strokeWidth="1.5" opacity="0.5" />
        {/* Mini list */}
        <rect x="222" y="290" width="46" height="4" rx="1" fill="#E7E5E4" opacity="0.1" />
        <rect x="222" y="298" width="35" height="4" rx="1" fill="#E7E5E4" opacity="0.08" />
        <rect x="222" y="306" width="40" height="4" rx="1" fill="#D4F268" opacity="0.15" />
        <rect x="222" y="314" width="30" height="4" rx="1" fill="#E7E5E4" opacity="0.08" />
        <rect x="222" y="322" width="46" height="4" rx="1" fill="#E7E5E4" opacity="0.06" />
      </g>

      {/* Coffee mug - fun detail */}
      <ellipse cx="60" cy="275" rx="12" ry="4" fill="#292524" stroke="#E7E5E4" strokeWidth="1.5" />
      <path d="M48 275 L50 295 Q55 300 60 300 Q65 300 70 295 L72 275" fill="#292524" stroke="#E7E5E4" strokeWidth="1.5" />
      <path d="M72 280 Q82 280 82 288 Q82 295 72 295" fill="none" stroke="#E7E5E4" strokeWidth="1.5" />
      {/* Steam */}
      <path d="M55 270 Q53 264 56 258" fill="none" stroke="#E7E5E4" strokeWidth="0.8" opacity="0.2" />
      <path d="M62 268 Q60 260 63 254" fill="none" stroke="#E7E5E4" strokeWidth="0.8" opacity="0.15" />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   PRODUCT SHOWCASE GRID — Illustrated cards
   ═══════════════════════════════════════════ */
function ShowcaseGrid() {
  const products = [
    {
      title: "The Viewer",
      subtitle: "Diagnostic-quality reads from any browser",
      fig: "Fig. 2A",
      color: "#0d1f3c",
      year: "Core",
      Illustration: IllustrationRadiologist,
    },
    {
      title: "AI Triage",
      subtitle: "FDA-cleared automated prioritization",
      fig: "Fig. 2B",
      color: "#1a2e1a",
      year: "Intelligence",
      offset: true,
      Illustration: IllustrationAIBrain,
    },
    {
      title: "X-Ray Reimagined",
      subtitle: "Cloud-native acquisition & archival",
      fig: "Fig. 2C",
      color: "#2a1f0d",
      year: "Imaging",
      Illustration: IllustrationXRay,
    },
    {
      title: "Command Center",
      subtitle: "Real-time analytics & SLA dashboards",
      fig: "Fig. 2D",
      color: "#1f0d2a",
      year: "Insights",
      Illustration: IllustrationDashboard,
    },
  ];

  return (
    <section id="solutions" className="py-24 lg:py-32 bg-stone-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <span className="text-xs font-mono text-off-white/40 tracking-[0.2em] uppercase block mb-4">
              Fig. 02 — Solutions
            </span>
            <h2
              className="font-serif font-extralight tracking-[-0.02em] text-off-white"
              style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}
            >
              Built for{" "}
              <em className="italic text-shimmer font-light">every</em>
              <br />
              radiology workflow
            </h2>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm text-off-white/50 hover:text-acid-lime font-medium transition-colors duration-300"
          >
            View all solutions
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </Reveal>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" stagger={0.1}>
          {products.map((p) => (
            <StaggerItem key={p.title} className={p.offset ? "lg:translate-y-10" : ""}>
              <TiltCard amount={6}>
              <a href="#" className="group block relative overflow-hidden rounded-3xl bg-card-dark hover-glow">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <div
                    className="absolute inset-0 transition-all duration-500 grayscale group-hover:grayscale-0"
                    style={{ background: p.color }}
                  >
                    {/* Illustration */}
                    <div className="absolute inset-0 p-4">
                      <p.Illustration />
                    </div>
                    {/* Grid overlay */}
                    <div className="absolute inset-0 grid-pattern pointer-events-none" />
                  </div>

                  {/* Catalog label */}
                  <div className="catalog-label">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-off-white/60">{p.fig}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-acid-lime" />
                    </div>
                    <span className="text-[10px] font-mono text-off-white/40">{p.year}</span>
                  </div>

                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-acid-lime flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <ArrowUpRight className="w-4 h-4 text-stone-black" />
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-serif text-xl font-light italic text-off-white tracking-[-0.01em]">
                    {p.title}
                  </h3>
                  <p className="text-sm text-off-white/40 mt-1">{p.subtitle}</p>
                </div>
              </a>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   STATS BAND
   ═══════════════════════════════════════════ */
function StatsBand() {
  const stats = [
    { number: "2M+", label: "Studies Archived" },
    { number: "150+", label: "Clinics Trust Us" },
    { number: "99.99%", label: "Uptime SLA" },
    { number: "<3s", label: "Avg. Load Time" },
  ];

  return (
    <section className="py-16 bg-warm-charcoal border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s) => (
            <StaggerItem key={s.label} className="text-center">
              <div className="font-serif text-4xl lg:text-5xl font-extralight text-acid-lime tracking-tight">
                <AnimatedCounter value={s.number} />
              </div>
              <div className="text-off-white/40 text-sm uppercase tracking-[0.15em] mt-2 font-medium">
                {s.label}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   TABBED PLATFORM DEEP-DIVE
   ═══════════════════════════════════════════ */
function TabbedContent() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      label: "Viewer",
      icon: Monitor,
      heading: "The viewer radiologists love",
      body: "Diagnostic-quality rendering in the browser. Familiar tools with a modern UX. Multi-planar reconstruction, 3D volume rendering, and hanging protocol automation — all without installing a single plugin.",
      details: [
        "Window/level presets with one-click switching",
        "Precision measurements & smart annotations",
        "Multi-monitor & multi-frame support",
        "Prior study comparison with auto-alignment",
        "Full DICOMweb & WADO-RS native support",
      ],
    },
    {
      label: "Reporting",
      icon: FileText,
      heading: "Structured reporting that flows",
      body: "Radiology-specific templates with AI-assisted auto-fill. Integrated voice dictation, real-time peer review, and one-click sign-off make reporting feel effortless rather than burdensome.",
      details: [
        "300+ radiology-specific templates built-in",
        "AI-assisted auto-population of findings",
        "Nuance PowerScribe & Dragon integration",
        "Critical result alerting with auto-escalation",
        "One-click PDF generation & HL7 distribution",
      ],
    },
    {
      label: "AI Engine",
      icon: BrainCircuit,
      heading: "Intelligence at every layer",
      body: "Our AI marketplace integrates FDA-cleared algorithms for chest X-ray triage, lung nodule detection, stroke identification, and mammography assistance — surfacing insights directly in the radiologist's workflow.",
      details: [
        "FDA 510(k)-cleared triage algorithms",
        "Automated lung nodule tracking (Lung-RADS)",
        "Stroke detection with LVO identification",
        "Bone age & fracture detection modules",
        "Open API for custom model integration",
      ],
    },
    {
      label: "Integration",
      icon: Link2,
      heading: "Plug into your ecosystem",
      body: "TitanRad connects to your existing infrastructure in hours, not months. Pre-built connectors for every major EMR, bi-directional HL7v2/FHIR messaging, and a fully documented REST API for custom workflows.",
      details: [
        "Epic, Cerner, MEDITECH, athenahealth connectors",
        "Bi-directional HL7v2 & FHIR R4 messaging",
        "DICOMweb (STOW/WADO/QIDO) native gateway",
        "Modality worklist (MWL) with auto-routing",
        "Webhooks & REST API with OpenAPI 3.0 spec",
      ],
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-stone-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal className="mb-16">
          <span className="text-xs font-mono text-off-white/40 tracking-[0.2em] uppercase block mb-4">
            Fig. 03 — Deep Dive
          </span>
          <h2
            className="font-serif font-extralight tracking-[-0.02em] text-off-white"
            style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}
          >
            Four pillars.{" "}
            <em className="italic text-shimmer font-light">One</em>{" "}
            platform.
          </h2>
        </Reveal>

        <div className="relative">
          <div className="flex gap-1 relative z-10 mb-0 overflow-x-auto pb-px">
            {tabs.map((tab, i) => {
              const isActive = i === activeTab;
              return (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(i)}
                  className="relative shrink-0 transition-all duration-300"
                  style={{
                    transform: isActive
                      ? "rotate(0deg) translateY(0px)"
                      : `rotate(${-2 + i * 0.5}deg) translateY(2px)`,
                    zIndex: isActive ? 10 : i,
                  }}
                >
                  <div
                    className={`px-6 py-3.5 rounded-t-2xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                      isActive
                        ? "bg-acid-lime text-stone-black px-8 py-4"
                        : "bg-card-dark text-off-white/50 hover:text-off-white/70 hover:bg-card-dark/80"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="relative bg-warm-charcoal rounded-b-3xl rounded-tr-3xl overflow-hidden">
            <div className="h-4 w-full serrated-top bg-warm-charcoal" />
            <div className="absolute inset-0 grid-pattern pointer-events-none" />

            <div className="relative z-10 p-8 lg:p-14">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                >
                  <div className="grid lg:grid-cols-2 gap-12">
                    <div>
                      <span className="text-xs font-mono text-acid-lime/60 tracking-wider block mb-4">
                        Module 0{activeTab + 1}
                      </span>
                      <h3
                        className="font-serif font-light text-off-white tracking-[-0.02em] mb-6"
                        style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}
                      >
                        {tabs[activeTab].heading}
                      </h3>
                      <p className="text-off-white/50 leading-relaxed text-base">
                        {tabs[activeTab].body}
                      </p>
                    </div>
                    <div className="space-y-4">
                      <span className="text-xs font-sans font-semibold text-off-white/30 uppercase tracking-[0.15em] block mb-2">
                        Capabilities
                      </span>
                      {tabs[activeTab].details.map((d, i) => (
                        <motion.div
                          key={d}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06, duration: 0.4 }}
                          className="flex items-start gap-3 group"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-acid-lime mt-2 shrink-0 group-hover:scale-150 transition-transform duration-300" />
                          <span className="text-off-white/70 text-[15px]">{d}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECURITY SECTION
   ═══════════════════════════════════════════ */
function SecuritySection() {
  const certs = [
    { icon: Shield, label: "HIPAA", desc: "Full administrative, physical, and technical safeguards" },
    { icon: Lock, label: "SOC 2 Type II", desc: "Annual audit by independent third-party firm" },
    { icon: Server, label: "99.99% SLA", desc: "Multi-region active-active on AWS GovCloud" },
    { icon: Eye, label: "Audit Logging", desc: "Immutable access logs with 7-year retention" },
  ];

  return (
    <section id="security" className="py-24 lg:py-32 bg-warm-charcoal">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <span className="text-xs font-mono text-off-white/40 tracking-[0.2em] uppercase block mb-4">
              Fig. 04 — Security &amp; Compliance
            </span>
            <h2
              className="font-serif font-extralight tracking-[-0.02em] text-off-white"
              style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}
            >
              Security isn&rsquo;t a{" "}
              <em className="italic text-shimmer font-light">feature</em>.
              <br />
              It&rsquo;s the foundation.
            </h2>
            <p className="mt-6 text-off-white/45 text-lg leading-relaxed max-w-lg">
              Every study is encrypted with AES-256 at rest and TLS 1.3 in transit.
              Role-based access control, IP allowlisting, and hardware MFA ensure
              only authorized personnel touch patient data.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 mt-8 text-acid-lime font-semibold text-sm hover:gap-3 transition-all duration-200"
            >
              Download our BAA <ArrowRight className="w-4 h-4" />
            </a>
          </Reveal>

          <StaggerContainer className="grid grid-cols-2 gap-4" stagger={0.1}>
            {certs.map((c) => (
              <StaggerItem key={c.label}>
                <TiltCard>
                <div className="bg-stone-black rounded-3xl p-6 border border-white/5 hover:border-acid-lime/15 transition-all duration-300 hover-glow">
                  <motion.div whileHover={{ scale: 1.2, rotate: 5 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                    <c.icon className="w-6 h-6 text-acid-lime mb-4" />
                  </motion.div>
                  <h4 className="font-serif text-lg font-light text-off-white mb-1">{c.label}</h4>
                  <p className="text-off-white/40 text-sm leading-relaxed">{c.desc}</p>
                </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   TESTIMONIALS — Two quotes
   ═══════════════════════════════════════════ */
function Testimonials() {
  const quotes = [
    {
      text: "TitanRad cut our average reporting turnaround from 48 hours to under 12. The zero-footprint viewer is a game changer for our teleradiology team.",
      name: "Dr. Sarah Chen",
      title: "Chief of Radiology, Metro Health System",
      initials: "SC",
    },
    {
      text: "We evaluated six PACS vendors. TitanRad was the only one that went live in under two weeks with full Epic bi-directional integration. Our radiologists refused to go back.",
      name: "Dr. James Rivera",
      title: "Medical Director, Pacific Imaging Group",
      initials: "JR",
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-stone-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal className="mb-16">
          <span className="text-xs font-mono text-off-white/40 tracking-[0.2em] uppercase block mb-4">
            Fig. 05 — Testimonials
          </span>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-8">
          {quotes.map((q, i) => (
            <Reveal key={q.name} delay={i * 0.15}>
              <TiltCard amount={5}>
              <div className="bg-warm-charcoal rounded-3xl p-8 lg:p-10 border border-white/5 hover-glow">
                <blockquote
                  className="font-serif font-extralight text-off-white leading-snug tracking-[-0.01em] mb-8"
                  style={{ fontSize: "clamp(1.15rem, 2vw, 1.4rem)" }}
                >
                  &ldquo;{q.text}&rdquo;
                </blockquote>
                <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                  <div className="w-11 h-11 rounded-full bg-card-dark flex items-center justify-center text-sm font-semibold text-off-white/70 border border-white/5">
                    {q.initials}
                  </div>
                  <div>
                    <div className="font-medium text-off-white text-sm">{q.name}</div>
                    <div className="text-off-white/40 text-xs">{q.title}</div>
                  </div>
                </div>
              </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   PRICING
   ═══════════════════════════════════════════ */
function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$499",
      period: "/mo",
      desc: "Up to 500 studies/month",
      features: [
        "Single-site license",
        "Zero-footprint viewer",
        "Structured reporting",
        "DICOM import/export",
        "Email support (48h SLA)",
      ],
      cta: "Start Free Trial",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$1,299",
      period: "/mo",
      desc: "Up to 5,000 studies/month",
      features: [
        "Multi-site, unlimited users",
        "AI triage + lung nodule module",
        "Epic & Cerner integration",
        "Full REST API access",
        "Priority support (4h SLA)",
        "Custom report templates",
      ],
      cta: "Start Free Trial",
      highlighted: true,
      badge: "Most Popular",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      desc: "Unlimited studies & sites",
      features: [
        "Dedicated success manager",
        "Custom SLA & uptime guarantee",
        "SSO / SAML / SCIM provisioning",
        "On-prem or hybrid deployment",
        "BAA & custom legal terms",
        "24/7 phone support",
      ],
      cta: "Contact Sales",
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 lg:py-32 bg-warm-charcoal">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono text-off-white/40 tracking-[0.2em] uppercase block mb-4">
            Fig. 06 — Pricing
          </span>
          <h2
            className="font-serif font-extralight tracking-[-0.02em] text-off-white"
            style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}
          >
            Transparent pricing.
            <br />
            <em className="italic text-shimmer font-light">Zero</em> surprises.
          </h2>
          <p className="text-off-white/45 text-lg mt-4">
            14-day free trial on all plans. No credit card required.
          </p>
        </Reveal>

        <StaggerContainer className="grid md:grid-cols-3 gap-6 lg:gap-8 items-start" stagger={0.12}>
          {plans.map((plan) => (
            <StaggerItem key={plan.name}>
              <TiltCard amount={5}>
              <div
                className={`relative rounded-3xl p-8 lg:p-10 transition-all duration-300 ${
                  plan.highlighted
                    ? "bg-stone-black ring-2 ring-acid-lime/50 scale-[1.02] lg:scale-105 glow-pulse"
                    : "bg-stone-black border border-white/5 hover:border-white/10 hover-glow"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <motion.span
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="inline-block bg-acid-lime text-stone-black text-xs font-bold px-4 py-1.5 rounded-full shadow-lg"
                    >
                      {plan.badge}
                    </motion.span>
                  </div>
                )}

                <div className="text-xs font-mono uppercase tracking-[0.2em] text-off-white/40 mb-4">
                  {plan.name}
                </div>

                <div className="flex items-baseline gap-1 mb-2">
                  <span className="font-serif text-5xl font-extralight text-off-white tracking-tight">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-off-white/40 font-medium text-sm">{plan.period}</span>
                  )}
                </div>

                <p className="text-off-white/40 mb-8 text-sm">{plan.desc}</p>

                <ul className="space-y-3.5 mb-10">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <Check
                        className={`w-4 h-4 shrink-0 ${plan.highlighted ? "text-acid-lime" : "text-acid-lime/50"}`}
                        strokeWidth={3}
                      />
                      <span className="text-off-white/60 text-[14px]">{f}</span>
                    </li>
                  ))}
                </ul>

                <MagneticButton className="w-full">
                  <a
                    href="#"
                    className={`block w-full text-center py-3.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                      plan.highlighted
                        ? "bg-acid-lime text-stone-black hover:bg-acid-lime-dark hover:-translate-y-0.5 btn-shine"
                        : "bg-white/5 text-off-white/70 hover:bg-white/10"
                    }`}
                  >
                    {plan.cta}
                  </a>
                </MagneticButton>
              </div>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   STICKY NOTE CTA
   ═══════════════════════════════════════════ */
function StickyNoteCta() {
  return (
    <section className="py-24 lg:py-32 bg-stone-black">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <Reveal>
          <motion.div
            whileHover={{ rotate: 0, scale: 1.02 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="bg-acid-lime text-stone-black rounded-3xl p-10 lg:p-16 relative"
            style={{ transform: "rotate(2deg)" }}
          >
            <h2
              className="font-serif font-light tracking-[-0.02em] leading-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
            >
              Ready to modernize
              <br />
              your <em className="italic font-extralight">imaging workflow?</em>
            </h2>

            <p className="mt-6 text-stone-black/60 text-lg max-w-lg leading-relaxed">
              Join 150+ clinics already using TitanRad to deliver faster reads,
              smarter triage, and better patient outcomes &mdash; all from the browser.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <MagneticButton>
                <a
                  href="#pricing"
                  className="btn-shine inline-flex items-center gap-2 px-8 py-3.5 bg-stone-black text-acid-lime font-semibold rounded-full text-sm hover:bg-warm-charcoal transition-all duration-300"
                >
                  Start Your 14-Day Free Trial
                  <ArrowRight className="w-4 h-4" />
                </a>
              </MagneticButton>
              <a
                href="#"
                className="animated-underline text-sm font-medium text-stone-black/60 hover:text-stone-black transition-colors duration-300"
              >
                Or request a live demo
              </a>
            </div>

            <div className="mt-8 pt-6 border-t border-stone-black/10">
              <span className="text-xs font-medium text-stone-black/40 uppercase tracking-[0.15em]">
                No credit card required &middot; Go live in under 24 hours
              </span>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════ */
function Footer() {
  const columns = [
    {
      title: "Product",
      links: ["DICOM Viewer", "AI Engine", "Reporting", "Analytics", "Integrations", "Mobile App"],
    },
    {
      title: "Company",
      links: ["About", "Careers", "Blog", "Press", "Contact"],
    },
    {
      title: "Resources",
      links: ["Documentation", "API Reference", "Status Page", "Changelog", "Community"],
    },
    {
      title: "Legal",
      links: ["Privacy Policy", "Terms of Service", "HIPAA", "BAA", "Compliance"],
    },
  ];

  return (
    <footer className="bg-warm-charcoal pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-6 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-acid-lime flex items-center justify-center">
                <Activity className="w-5 h-5 text-stone-black" strokeWidth={2.5} />
              </div>
              <span className="font-serif text-2xl font-light text-off-white tracking-tight">
                TitanRad
              </span>
            </a>
            <p className="text-off-white/40 text-sm leading-relaxed max-w-xs">
              Cloud-native PACS built for modern radiology. Secure, fast, and
              designed for teams that demand diagnostic excellence.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-acid-lime animate-pulse" />
                <span className="text-xs text-off-white/30">All systems operational</span>
              </div>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-off-white/60 font-semibold text-xs uppercase tracking-[0.15em] mb-5">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="animated-underline text-off-white/40 text-sm hover:text-off-white transition-colors duration-300">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-16 pt-8 border-t border-white/5">
          <p className="text-off-white/25 text-sm">
            &copy; {new Date().getFullYear()} TitanRad Health, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Twitter", "LinkedIn", "GitHub"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-off-white/30 text-xs hover:text-off-white transition-colors duration-300 uppercase tracking-widest"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
export default function Component() {
  return (
    <>
      <PageLoader />
      <CustomCursor />
      <ScrollProgress />
      <ClickRippleEffect />
      <div className="noise-overlay" />

      <Navbar />
      <Hero />
      <LogoBar />
      <Features />
      <SerratedDivider />
      <ShowcaseGrid />
      <StatsBand />
      <TabbedContent />
      <SecuritySection />
      <Testimonials />
      <Pricing />
      <StickyNoteCta />
      <Footer />
    </>
  );
}
