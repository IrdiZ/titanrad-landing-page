import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import TubesBackground from './TubesBackground';

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen">
      {/* Login nav button - outside TubesBackground so pointer-events work */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute top-6 right-6 z-30"
      >
        <Link
          to="/login"
          className="inline-block px-5 py-2 border border-white/20 hover:border-[#00D4AA]/50 text-white/70 hover:text-white rounded-full transition-all duration-300 text-sm tracking-wide backdrop-blur-sm hover:shadow-[0_0_20px_rgba(0,212,170,0.15)]"
        >
          Login
        </Link>
      </motion.div>

      <TubesBackground className="bg-[#0A1628]">
        <div className="flex flex-col items-center justify-center w-full h-full px-4 pointer-events-auto">
          {/* Main title block */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center select-none"
          >
            <h1
              className="text-[clamp(3.5rem,12vw,10rem)] font-black uppercase leading-[0.85] tracking-[-0.04em] text-white"
              style={{
                textShadow:
                  '0 0 80px rgba(0,102,255,0.4), 0 0 160px rgba(0,212,170,0.15)',
              }}
            >
              TITANRAD
            </h1>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="h-[2px] bg-gradient-to-r from-transparent via-[#00D4AA] to-transparent mt-4"
            />

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-6 text-sm md:text-base uppercase tracking-[0.35em] text-white/60 font-light"
            >
              Medical Imaging &middot; Anywhere &middot; Instantly
            </motion.p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-12 flex flex-col sm:flex-row items-center gap-4"
          >
            <a
              href="#pricing"
              className="px-8 py-3.5 bg-[#00D4AA] hover:bg-[#00e6b8] text-[#0A1628] font-semibold rounded-full transition-colors duration-200 text-sm tracking-wide"
            >
              Start Free Trial
            </a>
            <a
              href="#demo"
              className="px-8 py-3.5 border border-white/20 hover:border-white/40 text-white rounded-full transition-colors duration-200 text-sm tracking-wide backdrop-blur-sm"
            >
              Watch Demo
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="mt-14 flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs text-white/40 tracking-wide"
          >
            <span>HIPAA Compliant</span>
            <span>99.99% Uptime</span>
            <span>SOC 2 Type II</span>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-8 flex flex-col items-center gap-2 pointer-events-none"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
            >
              <div className="w-1 h-1.5 rounded-full bg-white/50" />
            </motion.div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/30">
              Scroll
            </span>
          </motion.div>
        </div>
      </TubesBackground>
    </section>
  );
}
