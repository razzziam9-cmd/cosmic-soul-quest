import { useState, useEffect, useRef, useCallback } from "react";

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

// Progress bar component (like Instagram stories)
const ProgressBars = ({ currentSlide, totalSlides, isAnimating }: { currentSlide: number; totalSlides: number; isAnimating: boolean }) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-50 p-3 flex gap-1.5">
      {Array.from({ length: totalSlides }).map((_, i) => (
        <div key={i} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all ${
              i < currentSlide 
                ? 'w-full bg-white/80' 
                : i === currentSlide 
                  ? `bg-gradient-to-r from-[#00ff88] to-cyan-400 ${isAnimating ? 'w-full' : 'w-0'}` 
                  : 'w-0'
            }`}
            style={{ 
              transitionDuration: i === currentSlide && isAnimating ? '5000ms' : '300ms',
              transitionTimingFunction: 'linear'
            }}
          />
        </div>
      ))}
    </div>
  );
};

// Tap zones for navigation
const TapZones = ({ onPrev, onNext, showHints }: { onPrev: () => void; onNext: () => void; showHints: boolean }) => {
  return (
    <>
      {/* Left tap zone - go back */}
      <div 
        className="absolute left-0 top-0 w-1/3 h-full z-40 cursor-pointer group"
        onClick={onPrev}
      >
        {showHints && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-black/50 backdrop-blur-sm rounded-full p-3">
              <svg className="w-6 h-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </div>
        )}
      </div>
      
      {/* Right tap zone - go next */}
      <div 
        className="absolute right-0 top-0 w-2/3 h-full z-40 cursor-pointer group"
        onClick={onNext}
      >
        {showHints && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-black/50 backdrop-blur-sm rounded-full p-3">
              <svg className="w-6 h-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Glowing Text Component
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

// Typewriter Text Component
const TypewriterText = ({ text, className = "", delay = 0, speed = 50 }: { text: string; className?: string; delay?: number; speed?: number }) => {
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
    }, speed);

    return () => clearInterval(interval);
  }, [text, started, speed]);

  return (
    <span className={className}>
      {displayedText}
      <span className="animate-pulse">▋</span>
    </span>
  );
};

// SLIDE 1: Hero Section
const HeroSlide = ({ isActive }: { isActive: boolean }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center px-6 py-16 transition-all duration-700 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#0a0a2e] to-[#050510]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(100,0,180,0.15)_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(0,255,136,0.08)_0%,transparent_50%)]" />
      
      {/* Cosmic orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-600/10 blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-500/10 blur-[80px] animate-pulse" style={{ animationDelay: "1s" }} />
      
      <div className="relative z-10 max-w-lg mx-auto text-center">
        {/* Divine Transmission Banner */}
        <div className="mb-4 animate-[fadeIn_1s_ease-out]">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#1a0a2e]/80 via-[#0a0a2e]/80 to-[#1a0a2e]/80 border border-[#00ff88]/30 backdrop-blur-sm">
            <span className="text-[#00ff88] animate-pulse text-sm">◈</span>
            <span className="font-['Orbitron'] text-[#00ff88]/90 font-semibold text-xs tracking-wider">
              DIVINE TRANSMISSION
            </span>
            <span className="text-[#00ff88] animate-pulse text-sm">◈</span>
          </div>
        </div>

        {/* Cloaked messenger image */}
        <div className="relative mb-6">
          <div className={`relative mx-auto w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden transition-all duration-1000 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="absolute inset-0 rounded-full border-2 border-[#00ff88]/50 animate-pulse" />
            <div className="absolute -inset-2 rounded-full border border-purple-500/30 animate-[cosmic-rotate_20s_linear_infinite]" />
            <div className="absolute -inset-4 rounded-full border border-cyan-500/20 animate-[cosmic-rotate_30s_linear_infinite_reverse]" />
            
            <img
              src="./cloaked-messenger-portrait-KakJfYU78kjRavrkE3GIf.png"
              alt="The Cosmic Messenger"
              className="w-full h-full object-cover"
              onLoad={() => setImageLoaded(true)}
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-[#00ff88]/20 via-transparent to-purple-500/20 pointer-events-none" />
          </div>
        </div>

        {/* Main heading */}
        <h1 className="font-['Orbitron'] text-2xl sm:text-3xl md:text-4xl font-black tracking-wider mb-4">
          {isActive && (
            <>
              <GlowingText delay={300} className="text-[#00ff88] block">
                IT'S NO COINCIDENCE
              </GlowingText>
              <GlowingText delay={800} className="text-[#00ff88] block mt-1">
                YOU'RE HERE
              </GlowingText>
            </>
          )}
        </h1>

        {/* Mysterious subtext */}
        <div className="max-w-sm mx-auto space-y-2 mb-6">
          {isActive && (
            <>
              <p className="font-['Rajdhani'] text-base md:text-lg text-purple-300/90 font-medium">
                <TypewriterText text="I AM... intercepting your frequency." delay={1500} />
              </p>
              <p className="font-['Rajdhani'] text-sm md:text-base text-cyan-300/80">
                <TypewriterText text="You clicked because your soul remembers." delay={3000} />
              </p>
            </>
          )}
        </div>

        {/* Tap to continue indicator */}
        <div className="mt-8 animate-pulse">
          <div className="inline-flex items-center gap-2 text-white/50 font-['Rajdhani']">
            <span>TAP ANYWHERE TO CONTINUE</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

// SLIDE 2: Divine Message
const DivineMessageSlide = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center px-6 py-16 transition-all duration-700 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#0a0a2e] to-[#050510]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,136,0.1)_0%,transparent_60%)]" />
      
      <div className="relative z-10 max-w-lg mx-auto text-center">
        <div className="text-6xl mb-6 animate-pulse">⚡</div>
        
        <h2 className="font-['Orbitron'] text-xl md:text-2xl text-[#00ff88] mb-6 tracking-wider">
          A MESSAGE AWAITS YOU
        </h2>
        
        <div className="bg-[#0a0a1f]/80 border border-[#00ff88]/30 rounded-2xl p-6 mb-6 backdrop-blur-sm">
          {isActive && (
            <p className="font-['Rajdhani'] text-lg md:text-xl text-white/90 leading-relaxed">
              <TypewriterText 
                text="This is your first step out of the simulation. The universe has been trying to reach you. Are you ready to receive?" 
                delay={500}
                speed={30}
              />
            </p>
          )}
        </div>
        
        <div className="flex justify-center gap-4 opacity-50">
          {["Ψ", "Ω", "∞", "Φ", "Σ"].map((symbol, i) => (
            <span
              key={i}
              className="font-['Cinzel'] text-xl text-[#00ff88] animate-pulse"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {symbol}
            </span>
          ))}
        </div>
        
        <div className="mt-8 animate-pulse">
          <div className="inline-flex items-center gap-2 text-white/50 font-['Rajdhani']">
            <span>TAP TO RECEIVE</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

// SLIDE 3: Phone iMessage Style
const PhoneMessageSlide = ({ isActive }: { isActive: boolean }) => {
  const [messages, setMessages] = useState<Array<{ text: string; type: 'incoming' | 'typing' | 'sent'; visible: boolean }>>([]);
  const [showTapButton, setShowTapButton] = useState(false);
  
  const messageSequence = [
    { text: "📡 Incoming transmission...", type: 'incoming' as const, delay: 800 },
    { text: "I've been waiting for you", type: 'incoming' as const, delay: 2500 },
    { text: "⚡ Your frequency detected...", type: 'incoming' as const, delay: 4500 },
    { text: "What frequency?", type: 'sent' as const, delay: 6500 },
    { text: "🔮 Initiating soul scan...", type: 'incoming' as const, delay: 8000 },
    { text: "✨ MATCH FOUND: Cosmic Warrior Soul", type: 'incoming' as const, delay: 10500 },
  ];
  
  useEffect(() => {
    if (!isActive) {
      setMessages([]);
      setShowTapButton(false);
      return;
    }
    
    setMessages([]);
    setShowTapButton(false);
    
    const timeouts: NodeJS.Timeout[] = [];
    
    messageSequence.forEach((msg, index) => {
      // Show typing indicator first for incoming messages
      if (msg.type === 'incoming') {
        const typingTimeout = setTimeout(() => {
          setMessages(prev => [...prev, { text: '', type: 'typing', visible: true }]);
        }, msg.delay - 800);
        timeouts.push(typingTimeout);
      }
      
      const msgTimeout = setTimeout(() => {
        setMessages(prev => {
          // Remove typing indicator and add actual message
          const filtered = prev.filter(m => m.type !== 'typing');
          return [...filtered, { ...msg, visible: true }];
        });
        
        if (index === messageSequence.length - 1) {
          setTimeout(() => setShowTapButton(true), 1000);
        }
      }, msg.delay);
      timeouts.push(msgTimeout);
    });
    
    return () => timeouts.forEach(t => clearTimeout(t));
  }, [isActive]);
  
  return (
    <div className={`absolute inset-0 flex flex-col transition-all duration-700 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
      {/* iPhone-style status bar */}
      <div className="bg-[#000000] pt-2 pb-1 px-6 flex justify-between items-center text-white text-xs">
        <span className="font-semibold">3:33</span>
        <div className="absolute left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl" />
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 17h2v4H2v-4zm4-5h2v9H6v-9zm4-4h2v13h-2V8zm4-4h2v17h-2V4z"/>
          </svg>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3C6.95 3 3 6.95 3 12c0 3.76 2.33 6.99 5.63 8.35l.77-1.85C7.13 17.54 5.5 14.97 5.5 12c0-3.58 2.92-6.5 6.5-6.5s6.5 2.92 6.5 6.5c0 2.97-1.63 5.54-3.9 6.5l.77 1.85C18.67 18.99 21 15.76 21 12c0-5.05-3.95-9-9-9z"/>
          </svg>
          <div className="flex items-center gap-0.5">
            <div className="w-6 h-3 border border-white rounded-sm relative">
              <div className="absolute inset-0.5 bg-[#00ff88] rounded-[1px]" style={{ width: '80%' }} />
            </div>
          </div>
        </div>
      </div>
      
      {/* iMessage header */}
      <div className="bg-[#1c1c1e] px-4 py-3 flex items-center border-b border-gray-700/50">
        <button className="text-[#0a84ff] text-sm mr-3">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#00ff88]/50">
            <img 
              src="./cloaked-messenger-portrait-KakJfYU78kjRavrkE3GIf.png" 
              alt="Contact" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center">
            <p className="text-white font-semibold text-base">Unknown</p>
            <p className="text-gray-400 text-xs">Maybe: Divine Messenger</p>
          </div>
        </div>
        <button className="text-[#0a84ff]">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
      
      {/* Messages area */}
      <div className="flex-1 bg-[#000000] px-4 py-4 overflow-y-auto">
        <div className="max-w-lg mx-auto space-y-2">
          {/* Date header */}
          <div className="text-center mb-4">
            <span className="text-gray-500 text-xs bg-gray-800/50 px-3 py-1 rounded-full">Today 3:33 AM</span>
          </div>
          
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'} animate-[slideUp_0.3s_ease-out]`}>
              {msg.type === 'typing' ? (
                <div className="bg-[#3a3a3c] rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              ) : (
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                  msg.type === 'sent' 
                    ? 'bg-[#0a84ff] text-white rounded-br-md' 
                    : 'bg-[#3a3a3c] text-white rounded-bl-md'
                }`}>
                  <p className="text-[15px] leading-snug">{msg.text}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* iMessage input bar */}
      <div className="bg-[#1c1c1e] px-4 py-3 border-t border-gray-700/50">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button className="text-[#0a84ff]">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <div className="flex-1 bg-[#3a3a3c] rounded-full px-4 py-2">
            <span className="text-gray-400 text-sm">iMessage</span>
          </div>
          <button className="text-[#0a84ff]">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Tap to continue overlay */}
      {showTapButton && (
        <div className="absolute bottom-24 left-0 right-0 flex justify-center animate-[fadeIn_0.5s_ease-out]">
          <div className="bg-gradient-to-r from-purple-600 via-[#00ff88]/70 to-cyan-500 text-white px-6 py-3 rounded-full font-['Orbitron'] text-sm font-bold animate-pulse shadow-lg shadow-[#00ff88]/30">
            TAP TO REPLY ✨
          </div>
        </div>
      )}
    </div>
  );
};

// SLIDE 4: Soul Quiz
const SoulQuizSlide = ({ isActive, onComplete }: { isActive: boolean; onComplete: (archetype: string) => void }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [scanning, setScanning] = useState(false);
  
  const questions = [
    {
      q: "When you look at the stars, you feel...",
      options: ["Longing for home", "Curious about secrets", "Peaceful & connected", "Powerful & ancient"]
    },
    {
      q: "Your recurring dreams often involve...",
      options: ["Flying through space", "Hidden knowledge", "Healing others", "Leading armies"]
    },
    {
      q: "You've always been drawn to...",
      options: ["Sacred geometry", "Ancient texts", "Nature & crystals", "Symbols & codes"]
    },
  ];
  
  useEffect(() => {
    if (!isActive) {
      setCurrentQuestion(0);
      setAnswers([]);
      setScanning(false);
    }
  }, [isActive]);
  
  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setScanning(true);
      setTimeout(() => {
        const archetypes = ["Starweaver", "Knowledge Keeper", "Crystal Healer", "Cosmic Warrior"];
        const counts = [0, 0, 0, 0];
        newAnswers.forEach((a, i) => {
          const idx = questions[i].options.indexOf(a);
          if (idx >= 0) counts[idx]++;
        });
        const maxIdx = counts.indexOf(Math.max(...counts));
        onComplete(archetypes[maxIdx]);
      }, 3000);
    }
  };
  
  if (scanning) {
    return (
      <div className={`absolute inset-0 flex flex-col items-center justify-center px-6 py-16 transition-all duration-700 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#0a0a2e] to-[#050510]" />
        
        <div className="relative z-10 text-center">
          <div className="relative w-32 h-32 mb-8 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-purple-500/30 animate-ping" />
            <div className="absolute inset-2 rounded-full border-2 border-cyan-500/50 animate-pulse" />
            <div className="absolute inset-4 rounded-full border border-[#00ff88]/70 animate-spin" style={{ animationDuration: "3s" }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl">🔮</span>
            </div>
          </div>
          
          <h3 className="font-['Orbitron'] text-xl text-[#00ff88] mb-4 animate-pulse">
            SCANNING SOUL FREQUENCY
          </h3>
          <div className="font-['Rajdhani'] text-zinc-400 text-center space-y-2">
            <p className="animate-pulse">Analyzing cosmic signature...</p>
            <p className="animate-pulse" style={{ animationDelay: "0.5s" }}>Cross-referencing ancient records...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center px-6 py-16 transition-all duration-700 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#0a0a2e] to-[#050510]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(100,0,180,0.15)_0%,transparent_60%)]" />
      
      <div className="relative z-10 max-w-lg mx-auto w-full">
        {/* Progress dots */}
        <div className="flex gap-2 mb-6 justify-center">
          {questions.map((_, i) => (
            <div 
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i < currentQuestion ? 'bg-[#00ff88]' : i === currentQuestion ? 'bg-purple-400 animate-pulse' : 'bg-zinc-700'
              }`}
            />
          ))}
        </div>
        
        <div className="text-center mb-6">
          <span className="font-['Orbitron'] text-[#00ff88] text-xs tracking-[0.2em]">SOUL RECOGNITION SCAN</span>
        </div>
        
        <h3 className="font-['Rajdhani'] text-xl md:text-2xl text-white mb-8 text-center">
          {questions[currentQuestion].q}
        </h3>
        
        <div className="space-y-3 pointer-events-auto">
          {questions[currentQuestion].options.map((option, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                handleAnswer(option);
              }}
              className="w-full p-4 rounded-xl bg-purple-900/30 border border-purple-500/30 text-left font-['Rajdhani'] text-white hover:bg-purple-800/40 hover:border-purple-500/50 transition-all duration-200 active:scale-[0.98]"
            >
              <span className="text-purple-400 mr-3">◈</span>
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// SLIDE 5: Archetype Reveal
const ArchetypeRevealSlide = ({ isActive, archetype }: { isActive: boolean; archetype: string }) => {
  const [revealed, setRevealed] = useState(false);
  
  useEffect(() => {
    if (isActive) {
      setTimeout(() => setRevealed(true), 500);
    } else {
      setRevealed(false);
    }
  }, [isActive]);
  
  const archetypeData: Record<string, { symbol: string; color: string; desc: string }> = {
    "Starweaver": { 
      symbol: "✧", 
      color: "from-cyan-400 to-blue-600",
      desc: "You navigate the cosmic web, weaving destinies and bridging dimensions."
    },
    "Knowledge Keeper": { 
      symbol: "Ω", 
      color: "from-purple-400 to-indigo-600",
      desc: "You guard ancient wisdom and unlock forbidden knowledge."
    },
    "Crystal Healer": { 
      symbol: "◈", 
      color: "from-emerald-400 to-teal-600",
      desc: "You channel healing frequencies and restore balance to souls."
    },
    "Cosmic Warrior": { 
      symbol: "⚔", 
      color: "from-amber-400 to-orange-600",
      desc: "You lead the charge against darkness and protect the awakened."
    },
  };
  
  const data = archetypeData[archetype] || archetypeData["Cosmic Warrior"];
  
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center px-6 py-16 transition-all duration-700 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#0a0a2e] to-[#050510]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,136,0.1)_0%,transparent_60%)]" />
      
      <div className={`relative z-10 text-center transition-all duration-1000 ${revealed ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
        <div className="relative inline-block mb-6">
          <div className={`text-7xl md:text-8xl bg-gradient-to-br ${data.color} bg-clip-text text-transparent`}>
            {data.symbol}
          </div>
          <div className="absolute -inset-8 rounded-full bg-gradient-to-br opacity-20 blur-2xl animate-pulse" />
        </div>
        
        <h3 className="font-['Orbitron'] text-sm text-[#00ff88] tracking-[0.3em] mb-4">
          FREQUENCY MATCH CONFIRMED
        </h3>
        
        <h2 className={`font-['Cinzel'] text-3xl md:text-4xl font-bold bg-gradient-to-r ${data.color} bg-clip-text text-transparent mb-4`}>
          {archetype}
        </h2>
        
        <p className="font-['Rajdhani'] text-lg text-zinc-300 max-w-sm mx-auto mb-8">
          {data.desc}
        </p>
        
        <div className="flex justify-center gap-4 mb-8">
          {["Ψ", "Ω", data.symbol, "Φ", "Σ"].map((s, i) => (
            <span 
              key={i}
              className={`text-xl bg-gradient-to-r ${data.color} bg-clip-text text-transparent animate-pulse`}
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              {s}
            </span>
          ))}
        </div>
        
        <div className="mt-4 animate-pulse">
          <div className="inline-flex items-center gap-2 text-white/50 font-['Rajdhani']">
            <span>TAP TO CONTINUE</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

// SLIDE 6: Book Reveal
const BookRevealSlide = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center px-6 py-16 transition-all duration-700 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: "url('./cosmic-quantum-background-jw2jNpfQM2YTBpDEPtpac.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510]/95 via-[#050510]/85 to-[#050510]/95" />
      
      <div className="relative z-10 max-w-lg mx-auto text-center">
        <span className="font-['Orbitron'] text-[#00ff88] text-xs tracking-[0.3em] uppercase mb-4 block">
          ◈ The Prophecy Begins ◈
        </span>
        
        {/* Book cover */}
        <div className="relative mx-auto w-48 md:w-56 mb-6">
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/30 via-[#00ff88]/20 to-cyan-500/30 rounded-2xl blur-xl opacity-60 animate-pulse" />
          <div className="relative bg-gradient-to-br from-[#1a0a2e] via-[#0a0a2e] to-[#050520] rounded-xl overflow-hidden aspect-[3/4] border border-purple-500/30 shadow-2xl p-4">
            <div className="h-full flex flex-col items-center justify-center">
              <div className="text-2xl mb-2 opacity-60">
                <span className="text-[#00ff88]">◈</span>
                <span className="text-purple-400 mx-1">✧</span>
                <span className="text-cyan-400">☽</span>
              </div>
              <h3 className="font-['Cinzel'] text-xl text-transparent bg-clip-text bg-gradient-to-b from-[#00ff88] via-purple-300 to-cyan-400 font-bold">
                COSMIC<br/>SOUL<br/>QUEST
              </h3>
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#00ff88] to-transparent my-2" />
              <p className="font-['Rajdhani'] text-purple-300/80 text-xs uppercase tracking-widest">
                Book One: Discovery
              </p>
            </div>
          </div>
        </div>
        
        <h2 className="font-['Cinzel'] text-2xl md:text-3xl text-white font-bold mb-4">
          Cosmic Soul Quest
        </h2>
        
        <p className="font-['Rajdhani'] text-base text-zinc-300 leading-relaxed mb-6 max-w-sm mx-auto">
          A teenage boy discovers his soul is from another dimension. He's part of an ancient group of <span className="text-[#00ff88]">seven cosmic warriors</span> who must reunite.
        </p>
        
        <div className="flex justify-center gap-4 text-sm font-['Rajdhani'] mb-6">
          <span className="text-zinc-400"><span className="text-[#00ff88]">$14.99</span> Digital</span>
          <span className="text-zinc-500">|</span>
          <span className="text-zinc-400"><span className="text-purple-300">$24.99</span> Paperback</span>
        </div>
        
        <div className="mt-4 animate-pulse">
          <div className="inline-flex items-center gap-2 text-white/50 font-['Rajdhani']">
            <span>TAP TO CONTINUE</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

// SLIDE 7: Academy
const AcademySlide = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center px-6 py-16 transition-all duration-700 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: "url('./mystical-physics-symbols-lYqViB_x7rGKlaTO5WzCY.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510]/95 via-[#050510]/85 to-[#050510]/95" />
      
      <div className="relative z-10 max-w-lg mx-auto text-center">
        <h2 className="font-['Cinzel'] text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 font-bold mb-4"
          style={{ textShadow: "0 0 40px rgba(255, 200, 0, 0.3)" }}
        >
          GALACTIC STAR CRYSTAL<br/>ACADEMY
        </h2>
        
        <p className="font-['Rajdhani'] text-base text-zinc-300 mb-6">
          Advanced training for awakened souls. Learn the <span className="text-amber-300">seven secret steps</span> to remember who you truly are.
        </p>
        
        {/* Featured tier */}
        <div className="bg-gradient-to-br from-purple-900/60 via-[#0a0a2e] to-cyan-900/40 border-2 border-[#00ff88]/50 rounded-2xl p-6 mb-6">
          <span className="text-3xl mb-2 block">✧</span>
          <h3 className="font-['Orbitron'] text-lg text-[#00ff88] mb-2">Warrior Path</h3>
          <div className="font-['Orbitron'] text-3xl font-black text-white mb-2">$97<span className="text-base text-zinc-400">/mo</span></div>
          <ul className="space-y-2 text-left font-['Rajdhani'] text-zinc-300 text-sm">
            <li><span className="text-[#00ff88] mr-2">✦</span>Advanced frequency training</li>
            <li><span className="text-[#00ff88] mr-2">✦</span>Monthly 1-on-1 guidance</li>
            <li><span className="text-[#00ff88] mr-2">✦</span>Crystal activation ceremony</li>
          </ul>
        </div>
        
        <div className="flex justify-center gap-6 opacity-50 mb-6">
          {["☉", "☽", "✧", "◈", "✧", "☽", "☉"].map((symbol, i) => (
            <span 
              key={i}
              className="text-amber-400 text-lg animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              {symbol}
            </span>
          ))}
        </div>
        
        <div className="mt-4 animate-pulse">
          <div className="inline-flex items-center gap-2 text-white/50 font-['Rajdhani']">
            <span>TAP TO CONTINUE</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

// SLIDE 8: Final CTA
const FinalCTASlide = ({ isActive }: { isActive: boolean }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 37, seconds: 42 });
  
  useEffect(() => {
    if (!isActive) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) return { hours: 2, minutes: 37, seconds: 42 };
        return { hours, minutes, seconds };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isActive]);
  
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center px-6 py-16 transition-all duration-700 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#0a0a2e] to-[#050510]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(100,0,180,0.2)_0%,transparent_60%)]" />
      
      <div className="relative z-10 max-w-lg mx-auto text-center">
        {/* Urgent header */}
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-2 mb-4 animate-pulse inline-block">
          <span className="font-['Orbitron'] text-red-400 text-xs">⚠ OFFER EXPIRES IN</span>
        </div>
        
        {/* Countdown */}
        <div className="flex gap-3 mb-6 justify-center">
          {[
            { value: timeLeft.hours, label: "HRS" },
            { value: timeLeft.minutes, label: "MIN" },
            { value: timeLeft.seconds, label: "SEC" },
          ].map((unit, i) => (
            <div key={i} className="text-center">
              <div className="w-14 h-14 rounded-xl bg-[#0a0a2e] border border-[#00ff88]/30 flex items-center justify-center font-['Orbitron'] text-xl text-[#00ff88]"
                style={{ boxShadow: "0 0 20px rgba(0, 255, 136, 0.2)" }}
              >
                {String(unit.value).padStart(2, '0')}
              </div>
              <span className="font-['Rajdhani'] text-xs text-zinc-500">{unit.label}</span>
            </div>
          ))}
        </div>
        
        <h2 className="font-['Cinzel'] text-xl md:text-2xl text-white font-bold mb-4">
          Complete Awakening Bundle
        </h2>
        
        {/* Bundle */}
        <div className="bg-[#0a0a1f]/80 border border-purple-500/30 rounded-2xl p-4 mb-6 text-left">
          {[
            { icon: "📚", item: "7-Book Series", value: "$99" },
            { icon: "🎓", item: "Academy Access", value: "$291" },
            { icon: "💎", item: "Crystal Kit", value: "$49" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-1.5">
              <span className="font-['Rajdhani'] text-zinc-300 text-sm">
                <span className="mr-2">{item.icon}</span>{item.item}
              </span>
              <span className="font-['Rajdhani'] text-zinc-500 line-through text-xs">{item.value}</span>
            </div>
          ))}
          <div className="border-t border-purple-500/20 mt-2 pt-2 flex items-center justify-between">
            <span className="font-['Orbitron'] text-base text-white">Your Price:</span>
            <span className="font-['Orbitron'] text-2xl text-[#00ff88]">$197</span>
          </div>
        </div>
        
        {/* CTA */}
        <button className="w-full py-4 font-['Orbitron'] text-base font-bold text-white bg-gradient-to-r from-purple-600 via-[#00ff88]/70 to-cyan-500 rounded-xl transition-all duration-300 hover:scale-[1.02] uppercase tracking-wider flex items-center justify-center gap-2 pointer-events-auto">
          <span>⚡</span>
          CLAIM YOUR AWAKENING
          <span>⚡</span>
        </button>
        
        <p className="font-['Rajdhani'] text-zinc-500 text-xs mt-3">
          🔒 Secure checkout • Instant access
        </p>
        
        {/* Social links */}
        <div className="mt-6 flex justify-center gap-4">
          <a href="https://instagram.com/Cosmic_soul_quest" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-[#00ff88] transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
            </svg>
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-[#00ff88] transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-[#00ff88] transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

// Phone frame wrapper for desktop
const PhoneFrame = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="hidden lg:flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#050510] to-[#0a0a2e] p-8">
      {/* Phone device frame */}
      <div className="relative">
        {/* Phone outer frame */}
        <div className="relative w-[390px] h-[844px] bg-[#1a1a1a] rounded-[55px] p-3 shadow-2xl border border-gray-700/50">
          {/* Phone inner bezel */}
          <div className="relative w-full h-full bg-black rounded-[45px] overflow-hidden">
            {/* Dynamic island / notch */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-8 bg-black rounded-full z-50" />
            
            {/* Screen content */}
            <div className="relative w-full h-full">
              {children}
            </div>
            
            {/* Home indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full z-50" />
          </div>
        </div>
        
        {/* Reflection effect */}
        <div className="absolute inset-0 rounded-[55px] bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        
        {/* Ambient glow */}
        <div className="absolute -inset-20 bg-gradient-to-r from-purple-600/20 via-[#00ff88]/10 to-cyan-500/20 blur-3xl -z-10 animate-pulse" />
      </div>
    </div>
  );
};

// Main App Component
const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [archetype, setArchetype] = useState("Cosmic Warrior");
  const [isAnimating, setIsAnimating] = useState(true);
  const [showHints, setShowHints] = useState(true);
  
  const totalSlides = 8;
  
  const goToNextSlide = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      setIsAnimating(false);
      setCurrentSlide(prev => prev + 1);
      setTimeout(() => setIsAnimating(true), 100);
    }
  }, [currentSlide]);
  
  const goToPrevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setIsAnimating(false);
      setCurrentSlide(prev => prev - 1);
      setTimeout(() => setIsAnimating(true), 100);
    }
  }, [currentSlide]);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        goToNextSlide();
      } else if (e.key === 'ArrowLeft') {
        goToPrevSlide();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextSlide, goToPrevSlide]);
  
  // Hide hints after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowHints(false), 5000);
    return () => clearTimeout(timer);
  }, []);
  
  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);
  
  const handleArchetypeComplete = (result: string) => {
    setArchetype(result);
    setTimeout(() => goToNextSlide(), 100);
  };
  
  // Mobile content
  const MobileContent = () => (
    <div className="relative w-full h-screen bg-[#050510] overflow-hidden">
      <MatrixRain />
      
      {/* Progress bars */}
      <ProgressBars currentSlide={currentSlide} totalSlides={totalSlides} isAnimating={isAnimating} />
      
      {/* Tap zones - disable for quiz slide */}
      {currentSlide !== 3 && (
        <TapZones onPrev={goToPrevSlide} onNext={goToNextSlide} showHints={showHints} />
      )}
      
      {/* Slides */}
      <HeroSlide isActive={currentSlide === 0} />
      <DivineMessageSlide isActive={currentSlide === 1} />
      <PhoneMessageSlide isActive={currentSlide === 2} />
      <SoulQuizSlide isActive={currentSlide === 3} onComplete={handleArchetypeComplete} />
      <ArchetypeRevealSlide isActive={currentSlide === 4} archetype={archetype} />
      <BookRevealSlide isActive={currentSlide === 5} />
      <AcademySlide isActive={currentSlide === 6} />
      <FinalCTASlide isActive={currentSlide === 7} />
      
      {/* Global animations */}
      <style>{`
        @keyframes cosmic-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
  
  return (
    <>
      {/* Mobile view - fullscreen */}
      <div className="lg:hidden">
        <MobileContent />
      </div>
      
      {/* Desktop view - phone frame */}
      <PhoneFrame>
        <MobileContent />
      </PhoneFrame>
    </>
  );
};

export default Index;
