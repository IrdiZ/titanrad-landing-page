import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Fingerprint,
  Scan,
  ArrowLeft,
  Skull,
  Radiation,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

/* ─── Floating particles background ─── */
function FloatingParticles() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 10,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background:
              p.id % 3 === 0
                ? "rgba(212,242,104,0.3)"
                : "rgba(255,255,255,0.08)",
          }}
          animate={{
            y: [0, -80, 0],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Animated grid background ─── */
function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.04]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(212,242,104,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,242,104,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(212,242,104,0.15) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* ─── Scanline effect ─── */
function ScanlineEffect({ isScanning }) {
  if (!isScanning) return null;
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none z-50 overflow-hidden rounded-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute left-0 right-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, #D4F268, transparent)",
          boxShadow: "0 0 20px 4px rgba(212,242,104,0.4)",
        }}
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
}

/* ─── Password strength helpers ─── */
const strengthLabels = [
  { label: "Wet Paper Bag", color: "#ef4444", emoji: "🧻" },
  { label: "Screen Door on a Submarine", color: "#f97316", emoji: "🚪" },
  { label: "Cardboard Shield", color: "#eab308", emoji: "📦" },
  { label: "Decent Deadbolt", color: "#22c55e", emoji: "🔒" },
  { label: "Fort Knox", color: "#D4F268", emoji: "🏰" },
  { label: "Nuclear Launch Codes", color: "#D4F268", emoji: "☢️" },
];

function getPasswordStrength(password) {
  if (!password) return -1;
  let score = 0;
  if (password.length >= 4) score++;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 5);
}

/* ─── Fake verification messages ─── */
const verificationMessages = [
  "Initializing quantum handshake...",
  "Verifying you're not a robot...",
  "Verifying you're not a cat on a keyboard...",
  "Scanning for bad vibes...",
  "Checking if you remembered to hydrate today...",
  "Confirming you know the difference between CT and MRI...",
  "Consulting the radiology gods...",
  "Aligning the DICOM stars...",
  "Warming up the lead aprons...",
  "ACCESS GRANTED... just kidding, one more check...",
  "Verifying your coffee intake is sufficient...",
  "Almost there... performing final vibe check...",
];

/* ─── Funny eyeball component ─── */
function FunnyEyeball({ isHovered }) {
  return (
    <AnimatePresence>
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="absolute -top-16 right-0 bg-[#292524] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#E7E5E4] whitespace-nowrap shadow-xl"
          style={{ fontFamily: "'Instrument Sans', sans-serif" }}
        >
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="inline-block mr-1"
          >
            👁️
          </motion.span>
          I see you looking...
          <div className="absolute -bottom-1 right-4 w-2 h-2 bg-[#292524] border-r border-b border-white/10 rotate-45" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Main LoginPage component ─── */
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [eyeHovered, setEyeHovered] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [shakeEmail, setShakeEmail] = useState(false);
  const [shakePassword, setShakePassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loginComplete, setLoginComplete] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [petTherapist, setPetTherapist] = useState("");
  const [typingBurst, setTypingBurst] = useState(false);
  const formRef = useRef(null);

  const passwordStrength = getPasswordStrength(password);

  // Cycle verification messages during login
  useEffect(() => {
    if (!isLoggingIn) return;
    const interval = setInterval(() => {
      setCurrentMessage((prev) => {
        if (prev >= verificationMessages.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLoggingIn(false);
            setShowTwoFactor(true);
          }, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [isLoggingIn]);

  // Typing burst animation on password
  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
    setTypingBurst(true);
    setTimeout(() => setTypingBurst(false), 150);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;
    if (!email) {
      setShakeEmail(true);
      setTimeout(() => setShakeEmail(false), 600);
      hasError = true;
    }
    if (!password) {
      setShakePassword(true);
      setTimeout(() => setShakePassword(false), 600);
      hasError = true;
    }
    if (hasError) return;
    setCurrentMessage(0);
    setIsLoggingIn(true);
  };

  const handleTwoFactorSubmit = (e) => {
    e.preventDefault();
    setShowTwoFactor(false);
    setLoginComplete(true);
  };

  // Stagger animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-12"
      style={{
        background: `
          radial-gradient(ellipse at 30% 20%, rgba(212,242,104,0.06) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%, rgba(212,242,104,0.04) 0%, transparent 50%),
          #0C0A09
        `,
        fontFamily: "'Instrument Sans', sans-serif",
      }}
    >
      <FloatingParticles />
      <GridBackground />

      {/* Back to home link */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="absolute top-6 left-6 md:top-8 md:left-8 z-20"
      >
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-[#E7E5E4]/60 hover:text-[#D4F268] transition-colors duration-200"
          style={{ fontFamily: "'Instrument Sans', sans-serif" }}
        >
          <ArrowLeft size={16} />
          Back to safety
        </Link>
      </motion.div>

      {/* Classification badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center gap-2 px-3 py-1.5 border border-[#D4F268]/30 rounded-full z-20"
      >
        <motion.div
          className="w-2 h-2 rounded-full bg-[#D4F268]"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span
          className="text-[10px] uppercase tracking-[0.2em] text-[#D4F268]"
          style={{ fontFamily: "'Instrument Sans', sans-serif" }}
        >
          Clearance Required
        </span>
      </motion.div>

      {/* Main login card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative w-full max-w-md z-10"
      >
        {/* Glow behind card */}
        <div
          className="absolute -inset-4 rounded-3xl opacity-30 blur-3xl pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(212,242,104,0.15), transparent 70%)",
          }}
        />

        <div
          className="relative rounded-2xl border border-white/[0.08] overflow-hidden"
          style={{
            background: "rgba(28,25,23,0.7)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
          }}
        >
          <ScanlineEffect isScanning={isLoggingIn} />

          {/* Header */}
          <div className="px-8 pt-8 pb-2">
            <motion.div variants={itemVariants} className="text-center mb-6">
              {/* Vault icon */}
              <motion.div
                className="mx-auto w-16 h-16 rounded-2xl border border-[#D4F268]/20 flex items-center justify-center mb-5"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(212,242,104,0.1), rgba(212,242,104,0.02))",
                }}
                animate={
                  isLoggingIn
                    ? { rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }
                    : {}
                }
                transition={
                  isLoggingIn
                    ? { duration: 0.5, repeat: Infinity }
                    : {}
                }
              >
                {isLoggingIn ? (
                  <Scan size={28} className="text-[#D4F268]" />
                ) : loginComplete ? (
                  <ShieldCheck size={28} className="text-[#D4F268]" />
                ) : (
                  <Fingerprint size={28} className="text-[#D4F268]" />
                )}
              </motion.div>

              <h1
                className="text-2xl font-semibold text-[#E7E5E4] mb-1"
                style={{ fontFamily: "'Newsreader', serif" }}
              >
                {loginComplete
                  ? "Welcome, Agent"
                  : showTwoFactor
                  ? "One More Thing..."
                  : "Access The Vault"}
              </h1>
              <p className="text-sm text-[#E7E5E4]/40">
                {loginComplete
                  ? "The DICOM files await you."
                  : showTwoFactor
                  ? "Enhanced security protocol engaged"
                  : "Authorized radiologists only. Seriously."}
              </p>
            </motion.div>
          </div>

          {/* Login Complete State */}
          <AnimatePresence mode="wait">
            {loginComplete ? (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="px-8 pb-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2,
                  }}
                  className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-[#D4F268] flex items-center justify-center"
                >
                  <ShieldCheck size={36} className="text-[#D4F268]" />
                </motion.div>
                <p className="text-[#E7E5E4] text-lg font-medium mb-2">
                  Identity Confirmed
                </p>
                <p className="text-[#E7E5E4]/40 text-sm mb-6">
                  Redirecting to mission control...
                </p>
                <motion.div
                  className="h-1 rounded-full bg-[#292524] overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="h-full bg-[#D4F268] rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                </motion.div>
              </motion.div>
            ) : showTwoFactor ? (
              /* ─── Fake 2FA: Pet's Therapist ─── */
              <motion.form
                key="twofactor"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                onSubmit={handleTwoFactorSubmit}
                className="px-8 pb-8"
              >
                <div className="mb-4 p-3 rounded-lg bg-[#D4F268]/5 border border-[#D4F268]/10">
                  <p className="text-xs text-[#D4F268]/80 flex items-center gap-2">
                    <Lock size={12} />
                    Enhanced Security Protocol v4.20
                  </p>
                </div>

                <label className="block text-sm text-[#E7E5E4]/60 mb-2">
                  What is the name of your first pet's therapist?
                </label>
                <input
                  type="text"
                  value={petTherapist}
                  onChange={(e) => setPetTherapist(e.target.value)}
                  placeholder="Dr. Whiskers McFluffington"
                  className="w-full px-4 py-3 rounded-xl bg-[#292524]/60 border border-white/[0.08] text-[#E7E5E4] placeholder-[#E7E5E4]/20 text-sm outline-none focus:border-[#D4F268]/40 transition-colors"
                  style={{ fontFamily: "'Instrument Sans', sans-serif" }}
                  autoFocus
                />
                <p className="text-[10px] text-[#E7E5E4]/20 mt-2 italic">
                  (We accept any answer. We just wanted to know.)
                </p>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={{
                    background: "#D4F268",
                    color: "#0C0A09",
                    fontFamily: "'Instrument Sans', sans-serif",
                  }}
                >
                  Confirm Identity
                </motion.button>

                <button
                  type="button"
                  onClick={() => {
                    setShowTwoFactor(false);
                    setLoginComplete(true);
                  }}
                  className="w-full mt-3 text-xs text-[#E7E5E4]/30 hover:text-[#E7E5E4]/50 transition-colors"
                >
                  I never had a pet (sad path)
                </button>
              </motion.form>
            ) : isLoggingIn ? (
              /* ─── Verification animation ─── */
              <motion.div
                key="verifying"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-8 pb-8"
              >
                <div className="space-y-3">
                  {verificationMessages
                    .slice(0, currentMessage + 1)
                    .map((msg, i) => (
                      <motion.div
                        key={msg}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                      >
                        {i < currentMessage ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-5 h-5 rounded-full bg-[#D4F268]/20 flex items-center justify-center flex-shrink-0"
                          >
                            <ShieldCheck
                              size={12}
                              className="text-[#D4F268]"
                            />
                          </motion.div>
                        ) : (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-5 h-5 rounded-full border-2 border-[#D4F268]/30 border-t-[#D4F268] flex-shrink-0"
                          />
                        )}
                        <span
                          className={`text-sm ${
                            i < currentMessage
                              ? "text-[#E7E5E4]/40"
                              : "text-[#E7E5E4]/80"
                          }`}
                        >
                          {msg}
                        </span>
                      </motion.div>
                    ))}
                </div>

                {/* Progress bar */}
                <div className="mt-6 h-1.5 rounded-full bg-[#292524] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "#D4F268" }}
                    initial={{ width: "0%" }}
                    animate={{
                      width: `${
                        ((currentMessage + 1) / verificationMessages.length) *
                        100
                      }%`,
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
                <p className="text-[10px] text-[#E7E5E4]/20 mt-2 text-center">
                  Threat Level: Midnight
                </p>
              </motion.div>
            ) : (
              /* ─── Login form ─── */
              <motion.form
                key="form"
                ref={formRef}
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-8 pb-8"
              >
                {/* Email field */}
                <motion.div variants={itemVariants} className="mb-4">
                  <label className="block text-xs text-[#E7E5E4]/40 mb-2 uppercase tracking-wider">
                    Email Identification
                  </label>
                  <motion.div
                    animate={
                      shakeEmail
                        ? { x: [0, -8, 8, -8, 8, 0] }
                        : {}
                    }
                    transition={{ duration: 0.4 }}
                    className="relative"
                  >
                    <Mail
                      size={16}
                      className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                        emailFocused
                          ? "text-[#D4F268]"
                          : "text-[#E7E5E4]/20"
                      }`}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      placeholder="agent@titanrad.io (we promise not to sell it... much)"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#292524]/60 text-[#E7E5E4] placeholder-[#E7E5E4]/15 text-sm outline-none transition-all duration-200"
                      style={{
                        border: emailFocused
                          ? "1px solid rgba(212,242,104,0.3)"
                          : "1px solid rgba(255,255,255,0.08)",
                        boxShadow: emailFocused
                          ? "0 0 20px rgba(212,242,104,0.08), inset 0 0 20px rgba(212,242,104,0.02)"
                          : "none",
                        fontFamily: "'Instrument Sans', sans-serif",
                      }}
                    />
                    {shakeEmail && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-red-400"
                      >
                        Required, chief
                      </motion.span>
                    )}
                  </motion.div>
                </motion.div>

                {/* Password field */}
                <motion.div variants={itemVariants} className="mb-2">
                  <label className="block text-xs text-[#E7E5E4]/40 mb-2 uppercase tracking-wider">
                    Secret Passphrase
                  </label>
                  <motion.div
                    animate={
                      shakePassword
                        ? { x: [0, -8, 8, -8, 8, 0] }
                        : {}
                    }
                    transition={{ duration: 0.4 }}
                    className="relative"
                  >
                    <Lock
                      size={16}
                      className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                        passwordFocused
                          ? "text-[#D4F268]"
                          : "text-[#E7E5E4]/20"
                      }`}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={handlePasswordChange}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      placeholder="Make it spicy \u{1F336}\u{FE0F}"
                      className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-[#292524]/60 text-[#E7E5E4] placeholder-[#E7E5E4]/15 text-sm outline-none transition-all duration-200"
                      style={{
                        border: passwordFocused
                          ? "1px solid rgba(212,242,104,0.3)"
                          : "1px solid rgba(255,255,255,0.08)",
                        boxShadow: passwordFocused
                          ? "0 0 20px rgba(212,242,104,0.08), inset 0 0 20px rgba(212,242,104,0.02)"
                          : "none",
                        fontFamily: "'Instrument Sans', sans-serif",
                      }}
                    />
                    {/* Eye toggle with funny easter egg */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <FunnyEyeball isHovered={eyeHovered} />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseEnter={() => setEyeHovered(true)}
                        onMouseLeave={() => setEyeHovered(false)}
                        className="p-1 text-[#E7E5E4]/30 hover:text-[#D4F268] transition-colors duration-200"
                      >
                        <motion.div
                          animate={
                            eyeHovered ? { scale: [1, 1.3, 1] } : {}
                          }
                          transition={{ duration: 0.3 }}
                        >
                          {showPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </motion.div>
                      </button>
                    </div>
                    {shakePassword && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute right-12 top-1/2 -translate-y-1/2 text-xs text-red-400"
                      >
                        Nice try
                      </motion.span>
                    )}
                  </motion.div>
                </motion.div>

                {/* Password strength meter */}
                <motion.div variants={itemVariants} className="mb-6">
                  <AnimatePresence>
                    {password.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Strength bar */}
                        <div className="flex gap-1 mt-3 mb-2">
                          {Array.from({ length: 5 }, (_, i) => (
                            <motion.div
                              key={i}
                              className="h-1 flex-1 rounded-full"
                              initial={{ scaleX: 0 }}
                              animate={{
                                scaleX: 1,
                                backgroundColor:
                                  i <= passwordStrength
                                    ? strengthLabels[
                                        Math.min(
                                          passwordStrength,
                                          strengthLabels.length - 1
                                        )
                                      ].color
                                    : "rgba(255,255,255,0.06)",
                              }}
                              transition={{ delay: i * 0.05 }}
                              style={{ originX: 0 }}
                            />
                          ))}
                        </div>

                        {/* Strength label */}
                        <motion.div
                          key={passwordStrength}
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center justify-between"
                        >
                          <span className="text-xs text-[#E7E5E4]/40">
                            Security Level:{" "}
                            <span
                              style={{
                                color:
                                  strengthLabels[
                                    Math.min(
                                      Math.max(passwordStrength, 0),
                                      strengthLabels.length - 1
                                    )
                                  ].color,
                              }}
                            >
                              {
                                strengthLabels[
                                  Math.min(
                                    Math.max(passwordStrength, 0),
                                    strengthLabels.length - 1
                                  )
                                ].label
                              }
                            </span>
                          </span>
                          <motion.span
                            animate={
                              typingBurst ? { scale: [1, 1.4, 1] } : {}
                            }
                            className="text-sm"
                          >
                            {
                              strengthLabels[
                                Math.min(
                                  Math.max(passwordStrength, 0),
                                  strengthLabels.length - 1
                                )
                              ].emoji
                            }
                          </motion.span>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Submit button */}
                <motion.div variants={itemVariants}>
                  <motion.button
                    type="submit"
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 0 30px rgba(212,242,104,0.2)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    className="relative w-full py-3.5 rounded-xl text-sm font-semibold overflow-hidden group cursor-pointer"
                    style={{
                      background: "#D4F268",
                      color: "#0C0A09",
                      fontFamily: "'Instrument Sans', sans-serif",
                    }}
                  >
                    {/* Hover sweep effect */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span className="relative flex items-center justify-center gap-2">
                      <Fingerprint size={16} />
                      Initiate Access Protocol
                    </span>
                  </motion.button>
                </motion.div>

                {/* Forgot password */}
                <motion.div
                  variants={itemVariants}
                  className="mt-4 text-center"
                >
                  <button
                    type="button"
                    className="text-xs text-[#E7E5E4]/25 hover:text-[#D4F268]/60 transition-colors"
                  >
                    Forgot your passphrase? That's... concerning.
                  </button>
                </motion.div>

                {/* Divider */}
                <motion.div
                  variants={itemVariants}
                  className="flex items-center gap-4 my-6"
                >
                  <div className="flex-1 h-px bg-white/[0.06]" />
                  <span className="text-[10px] text-[#E7E5E4]/20 uppercase tracking-wider">
                    or
                  </span>
                  <div className="flex-1 h-px bg-white/[0.06]" />
                </motion.div>

                {/* SSO button */}
                <motion.div variants={itemVariants}>
                  <button
                    type="button"
                    className="w-full py-3 rounded-xl text-sm text-[#E7E5E4]/50 border border-white/[0.06] hover:border-[#D4F268]/20 hover:text-[#E7E5E4]/70 transition-all duration-200 flex items-center justify-center gap-2"
                    style={{ fontFamily: "'Instrument Sans', sans-serif" }}
                  >
                    <Zap size={14} />
                    Continue with Hospital SSO
                  </button>
                </motion.div>

                {/* Disclaimer */}
                <motion.p
                  variants={itemVariants}
                  className="mt-6 text-[10px] text-[#E7E5E4]/15 text-center leading-relaxed"
                >
                  By logging in, you solemnly agree that radiology is cooler
                  than cardiology, MRI is just expensive photography, and
                  you will never confuse left and right on a chest X-ray
                  again.
                </motion.p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Security badges below card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="flex justify-center gap-6 mt-6"
        >
          {["HIPAA", "SOC 2", "256-bit"].map((badge) => (
            <span
              key={badge}
              className="text-[10px] text-[#E7E5E4]/15 uppercase tracking-wider"
            >
              {badge}
            </span>
          ))}
        </motion.div>

        {/* Copyright / humor footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="text-center mt-4 text-[10px] text-[#E7E5E4]/10"
        >
          TitanRad v4.20.69 - "The Vault" Edition
        </motion.p>
      </motion.div>
    </div>
  );
}
