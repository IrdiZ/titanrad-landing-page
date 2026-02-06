import { useRef, useEffect, useCallback, useState } from 'react';

// --- Configuration Defaults ---
const DEFAULTS = {
  text: 'Pressure',
  fontFamily: 'Unbounded',
  fontUrl:
    'https://fonts.googleapis.com/css2?family=Unbounded:wght@100..900&display=swap',
  maxDistance: 200,
  minWeight: 100,
  maxWeight: 900,
  minWidth: 50,
  maxWidth: 100,
  minSlant: 0,
  maxSlant: 12,
  fontSize: 'clamp(3rem, 8vw, 8rem)',
  lineHeight: 1,
  color: '#ffffff',
  className: '',
};

// --- Font injection singleton ---
const injectedFonts = new Set();

function injectFont(family, url) {
  if (injectedFonts.has(family)) return;
  injectedFonts.add(family);

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
}

// --- Utility: linear interpolation ---
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// --- The Component ---
export default function TextPressure({
  text = DEFAULTS.text,
  fontFamily = DEFAULTS.fontFamily,
  fontUrl = DEFAULTS.fontUrl,
  maxDistance = DEFAULTS.maxDistance,
  minWeight = DEFAULTS.minWeight,
  maxWeight = DEFAULTS.maxWeight,
  minWidth = DEFAULTS.minWidth,
  maxWidth = DEFAULTS.maxWidth,
  minSlant = DEFAULTS.minSlant,
  maxSlant = DEFAULTS.maxSlant,
  fontSize = DEFAULTS.fontSize,
  lineHeight = DEFAULTS.lineHeight,
  color = DEFAULTS.color,
  className = DEFAULTS.className,
}) {
  const containerRef = useRef(null);
  const charRefs = useRef([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(null);
  const [fontLoaded, setFontLoaded] = useState(false);

  // Inject the variable font on mount
  useEffect(() => {
    injectFont(fontFamily, fontUrl);

    // Wait for font to load
    if (document.fonts) {
      document.fonts.ready.then(() => setFontLoaded(true));
    } else {
      // Fallback: just set after a short delay
      const t = setTimeout(() => setFontLoaded(true), 500);
      return () => clearTimeout(t);
    }
  }, [fontFamily, fontUrl]);

  // --- Mouse tracking ---
  const handleMouseMove = useCallback((e) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -9999, y: -9999 };
  }, []);

  // --- The animation loop ---
  const updateVariations = useCallback(() => {
    const chars = charRefs.current;
    const mouse = mouseRef.current;

    for (let i = 0; i < chars.length; i++) {
      const el = chars[i];
      if (!el) continue;

      const rect = el.getBoundingClientRect();
      const charCenterX = rect.left + rect.width / 2;
      const charCenterY = rect.top + rect.height / 2;

      const dx = mouse.x - charCenterX;
      const dy = mouse.y - charCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Normalise: 0 = right on cursor, 1 = at maxDistance or beyond
      const t = Math.min(distance / maxDistance, 1);

      // Invert: closer = higher values
      const proximity = 1 - t;

      const weight = lerp(minWeight, maxWeight, proximity);
      const width = lerp(minWidth, maxWidth, proximity);
      const slant = lerp(minSlant, maxSlant, proximity);

      el.style.fontVariationSettings = `"wght" ${weight}, "wdth" ${width}, "slnt" ${-slant}`;
      // Apply a very subtle scale for extra "swell" feel
      const scale = lerp(1, 1.05, proximity);
      el.style.transform = `scale(${scale})`;
    }

    rafRef.current = requestAnimationFrame(updateVariations);
  }, [maxDistance, minWeight, maxWeight, minWidth, maxWidth, minSlant, maxSlant]);

  // --- Lifecycle: start / stop loop, attach events ---
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    rafRef.current = requestAnimationFrame(updateVariations);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove, handleMouseLeave, updateVariations]);

  // --- Build character spans ---
  const chars = text.split('');
  charRefs.current = [];

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        display: 'inline-flex',
        flexWrap: 'wrap',
        cursor: 'default',
        fontFamily: `'${fontFamily}', sans-serif`,
        fontSize,
        lineHeight,
        color,
        opacity: fontLoaded ? 1 : 0,
        transition: 'opacity 0.4s ease',
        userSelect: 'none',
      }}
      aria-label={text}
    >
      {chars.map((char, i) => (
        <span
          key={i}
          ref={(el) => {
            charRefs.current[i] = el;
          }}
          style={{
            display: 'inline-block',
            whiteSpace: char === ' ' ? 'pre' : 'normal',
            fontVariationSettings: `"wght" ${minWeight}, "wdth" ${minWidth}, "slnt" 0`,
            willChange: 'font-variation-settings, transform',
            transformOrigin: 'center center',
          }}
          aria-hidden="true"
        >
          {char}
        </span>
      ))}
    </div>
  );
}
