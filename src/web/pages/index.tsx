import { useState, useEffect, useRef, useCallback } from "react";

// Audio context for sound effects
let audioContext: AudioContext | null = null;
let isMuted = false;

// Get or create audio context
const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
};

// Tap/click sound - subtle cosmic pulse
const playTapSound = () => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  } catch {
    // Audio not supported
  }
};

// Success sound - ascending cosmic chime
const playSuccessSound = () => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Three-note ascending arpeggio
    [523, 659, 784].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      osc.type = 'sine';
      
      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.08, now + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.25);
      
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.25);
    });
  } catch {
    // Audio not supported
  }
};

// Message received sound - soft chime notification
const playMessageSound = () => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Two-tone notification like iMessage
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    
    osc1.frequency.setValueAtTime(1318, now);
    osc2.frequency.setValueAtTime(1046, now + 0.06);
    osc1.type = 'sine';
    osc2.type = 'sine';
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.01);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    
    osc1.start(now);
    osc1.stop(now + 0.12);
    osc2.start(now + 0.06);
    osc2.stop(now + 0.2);
  } catch {
    // Audio not supported
  }
};

// Typing keyboard click sound
const playTypingSound = () => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Subtle keyboard click
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    // White noise style click
    osc.frequency.setValueAtTime(2000 + Math.random() * 500, now);
    osc.type = 'square';
    
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1000, now);
    
    gain.gain.setValueAtTime(0.015, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    
    osc.start(now);
    osc.stop(now + 0.03);
  } catch {
    // Audio not supported
  }
};

// Slide transition whoosh sound
const playWhooshSound = () => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    // Descending swoosh
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
    osc.type = 'sine';
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.15);
    
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    
    osc.start(now);
    osc.stop(now + 0.18);
  } catch {
    // Audio not supported
  }
};

// Quiz answer selection affirmation tone
const playAffirmationSound = () => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    // Pleasant confirmation note
    osc.frequency.setValueAtTime(880, now);
    osc.type = 'sine';
    
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    
    osc.start(now);
    osc.stop(now + 0.15);
  } catch {
    // Audio not supported
  }
};

// ===========================================
// AMBIENT SOUND SYSTEM - "Hacked" atmosphere
// ===========================================
interface AmbientSoundNodes {
  whiteNoise: AudioBufferSourceNode | null;
  lowHum: OscillatorNode | null;
  highFreq: OscillatorNode | null;
  masterGain: GainNode | null;
  noiseGain: GainNode | null;
  humGain: GainNode | null;
  highGain: GainNode | null;
  filter: BiquadFilterNode | null;
}

let ambientNodes: AmbientSoundNodes = {
  whiteNoise: null,
  lowHum: null,
  highFreq: null,
  masterGain: null,
  noiseGain: null,
  humGain: null,
  highGain: null,
  filter: null
};
let ambientStarted = false;

// Create white noise buffer
const createNoiseBuffer = (ctx: AudioContext, duration: number) => {
  const sampleRate = ctx.sampleRate;
  const buffer = ctx.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  return buffer;
};

// Start ambient background sounds
const startAmbientSound = () => {
  if (ambientStarted || isMuted) return;
  
  try {
    const ctx = getAudioContext();
    
    // Master gain for overall volume control
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.15, ctx.currentTime); // Low overall volume
    masterGain.connect(ctx.destination);
    ambientNodes.masterGain = masterGain;
    
    // 1. White noise / static layer
    const noiseBuffer = createNoiseBuffer(ctx, 2);
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;
    
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.08, ctx.currentTime);
    
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(2000, ctx.currentTime);
    
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);
    noiseSource.start();
    
    ambientNodes.whiteNoise = noiseSource;
    ambientNodes.noiseGain = noiseGain;
    ambientNodes.filter = noiseFilter;
    
    // 2. Low electronic hum layer
    const lowHum = ctx.createOscillator();
    lowHum.type = 'sine';
    lowHum.frequency.setValueAtTime(60, ctx.currentTime);
    
    const humGain = ctx.createGain();
    humGain.gain.setValueAtTime(0.04, ctx.currentTime);
    
    lowHum.connect(humGain);
    humGain.connect(masterGain);
    lowHum.start();
    
    ambientNodes.lowHum = lowHum;
    ambientNodes.humGain = humGain;
    
    // 3. High frequency digital layer (subtle)
    const highFreq = ctx.createOscillator();
    highFreq.type = 'square';
    highFreq.frequency.setValueAtTime(8000, ctx.currentTime);
    
    const highGain = ctx.createGain();
    highGain.gain.setValueAtTime(0.008, ctx.currentTime);
    
    const highFilter = ctx.createBiquadFilter();
    highFilter.type = 'lowpass';
    highFilter.frequency.setValueAtTime(10000, ctx.currentTime);
    
    highFreq.connect(highFilter);
    highFilter.connect(highGain);
    highGain.connect(masterGain);
    highFreq.start();
    
    ambientNodes.highFreq = highFreq;
    ambientNodes.highGain = highGain;
    
    // 4. Periodic glitch sounds
    const scheduleGlitch = () => {
      if (!ambientStarted || isMuted) return;
      
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      
      // Random glitch burst
      const glitchOsc = ctx.createOscillator();
      const glitchGain = ctx.createGain();
      
      glitchOsc.type = 'sawtooth';
      glitchOsc.frequency.setValueAtTime(100 + Math.random() * 500, now);
      glitchOsc.frequency.exponentialRampToValueAtTime(50 + Math.random() * 200, now + 0.1);
      
      glitchGain.gain.setValueAtTime(0.03, now);
      glitchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      
      glitchOsc.connect(glitchGain);
      glitchGain.connect(masterGain);
      
      glitchOsc.start(now);
      glitchOsc.stop(now + 0.15);
      
      // Schedule next glitch (random interval 3-8 seconds)
      setTimeout(scheduleGlitch, 3000 + Math.random() * 5000);
    };
    
    // Start glitch schedule after 2 seconds
    setTimeout(scheduleGlitch, 2000);
    
    ambientStarted = true;
  } catch {
    // Audio not supported
  }
};

// Stop ambient sounds
const stopAmbientSound = () => {
  if (!ambientStarted) return;
  
  try {
    if (ambientNodes.whiteNoise) {
      ambientNodes.whiteNoise.stop();
      ambientNodes.whiteNoise = null;
    }
    if (ambientNodes.lowHum) {
      ambientNodes.lowHum.stop();
      ambientNodes.lowHum = null;
    }
    if (ambientNodes.highFreq) {
      ambientNodes.highFreq.stop();
      ambientNodes.highFreq = null;
    }
    ambientNodes.masterGain = null;
    ambientNodes.noiseGain = null;
    ambientNodes.humGain = null;
    ambientNodes.highGain = null;
    ambientNodes.filter = null;
    ambientStarted = false;
  } catch {
    // Audio cleanup failed
  }
};

// Set ambient volume
const setAmbientVolume = (volume: number) => {
  if (ambientNodes.masterGain) {
    const ctx = getAudioContext();
    ambientNodes.masterGain.gain.setValueAtTime(volume, ctx.currentTime);
  }
};

// Toggle ambient mute state
const toggleAmbientMute = (mute: boolean) => {
  if (mute) {
    stopAmbientSound();
  } else {
    startAmbientSound();
  }
};

// Haptic feedback helper with pattern support
const triggerHaptic = (intensity: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light') => {
  if ('vibrate' in navigator) {
    const patterns: Record<string, number | number[]> = {
      light: 8,
      medium: 20,
      heavy: 40,
      success: [10, 30, 10], // double tap feel
      error: [50, 30, 50] // warning pattern
    };
    navigator.vibrate(patterns[intensity]);
  }
};

// Touch-optimized wrapper for consistent touch behavior
const useTouchFeedback = () => {
  const handleTouchStart = (e: React.TouchEvent) => {
    e.currentTarget.classList.add('touch-active');
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    e.currentTarget.classList.remove('touch-active');
  };
  
  return { 
    onTouchStart: handleTouchStart, 
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchEnd
  };
};

// Checkout helper function - calls API to get Stripe checkout URL
const initiateCheckout = async (productId: string): Promise<string | null> => {
  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId }),
    });
    
    const data = await response.json();
    
    if (data.url) {
      return data.url;
    }
    
    console.error('No checkout URL returned:', data);
    return null;
  } catch (error) {
    console.error('Checkout error:', error);
    return null;
  }
};

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

// Tap zones for navigation with realistic ripple effects
const TapZones = ({ onPrev, onNext, showHints }: { onPrev: () => void; onNext: () => void; showHints: boolean }) => {
  const [leftTapped, setLeftTapped] = useState(false);
  const [rightTapped, setRightTapped] = useState(false);
  const [leftRipple, setLeftRipple] = useState<{ x: number; y: number } | null>(null);
  const [rightRipple, setRightRipple] = useState<{ x: number; y: number } | null>(null);
  
  const handleLeftTap = (e: React.MouseEvent<HTMLDivElement>) => {
    // Get tap position relative to element
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setLeftTapped(true);
    setLeftRipple({ x, y });
    playTapSound();
    triggerHaptic('light');
    onPrev();
    
    setTimeout(() => setLeftTapped(false), 150);
    setTimeout(() => setLeftRipple(null), 600);
  };
  
  const handleRightTap = (e: React.MouseEvent<HTMLDivElement>) => {
    // Get tap position relative to element
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setRightTapped(true);
    setRightRipple({ x, y });
    playTapSound();
    triggerHaptic('light');
    onNext();
    
    setTimeout(() => setRightTapped(false), 150);
    setTimeout(() => setRightRipple(null), 600);
  };
  
  return (
    <>
      {/* Left tap zone - go back */}
      <div 
        className="absolute left-0 top-0 w-1/3 h-full z-40 cursor-pointer group touch-manipulation overflow-hidden"
        onClick={handleLeftTap}
      >
        {/* Quick flash feedback */}
        <div className={`absolute inset-0 bg-white/8 transition-opacity duration-100 ${leftTapped ? 'opacity-100' : 'opacity-0'}`} />
        
        {/* Ripple effect emanating from tap position */}
        {leftRipple && (
          <span 
            className="absolute rounded-full bg-white/20 pointer-events-none"
            style={{
              left: leftRipple.x - 75,
              top: leftRipple.y - 75,
              width: 150,
              height: 150,
              animation: 'ripple-expand 600ms ease-out forwards',
            }}
          />
        )}
        
        {showHints && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className={`bg-black/50 backdrop-blur-sm rounded-full p-3 transition-transform duration-100 ${leftTapped ? 'scale-[0.85]' : 'scale-100'}`}>
              <svg className="w-6 h-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </div>
        )}
      </div>
      
      {/* Right tap zone - go next */}
      <div 
        className="absolute right-0 top-0 w-2/3 h-full z-40 cursor-pointer group touch-manipulation overflow-hidden"
        onClick={handleRightTap}
      >
        {/* Quick flash feedback */}
        <div className={`absolute inset-0 bg-white/8 transition-opacity duration-100 ${rightTapped ? 'opacity-100' : 'opacity-0'}`} />
        
        {/* Ripple effect emanating from tap position */}
        {rightRipple && (
          <span 
            className="absolute rounded-full bg-white/20 pointer-events-none"
            style={{
              left: rightRipple.x - 75,
              top: rightRipple.y - 75,
              width: 150,
              height: 150,
              animation: 'ripple-expand 600ms ease-out forwards',
            }}
          />
        )}
        
        {showHints && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className={`bg-black/50 backdrop-blur-sm rounded-full p-3 transition-transform duration-100 ${rightTapped ? 'scale-[0.85]' : 'scale-100'}`}>
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

// Interactive Button Component with micro-interactions
interface InteractiveButtonProps {
  onClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  haptic?: 'light' | 'medium' | 'heavy';
  sound?: boolean;
}

const InteractiveButton = ({ 
  onClick, 
  children, 
  className = '', 
  disabled = false, 
  loading = false,
  variant = 'primary',
  haptic = 'light',
  sound = true
}: InteractiveButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const [ripplePos, setRipplePos] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const baseStyles = "relative overflow-hidden transition-all ease-out transform-gpu touch-manipulation";
  
  const variantStyles = {
    primary: "bg-gradient-to-r from-purple-600 via-[#00ff88]/70 to-cyan-500 text-white",
    secondary: "bg-[#0a0a2e]/80 border border-[#00ff88]/30 text-white hover:border-[#00ff88]/60",
    ghost: "bg-transparent text-white/70 hover:text-white hover:bg-white/5"
  };
  
  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled || loading) return;
    setIsPressed(true);
    
    // Create ripple effect at pointer position
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      setRipplePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setShowRipple(true);
      setTimeout(() => setShowRipple(false), 600);
    }
    
    // Immediate haptic feedback
    triggerHaptic(haptic);
  };
  
  const handlePointerUp = () => {
    setIsPressed(false);
  };
  
  const handleClick = (e: React.MouseEvent) => {
    if (disabled || loading) return;
    
    // Sound on click
    if (sound) playTapSound();
    
    onClick(e);
  };
  
  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      style={{
        transform: isPressed ? 'scale(0.95)' : 'scale(1)',
        transition: isPressed 
          ? 'transform 80ms cubic-bezier(0.4, 0, 0.2, 1)' 
          : 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        boxShadow: isPressed 
          ? '0 2px 8px rgba(0, 0, 0, 0.15)' 
          : '0 4px 15px rgba(0, 0, 0, 0.2)'
      }}
    >
      {/* Ripple effect emanating from touch position */}
      {showRipple && (
        <span 
          className="absolute rounded-full bg-white/30 pointer-events-none"
          style={{
            left: ripplePos.x - 50,
            top: ripplePos.y - 50,
            width: 100,
            height: 100,
            animation: 'ripple-expand 600ms ease-out forwards',
          }}
        />
      )}
      
      {/* Loading spinner overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
      
      {/* Button content */}
      <span className={`relative z-10 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </span>
    </button>
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

// Checkout Modal Component - Redirects to Stripe
interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  product: {
    name: string;
    price: string;
    description: string;
  };
}

const CheckoutModal = ({ isOpen, onClose, productId, product }: CheckoutModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setLoading(false);
      setError(null);
    }
  }, [isOpen]);
  
  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    
    const checkoutUrl = await initiateCheckout(productId);
    
    if (checkoutUrl) {
      // Redirect to Stripe checkout
      window.location.href = checkoutUrl;
    } else {
      setError("Unable to start checkout. Please try again.");
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-md bg-gradient-to-br from-[#0a0a2e] via-[#050520] to-[#0a0a1f] border border-[#00ff88]/30 rounded-2xl overflow-hidden animate-[slideUp_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Glowing top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-[#00ff88] to-cyan-500" />
        
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-['Orbitron'] text-lg text-[#00ff88] mb-2">
              SECURE CHECKOUT
            </h3>
            <p className="font-['Rajdhani'] text-zinc-400 text-sm">
              Complete your order to begin the awakening
            </p>
          </div>
          
          {/* Order summary */}
          <div className="bg-[#050510]/60 border border-purple-500/20 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-['Orbitron'] text-white text-sm">{product.name}</h4>
                <p className="font-['Rajdhani'] text-zinc-500 text-xs">{product.description}</p>
              </div>
              <span className="font-['Orbitron'] text-[#00ff88] text-lg">{product.price}</span>
            </div>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4">
              <p className="font-['Rajdhani'] text-red-400 text-sm text-center">{error}</p>
            </div>
          )}
          
          {/* Checkout button */}
          <button
            onClick={() => {
              playSuccessSound();
              triggerHaptic('success');
              handleCheckout();
            }}
            disabled={loading}
            className="w-full py-4 font-['Orbitron'] text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-[#00ff88]/70 to-cyan-500 rounded-xl uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.97] min-h-[56px]"
            style={{ 
              transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 200ms ease',
              boxShadow: loading ? 'none' : '0 0 25px rgba(0, 255, 136, 0.25)'
            }}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Connecting to Stripe...</span>
              </>
            ) : (
              <>
                <span>🔒</span>
                <span>Proceed to Payment</span>
              </>
            )}
          </button>
          
          {/* Trust badges */}
          <div className="flex justify-center gap-4 mt-4 text-zinc-500 text-xs font-['Rajdhani']">
            <span>🔐 Stripe Secure</span>
            <span>⚡ Instant Access</span>
            <span>✨ 30-Day Guarantee</span>
          </div>
          
          {/* Powered by Stripe */}
          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-2 text-zinc-600 text-xs">
              <span>Powered by</span>
              <svg className="h-4" viewBox="0 0 60 25" fill="currentColor">
                <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.02 1.04-.06 1.48zm-6.3-5.63c-1.03 0-1.99.73-2.1 2.25h4.19c-.12-1.46-.97-2.25-2.09-2.25zM41.8 20.57V8.24h4.09v12.33H41.8zm2.05-13.72c-1.3 0-2.35-1.07-2.35-2.37 0-1.3 1.05-2.36 2.35-2.36 1.3 0 2.35 1.06 2.35 2.36 0 1.3-1.05 2.37-2.35 2.37zM33.75 5.97V2.4L38 1.13v3.57l-4.25 1.27zM33.81 20.57V8.24h4.09v12.33h-4.09zM20.92 20.57V8.24h3.97v1.65a4.7 4.7 0 0 1 4.05-1.93c2.57 0 4.47 1.97 4.47 5.68v6.93h-4.1v-5.93c0-1.9-.72-2.84-2.01-2.84-1.45 0-2.28 1.11-2.28 2.84v5.93h-4.1zM16.73 5.97V2.4L21 1.13v3.57l-4.27 1.27zM16.8 20.57V8.24h4.09v12.33H16.8zM0 20.57V1.82h4.1v7.26c.76-.84 2.19-1.38 3.72-1.38 3.04 0 5.51 2.64 5.51 6.55 0 3.92-2.72 6.55-5.73 6.55-1.43 0-2.88-.65-3.61-1.65v1.42H0zm6.98-8.54c-1.49 0-2.88 1.3-2.88 3.05 0 1.74 1.33 3.04 2.88 3.04 1.5 0 2.82-1.26 2.82-3.04 0-1.79-1.33-3.05-2.82-3.05z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// SLIDE 1: Hero Section
const HeroSlide = ({ isActive }: { isActive: boolean }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center px-6 py-16 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
      {/* Background gradients with parallax layering */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#0a0a2e] to-[#050510]" />
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(100,0,180,0.15)_0%,transparent_70%)]"
        style={{ animation: 'parallax-layer-1 15s ease-in-out infinite' }}
      />
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(0,255,136,0.08)_0%,transparent_50%)]"
        style={{ animation: 'parallax-layer-2 18s ease-in-out infinite' }}
      />
      
      {/* Cosmic orbs with physics-based parallax floating */}
      <div 
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-600/10 blur-[100px] animate-physics"
        style={{ animation: 'parallax-float 12s ease-in-out infinite' }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-500/10 blur-[80px] animate-physics"
        style={{ animation: 'parallax-float 15s ease-in-out infinite reverse', animationDelay: '-3s' }}
      />
      <div 
        className="absolute top-1/3 right-1/3 w-64 h-64 rounded-full bg-[#00ff88]/5 blur-[60px] animate-physics"
        style={{ animation: 'parallax-float 18s ease-in-out infinite', animationDelay: '-7s' }}
      />
      
      <div className="relative z-10 max-w-lg mx-auto text-center">
        {/* Divine Transmission Banner */}
        <div className="mb-4 animate-[fadeIn_1s_ease-out]">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#1a0a2e]/80 via-[#0a0a2e]/80 to-[#1a0a2e]/80 border border-[#00ff88]/30 backdrop-blur-sm transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(0,255,136,0.2)]">
            <span className="text-[#00ff88] animate-pulse text-sm">◈</span>
            <span className="font-['Orbitron'] text-[#00ff88]/90 font-semibold text-xs tracking-wider">
              DIVINE TRANSMISSION
            </span>
            <span className="text-[#00ff88] animate-pulse text-sm">◈</span>
          </div>
        </div>

        {/* Cloaked messenger image with breathing animation */}
        <div className="relative mb-6">
          <div 
            className={`relative mx-auto w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden transition-all duration-1000 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            style={{ animation: imageLoaded ? 'breathing 4s ease-in-out infinite' : 'none' }}
          >
            <div className="absolute inset-0 rounded-full border-2 border-[#00ff88]/50" style={{ animation: 'pulse-border 2s ease-in-out infinite' }} />
            <div className="absolute -inset-2 rounded-full border border-purple-500/30 animate-[cosmic-rotate_20s_linear_infinite]" />
            <div className="absolute -inset-4 rounded-full border border-cyan-500/20 animate-[cosmic-rotate_30s_linear_infinite_reverse]" />
            
            {/* Glowing aura around messenger */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#00ff88]/20 via-purple-500/20 to-cyan-500/20 blur-md" style={{ animation: 'aura-pulse 3s ease-in-out infinite' }} />
            
            <img
              src="./cloaked-messenger-portrait-KakJfYU78kjRavrkE3GIf.png"
              alt="The Cosmic Messenger"
              className="w-full h-full object-cover relative z-10"
              onLoad={() => setImageLoaded(true)}
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-[#00ff88]/20 via-transparent to-purple-500/20 pointer-events-none z-20" />
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
        <div className="mt-8" style={{ animation: 'float-gentle 2s ease-in-out infinite' }}>
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
    <div className={`absolute inset-0 flex flex-col items-center justify-center px-6 py-16 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
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

// SLIDE 3: Phone iMessage Style - Hyper-Realistic version
interface MessageData {
  text: string;
  type: 'incoming' | 'sent';
  delivered?: boolean;
  read?: boolean;
  time?: string;
  showTimestamp?: boolean;
}

// Hyper-realistic typing indicator with natural bouncing dots
const RealisticTypingIndicator = () => {
  return (
    <div 
      className="flex justify-start"
      style={{ animation: 'typing-appear 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
    >
      <div className="bg-[#3a3a3c] rounded-[18px] rounded-bl-[4px] px-4 py-3 relative">
        <div className="flex gap-[5px] items-center h-[14px]">
          <span 
            className="w-[7px] h-[7px] bg-[#8e8e93] rounded-full"
            style={{ 
              animation: 'typing-bounce-natural 1.4s ease-in-out infinite',
              animationDelay: '0ms'
            }} 
          />
          <span 
            className="w-[7px] h-[7px] bg-[#8e8e93] rounded-full"
            style={{ 
              animation: 'typing-bounce-natural 1.4s ease-in-out infinite',
              animationDelay: '200ms'
            }} 
          />
          <span 
            className="w-[7px] h-[7px] bg-[#8e8e93] rounded-full"
            style={{ 
              animation: 'typing-bounce-natural 1.4s ease-in-out infinite',
              animationDelay: '400ms'
            }} 
          />
        </div>
      </div>
    </div>
  );
};

// Message bubble with animated delivery states and arrival flash
const MessageBubbleEnhanced = ({ 
  msg, 
  isNew,
  showDelivered 
}: { 
  msg: MessageData; 
  isNew: boolean;
  showDelivered: boolean;
}) => {
  const [status, setStatus] = useState<'sending' | 'delivered' | 'read'>(
    msg.type === 'sent' ? (msg.delivered ? (msg.read ? 'read' : 'delivered') : 'sending') : 'delivered'
  );
  const [showArrivalFlash, setShowArrivalFlash] = useState(isNew && msg.type === 'incoming');
  
  useEffect(() => {
    if (msg.type === 'sent' && isNew) {
      setStatus('sending');
      const deliverTimeout = setTimeout(() => setStatus('delivered'), 450);
      const readTimeout = msg.read ? setTimeout(() => setStatus('read'), 1400) : null;
      
      return () => {
        clearTimeout(deliverTimeout);
        if (readTimeout) clearTimeout(readTimeout);
      };
    } else if (msg.type === 'sent') {
      setStatus(msg.read ? 'read' : msg.delivered ? 'delivered' : 'sending');
    }
  }, [msg.type, msg.delivered, msg.read, isNew]);
  
  // Clear arrival flash after animation
  useEffect(() => {
    if (showArrivalFlash) {
      const timer = setTimeout(() => setShowArrivalFlash(false), 500);
      return () => clearTimeout(timer);
    }
  }, [showArrivalFlash]);
  
  return (
    <div className="mb-[2px]">
      <div 
        className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}
        style={{
          animation: isNew ? 'message-pop-enhanced 0.38s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none'
        }}
      >
        <div 
          className={`max-w-[75%] px-[12px] py-[8px] relative ${
            msg.type === 'sent' 
              ? 'bg-[#007aff] text-white rounded-[18px] rounded-br-[4px]' 
              : 'bg-[#3a3a3c] text-white rounded-[18px] rounded-bl-[4px]'
          }`}
          style={{
            boxShadow: showArrivalFlash 
              ? '0 0 15px rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0,0,0,0.12)' 
              : '0 1px 1px rgba(0,0,0,0.12)',
            transition: 'box-shadow 300ms ease-out'
          }}
        >
          <p className="text-[17px] leading-[22px] whitespace-pre-wrap">{msg.text}</p>
        </div>
      </div>
      
      {/* Delivery status for sent messages */}
      {msg.type === 'sent' && showDelivered && (
        <div 
          className="flex justify-end mt-[3px] mr-[4px] transition-all duration-300"
          style={{ opacity: status === 'sending' ? 0.6 : 1 }}
        >
          <span className="text-[11px] text-[#8e8e93] font-light tracking-[-0.1px]">
            {status === 'sending' && 'Sending...'}
            {status === 'delivered' && 'Delivered'}
            {status === 'read' && `Read ${msg.time || ''} AM`}
          </span>
        </div>
      )}
    </div>
  );
};

const PhoneMessageSlide = ({ isActive, onAdvance }: { isActive: boolean; onAdvance?: () => void }) => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showAwakeningButton, setShowAwakeningButton] = useState(false);
  const [newMessageIndex, setNewMessageIndex] = useState(-1);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isTyping]);
  
  // Divine transmission messages - appearing as system-level interruptions
  const allMessages: Array<{ 
    text: string; 
    typingDuration: number; 
    pauseBefore: number;
  }> = [
    { text: "📡 Incoming transmission...", typingDuration: 2200, pauseBefore: 1000 },
    { text: "I've been waiting for you", typingDuration: 2800, pauseBefore: 1400 },
    { text: "⚡ Your frequency detected...", typingDuration: 2400, pauseBefore: 1600 },
    { text: "🔮 Initiating soul scan...", typingDuration: 2000, pauseBefore: 1200 },
    { text: "Analyzing cosmic signature...", typingDuration: 3200, pauseBefore: 2000 },
    { text: "✨ MATCH FOUND", typingDuration: 1400, pauseBefore: 2800 },
    { text: "You carry the mark of the seven.", typingDuration: 2600, pauseBefore: 800 },
    { text: "Your soul is ancient. It remembers what your mind has forgotten.", typingDuration: 4200, pauseBefore: 1400 },
    { text: "The prophecy speaks of warriors who will reunite across dimensions to restore Earth's frequency.", typingDuration: 5000, pauseBefore: 1800 },
    { text: "You are one of them.", typingDuration: 1800, pauseBefore: 2200 },
    { text: "It's time to remember who you truly are. ✨🔮", typingDuration: 3400, pauseBefore: 1600 },
  ];
  
  // Calculate cumulative timings for message sequence
  const getMessageTimings = (msgs: typeof allMessages) => {
    let cumulative = 0;
    return msgs.map(msg => {
      const startTyping = cumulative + msg.pauseBefore;
      const showMessage = startTyping + msg.typingDuration;
      cumulative = showMessage;
      return { ...msg, startTyping, showMessage };
    });
  };
  
  // Full message sequence - plays automatically
  useEffect(() => {
    if (!isActive) return;
    
    setMessages([]);
    setShowAwakeningButton(false);
    setIsTyping(false);
    setNewMessageIndex(-1);
    
    // Initial glitch effect
    setGlitchEffect(true);
    setTimeout(() => setGlitchEffect(false), 800);
    
    const timeouts: NodeJS.Timeout[] = [];
    const timings = getMessageTimings(allMessages);
    
    timings.forEach((msg, index) => {
      // Start typing indicator with typing sound
      timeouts.push(setTimeout(() => {
        setIsTyping(true);
        playTypingSound();
      }, msg.startTyping));
      
      // Show message after typing
      timeouts.push(setTimeout(() => {
        setIsTyping(false);
        playMessageSound();
        triggerHaptic('light');
        setNewMessageIndex(index);
        setMessages(prev => [...prev, { 
          text: msg.text, 
          type: 'incoming',
          delivered: true,
        }]);
        
        // Clear new status
        setTimeout(() => setNewMessageIndex(-1), 450);
        
        // Show START YOUR AWAKENING button after the last message
        if (index === timings.length - 1) {
          setTimeout(() => {
            playSuccessSound();
            triggerHaptic('heavy');
            setShowAwakeningButton(true);
          }, 1800);
        }
      }, msg.showMessage));
    });
    
    return () => timeouts.forEach(clearTimeout);
  }, [isActive]);
  
  // Reset when slide becomes inactive
  useEffect(() => {
    if (!isActive) {
      setMessages([]);
      setShowAwakeningButton(false);
      setIsTyping(false);
      setNewMessageIndex(-1);
    }
  }, [isActive]);
  
  const handleStartAwakening = () => {
    triggerHaptic('heavy');
    playSuccessSound();
    onAdvance?.();
  };
  
  return (
    <div className={`absolute inset-0 flex flex-col transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
      {/* Enhanced animations */}
      <style>{`
        @keyframes typing-appear {
          0% { opacity: 0; transform: translateY(6px) scale(0.92); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes typing-bounce-natural {
          0%, 100% { transform: translateY(0); opacity: 0.45; }
          15% { transform: translateY(-1px); opacity: 0.55; }
          30% { transform: translateY(-5px); opacity: 1; }
          45% { transform: translateY(-2px); opacity: 0.75; }
          60% { transform: translateY(0); opacity: 0.5; }
        }
        @keyframes message-pop-enhanced {
          0% { opacity: 0; transform: translateY(14px) scale(0.9); }
          45% { transform: translateY(-3px) scale(1.015); }
          70% { transform: translateY(1px) scale(0.995); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes glitch-text {
          0%, 100% { transform: translate(0); filter: none; }
          20% { transform: translate(-2px, 1px); filter: hue-rotate(90deg); }
          40% { transform: translate(2px, -1px); filter: hue-rotate(-90deg); }
          60% { transform: translate(-1px, 2px); filter: brightness(1.5); }
          80% { transform: translate(1px, -2px); filter: saturate(2); }
        }
        @keyframes scan-line {
          0% { top: 0; }
          100% { top: 100%; }
        }
        @keyframes notification-slide {
          0% { opacity: 0; transform: translateY(-100%); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-100%); }
        }
      `}</style>
      
      {/* Cosmic transmission background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#0a0a2e] to-[#050510]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,136,0.08)_0%,transparent_60%)]" />
      
      {/* Matrix/Glitch scan line effect */}
      {glitchEffect && (
        <div 
          className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00ff88] to-transparent opacity-80 z-50"
          style={{ animation: 'scan-line 0.8s linear' }}
        />
      )}
      
      {/* Header - cosmic transmission style (no profile picture) */}
      <div className="relative z-20 pt-8 pb-4 px-6 text-center">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0a0a2e]/80 border border-[#00ff88]/40 backdrop-blur-sm ${glitchEffect ? 'animate-[glitch-text_0.3s_ease-in-out]' : ''}`}>
          <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse" />
          <span className="font-['Orbitron'] text-[#00ff88] text-xs tracking-wider uppercase">
            Divine Transmission Active
          </span>
          <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse" />
        </div>
        <p className="font-['Rajdhani'] text-zinc-500 text-xs mt-2 tracking-wide">
          ENCRYPTED CHANNEL • FREQUENCY LOCKED
        </p>
      </div>
      
      {/* Messages area - cosmic notification style */}
      <div className="flex-1 px-4 py-4 overflow-y-auto scroll-momentum relative z-10">
        <div className="max-w-lg mx-auto space-y-3">
          {messages.map((msg, i) => (
            <div 
              key={i}
              className={`${i === newMessageIndex ? 'animate-[message-pop-enhanced_0.38s_cubic-bezier(0.34,1.56,0.64,1)]' : ''}`}
            >
              {/* Cosmic message bubble - no avatar */}
              <div className="bg-gradient-to-r from-[#0a0a2e]/90 via-[#1a0a3e]/80 to-[#0a0a2e]/90 border border-[#00ff88]/20 rounded-2xl px-5 py-4 backdrop-blur-sm relative overflow-hidden group">
                {/* Subtle glow on new messages */}
                {i === newMessageIndex && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00ff88]/10 via-purple-500/10 to-[#00ff88]/10 animate-pulse" />
                )}
                
                {/* Left accent bar */}
                <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#00ff88] via-purple-400 to-cyan-400 rounded-full" />
                
                <p className="font-['Rajdhani'] text-white/95 text-[16px] leading-relaxed pl-2 relative z-10">
                  {msg.text}
                </p>
              </div>
            </div>
          ))}
          
          {/* Typing indicator - cosmic style */}
          {isTyping && (
            <div className="animate-[typing-appear_0.22s_cubic-bezier(0.34,1.56,0.64,1)]">
              <div className="bg-[#0a0a2e]/80 border border-purple-500/30 rounded-2xl px-5 py-4 inline-flex items-center gap-2">
                <span className="font-['Rajdhani'] text-purple-300/70 text-sm">Receiving transmission</span>
                <div className="flex gap-[5px] items-center">
                  <span className="w-[6px] h-[6px] bg-[#00ff88] rounded-full" style={{ animation: 'typing-bounce-natural 1.4s ease-in-out infinite', animationDelay: '0ms' }} />
                  <span className="w-[6px] h-[6px] bg-[#00ff88] rounded-full" style={{ animation: 'typing-bounce-natural 1.4s ease-in-out infinite', animationDelay: '200ms' }} />
                  <span className="w-[6px] h-[6px] bg-[#00ff88] rounded-full" style={{ animation: 'typing-bounce-natural 1.4s ease-in-out infinite', animationDelay: '400ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Bottom area - shows awakening button when messages complete */}
      <div className="relative z-20 px-6 py-6 bg-gradient-to-t from-[#050510] via-[#050510]/95 to-transparent">
        {showAwakeningButton ? (
          <button 
            onClick={() => {
              playTapSound();
              handleStartAwakening();
            }}
            className="w-full max-w-lg mx-auto block text-white py-4 rounded-2xl font-bold text-[16px] tracking-wide transition-all hover:scale-[1.02] active:scale-[0.97] min-h-[56px] relative overflow-hidden font-['Orbitron']"
            style={{ 
              background: 'linear-gradient(135deg, #6b21a8 0%, #00ff88 50%, #0ea5e9 100%)',
              backgroundSize: '200% 200%',
              animation: 'awakening-btn-glow 2.5s ease-in-out infinite, awakening-gradient-shift 3s ease-in-out infinite',
              boxShadow: '0 0 30px rgba(0, 255, 136, 0.5), 0 0 60px rgba(0, 255, 136, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
              textShadow: '0 0 10px rgba(255,255,255,0.5)',
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <span>✨</span>
              <span>TAP TO CONTINUE</span>
              <span>✨</span>
            </span>
          </button>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-zinc-500 text-sm font-['Rajdhani']">
              <svg className="w-4 h-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Receiving cosmic data...</span>
            </div>
          </div>
        )}
      </div>
      
      {/* CSS for awakening button animations */}
      <style>{`
        @keyframes awakening-btn-glow {
          0%, 100% { 
            box-shadow: 0 0 30px rgba(0, 255, 136, 0.5), 0 0 60px rgba(0, 255, 136, 0.3), inset 0 1px 0 rgba(255,255,255,0.2);
          }
          50% { 
            box-shadow: 0 0 50px rgba(0, 255, 136, 0.7), 0 0 100px rgba(0, 255, 136, 0.4), 0 0 150px rgba(107, 33, 168, 0.3), inset 0 1px 0 rgba(255,255,255,0.3);
          }
        }
        @keyframes awakening-gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
};

// WISDOM SLIDE 1: The Synchronicity Code
const WisdomSlide1 = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center px-6 py-16 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#0a0a2e] to-[#050510]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,136,0.12)_0%,transparent_60%)]" />
      
      {/* Floating sacred numbers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['11:11', '3:33', '7:77', '4:44', '12:12'].map((num, i) => (
          <span
            key={i}
            className="absolute font-['Orbitron'] text-[#00ff88]/10 text-4xl"
            style={{
              left: `${15 + i * 18}%`,
              top: `${10 + (i % 3) * 30}%`,
              animation: `float-gentle ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`
            }}
          >
            {num}
          </span>
        ))}
      </div>
      
      <div className="relative z-10 max-w-lg mx-auto text-center">
        <div className="mb-6">
          <span className="font-['Orbitron'] text-6xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-cyan-300 to-[#00ff88] font-black"
            style={{ textShadow: '0 0 60px rgba(0, 255, 136, 0.5)' }}
          >
            11:11
          </span>
        </div>
        
        <h2 className="font-['Cinzel'] text-xl md:text-2xl text-white font-bold mb-4">
          THE SYNCHRONICITY CODE
        </h2>
        
        <div className="bg-[#0a0a2e]/60 border border-[#00ff88]/30 rounded-2xl p-6 backdrop-blur-sm mb-6">
          <p className="font-['Rajdhani'] text-base md:text-lg text-zinc-300 leading-relaxed mb-4">
            You've seen them. <span className="text-[#00ff88] font-semibold">11:11</span>. <span className="text-purple-400 font-semibold">3:33</span>. <span className="text-cyan-400 font-semibold">4:44</span>.
          </p>
          <p className="font-['Rajdhani'] text-base md:text-lg text-zinc-300 leading-relaxed mb-4">
            These aren't random. They're <span className="text-[#00ff88]">activation codes</span> — signals from beyond the veil that your soul is awakening.
          </p>
          <p className="font-['Rajdhani'] text-base md:text-lg text-white leading-relaxed font-medium">
            The universe is <span className="text-[#00ff88]">speaking to you</span>. It has been for years. Now you're finally ready to listen.
          </p>
        </div>
        
        <div className="flex justify-center gap-4 opacity-60">
          {["✧", "◈", "✧", "◈", "✧"].map((symbol, i) => (
            <span
              key={i}
              className="text-[#00ff88] text-xl animate-pulse"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {symbol}
            </span>
          ))}
        </div>
        
        <div className="mt-6 animate-pulse">
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

// WISDOM SLIDE 2: The Seven Cosmic Warriors Prophecy
const WisdomSlide2 = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center px-6 py-16 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#1a0a2e] to-[#050510]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(147,51,234,0.12)_0%,transparent_60%)]" />
      
      <div className="relative z-10 max-w-lg mx-auto text-center">
        {/* Seven stars symbol */}
        <div className="mb-6 relative">
          <div className="flex justify-center gap-3 mb-4">
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <span
                key={n}
                className={`text-2xl ${n === 4 ? 'text-[#00ff88] scale-125' : 'text-purple-400'} animate-pulse`}
                style={{ animationDelay: `${n * 0.1}s` }}
              >
                ✧
              </span>
            ))}
          </div>
        </div>
        
        <span className="font-['Orbitron'] text-[#00ff88] text-xs tracking-[0.3em] uppercase block mb-3">
          ◈ Ancient Prophecy ◈
        </span>
        
        <h2 className="font-['Cinzel'] text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 font-bold mb-4">
          THE SEVEN COSMIC WARRIORS
        </h2>
        
        <div className="bg-[#0a0a2e]/60 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm mb-6">
          <p className="font-['Rajdhani'] text-base md:text-lg text-zinc-300 leading-relaxed mb-4 italic">
            "When Earth's frequency falls to its lowest point, seven souls from the original creation will reawaken..."
          </p>
          <p className="font-['Rajdhani'] text-base md:text-lg text-zinc-300 leading-relaxed mb-4">
            They were <span className="text-purple-400 font-semibold">scattered across dimensions</span>, their memories sealed. But each carries a <span className="text-[#00ff88] font-semibold">cosmic fragment</span> — a piece of the original light.
          </p>
          <p className="font-['Rajdhani'] text-base md:text-lg text-white leading-relaxed font-medium">
            When all seven reunite, they will <span className="text-[#00ff88]">restore the frequency</span> and awaken humanity from the simulation.
          </p>
        </div>
        
        <p className="font-['Rajdhani'] text-lg text-purple-300 font-medium">
          Are you one of the seven?
        </p>
        
        <div className="mt-6 animate-pulse">
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

// WISDOM SLIDE 3: Your Soul's True Origin
const WisdomSlide3 = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center px-6 py-16 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: "url('./cosmic-quantum-background-jw2jNpfQM2YTBpDEPtpac.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510]/95 via-[#050510]/80 to-[#050510]/95" />
      
      <div className="relative z-10 max-w-lg mx-auto text-center">
        {/* Dimensional portal symbol */}
        <div className="mb-6 relative inline-block">
          <div className="w-24 h-24 rounded-full border-2 border-cyan-400/50 flex items-center justify-center relative">
            <div className="absolute inset-2 rounded-full border border-purple-400/50 animate-[cosmic-rotate_8s_linear_infinite]" />
            <div className="absolute inset-4 rounded-full border border-[#00ff88]/50 animate-[cosmic-rotate_6s_linear_infinite_reverse]" />
            <span className="text-3xl">🌌</span>
          </div>
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 blur-xl animate-pulse" />
        </div>
        
        <span className="font-['Orbitron'] text-cyan-400 text-xs tracking-[0.3em] uppercase block mb-3">
          ◈ Dimensional Truth ◈
        </span>
        
        <h2 className="font-['Cinzel'] text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-cyan-300 font-bold mb-4">
          YOUR SOUL'S TRUE ORIGIN
        </h2>
        
        <div className="bg-[#0a0a2e]/70 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-sm mb-6">
          <p className="font-['Rajdhani'] text-base md:text-lg text-zinc-300 leading-relaxed mb-4">
            You don't belong here. You've <span className="text-cyan-400 font-semibold">always felt it</span> — like you're watching life through a screen, disconnected from this reality.
          </p>
          <p className="font-['Rajdhani'] text-base md:text-lg text-zinc-300 leading-relaxed mb-4">
            Your soul originated in <span className="text-[#00ff88] font-semibold">higher dimensions</span>. You volunteered to incarnate here, knowing you'd forget everything.
          </p>
          <p className="font-['Rajdhani'] text-base md:text-lg text-white leading-relaxed font-medium">
            But forgetting was <span className="text-[#00ff88]">temporary</span>. The time for <span className="text-cyan-400">remembering</span> has arrived.
          </p>
        </div>
        
        <div className="flex justify-center gap-2 mb-4">
          {["Ψ", "Ω", "∞", "Φ", "Σ"].map((symbol, i) => (
            <span
              key={i}
              className="font-['Cinzel'] text-xl text-cyan-400/80 animate-pulse"
              style={{ animationDelay: `${i * 0.15}s` }}
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

// SLIDE 4: Soul Quiz
const SoulQuizSlide = ({ isActive, onComplete }: { isActive: boolean; onComplete: (archetype: string) => void }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [scanning, setScanning] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  
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
      setSelectedOption(null);
    }
  }, [isActive]);
  
  const handleAnswer = (answer: string, index: number) => {
    // Instant visual feedback
    setSelectedOption(index);
    playAffirmationSound();
    triggerHaptic('medium');
    
    // Small delay before transitioning for visual feedback
    setTimeout(() => {
      const newAnswers = [...answers, answer];
      setAnswers(newAnswers);
      setSelectedOption(null);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setScanning(true);
        triggerHaptic('heavy');
        setTimeout(() => {
          const archetypes = ["Starweaver", "Knowledge Keeper", "Crystal Healer", "Cosmic Warrior"];
          const counts = [0, 0, 0, 0];
          newAnswers.forEach((a, i) => {
            const idx = questions[i].options.indexOf(a);
            if (idx >= 0) counts[idx]++;
          });
          const maxIdx = counts.indexOf(Math.max(...counts));
          playSuccessSound();
          triggerHaptic('heavy');
          onComplete(archetypes[maxIdx]);
        }, 3000);
      }
    }, 180);
  };
  
  if (scanning) {
    return (
      <div className={`absolute inset-0 flex flex-col items-center justify-center px-6 py-16 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
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
    <div className={`absolute inset-0 flex flex-col items-center justify-center px-6 py-16 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
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
        
        {/* Quiz options with physics-based interactions */}
        <div className="space-y-3 pointer-events-auto scroll-momentum">
          {questions[currentQuestion].options.map((option, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                handleAnswer(option, i);
              }}
              className={`w-full p-4 rounded-xl border text-left font-['Rajdhani'] text-white transition-all touch-manipulation ${
                selectedOption === i 
                  ? 'bg-[#00ff88]/30 border-[#00ff88]/70 scale-[0.97]' 
                  : 'bg-purple-900/30 border-purple-500/30 hover:bg-purple-800/40 hover:border-purple-500/50'
              }`}
              style={{ 
                transition: 'transform 100ms cubic-bezier(0.34, 1.56, 0.64, 1), background 150ms ease, border-color 150ms ease, box-shadow 150ms ease',
                minHeight: '56px',
                boxShadow: selectedOption === i ? '0 0 20px rgba(0, 255, 136, 0.3)' : 'none'
              }}
            >
              <span className={`mr-3 transition-colors duration-150 ${selectedOption === i ? 'text-[#00ff88]' : 'text-purple-400'}`}>◈</span>
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
    <div className={`absolute inset-0 flex flex-col items-center justify-center px-6 py-16 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
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

// SLIDE 6: Book Reveal with Stripe Checkout Buttons
const BookRevealSlide = ({ isActive, onBookCheckout }: { isActive: boolean; onBookCheckout: (productId: string, product: {name: string; price: string; description: string}) => void }) => {
  const [loadingProduct, setLoadingProduct] = useState<string | null>(null);
  
  const handleBookPurchase = async (productId: string, name: string, price: string) => {
    setLoadingProduct(productId);
    const checkoutUrl = await initiateCheckout(productId);
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    } else {
      setLoadingProduct(null);
      // Fallback to modal
      onBookCheckout(productId, { name, price, description: "Cosmic Soul Quest Book" });
    }
  };
  
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center px-6 py-16 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
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
        <div className="relative mx-auto w-40 md:w-48 mb-4">
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/30 via-[#00ff88]/20 to-cyan-500/30 rounded-2xl blur-xl opacity-60 animate-pulse" />
          <div className="relative bg-gradient-to-br from-[#1a0a2e] via-[#0a0a2e] to-[#050520] rounded-xl overflow-hidden aspect-[3/4] border border-purple-500/30 shadow-2xl p-4">
            <div className="h-full flex flex-col items-center justify-center">
              <div className="text-2xl mb-2 opacity-60">
                <span className="text-[#00ff88]">◈</span>
                <span className="text-purple-400 mx-1">✧</span>
                <span className="text-cyan-400">☽</span>
              </div>
              <h3 className="font-['Cinzel'] text-lg text-transparent bg-clip-text bg-gradient-to-b from-[#00ff88] via-purple-300 to-cyan-400 font-bold">
                COSMIC<br/>SOUL<br/>QUEST
              </h3>
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#00ff88] to-transparent my-2" />
              <p className="font-['Rajdhani'] text-purple-300/80 text-xs uppercase tracking-widest">
                Book One: Discovery
              </p>
            </div>
          </div>
        </div>
        
        <h2 className="font-['Cinzel'] text-xl md:text-2xl text-white font-bold mb-2">
          Cosmic Soul Quest
        </h2>
        
        <p className="font-['Rajdhani'] text-sm text-zinc-300 leading-relaxed mb-4 max-w-sm mx-auto">
          A teenage boy discovers his soul is from another dimension. He's part of an ancient group of <span className="text-[#00ff88]">seven cosmic warriors</span> who must reunite.
        </p>
        
        {/* Pricing buttons */}
        <div className="grid grid-cols-3 gap-2 mb-4 pointer-events-auto">
          <button
            onClick={(e) => { e.stopPropagation(); playTapSound(); triggerHaptic('medium'); handleBookPurchase('book_digital', 'Digital Edition', '$14.99'); }}
            disabled={loadingProduct !== null}
            className="bg-[#0a0a2e]/80 border border-[#00ff88]/30 rounded-xl p-3 transition-all hover:scale-[1.03] active:scale-[0.97] hover:border-[#00ff88]/60 disabled:opacity-50 min-h-[88px]"
            style={{ transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1), border-color 200ms ease' }}
          >
            <span className="block text-lg mb-1">📱</span>
            <span className="block font-['Orbitron'] text-[#00ff88] text-sm font-bold">$14.99</span>
            <span className="block font-['Rajdhani'] text-zinc-400 text-xs">Digital</span>
            {loadingProduct === 'book_digital' && <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin mx-auto mt-1" />}
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); playTapSound(); triggerHaptic('medium'); handleBookPurchase('book_paperback', 'Paperback Edition', '$24.99'); }}
            disabled={loadingProduct !== null}
            className="bg-[#0a0a2e]/80 border border-purple-500/30 rounded-xl p-3 transition-all hover:scale-[1.03] active:scale-[0.97] hover:border-purple-500/60 disabled:opacity-50 min-h-[88px]"
            style={{ transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1), border-color 200ms ease' }}
          >
            <span className="block text-lg mb-1">📚</span>
            <span className="block font-['Orbitron'] text-purple-300 text-sm font-bold">$24.99</span>
            <span className="block font-['Rajdhani'] text-zinc-400 text-xs">Paperback</span>
            {loadingProduct === 'book_paperback' && <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin mx-auto mt-1" />}
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); playTapSound(); triggerHaptic('medium'); handleBookPurchase('book_collector', "Collector's Edition", '$39.99'); }}
            disabled={loadingProduct !== null}
            className="bg-gradient-to-br from-amber-900/40 to-[#0a0a2e]/80 border border-amber-500/40 rounded-xl p-3 transition-all hover:scale-[1.03] active:scale-[0.97] hover:border-amber-500/70 disabled:opacity-50 min-h-[88px]"
            style={{ transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1), border-color 200ms ease' }}
          >
            <span className="block text-lg mb-1">✨</span>
            <span className="block font-['Orbitron'] text-amber-300 text-sm font-bold">$39.99</span>
            <span className="block font-['Rajdhani'] text-zinc-400 text-xs">Collector's</span>
            {loadingProduct === 'book_collector' && <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin mx-auto mt-1" />}
          </button>
        </div>
        
        <div className="mt-2 animate-pulse">
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

// SLIDE 7: TOP SECRET Academy Teaser (Classified style)
const AcademySlide = ({ isActive }: { isActive: boolean }) => {
  const [revealed, setRevealed] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [glitchText, setGlitchText] = useState(false);
  
  useEffect(() => {
    if (isActive) {
      // Reveal sequence
      setTimeout(() => setRevealed(true), 300);
      setTimeout(() => setScanComplete(true), 1500);
      
      // Random glitch effect
      const glitchInterval = setInterval(() => {
        if (Math.random() > 0.7) {
          setGlitchText(true);
          setTimeout(() => setGlitchText(false), 150);
        }
      }, 2000);
      
      return () => clearInterval(glitchInterval);
    } else {
      setRevealed(false);
      setScanComplete(false);
    }
  }, [isActive]);
  
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center px-6 py-16 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
      {/* Dark classified background */}
      <div className="absolute inset-0 bg-[#030308]" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Scan line effect on reveal */}
      {revealed && !scanComplete && (
        <div 
          className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-500/60 to-transparent z-20"
          style={{ animation: 'scan-line-classified 1.2s linear' }}
        />
      )}
      
      <div className={`relative z-10 max-w-lg mx-auto text-center transition-all duration-1000 ${revealed ? 'opacity-100' : 'opacity-0'}`}>
        {/* TOP SECRET stamp */}
        <div className="mb-8 relative">
          <div 
            className={`inline-block px-6 py-3 border-4 border-red-600 bg-transparent rotate-[-3deg] transition-all duration-300 ${glitchText ? 'translate-x-1' : ''}`}
            style={{ 
              boxShadow: '0 0 20px rgba(255, 0, 0, 0.3)',
            }}
          >
            <span className="font-['Orbitron'] text-2xl md:text-3xl text-red-600 font-black tracking-[0.2em]">
              TOP SECRET
            </span>
          </div>
        </div>
        
        {/* Clearance Level */}
        <div className={`mb-6 transition-all duration-500 ${scanComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#0a0a1a] border border-amber-500/30 rounded">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span className="font-['Orbitron'] text-amber-500 text-xs tracking-[0.3em]">
              CLEARANCE LEVEL: COSMIC
            </span>
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          </div>
        </div>
        
        {/* Main text with redacted elements */}
        <div className={`space-y-4 mb-8 transition-all duration-700 delay-300 ${scanComplete ? 'opacity-100' : 'opacity-0'}`}>
          <p className={`font-['Rajdhani'] text-lg text-zinc-400 leading-relaxed ${glitchText ? 'translate-x-[-2px] text-red-400' : ''}`} style={{ transition: 'all 50ms' }}>
            There is more...
          </p>
          <p className="font-['Rajdhani'] text-base text-zinc-500">
            but you're <span className="bg-zinc-800 text-zinc-800 px-2 mx-1">not yet</span> ready.
          </p>
          <p className="font-['Rajdhani'] text-sm text-zinc-600">
            Only souls operating at the <span className="text-amber-400">highest frequency</span>
            <br />will receive the next transmission.
          </p>
        </div>
        
        {/* Classified Academy Name */}
        <div className={`mb-8 transition-all duration-700 delay-500 ${scanComplete ? 'opacity-100' : 'opacity-0'}`}>
          <div className="relative inline-block">
            {/* Redaction bars */}
            <div className="absolute -left-4 top-1/2 w-full h-4 bg-zinc-900 -rotate-1" />
            <div className="absolute -left-2 top-1/2 w-[110%] h-3 bg-zinc-800 rotate-1" />
            
            {/* Partially visible text */}
            <h2 
              className="font-['Cinzel'] text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300/50 via-yellow-200/50 to-amber-400/50 font-bold relative z-10"
              style={{ 
                textShadow: "0 0 30px rgba(255, 200, 0, 0.2)",
                filter: 'blur(1px)'
              }}
            >
              GALACTIC STAR CRYSTAL
              <br />
              ACADEMY
            </h2>
          </div>
        </div>
        
        {/* ACCESS RESTRICTED stamp */}
        <div className={`mb-6 transition-all duration-700 delay-700 ${scanComplete ? 'opacity-100' : 'opacity-0'}`}>
          <div 
            className="inline-block px-4 py-2 border-2 border-dashed border-red-900 rotate-[2deg]"
          >
            <span className="font-['Orbitron'] text-sm text-red-900 tracking-[0.15em]">
              ◈ ACCESS RESTRICTED ◈
            </span>
          </div>
        </div>
        
        {/* Coming soon message */}
        <div className={`transition-all duration-700 delay-900 ${scanComplete ? 'opacity-100' : 'opacity-0'}`}>
          <p className="font-['Rajdhani'] text-xs text-zinc-600 tracking-wider">
            Coming for the <span className="text-cyan-500">chosen few</span>
          </p>
          <div className="flex justify-center gap-2 mt-4 opacity-40">
            {["◆", "◇", "◆", "◇", "◆"].map((s, i) => (
              <span key={i} className="text-red-900 text-xs animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
                {s}
              </span>
            ))}
          </div>
        </div>
        
        {/* TAP TO CONTINUE */}
        <div className="mt-8 animate-pulse">
          <div className="inline-flex items-center gap-2 text-white/30 font-['Rajdhani'] text-sm">
            <span>TAP TO CONTINUE</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Classified CSS */}
      <style>{`
        @keyframes scan-line-classified {
          0% { top: 0; opacity: 0.8; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// SLIDE 8: Final CTA
const FinalCTASlide = ({ isActive, onCheckout }: { isActive: boolean; onCheckout: () => void }) => {
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
    <div className={`absolute inset-0 flex flex-col items-center justify-center px-6 py-16 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
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
        <button 
          onClick={(e) => {
            e.stopPropagation();
            playSuccessSound();
            triggerHaptic('success');
            onCheckout();
          }}
          className="w-full py-4 font-['Orbitron'] text-base font-bold text-white bg-gradient-to-r from-purple-600 via-[#00ff88]/70 to-cyan-500 rounded-xl transition-all uppercase tracking-wider flex items-center justify-center gap-2 pointer-events-auto hover:scale-[1.02] active:scale-[0.97] min-h-[56px]"
          style={{ 
            transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 200ms ease',
            boxShadow: '0 0 30px rgba(0, 255, 136, 0.3)'
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.boxShadow = '0 0 50px rgba(0, 255, 136, 0.5)';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.boxShadow = '0 0 30px rgba(0, 255, 136, 0.3)';
          }}
        >
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

// Screen corruption/glitch effects for "hacked" appearance
const ScreenCorruptionEffects = () => {
  const [glitchFrame, setGlitchFrame] = useState(0);
  const [showScanLine, setShowScanLine] = useState(false);
  const [staticIntensity, setStaticIntensity] = useState(0.3);
  const [screenFlicker, setScreenFlicker] = useState(false);
  const [chromaticAberration, setChromaticAberration] = useState(false);
  const [fullGlitch, setFullGlitch] = useState(false);
  const [glitchBars, setGlitchBars] = useState<{top: number; height: number}[]>([]);
  
  // Random glitch triggers
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.85) {
        setGlitchFrame(prev => (prev + 1) % 5);
        setTimeout(() => setGlitchFrame(0), 150);
      }
    }, 2000);
    
    const scanLineInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setShowScanLine(true);
        setTimeout(() => setShowScanLine(false), 800);
      }
    }, 4000);
    
    const staticInterval = setInterval(() => {
      setStaticIntensity(0.2 + Math.random() * 0.3);
    }, 100);
    
    // Screen flicker - quick flash effect
    const flickerInterval = setInterval(() => {
      if (Math.random() > 0.92) {
        setScreenFlicker(true);
        setTimeout(() => setScreenFlicker(false), 50);
        // Sometimes double flicker
        if (Math.random() > 0.5) {
          setTimeout(() => {
            setScreenFlicker(true);
            setTimeout(() => setScreenFlicker(false), 30);
          }, 100);
        }
      }
    }, 3000);
    
    // Chromatic aberration (RGB split) effect
    const chromaticInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        setChromaticAberration(true);
        setTimeout(() => setChromaticAberration(false), 200);
      }
    }, 5000);
    
    // Full screen glitch with horizontal displacement bars
    const fullGlitchInterval = setInterval(() => {
      if (Math.random() > 0.95) {
        // Generate random glitch bars
        const bars = Array.from({ length: Math.floor(Math.random() * 5) + 2 }, () => ({
          top: Math.random() * 100,
          height: Math.random() * 3 + 1
        }));
        setGlitchBars(bars);
        setFullGlitch(true);
        setTimeout(() => {
          setFullGlitch(false);
          setGlitchBars([]);
        }, 150);
      }
    }, 4000);
    
    return () => {
      clearInterval(glitchInterval);
      clearInterval(scanLineInterval);
      clearInterval(staticInterval);
      clearInterval(flickerInterval);
      clearInterval(chromaticInterval);
      clearInterval(fullGlitchInterval);
    };
  }, []);
  
  return (
    <>
      {/* Full screen flicker overlay */}
      {screenFlicker && (
        <div className="fixed inset-0 z-[80] pointer-events-none bg-white/15" />
      )}
      
      {/* Full screen glitch displacement effect */}
      {fullGlitch && (
        <div className="fixed inset-0 z-[75] pointer-events-none overflow-hidden">
          {glitchBars.map((bar, i) => (
            <div 
              key={i}
              className="absolute left-0 right-0 bg-gradient-to-r from-cyan-500/20 via-red-500/20 to-green-500/20"
              style={{
                top: `${bar.top}%`,
                height: `${bar.height}%`,
                transform: `translateX(${Math.random() > 0.5 ? '' : '-'}${Math.random() * 10 + 5}px)`,
              }}
            />
          ))}
        </div>
      )}
      
      {/* CRT scanlines overlay */}
      <div 
        className="fixed inset-0 z-[56] pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        }}
      />
      
      {/* Edge corruption effects - top */}
      <div className="fixed top-0 left-0 right-0 h-8 z-[60] pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-b from-[#00ff88]/10 to-transparent"
          style={{ 
            opacity: staticIntensity,
            animation: 'corruption-flicker 0.1s steps(2) infinite'
          }}
        />
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            opacity: staticIntensity * 0.4,
            mixBlendMode: 'overlay'
          }}
        />
      </div>
      
      {/* Edge corruption effects - bottom */}
      <div className="fixed bottom-0 left-0 right-0 h-8 z-[60] pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent"
          style={{ opacity: staticIntensity }}
        />
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            opacity: staticIntensity * 0.4,
            mixBlendMode: 'overlay'
          }}
        />
      </div>
      
      {/* Edge corruption effects - left */}
      <div className="fixed top-0 left-0 bottom-0 w-6 z-[60] pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent"
          style={{ opacity: staticIntensity }}
        />
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            opacity: staticIntensity * 0.5,
            mixBlendMode: 'overlay'
          }}
        />
      </div>
      
      {/* Edge corruption effects - right */}
      <div className="fixed top-0 right-0 bottom-0 w-6 z-[60] pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-l from-[#00ff88]/10 to-transparent"
          style={{ opacity: staticIntensity }}
        />
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            opacity: staticIntensity * 0.5,
            mixBlendMode: 'overlay'
          }}
        />
      </div>
      
      {/* Corner glitch blocks */}
      <div 
        className="fixed top-0 left-0 w-16 h-16 z-[60] pointer-events-none"
        style={{
          background: glitchFrame === 1 ? 'rgba(0, 255, 136, 0.2)' : 'transparent',
          transition: 'background 50ms'
        }}
      />
      <div 
        className="fixed top-0 right-0 w-12 h-20 z-[60] pointer-events-none"
        style={{
          background: glitchFrame === 2 ? 'rgba(255, 0, 100, 0.15)' : 'transparent',
          transition: 'background 50ms'
        }}
      />
      <div 
        className="fixed bottom-0 left-0 w-20 h-12 z-[60] pointer-events-none"
        style={{
          background: glitchFrame === 3 ? 'rgba(0, 200, 255, 0.15)' : 'transparent',
          transition: 'background 50ms'
        }}
      />
      <div 
        className="fixed bottom-0 right-0 w-14 h-14 z-[60] pointer-events-none"
        style={{
          background: glitchFrame === 4 ? 'rgba(150, 0, 255, 0.2)' : 'transparent',
          transition: 'background 50ms'
        }}
      />
      
      {/* Horizontal scan line */}
      {showScanLine && (
        <div 
          className="fixed left-0 right-0 h-1 z-[70] pointer-events-none bg-gradient-to-r from-transparent via-[#00ff88]/60 to-transparent"
          style={{ animation: 'scan-line-full 0.8s linear' }}
        />
      )}
      
      {/* Chromatic aberration / RGB split effect */}
      {chromaticAberration && (
        <>
          <div 
            className="fixed inset-0 z-[65] pointer-events-none mix-blend-screen"
            style={{
              background: 'radial-gradient(circle at 30% 50%, rgba(255,0,0,0.08) 0%, transparent 50%)',
              transform: 'translateX(-3px)'
            }}
          />
          <div 
            className="fixed inset-0 z-[65] pointer-events-none mix-blend-screen"
            style={{
              background: 'radial-gradient(circle at 70% 50%, rgba(0,0,255,0.08) 0%, transparent 50%)',
              transform: 'translateX(3px)'
            }}
          />
        </>
      )}
      
      {/* RGB split effect overlay (constant subtle) */}
      <div 
        className="fixed inset-0 z-[55] pointer-events-none"
        style={{
          opacity: glitchFrame > 0 ? 0.2 : 0,
          background: 'linear-gradient(90deg, rgba(255,0,0,0.1) 33%, rgba(0,255,0,0.1) 33% 66%, rgba(0,0,255,0.1) 66%)',
          transition: 'opacity 50ms'
        }}
      />
      
      {/* Vignette effect */}
      <div 
        className="fixed inset-0 z-[54] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)'
        }}
      />
      
      {/* Screen corruption CSS */}
      <style>{`
        @keyframes corruption-flicker {
          0%, 100% { opacity: 0.3; transform: translateX(0); }
          25% { opacity: 0.5; transform: translateX(1px); }
          50% { opacity: 0.2; transform: translateX(-1px); }
          75% { opacity: 0.4; transform: translateX(0.5px); }
        }
        
        @keyframes scan-line-full {
          0% { top: -2px; }
          100% { top: 100%; }
        }
        
        @keyframes screen-glitch {
          0%, 100% { transform: translate(0); filter: none; }
          10% { transform: translate(-2px, 1px); filter: hue-rotate(90deg); }
          20% { transform: translate(2px, -1px); filter: hue-rotate(-90deg); }
          30% { transform: translate(0); filter: none; }
        }
        
        @keyframes digital-noise {
          0%, 100% { background-position: 0 0; }
          10% { background-position: -5% -10%; }
          20% { background-position: -15% 5%; }
          30% { background-position: 7% -25%; }
          40% { background-position: -5% 25%; }
          50% { background-position: -15% 10%; }
          60% { background-position: 15% 0%; }
          70% { background-position: 0% 15%; }
          80% { background-position: 3% 35%; }
          90% { background-position: -10% 10%; }
        }
        
        @keyframes text-scramble {
          0%, 100% { 
            transform: translateX(0); 
            filter: none;
            opacity: 1;
          }
          25% { 
            transform: translateX(-2px) skewX(-2deg); 
            filter: hue-rotate(60deg) contrast(1.2);
            opacity: 0.8;
          }
          50% { 
            transform: translateX(2px) skewX(2deg); 
            filter: hue-rotate(-60deg) saturate(1.5);
            opacity: 0.9;
          }
          75% { 
            transform: translateX(-1px); 
            filter: brightness(1.3);
            opacity: 0.85;
          }
        }
        
        /* Apply glitch class to any element */
        .glitch-text {
          animation: text-scramble 0.15s ease-in-out;
        }
        
        /* Constant subtle RGB offset for high-tech feel */
        .chromatic-shift::before,
        .chromatic-shift::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .chromatic-shift::before {
          left: 1px;
          text-shadow: -1px 0 rgba(255, 0, 0, 0.5);
          clip: rect(24px, 550px, 90px, 0);
        }
        .chromatic-shift::after {
          left: -1px;
          text-shadow: 1px 0 rgba(0, 255, 255, 0.5);
          clip: rect(85px, 550px, 140px, 0);
        }
      `}</style>
    </>
  );
};

// Main App Component
const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [archetype, setArchetype] = useState("Cosmic Warrior");
  const [isAnimating, setIsAnimating] = useState(true);
  const [showHints, setShowHints] = useState(true);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutProductId, setCheckoutProductId] = useState("awakening_bundle");
  const [checkoutProduct, setCheckoutProduct] = useState({
    name: "Complete Awakening Bundle",
    price: "$197",
    description: "7-Book Series + Academy Access + Crystal Kit"
  });
  const [rubberBand, setRubberBand] = useState<'left' | 'right' | null>(null);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  
  const totalSlides = 11;
  const [soundMuted, setSoundMuted] = useState(false);
  const [ambientInitialized, setAmbientInitialized] = useState(false);
  
  // Initialize ambient sound on first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!ambientInitialized && !soundMuted) {
        startAmbientSound();
        setAmbientInitialized(true);
      }
      // Remove listeners after first interaction
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
    
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);
    
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [ambientInitialized, soundMuted]);
  
  // Cleanup ambient sound on unmount
  useEffect(() => {
    return () => {
      stopAmbientSound();
    };
  }, []);
  
  // Toggle sound mute (includes ambient sounds)
  const toggleMute = () => {
    const newMuted = !isMuted;
    isMuted = newMuted;
    setSoundMuted(newMuted);
    toggleAmbientMute(newMuted);
  };
  
  // Handler for opening checkout modal with specific product
  const handleOpenCheckout = (productId: string, product: { name: string; price: string; description: string }) => {
    setCheckoutProductId(productId);
    setCheckoutProduct(product);
    setCheckoutOpen(true);
  };
  
  const goToNextSlide = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      setSlideDirection('right');
      setIsAnimating(false);
      playWhooshSound();
      setCurrentSlide(prev => prev + 1);
      setTimeout(() => setIsAnimating(true), 100);
    } else {
      // Rubber band effect at the end
      setRubberBand('right');
      triggerHaptic('light');
      setTimeout(() => setRubberBand(null), 400);
    }
  }, [currentSlide]);
  
  const goToPrevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setSlideDirection('left');
      setIsAnimating(false);
      playWhooshSound();
      setCurrentSlide(prev => prev - 1);
      setTimeout(() => setIsAnimating(true), 100);
    } else {
      // Rubber band effect at the start
      setRubberBand('left');
      triggerHaptic('light');
      setTimeout(() => setRubberBand(null), 400);
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
  
  // Mobile content with rubber band physics
  const MobileContent = () => (
    <div 
      className="relative w-full h-screen bg-[#050510] overflow-hidden"
      style={{
        animation: rubberBand 
          ? rubberBand === 'left' 
            ? 'rubber-band-left 400ms cubic-bezier(0.34, 1.56, 0.64, 1)' 
            : 'rubber-band-right 400ms cubic-bezier(0.34, 1.56, 0.64, 1)'
          : 'none'
      }}
    >
      <MatrixRain />
      
      {/* Progress bars */}
      <ProgressBars currentSlide={currentSlide} totalSlides={totalSlides} isAnimating={isAnimating} />
      
      {/* Tap zones - disable for quiz and phone message slide */}
      {currentSlide !== 8 && currentSlide !== 2 && (
        <TapZones onPrev={goToPrevSlide} onNext={goToNextSlide} showHints={showHints} />
      )}
      
      {/* Mute button */}
      <button
        onClick={toggleMute}
        className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-[#0a0a2e]/80 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-[#0a0a2e] transition-all"
      >
        {soundMuted ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>
      
      {/* Slides - reordered: Hero, Divine, Phone, Wisdom x3, Book, Academy, Quiz, Archetype, Final */}
      <HeroSlide isActive={currentSlide === 0} />
      <DivineMessageSlide isActive={currentSlide === 1} />
      <PhoneMessageSlide isActive={currentSlide === 2} onAdvance={goToNextSlide} />
      <WisdomSlide1 isActive={currentSlide === 3} />
      <WisdomSlide2 isActive={currentSlide === 4} />
      <WisdomSlide3 isActive={currentSlide === 5} />
      <BookRevealSlide isActive={currentSlide === 6} onBookCheckout={handleOpenCheckout} />
      <AcademySlide isActive={currentSlide === 7} />
      <SoulQuizSlide isActive={currentSlide === 8} onComplete={handleArchetypeComplete} />
      <ArchetypeRevealSlide isActive={currentSlide === 9} archetype={archetype} />
      <FinalCTASlide isActive={currentSlide === 10} onCheckout={() => handleOpenCheckout("awakening_bundle", {
        name: "Complete Awakening Bundle",
        price: "$197",
        description: "7-Book Series + Academy Access + Crystal Kit"
      })} />
      
      {/* Global animations with physics-based effects */}
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
        @keyframes ripple {
          0% { transform: scale(0); opacity: 0.5; }
          100% { transform: scale(4); opacity: 0; }
        }
        @keyframes ripple-expand {
          0% { transform: scale(0); opacity: 0.6; }
          70% { opacity: 0.3; }
          100% { transform: scale(4); opacity: 0; }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 136, 0.3); }
          50% { box-shadow: 0 0 40px rgba(0, 255, 136, 0.5); }
        }
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes tap-feedback {
          0% { transform: scale(1); }
          50% { transform: scale(0.97); }
          100% { transform: scale(1); }
        }
        @keyframes glow-pulse {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(0, 255, 136, 0.4)); }
          50% { filter: drop-shadow(0 0 16px rgba(0, 255, 136, 0.7)); }
        }
        @keyframes message-slide-bounce {
          0% { opacity: 0; transform: translateY(20px) scale(0.95); }
          60% { transform: translateY(-3px) scale(1.01); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        /* Enhanced breathing animation with subtle expansion */
        @keyframes breathing {
          0%, 100% { 
            transform: scale(1); 
            filter: drop-shadow(0 0 15px rgba(0, 255, 136, 0.3));
          }
          50% { 
            transform: scale(1.035); 
            filter: drop-shadow(0 0 25px rgba(0, 255, 136, 0.5));
          }
        }
        
        /* Physics-based floating orb animation with varied speeds */
        @keyframes float-orb-slow {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(10px, -15px); }
          50% { transform: translate(-5px, -8px); }
          75% { transform: translate(-15px, -5px); }
        }
        
        /* New parallax float animation for background elements */
        @keyframes parallax-float {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          25% { transform: translate3d(15px, -20px, 0) scale(1.02); }
          50% { transform: translate3d(-8px, -35px, 0) scale(1); }
          75% { transform: translate3d(-20px, -15px, 0) scale(0.98); }
        }
        
        /* Subtle depth-based parallax for layered backgrounds */
        @keyframes parallax-layer-1 {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(5px, -8px, 0); }
        }
        @keyframes parallax-layer-2 {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(-8px, -12px, 0); }
        }
        @keyframes parallax-layer-3 {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(12px, -18px, 0); }
        }
        
        @keyframes pulse-border {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes aura-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        
        /* Physics-based spring animation for slide transitions */
        @keyframes slide-in-spring {
          0% { 
            opacity: 0; 
            transform: translateX(100%) scale(0.95); 
          }
          60% { 
            transform: translateX(-2%) scale(1.01); 
          }
          80% { 
            transform: translateX(1%) scale(0.995); 
          }
          100% { 
            opacity: 1; 
            transform: translateX(0) scale(1); 
          }
        }
        
        @keyframes slide-out-spring {
          0% { 
            opacity: 1; 
            transform: translateX(0) scale(1); 
          }
          40% { 
            transform: translateX(2%) scale(0.995); 
          }
          100% { 
            opacity: 0; 
            transform: translateX(-100%) scale(0.95); 
          }
        }
        
        /* Rubber band effect for boundary interactions */
        @keyframes rubber-band {
          0% { transform: scale(1); }
          30% { transform: scale(1.05, 0.95); }
          40% { transform: scale(0.95, 1.05); }
          50% { transform: scale(1.02, 0.98); }
          65% { transform: scale(0.98, 1.02); }
          75% { transform: scale(1.01, 0.99); }
          100% { transform: scale(1); }
        }
        
        /* Rubber band for left/right boundary hit */
        @keyframes rubber-band-left {
          0% { transform: translateX(0); }
          25% { transform: translateX(25px); }
          50% { transform: translateX(-8px); }
          75% { transform: translateX(3px); }
          100% { transform: translateX(0); }
        }
        @keyframes rubber-band-right {
          0% { transform: translateX(0); }
          25% { transform: translateX(-25px); }
          50% { transform: translateX(8px); }
          75% { transform: translateX(-3px); }
          100% { transform: translateX(0); }
        }
        
        /* Enhanced hover lift effect with shadow */
        @keyframes lift-hover {
          from {
            transform: translateY(0) scale(1);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
          to {
            transform: translateY(-4px) scale(1.01);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25), 0 0 15px rgba(0, 255, 136, 0.15);
          }
        }
        
        /* Expo easing curves for physics-based feel */
        .ease-out-expo {
          transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
        }
        .ease-in-out-expo {
          transition-timing-function: cubic-bezier(0.87, 0, 0.13, 1);
        }
        .ease-out-back {
          transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .ease-spring {
          transition-timing-function: cubic-bezier(0.5, 1.8, 0.3, 1);
        }
        
        /* Physics-based button interactions */
        .physics-button {
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .physics-button:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 255, 136, 0.2);
        }
        .physics-button:active {
          transform: translateY(1px) scale(0.98);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          transition-duration: 0.1s;
        }
        
        /* Interactive card with lift effect */
        .card-lift {
          transition: all 0.35s cubic-bezier(0.19, 1, 0.22, 1);
        }
        .card-lift:hover {
          transform: translateY(-6px) scale(1.01);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25), 0 0 30px rgba(0, 255, 136, 0.1);
        }
        
        /* Touch target optimization for mobile */
        button, a, [role="button"] {
          min-height: 44px;
          min-width: 44px;
        }
        
        /* Touch active state - instant feedback */
        .touch-active {
          transform: scale(0.97);
          opacity: 0.9;
        }
        
        /* Disable tap highlight on mobile */
        * {
          -webkit-tap-highlight-color: transparent;
        }
        
        /* Better scrolling momentum on mobile */
        .scroll-momentum {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }
        
        /* Fast touch response */
        button, a, [role="button"], .interactive {
          touch-action: manipulation;
        }
        
        /* Smooth transition for all animated elements */
        .animate-physics {
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
  
  return (
    <>
      {/* Full screen takeover - no phone frame, feels like browser is hacked */}
      <MobileContent />
      
      {/* Screen corruption effects - makes it look like the screen is being hacked */}
      <ScreenCorruptionEffects />
      
      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={checkoutOpen} 
        onClose={() => setCheckoutOpen(false)} 
        productId={checkoutProductId}
        product={checkoutProduct}
      />
    </>
  );
};

export default Index;
