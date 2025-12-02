import { useEffect, useState } from 'react';

const Snowfall = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Check if desktop (width > 768px and not a touch device)
    const checkDesktop = () => {
      const isWideScreen = window.innerWidth > 768;
      const isNotTouch = !('ontouchstart' in window);
      setIsDesktop(isWideScreen && isNotTouch);
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  if (!isDesktop) return null;

  // Generate snowflakes with varied properties
  const snowflakes = Array.from({ length: 50 }, (_, i) => {
    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const animationDuration = Math.random() * 10 + 10;
    const animationDelay = Math.random() * -20;
    const opacity = Math.random() * 0.4 + 0.2;

    return (
      <div
        key={i}
        className="snowflake"
        style={{
          left: `${left}%`,
          width: `${size}px`,
          height: `${size}px`,
          animationDuration: `${animationDuration}s`,
          animationDelay: `${animationDelay}s`,
          opacity,
        }}
      />
    );
  });

  return (
    <div className="snowfall-container" aria-hidden="true">
      {snowflakes}
      <style jsx global>{`
        .snowfall-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 9999;
          overflow: hidden;
        }

        .snowflake {
          position: absolute;
          top: -10px;
          background: radial-gradient(circle at 30% 30%, #fff, #e0e8f0);
          border-radius: 50%;
          filter: blur(0.5px);
          animation: snowfall linear infinite;
          box-shadow: 0 0 3px rgba(255, 255, 255, 0.3);
        }

        @keyframes snowfall {
          0% {
            transform: translateY(-10px) translateX(0) rotate(0deg);
          }
          25% {
            transform: translateY(25vh) translateX(15px) rotate(90deg);
          }
          50% {
            transform: translateY(50vh) translateX(-10px) rotate(180deg);
          }
          75% {
            transform: translateY(75vh) translateX(20px) rotate(270deg);
          }
          100% {
            transform: translateY(105vh) translateX(-5px) rotate(360deg);
          }
        }

        /* Respect reduced motion preference */
        @media (prefers-reduced-motion: reduce) {
          .snowfall-container {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Snowfall;

