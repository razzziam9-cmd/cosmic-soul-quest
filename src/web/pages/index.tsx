import { useState, useEffect, useRef } from "react";
import PhoneFunnel from "./phone-funnel";
import BookShowcase from "./book-showcase";
import AcademySection from "./academy";
import FunnelFlow from "./funnel";
import Footer from "../components/footer";

// Matrix rain character set
const MATRIX_CHARS = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ΨΩΦΣΠΘΞΛΚΙΗΖΕΔΓΒΑ∞∑∏√∂∫≈≠≤≥÷×±∓∴∵∝∅∈∉⊂⊃⊆⊇∪∩";

// Instagram Story Progress Bars Component
const InstagramStoryProgress = () => {
  const [activeBar, setActiveBar] = useState(0);
  const totalBars = 5;
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBar((prev) => (prev + 1) % totalBars);
    }, 6000); // Each "story" lasts 6 seconds
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent pt-2 pb-6 px-3">
      <div className="flex gap-1 max-w-lg mx-auto">
        {[...Array(totalBars)].map((_, i) => (
          <div 
            key={i} 
            className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
          >
            <div 
              className={`h-full bg-white rounded-full ${
                i < activeBar ? 'w-full' : 
                i === activeBar ? 'animate-[storyProgress_6s_linear_forwards]' : 
                'w-0'
              }`}
            />
          </div>
        ))}
      </div>
      
      {/* Story header with user info and IG UI elements */}
      <div className="flex items-center justify-between mt-3 max-w-lg mx-auto">
        {/* Left side - user info */}
        <a 
          href="https://instagram.com/Cosmic_soul_quest" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#833AB4] via-[#FD1D1D] to-[#F77737] p-0.5">
            <div className="w-full h-full rounded-full bg-[#050510] flex items-center justify-center overflow-hidden">
              <img 
                src="./cloaked-messenger-portrait-KakJfYU78kjRavrkE3GIf.png" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <span className="font-['Rajdhani'] text-white text-sm font-medium group-hover:opacity-70 transition-opacity">
            Cosmic_soul_quest
          </span>
          <span className="text-white/50 text-xs">16h</span>
        </a>
        
        {/* Right side - IG UI icons */}
        <div className="flex items-center gap-4">
          {/* Three dots menu */}
          <button className="text-white/80 hover:text-white transition-colors">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="2"/>
              <circle cx="19" cy="12" r="2"/>
              <circle cx="5" cy="12" r="2"/>
            </svg>
          </button>
          {/* Close X */}
          <button className="text-white/80 hover:text-white transition-colors">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Instagram Floating Action Icons (right side)
const InstagramStoryActions = () => {
  const [liked, setLiked] = useState(false);
  
  return (
    <div className="fixed right-4 bottom-1/4 z-50 flex flex-col gap-6">
      {/* Heart/Like */}
      <button 
        onClick={() => setLiked(!liked)}
        className={`transition-all duration-300 ${liked ? 'scale-125' : 'hover:scale-110'}`}
      >
        <svg 
          className={`w-8 h-8 ${liked ? 'text-red-500 fill-current' : 'text-white'}`}
          viewBox="0 0 24 24" 
          fill={liked ? "currentColor" : "none"} 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        {liked && (
          <div className="absolute inset-0 animate-ping">
            <svg className="w-8 h-8 text-red-500 fill-current" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
        )}
      </button>
      
      {/* Share/Send */}
      <button className="text-white hover:scale-110 transition-transform">
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
        </svg>
      </button>
      
      {/* Bookmark */}
      <button className="text-white hover:scale-110 transition-transform">
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
      </button>
    </div>
  );
};

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

// Instagram icon component
const InstagramIcon = ({ className = "" }: { className?: string }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

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
        {/* Instagram Branding Banner */}
        <div className="mb-6 animate-[fadeIn_1s_ease-out]">
          <a 
            href="https://instagram.com/Cosmic_soul_quest"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#833AB4]/80 via-[#FD1D1D]/80 to-[#F77737]/80 border border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(253,29,29,0.4)] group"
          >
            <InstagramIcon className="w-5 h-5 text-white drop-shadow-lg" />
            <span className="font-['Rajdhani'] text-white font-semibold text-sm md:text-base tracking-wide">
              FROM INSTAGRAM
            </span>
            <span className="text-white/60">|</span>
            <span className="font-['Orbitron'] text-white text-xs md:text-sm font-bold">
              @Cosmic_soul_quest
            </span>
            <svg className="w-4 h-4 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
        {/* Cloaked messenger image */}
        <div className="relative mb-8 md:mb-12">
          <div className={`relative mx-auto w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden transition-all duration-1000 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            {/* Glowing ring around image */}
            <div className="absolute inset-0 rounded-full border-2 border-[#00ff88]/50 animate-pulse" />
            <div className="absolute -inset-2 rounded-full border border-purple-500/30 animate-[cosmic-rotate_20s_linear_infinite]" />
            <div className="absolute -inset-4 rounded-full border border-cyan-500/20 animate-[cosmic-rotate_30s_linear_infinite_reverse]" />
            
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

        {/* CTA Button with glow effect */}
        <div className="relative inline-block">
          <button
            onClick={scrollToNext}
            className="relative px-8 py-4 md:px-12 md:py-5 font-['Orbitron'] text-lg md:text-xl font-bold text-white bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] rounded-xl transition-all duration-300 hover:scale-105 uppercase tracking-widest glow-button group overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 19V5M5 12l7-7 7 7"/>
              </svg>
              Swipe Up
            </span>
            
            {/* Button glow layers */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
          </button>
          
          {/* Pulse ring effect */}
          <div className="absolute inset-0 rounded-xl border-2 border-white/30 animate-ping opacity-20" />
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

// Instagram Link in Bio Section
const LinkInBio = () => {
  const links = [
    { icon: "📚", title: "Read the Book", subtitle: "Cosmic Soul Quest Series", href: "#book-showcase" },
    { icon: "🎓", title: "Join Academy", subtitle: "Galactic Star Crystal Training", href: "#academy" },
    { icon: "✨", title: "Start Awakening Journey", subtitle: "Begin your transformation", href: "#phone-funnel" },
    { icon: "📩", title: "Contact", subtitle: "DM for questions", href: "https://instagram.com/Cosmic_soul_quest" },
  ];
  
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#0a0a1f] to-[#050510]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(131,58,180,0.15)_0%,transparent_60%)]" />
      
      <div className="relative z-10 max-w-md mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-8">
          {/* Profile Picture with IG gradient ring */}
          <div className="inline-block mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#833AB4] via-[#FD1D1D] to-[#F77737] p-1">
              <div className="w-full h-full rounded-full bg-[#050510] p-1 overflow-hidden">
                <img 
                  src="./cloaked-messenger-portrait-KakJfYU78kjRavrkE3GIf.png"
                  alt="Cosmic Soul Quest"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          </div>
          
          {/* Username */}
          <h3 className="font-['Rajdhani'] text-2xl text-white font-bold mb-1">
            @Cosmic_soul_quest
          </h3>
          
          {/* Verified badge */}
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-blue-400">✓</span>
            <span className="font-['Rajdhani'] text-zinc-400 text-sm">Cosmic Creator</span>
          </div>
          
          {/* Bio */}
          <p className="font-['Rajdhani'] text-zinc-300 text-sm max-w-xs mx-auto mb-4">
            ✨ Awakening cosmic warriors since the beginning of time
            <br />
            📖 Author • 🔮 Mystic • 💫 Soul Guide
          </p>
          
          {/* Stats (fake but looks authentic) */}
          <div className="flex justify-center gap-8 text-center">
            <div>
              <span className="font-['Orbitron'] text-white text-lg font-bold block">47.7K</span>
              <span className="font-['Rajdhani'] text-zinc-500 text-xs">Followers</span>
            </div>
            <div>
              <span className="font-['Orbitron'] text-white text-lg font-bold block">777</span>
              <span className="font-['Rajdhani'] text-zinc-500 text-xs">Awakened</span>
            </div>
            <div>
              <span className="font-['Orbitron'] text-white text-lg font-bold block">∞</span>
              <span className="font-['Rajdhani'] text-zinc-500 text-xs">Lifetimes</span>
            </div>
          </div>
        </div>
        
        {/* Link Buttons - Linktree style */}
        <div className="space-y-3">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.href}
              className="block w-full p-4 rounded-2xl bg-gradient-to-r from-[#1a1a2e] to-[#16162a] border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(131,58,180,0.3)] group"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl group-hover:scale-110 transition-transform">{link.icon}</span>
                <div className="flex-1 text-left">
                  <span className="font-['Orbitron'] text-white text-sm font-semibold block">
                    {link.title}
                  </span>
                  <span className="font-['Rajdhani'] text-zinc-500 text-xs">
                    {link.subtitle}
                  </span>
                </div>
                <svg className="w-5 h-5 text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            </a>
          ))}
        </div>
        
        {/* Instagram Follow Button */}
        <a
          href="https://instagram.com/Cosmic_soul_quest"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 w-full py-4 rounded-2xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] flex items-center justify-center gap-3 font-['Orbitron'] text-white font-bold text-sm uppercase tracking-wider hover:scale-[1.02] transition-transform"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          Follow on Instagram
        </a>
        
        {/* Footer text */}
        <p className="text-center mt-6 font-['Rajdhani'] text-zinc-600 text-xs">
          🔗 Link in Bio powered by cosmic frequencies
        </p>
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

// Instagram Feed Section
const InstagramFeed = () => {
  const [hoveredPost, setHoveredPost] = useState<number | null>(null);
  
  // Placeholder post data
  const posts = [
    { likes: "2.4K", comments: "127", type: "quote" },
    { likes: "3.1K", comments: "89", type: "image" },
    { likes: "1.8K", comments: "203", type: "quote" },
    { likes: "4.2K", comments: "156", type: "image" },
    { likes: "2.9K", comments: "94", type: "quote" },
    { likes: "1.5K", comments: "67", type: "image" },
  ];
  
  const placeholderQuotes = [
    "Your soul chose this lifetime for a reason ✨",
    "The universe is speaking... are you listening? 🌌",
    "You're not lost, you're awakening 🔮",
    "7 cosmic warriors. 1 mission. Are you one? ⚡",
    "The simulation has glitches. You're one of them 👁",
    "Trust the frequency of your soul 💫",
  ];
  
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#0a0a1f] to-[#050510]" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span className="font-['Orbitron'] text-white text-xl font-bold">@Cosmic_soul_quest</span>
          </div>
          <h2 className="font-['Cinzel'] text-2xl md:text-3xl text-white font-bold mb-3">
            Follow the Journey
          </h2>
          <p className="font-['Rajdhani'] text-zinc-400 max-w-lg mx-auto">
            Daily transmissions to awaken your cosmic consciousness
          </p>
        </div>
        
        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 mb-10">
          {posts.map((post, i) => (
            <a
              key={i}
              href="https://instagram.com/Cosmic_soul_quest"
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square group cursor-pointer overflow-hidden rounded-lg"
              onMouseEnter={() => setHoveredPost(i)}
              onMouseLeave={() => setHoveredPost(null)}
            >
              {/* Post background */}
              <div className={`absolute inset-0 ${
                post.type === "quote" 
                  ? "bg-gradient-to-br from-[#833AB4] via-[#1a1a2e] to-[#FD1D1D]/50" 
                  : "bg-gradient-to-br from-[#0a0a1f] via-[#1a0a2e] to-[#0a0a1f]"
              }`}>
                {/* Quote content */}
                {post.type === "quote" && (
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <p className="font-['Rajdhani'] text-white text-center text-sm md:text-base font-medium">
                      {placeholderQuotes[i]}
                    </p>
                  </div>
                )}
                
                {/* Image placeholder */}
                {post.type === "image" && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <img 
                      src="./cloaked-messenger-portrait-KakJfYU78kjRavrkE3GIf.png"
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {/* Cosmic symbols overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                  {["✧", "◈", "Ψ", "Ω"][i % 4]}
                </div>
              </div>
              
              {/* Hover overlay */}
              <div className={`absolute inset-0 bg-black/60 flex items-center justify-center gap-6 transition-opacity duration-300 ${
                hoveredPost === i ? 'opacity-100' : 'opacity-0'
              }`}>
                {/* Likes */}
                <div className="flex items-center gap-2 text-white">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  <span className="font-['Rajdhani'] font-bold">{post.likes}</span>
                </div>
                {/* Comments */}
                <div className="flex items-center gap-2 text-white">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  <span className="font-['Rajdhani'] font-bold">{post.comments}</span>
                </div>
              </div>
              
              {/* Multi-post indicator */}
              {i % 3 === 0 && (
                <div className="absolute top-2 right-2">
                  <svg className="w-5 h-5 text-white drop-shadow-lg" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="3" width="12" height="18" rx="2"/>
                    <rect x="3" y="6" width="12" height="15" rx="2" className="opacity-60"/>
                  </svg>
                </div>
              )}
            </a>
          ))}
        </div>
        
        {/* Follow Button */}
        <div className="text-center">
          <a
            href="https://instagram.com/Cosmic_soul_quest"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] font-['Orbitron'] text-white font-bold text-sm uppercase tracking-wider hover:scale-105 transition-transform"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Follow on Instagram
          </a>
          <p className="mt-4 font-['Rajdhani'] text-zinc-500 text-sm">
            Join 47.7K+ awakening souls
          </p>
        </div>
      </div>
    </section>
  );
};

// Instagram Engagement Prompt Component
const EngagementPrompt = ({ 
  text, 
  emoji, 
  variant = "default" 
}: { 
  text: string; 
  emoji: string; 
  variant?: "default" | "highlight" | "action" 
}) => {
  const [interacted, setInteracted] = useState(false);
  
  const handleClick = () => {
    setInteracted(true);
    setTimeout(() => setInteracted(false), 1000);
  };
  
  const variantStyles = {
    default: "from-[#1a1a2e]/80 to-[#0f0f1f]/80 border-white/10",
    highlight: "from-[#833AB4]/20 to-[#FD1D1D]/20 border-[#FD1D1D]/30",
    action: "from-[#0f0f1f]/90 to-[#1a1a2e]/90 border-[#00ff88]/20",
  };
  
  return (
    <div 
      className={`relative py-8 px-4 cursor-pointer group`}
      onClick={handleClick}
    >
      <div className={`max-w-md mx-auto p-6 rounded-2xl bg-gradient-to-r ${variantStyles[variant]} border backdrop-blur-sm transition-all duration-300 ${interacted ? 'scale-105' : 'hover:scale-[1.02]'}`}>
        <div className="flex items-center justify-center gap-3">
          <span className={`text-3xl transition-all duration-300 ${interacted ? 'scale-150 animate-bounce' : 'group-hover:scale-110'}`}>
            {emoji}
          </span>
          <p className="font-['Rajdhani'] text-lg text-white/90 font-medium">
            {text}
          </p>
        </div>
        
        {/* Animated heart burst when interacted */}
        {interacted && emoji === "❤️" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="animate-ping text-4xl">❤️</div>
          </div>
        )}
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <div className="relative min-h-screen bg-[#050510] overflow-x-hidden">
      {/* Instagram Story UI */}
      <InstagramStoryProgress />
      <InstagramStoryActions />
      
      <MatrixRain />
      
      {/* Hero Section - add top padding for story progress bar */}
      <div className="pt-20">
        <HeroSection />
      </div>
      
      {/* Instagram Engagement Prompt 1 */}
      <EngagementPrompt 
        text="Double tap if you feel this" 
        emoji="❤️" 
        variant="highlight" 
      />
      
      {/* Phone Hack Funnel */}
      <div id="phone-funnel">
        <PhoneFunnel />
      </div>
      
      {/* Instagram Engagement Prompt 2 */}
      <EngagementPrompt 
        text="Tag someone who needs to see this" 
        emoji="👇" 
        variant="default" 
      />
      
      {/* Book Showcase */}
      <div id="book-showcase">
        <BookShowcase />
      </div>
      
      {/* Instagram Engagement Prompt 3 */}
      <EngagementPrompt 
        text="Share this to your story" 
        emoji="✨" 
        variant="action" 
      />
      
      {/* Academy Section */}
      <div id="academy">
        <AcademySection />
      </div>
      
      {/* Instagram Engagement Prompt 4 */}
      <EngagementPrompt 
        text="DM me AWAKEN to start" 
        emoji="📩" 
        variant="highlight" 
      />
      
      {/* Multi-step Funnel */}
      <FunnelFlow />
      
      <SectionDivider />
      
      {/* Instagram Feed Section */}
      <InstagramFeed />
      
      <SectionDivider />
      
      {/* Link in Bio Section */}
      <LinkInBio />
      
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
        @keyframes storyProgress {
          from { width: 0%; }
          to { width: 100%; }
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
