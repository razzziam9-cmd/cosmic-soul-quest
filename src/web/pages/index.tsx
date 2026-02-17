import { useState, useEffect, useRef, useCallback } from "react";

// Audio context for subtle sound effects
let audioContext: AudioContext | null = null;

const playTapSound = () => {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  } catch {
    // Audio not supported, fail silently
  }
};

const playSuccessSound = () => {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch {
    // Audio not supported, fail silently
  }
};

// iMessage-like notification sound (subtle pop)
const playMessageSound = () => {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Short pop sound like iMessage
    oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.05);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.04, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.08);
  } catch {
    // Audio not supported, fail silently
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

// Enhanced iMessage notification sound with realistic tone
const playMessageReceivedSound = () => {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    
    const now = audioContext.currentTime;
    
    // Two-tone iMessage style notification
    const osc1 = audioContext.createOscillator();
    const osc2 = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(audioContext.destination);
    
    // First higher tone
    osc1.frequency.setValueAtTime(1318, now); // E6
    osc1.type = 'sine';
    
    // Second lower tone (slightly delayed)  
    osc2.frequency.setValueAtTime(1046, now + 0.06); // C6
    osc2.type = 'sine';
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.07, now + 0.01);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    
    osc1.start(now);
    osc1.stop(now + 0.12);
    osc2.start(now + 0.06);
    osc2.stop(now + 0.2);
  } catch {
    // Silently fail
  }
};

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
  const [currentTime, setCurrentTime] = useState('3:33');
  const [newMessageIndex, setNewMessageIndex] = useState(-1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isTyping]);
  
  // Complete message sequence from the divine messenger - no interruptions
  const allMessages: Array<{ 
    text: string; 
    typingDuration: number; 
    pauseBefore: number; 
    time: string; 
    showTimestamp?: boolean 
  }> = [
    { text: "📡 Incoming transmission...", typingDuration: 2200, pauseBefore: 1000, time: '3:33', showTimestamp: true },
    { text: "I've been waiting for you", typingDuration: 2800, pauseBefore: 1400, time: '3:33' },
    { text: "⚡ Your frequency detected...", typingDuration: 2400, pauseBefore: 1600, time: '3:34', showTimestamp: true },
    { text: "🔮 Initiating soul scan...", typingDuration: 2000, pauseBefore: 1200, time: '3:34' },
    { text: "Analyzing cosmic signature...", typingDuration: 3200, pauseBefore: 2000, time: '3:35', showTimestamp: true },
    { text: "✨ MATCH FOUND", typingDuration: 1400, pauseBefore: 2800, time: '3:35' },
    { text: "You carry the mark of the seven.", typingDuration: 2600, pauseBefore: 800, time: '3:36' },
    { text: "Your soul is ancient. It remembers what your mind has forgotten.", typingDuration: 4200, pauseBefore: 1400, time: '3:36', showTimestamp: true },
    { text: "The prophecy speaks of warriors who will reunite across dimensions to restore Earth's frequency.", typingDuration: 5000, pauseBefore: 1800, time: '3:37' },
    { text: "You are one of them.", typingDuration: 1800, pauseBefore: 2200, time: '3:37', showTimestamp: true },
    { text: "It's time to remember who you truly are. ✨🔮", typingDuration: 3400, pauseBefore: 1600, time: '3:38' },
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
    setCurrentTime('3:33');
    
    const timeouts: NodeJS.Timeout[] = [];
    const timings = getMessageTimings(allMessages);
    
    timings.forEach((msg, index) => {
      // Start typing indicator
      timeouts.push(setTimeout(() => {
        setIsTyping(true);
        setCurrentTime(msg.time);
      }, msg.startTyping));
      
      // Show message after typing
      timeouts.push(setTimeout(() => {
        setIsTyping(false);
        playMessageReceivedSound();
        triggerHaptic('light');
        setNewMessageIndex(index);
        setMessages(prev => [...prev, { 
          text: msg.text, 
          type: 'incoming',
          delivered: true,
          time: msg.time,
          showTimestamp: msg.showTimestamp
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
      setCurrentTime('3:33');
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
        @keyframes typing-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-5px); opacity: 1; }
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
        @keyframes reply-btn-pulse {
          0%, 100% { 
            box-shadow: 0 0 18px rgba(10, 132, 255, 0.45), 0 0 35px rgba(10, 132, 255, 0.25);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 28px rgba(10, 132, 255, 0.65), 0 0 55px rgba(10, 132, 255, 0.35);
            transform: scale(1.012);
          }
        }
      `}</style>
      
      {/* iPhone-style status bar */}
      <div className="bg-[#000000] pt-2 pb-1 px-6 flex justify-between items-center text-white text-xs">
        <span className="font-semibold tabular-nums">{currentTime}</span>
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
              <div className="absolute inset-0.5 bg-[#32d74b] rounded-[1px]" style={{ width: '82%' }} />
            </div>
          </div>
        </div>
      </div>
      
      {/* iMessage header */}
      <div className="bg-[#1c1c1e] px-4 py-3 flex items-center border-b border-gray-700/50">
        <button className="text-[#007aff] text-sm mr-3 min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#00ff88]/50 flex-shrink-0">
            <img 
              src="./cloaked-messenger-portrait-KakJfYU78kjRavrkE3GIf.png" 
              alt="Contact" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center">
            <p className="text-white font-semibold text-[17px]">Unknown</p>
            <p className="text-[#8e8e93] text-[12px]">Maybe: Divine Messenger</p>
          </div>
        </div>
        <button className="text-[#007aff] min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
      
      {/* Messages area */}
      <div className="flex-1 bg-[#000000] px-4 py-4 overflow-y-auto scroll-momentum">
        <div className="max-w-lg mx-auto">
          {/* Date header */}
          <div className="text-center mb-4">
            <span className="text-[#8e8e93] text-[11px] bg-[#2c2c2e]/60 px-3 py-1 rounded-full">Today 3:33 AM</span>
          </div>
          
          {messages.map((msg, i) => (
            <div key={i}>
              {/* Timestamp between messages - realistic time progression */}
              {msg.showTimestamp && i > 0 && (
                <div className="text-center my-3">
                  <span className="text-[#636366] text-[11px]">{msg.time} AM</span>
                </div>
              )}
              
              <MessageBubbleEnhanced 
                msg={msg} 
                isNew={i === newMessageIndex}
                showDelivered={msg.type === 'sent'}
              />
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && <RealisticTypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Bottom area - shows awakening button when messages complete */}
      <div className="bg-[#1c1c1e] px-4 py-4 border-t border-[#38383a]/50">
        {showAwakeningButton ? (
          <button 
            onClick={() => {
              playTapSound();
              handleStartAwakening();
            }}
            className="w-full max-w-lg mx-auto block text-white py-4 rounded-full font-bold text-[18px] tracking-wide transition-all hover:scale-[1.03] active:scale-[0.96] min-h-[56px] relative overflow-hidden"
            style={{ 
              background: 'linear-gradient(135deg, #6b21a8 0%, #00ff88 50%, #0ea5e9 100%)',
              backgroundSize: '200% 200%',
              animation: 'awakening-btn-glow 2.5s ease-in-out infinite, awakening-gradient-shift 3s ease-in-out infinite',
              boxShadow: '0 0 30px rgba(0, 255, 136, 0.5), 0 0 60px rgba(0, 255, 136, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
              textShadow: '0 0 10px rgba(255,255,255,0.5)',
              transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <span>✨</span>
              <span>START YOUR AWAKENING</span>
              <span>✨</span>
            </span>
          </button>
        ) : (
          <div className="flex items-center gap-3 max-w-lg mx-auto">
            <button className="text-[#007aff] min-w-[44px] min-h-[44px] flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <div className="flex-1 bg-[#3a3a3c] rounded-full px-4 py-2.5">
              <span className="text-[#8e8e93] text-[15px]">iMessage</span>
            </div>
            <button className="text-[#007aff] min-w-[44px] min-h-[44px] flex items-center justify-center">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {/* CSS for awakening button animations */}
      <style>{`
        @keyframes awakening-btn-glow {
          0%, 100% { 
            box-shadow: 0 0 30px rgba(0, 255, 136, 0.5), 0 0 60px rgba(0, 255, 136, 0.3), inset 0 1px 0 rgba(255,255,255,0.2);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 50px rgba(0, 255, 136, 0.7), 0 0 100px rgba(0, 255, 136, 0.4), 0 0 150px rgba(107, 33, 168, 0.3), inset 0 1px 0 rgba(255,255,255,0.3);
            transform: scale(1.02);
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
    playTapSound();
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

// SLIDE 7: Academy with Stripe Subscription Buttons
const AcademySlide = ({ isActive, onAcademyCheckout }: { isActive: boolean; onAcademyCheckout: (productId: string, product: {name: string; price: string; description: string}) => void }) => {
  const [loadingProduct, setLoadingProduct] = useState<string | null>(null);
  
  const handleAcademySubscribe = async (productId: string, name: string, price: string) => {
    setLoadingProduct(productId);
    const checkoutUrl = await initiateCheckout(productId);
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    } else {
      setLoadingProduct(null);
      // Fallback to modal
      onAcademyCheckout(productId, { name, price, description: "Monthly subscription to Galactic Star Crystal Academy" });
    }
  };
  
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center px-6 py-16 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
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
        <h2 className="font-['Cinzel'] text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 font-bold mb-3"
          style={{ textShadow: "0 0 40px rgba(255, 200, 0, 0.3)" }}
        >
          GALACTIC STAR CRYSTAL<br/>ACADEMY
        </h2>
        
        <p className="font-['Rajdhani'] text-sm text-zinc-300 mb-4">
          Advanced training for awakened souls. Learn the <span className="text-amber-300">seven secret steps</span> to remember who you truly are.
        </p>
        
        {/* Pricing tiers */}
        <div className="grid grid-cols-3 gap-2 mb-4 pointer-events-auto">
          {/* Initiate */}
          <button
            onClick={(e) => { e.stopPropagation(); playTapSound(); triggerHaptic('medium'); handleAcademySubscribe('academy_initiate', 'Initiate Path', '$47/mo'); }}
            disabled={loadingProduct !== null}
            className="bg-[#0a0a2e]/80 border border-purple-500/30 rounded-xl p-3 transition-all hover:scale-[1.03] active:scale-[0.97] hover:border-purple-500/60 disabled:opacity-50 min-h-[100px]"
            style={{ transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1), border-color 200ms ease' }}
          >
            <span className="block text-lg mb-1">🌟</span>
            <span className="block font-['Orbitron'] text-purple-300 text-xs font-bold">$47</span>
            <span className="block font-['Rajdhani'] text-zinc-500 text-[10px]">/month</span>
            <span className="block font-['Rajdhani'] text-zinc-400 text-xs mt-1">Initiate</span>
            {loadingProduct === 'academy_initiate' && <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin mx-auto mt-1" />}
          </button>
          
          {/* Warrior - Featured */}
          <button
            onClick={(e) => { e.stopPropagation(); playTapSound(); triggerHaptic('medium'); handleAcademySubscribe('academy_warrior', 'Warrior Path', '$97/mo'); }}
            disabled={loadingProduct !== null}
            className="bg-gradient-to-br from-purple-900/60 via-[#0a0a2e] to-cyan-900/40 border-2 border-[#00ff88]/50 rounded-xl p-3 transition-all hover:scale-[1.03] active:scale-[0.97] hover:border-[#00ff88]/70 disabled:opacity-50 relative min-h-[100px]"
            style={{ transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1), border-color 200ms ease' }}
          >
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#00ff88] text-black text-[8px] font-['Orbitron'] px-2 py-0.5 rounded-full">POPULAR</span>
            <span className="block text-lg mb-1">⚔️</span>
            <span className="block font-['Orbitron'] text-[#00ff88] text-xs font-bold">$97</span>
            <span className="block font-['Rajdhani'] text-zinc-500 text-[10px]">/month</span>
            <span className="block font-['Rajdhani'] text-zinc-400 text-xs mt-1">Warrior</span>
            {loadingProduct === 'academy_warrior' && <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin mx-auto mt-1" />}
          </button>
          
          {/* Master */}
          <button
            onClick={(e) => { e.stopPropagation(); playTapSound(); triggerHaptic('medium'); handleAcademySubscribe('academy_master', 'Master Path', '$197/mo'); }}
            disabled={loadingProduct !== null}
            className="bg-gradient-to-br from-amber-900/40 to-[#0a0a2e]/80 border border-amber-500/40 rounded-xl p-3 transition-all hover:scale-[1.03] active:scale-[0.97] hover:border-amber-500/70 disabled:opacity-50 min-h-[100px]"
            style={{ transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1), border-color 200ms ease' }}
          >
            <span className="block text-lg mb-1">👁️</span>
            <span className="block font-['Orbitron'] text-amber-300 text-xs font-bold">$197</span>
            <span className="block font-['Rajdhani'] text-zinc-500 text-[10px]">/month</span>
            <span className="block font-['Rajdhani'] text-zinc-400 text-xs mt-1">Master</span>
            {loadingProduct === 'academy_master' && <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin mx-auto mt-1" />}
          </button>
        </div>
        
        {/* Features summary */}
        <div className="bg-[#0a0a1f]/60 border border-purple-500/20 rounded-xl p-3 mb-4">
          <p className="font-['Rajdhani'] text-xs text-zinc-400">
            <span className="text-[#00ff88]">✦</span> Advanced frequency training • <span className="text-[#00ff88]">✦</span> 1-on-1 guidance • <span className="text-[#00ff88]">✦</span> Crystal activation
          </p>
        </div>
        
        <div className="flex justify-center gap-4 opacity-50 mb-4">
          {["☉", "☽", "✧", "◈", "✧", "☽", "☉"].map((symbol, i) => (
            <span 
              key={i}
              className="text-amber-400 text-sm animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              {symbol}
            </span>
          ))}
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
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutProductId, setCheckoutProductId] = useState("awakening_bundle");
  const [checkoutProduct, setCheckoutProduct] = useState({
    name: "Complete Awakening Bundle",
    price: "$197",
    description: "7-Book Series + Academy Access + Crystal Kit"
  });
  const [rubberBand, setRubberBand] = useState<'left' | 'right' | null>(null);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  
  const totalSlides = 8;
  
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
      {currentSlide !== 3 && currentSlide !== 2 && (
        <TapZones onPrev={goToPrevSlide} onNext={goToNextSlide} showHints={showHints} />
      )}
      
      {/* Slides */}
      <HeroSlide isActive={currentSlide === 0} />
      <DivineMessageSlide isActive={currentSlide === 1} />
      <PhoneMessageSlide isActive={currentSlide === 2} onAdvance={goToNextSlide} />
      <SoulQuizSlide isActive={currentSlide === 3} onComplete={handleArchetypeComplete} />
      <ArchetypeRevealSlide isActive={currentSlide === 4} archetype={archetype} />
      <BookRevealSlide isActive={currentSlide === 5} onBookCheckout={handleOpenCheckout} />
      <AcademySlide isActive={currentSlide === 6} onAcademyCheckout={handleOpenCheckout} />
      <FinalCTASlide isActive={currentSlide === 7} onCheckout={() => handleOpenCheckout("awakening_bundle", {
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
      {/* Mobile view - fullscreen */}
      <div className="lg:hidden">
        <MobileContent />
      </div>
      
      {/* Desktop view - phone frame */}
      <PhoneFrame>
        <MobileContent />
      </PhoneFrame>
      
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
