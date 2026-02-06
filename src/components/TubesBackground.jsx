import { useEffect, useRef, useState } from 'react';

const randomColors = (count) =>
  Array.from({ length: count }, () =>
    '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
  );

export default function TubesBackground({
  children,
  className,
  enableClickInteraction = true,
  tubeColors = ['#0066FF', '#00D4AA', '#7c3aed'],
  lightColors = ['#00D4AA', '#0066FF', '#ff008a', '#60aed5'],
}) {
  const canvasRef = useRef(null);
  const tubesRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    let resizeHandler;

    const init = async () => {
      if (!canvasRef.current) return;
      try {
        const module = await import(
          /* @vite-ignore */
          'https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js'
        );
        if (!mounted) return;

        const app = module.default(canvasRef.current, {
          tubes: {
            colors: tubeColors,
            lights: { intensity: 200, colors: lightColors },
          },
        });

        tubesRef.current = app;
        setLoaded(true);

        resizeHandler = () => {};
        window.addEventListener('resize', resizeHandler);
      } catch (err) {
        console.error('TubesCursor failed to load:', err);
      }
    };

    init();

    return () => {
      mounted = false;
      if (resizeHandler) window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  const handleClick = () => {
    if (!enableClickInteraction || !tubesRef.current) return;
    tubesRef.current.tubes.setColors(randomColors(3));
    tubesRef.current.tubes.setLightsColors(randomColors(4));
  };

  return (
    <div
      className={`relative w-full h-full min-h-[400px] overflow-hidden ${className ?? ''}`}
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
        style={{ touchAction: 'none' }}
      />
      <div className="relative z-10 w-full h-full pointer-events-none">
        {children}
      </div>
    </div>
  );
}
