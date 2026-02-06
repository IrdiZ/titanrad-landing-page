import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
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
    const over = (e) => { if (e.target.closest("a,button,[role=button],input")) setHovered(true); };
    const out = (e) => { if (e.target.closest("a,button,[role=button],input")) setHovered(false); };
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
