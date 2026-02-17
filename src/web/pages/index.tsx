import { useState, useEffect, useRef } from "react";
import PhoneFunnel from "./phone-funnel";
import BookShowcase from "./book-showcase";
import AcademySection from "./academy";
import FunnelFlow from "./funnel";
import Footer from "../components/footer";

// Matrix rain character set
const MATRIX_CHARS = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ΨΩΦΣΠΘΞΛΚΙΗΖΕΔΓΒΑ∞∑∏√∂∫≈≠≤≥÷×±∓∴∵∝∅∈∉⊂⊃⊆⊇∪∩";

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(5, 5, 16, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00ff4120";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Gradient from bright to dim
        const alpha = Math.random() * 0.5 + 0.1;
        ctx.fillStyle = `rgba(0, 255, 65, ${alpha})`;
        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-30"
      style={{ zIndex: 0 }}
    />
  );
};

const GlowingText = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <span
      className={`transition-all duration-1000 ${className} ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{
        textShadow: visible
          ? "0 0 10px #00ff88, 0 0 20px #00ff88, 0 0 40px #00ff88, 0 0 80px #00ff88"
          : "none",
      }}
    >
      {children}
    </span>
  );
};

const TypewriterText = ({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setDisplayedText(text.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [text, started]);

  return (
    <span className={className}>
      {displayedText}
      <span className="animate-pulse">▋</span>
    </span>
  );
};

const HeroSection = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const scrollToNext = () => {
    const nextSection = document.getElementById('phone-funnel');
    nextSection?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#0a0a2e] to-[#050510]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(100,0,180,0.15)_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(0,255,136,0.08)_0%,transparent_50%)]" />
      
      {/* Cosmic orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-600/10 blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-500/10 blur-[80px] animate-pulse" style={{ animationDelay: "1s" }} />
      
      {/* Scan line effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-[#00ff88]/50 to-transparent animate-[scan-line_4s_linear_infinite]" />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Divine Transmission Banner */}
        <div className="mb-6 animate-[fadeIn_1s_ease-out]">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#1a0a2e]/80 via-[#0a0a2e]/80 to-[#1a0a2e]/80 border border-[#00ff88]/30 backdrop-blur-sm">
            <span className="text-[#00ff88] animate-pulse">◈</span>
            <span className="font-['Orbitron'] text-[#00ff88]/90 font-semibold text-sm md:text-base tracking-wider">
              DIVINE TRANSMISSION INCOMING
            </span>
            <span className="text-[#00ff88] animate-pulse">◈</span>
          </div>
        </div>

        {/* Cloaked messenger image */}
        <div className="relative mb-8 md:mb-12">
          <div className={`relative mx-auto w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden transition-all duration-1000 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            {/* Divine glowing rings around image */}
            <div className="absolute inset-0 rounded-full border-2 border-[#00ff88]/50 animate-pulse" />
            <div className="absolute -inset-2 rounded-full border border-purple-500/30 animate-[cosmic-rotate_20s_linear_infinite]" />
            <div className="absolute -inset-4 rounded-full border border-cyan-500/20 animate-[cosmic-rotate_30s_linear_infinite_reverse]" />
            <div className="absolute -inset-6 rounded-full border border-[#00ff88]/10 animate-[cosmic-rotate_40s_linear_infinite]" />
            
            {/* Divine glow effect */}
            <div className="absolute -inset-8 rounded-full bg-gradient-to-r from-[#00ff88]/5 via-purple-500/5 to-cyan-500/5 blur-xl animate-pulse" />
            
            <img
              src="./cloaked-messenger-portrait-KakJfYU78kjRavrkE3GIf.png"
              alt="The Cosmic Messenger"
              className="w-full h-full object-cover"
              onLoad={() => setImageLoaded(true)}
            />
            
            {/* Overlay glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#00ff88]/20 via-transparent to-purple-500/20 pointer-events-none" />
          </div>
          
          {/* Floating particles around image */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-[#00ff88] rounded-full animate-pulse"
                style={{
                  top: `${20 + Math.sin(i * 0.8) * 40}%`,
                  left: `${50 + Math.cos(i * 0.8) * 45}%`,
                  animationDelay: `${i * 0.2}s`,
                  boxShadow: "0 0 10px #00ff88, 0 0 20px #00ff88",
                }}
              />
            ))}
          </div>
        </div>

        {/* Main heading with neon glow */}
        <h1 className="font-['Orbitron'] text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black tracking-wider mb-6 md:mb-8">
          <GlowingText delay={300} className="text-[#00ff88] block">
            IT'S NO COINCIDENCE
          </GlowingText>
          <GlowingText delay={800} className="text-[#00ff88] block mt-2">
            YOU'RE HERE
          </GlowingText>
        </h1>

        {/* Mysterious subtext */}
        <div className="max-w-2xl mx-auto space-y-4 mb-8 md:mb-12">
          <p className="font-['Rajdhani'] text-lg md:text-xl lg:text-2xl text-purple-300/90 font-medium">
            <TypewriterText text="I AM... intercepting your frequency." delay={1500} />
          </p>
          <p className="font-['Rajdhani'] text-base md:text-lg lg:text-xl text-cyan-300/80">
            <TypewriterText text="You clicked because your soul remembers." delay={3000} />
          </p>
          <p className="font-['Rajdhani'] text-base md:text-lg lg:text-xl text-white/70">
            <TypewriterText text="This is your first step out of the simulation." delay={4500} />
          </p>
        </div>

        {/* CTA Button with cosmic glow effect */}
        <div className="relative inline-block">
          <button
            onClick={scrollToNext}
            className="relative px-8 py-4 md:px-12 md:py-5 font-['Orbitron'] text-lg md:text-xl font-bold text-white bg-gradient-to-r from-purple-600 via-[#00ff88]/80 to-cyan-500 rounded-xl transition-all duration-300 hover:scale-105 uppercase tracking-widest glow-button group overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              <span className="text-lg">⚡</span>
              BEGIN AWAKENING
              <span className="text-lg">⚡</span>
            </span>
            
            {/* Button glow layers */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 via-[#00ff88]/80 to-cyan-500 blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
          </button>
          
          {/* Pulse ring effect */}
          <div className="absolute inset-0 rounded-xl border-2 border-[#00ff88]/30 animate-ping opacity-20" />
        </div>
        
        {/* Sacred geometry hint */}
        <div className="mt-16 md:mt-24 opacity-30">
          <div className="flex justify-center gap-4">
            {["Ψ", "Ω", "∞", "Φ", "Σ", "∆", "Ξ"].map((symbol, i) => (
              <span
                key={i}
                className="font-['Cinzel'] text-xl md:text-2xl text-[#00ff88] animate-pulse"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {symbol}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-[#00ff88]/50 flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-[#00ff88] rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

// Section divider component
const SectionDivider = () => (
  <div className="relative py-12 overflow-hidden">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
    </div>
    <div className="relative flex justify-center">
      <div className="bg-[#050510] px-8 flex gap-4">
        {["✧", "◈", "✧"].map((s, i) => (
          <span key={i} className="text-[#00ff88]/50 text-xl">{s}</span>
        ))}
      </div>
    </div>
  </div>
);

const Index = () => {
  return (
    <div className="relative min-h-screen bg-[#050510] overflow-x-hidden">
      <MatrixRain />
      
      {/* Hero Section */}
      <HeroSection />
      
      <SectionDivider />
      
      {/* Phone Hack Funnel */}
      <div id="phone-funnel">
        <PhoneFunnel />
      </div>
      
      <SectionDivider />
      
      {/* Book Showcase */}
      <div id="book-showcase">
        <BookShowcase />
      </div>
      
      <SectionDivider />
      
      {/* Academy Section */}
      <div id="academy">
        <AcademySection />
      </div>
      
      <SectionDivider />
      
      {/* Multi-step Funnel */}
      <FunnelFlow />
      
      {/* Footer */}
      <Footer />
      
      {/* Global animations */}
      <style>{`
        @keyframes scan-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes cosmic-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .glow-button {
          animation: glow-pulse 2s ease-in-out infinite;
        }
        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 
              0 0 5px #00ff88,
              0 0 10px #00ff88,
              0 0 20px #00ff88,
              inset 0 0 10px rgba(0, 255, 136, 0.1);
          }
          50% {
            box-shadow: 
              0 0 10px #00ff88,
              0 0 25px #00ff88,
              0 0 50px #00ff88,
              inset 0 0 20px rgba(0, 255, 136, 0.2);
          }
        }
      `}</style>
    </div>
  );
};

export default Index;
