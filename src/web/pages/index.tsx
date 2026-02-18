import { useState, useEffect, useRef, useCallback } from "react";

// ===========================================
// AUDIO SYSTEM
// ===========================================
let audioContext: AudioContext | null = null;
let isMuted = false;
let ambientStarted = false;

interface AmbientNodes {
  whiteNoise: AudioBufferSourceNode | null;
  lowHum: OscillatorNode | null;
  masterGain: GainNode | null;
}

let ambientNodes: AmbientNodes = {
  whiteNoise: null,
  lowHum: null,
  masterGain: null,
};

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
};

// Glitch/static burst sound - DISABLED (keeping ambient sounds only)
const playGlitchSound = () => {
  // Sound removed per user request - text appearing should be silent
};



// Transition whoosh - DISABLED (keeping ambient sounds only)
const playTransitionSound = () => {
  // Sound removed per user request - keeping only ambient background sounds
};

// Selection confirmation - DISABLED (keeping ambient sounds only)
const playSelectSound = () => {
  // Sound removed per user request - keeping only ambient background sounds
};

// Create noise buffer
const createNoiseBuffer = (ctx: AudioContext, duration: number) => {
  const sampleRate = ctx.sampleRate;
  const buffer = ctx.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
};

// Start ambient sounds (static + electronic hum only)
const startAmbientSound = () => {
  if (ambientStarted || isMuted) return;
  
  try {
    const ctx = getAudioContext();
    
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.12, ctx.currentTime);
    masterGain.connect(ctx.destination);
    ambientNodes.masterGain = masterGain;
    
    // Static/white noise
    const noiseBuffer = createNoiseBuffer(ctx, 2);
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;
    
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.06, ctx.currentTime);
    
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(3000, ctx.currentTime);
    
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);
    noiseSource.start();
    ambientNodes.whiteNoise = noiseSource;
    
    // Low electronic hum (60hz)
    const lowHum = ctx.createOscillator();
    lowHum.type = 'sine';
    lowHum.frequency.setValueAtTime(60, ctx.currentTime);
    
    const humGain = ctx.createGain();
    humGain.gain.setValueAtTime(0.03, ctx.currentTime);
    
    lowHum.connect(humGain);
    humGain.connect(masterGain);
    lowHum.start();
    ambientNodes.lowHum = lowHum;
    
    // Note: Random glitch bursts removed - keeping only continuous ambient sounds
    
    ambientStarted = true;
  } catch {}
};

const stopAmbientSound = () => {
  if (!ambientStarted) return;
  try {
    ambientNodes.whiteNoise?.stop();
    ambientNodes.lowHum?.stop();
    ambientNodes = { whiteNoise: null, lowHum: null, masterGain: null };
    ambientStarted = false;
  } catch {}
};

// Haptic feedback
const triggerHaptic = (intensity: 'light' | 'medium' | 'heavy' = 'light') => {
  if ('vibrate' in navigator) {
    const patterns: Record<string, number> = { light: 8, medium: 20, heavy: 40 };
    navigator.vibrate(patterns[intensity]);
  }
};

// ===========================================
// CHECKOUT SYSTEM
// ===========================================
const initiateCheckout = async (productId: string): Promise<string | null> => {
  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
    const data = await response.json();
    return data.url || null;
  } catch {
    return null;
  }
};

// ===========================================
// VISUAL EFFECTS COMPONENTS
// ===========================================

// CRT Scan lines overlay
const ScanLines = () => (
  <div 
    className="fixed inset-0 pointer-events-none z-50"
    style={{
      background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
      mixBlendMode: 'multiply'
    }}
  />
);

// Screen flicker effect
const ScreenFlicker = () => {
  const [flicker, setFlicker] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.97) {
        setFlicker(true);
        setTimeout(() => setFlicker(false), 50 + Math.random() * 100);
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div 
      className={`fixed inset-0 pointer-events-none z-40 transition-opacity duration-50 ${flicker ? 'opacity-100' : 'opacity-0'}`}
      style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
    />
  );
};

// Static noise corners
const StaticCorners = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw static noise in corners
      const drawNoise = (x: number, y: number, w: number, h: number, intensity: number) => {
        const imageData = ctx.createImageData(w, h);
        for (let i = 0; i < imageData.data.length; i += 4) {
          const val = Math.random() * 255 * intensity;
          imageData.data[i] = val * 0.3;     // R - slight green tint
          imageData.data[i + 1] = val;        // G
          imageData.data[i + 2] = val * 0.8;  // B - slight cyan
          imageData.data[i + 3] = Math.random() * 40;
        }
        ctx.putImageData(imageData, x, y);
      };
      
      const intensity = 0.3 + Math.random() * 0.2;
      drawNoise(0, 0, 80, 80, intensity);
      drawNoise(canvas.width - 80, 0, 80, 80, intensity);
      drawNoise(0, canvas.height - 80, 80, 80, intensity);
      drawNoise(canvas.width - 80, canvas.height - 80, 80, 80, intensity);
    };
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resize();
    window.addEventListener('resize', resize);
    const interval = setInterval(draw, 100);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-30 opacity-60" />;
};

// Terminal cursor blink
const TerminalCursor = ({ active = true }: { active?: boolean }) => (
  <span 
    className={`inline-block w-2.5 h-5 bg-[#00ff41] ml-0.5 align-middle ${active ? 'animate-[blink_1s_step-end_infinite]' : 'opacity-0'}`}
  />
);

// Typewriter text with realistic typing
const TypewriterText = ({ 
  text, 
  delay = 0, 
  speed = 50, 
  onComplete,
  showCursor = false,
  className = ""
}: { 
  text: string; 
  delay?: number; 
  speed?: number; 
  onComplete?: () => void;
  showCursor?: boolean;
  className?: string;
}) => {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [started, setStarted] = useState(false);
  
  useEffect(() => {
    const startTimeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);
  
  useEffect(() => {
    if (!started) return;
    
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        onComplete?.();
      }
    }, speed + Math.random() * 30);
    
    return () => clearInterval(interval);
  }, [started, text, speed, onComplete]);
  
  return (
    <span className={className}>
      {displayText}
      {showCursor && <TerminalCursor active={!isComplete} />}
    </span>
  );
};

// Glitching text effect
const GlitchText = ({ children, className = "" }: { children: string; className?: string }) => {
  const [glitched, setGlitched] = useState(false);
  const [glitchText, setGlitchText] = useState(children);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        setGlitched(true);
        const chars = "!@#$%^&*()_+-=[]{}|;:',.<>?/~`αβγδεζηθικλμνξοπρστυφχψω";
        const glitchedVersion = children.split('').map(c => 
          Math.random() > 0.7 ? chars[Math.floor(Math.random() * chars.length)] : c
        ).join('');
        setGlitchText(glitchedVersion);
        
        setTimeout(() => {
          setGlitched(false);
          setGlitchText(children);
        }, 100 + Math.random() * 150);
      }
    }, 300);
    
    return () => clearInterval(interval);
  }, [children]);
  
  return (
    <span className={`${className} ${glitched ? 'text-[#ff0040]' : ''}`}>
      {glitched ? glitchText : children}
    </span>
  );
};

// Tap zones
const TapZones = ({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) => {
  const [leftTap, setLeftTap] = useState(false);
  const [rightTap, setRightTap] = useState(false);
  
  const handleLeft = () => {
    setLeftTap(true);
    triggerHaptic('light');
    playTransitionSound();
    onPrev();
    setTimeout(() => setLeftTap(false), 150);
  };
  
  const handleRight = () => {
    setRightTap(true);
    triggerHaptic('light');
    playTransitionSound();
    onNext();
    setTimeout(() => setRightTap(false), 150);
  };
  
  return (
    <>
      <div 
        className="fixed left-0 top-0 w-1/3 h-full z-40 cursor-pointer"
        onClick={handleLeft}
      >
        <div className={`absolute inset-0 bg-[#00ff41]/5 transition-opacity ${leftTap ? 'opacity-100' : 'opacity-0'}`} />
      </div>
      <div 
        className="fixed right-0 top-0 w-2/3 h-full z-40 cursor-pointer"
        onClick={handleRight}
      >
        <div className={`absolute inset-0 bg-[#00ff41]/5 transition-opacity ${rightTap ? 'opacity-100' : 'opacity-0'}`} />
      </div>
    </>
  );
};

// Dramatic CTA Button with bold challenge styling
const DramaticCTA = ({ 
  text, 
  onClick, 
  delay = 0,
  variant = 'primary'
}: { 
  text: string; 
  onClick?: () => void;
  delay?: number;
  variant?: 'primary' | 'secondary';
}) => {
  const [visible, setVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  const handleClick = () => {
    if (!onClick) return;
    setIsPressed(true);
    playSelectSound();
    triggerHaptic('medium');
    setTimeout(() => {
      setIsPressed(false);
      onClick();
    }, 150);
  };
  
  const isPrimary = variant === 'primary';
  
  return (
    <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <button
        onClick={handleClick}
        className={`
          relative overflow-hidden font-mono text-sm md:text-base tracking-wider
          px-8 py-4 border-2 transition-all duration-200
          ${isPrimary 
            ? 'bg-[#ff0040]/20 border-[#ff0040] text-[#ff0040] hover:bg-[#ff0040]/40 hover:text-white hover:shadow-[0_0_30px_rgba(255,0,64,0.5)]' 
            : 'bg-[#00ff41]/10 border-[#00ff41]/60 text-[#00ff41] hover:bg-[#00ff41]/20 hover:border-[#00ff41] hover:shadow-[0_0_20px_rgba(0,255,65,0.3)]'
          }
          ${isPressed ? 'scale-95' : 'scale-100'}
          animate-[dramaticPulse_2s_ease-in-out_infinite]
        `}
        style={{
          textShadow: isPrimary ? '0 0 10px rgba(255,0,64,0.8)' : '0 0 10px rgba(0,255,65,0.5)',
        }}
      >
        {/* Glowing border effect */}
        <div className={`absolute inset-0 ${isPrimary ? 'bg-[#ff0040]' : 'bg-[#00ff41]'} opacity-20 blur-xl`} />
        
        {/* Scanning line effect */}
        <div 
          className={`absolute inset-0 ${isPrimary ? 'bg-gradient-to-r from-transparent via-[#ff0040]/30 to-transparent' : 'bg-gradient-to-r from-transparent via-[#00ff41]/20 to-transparent'}`}
          style={{ animation: 'scanLine 2s linear infinite' }}
        />
        
        {/* Button text */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          <span className="animate-[flicker_3s_ease-in-out_infinite]">⟨</span>
          {text}
          <span className="animate-[flicker_3s_ease-in-out_infinite]" style={{ animationDelay: '0.5s' }}>⟩</span>
        </span>
      </button>
    </div>
  );
};

// Array of dramatic button texts to cycle through
const dramaticTexts = {
  continue: [
    "I DARE TO KNOW",
    "SHOW ME THE TRUTH", 
    "I'M READY TO REMEMBER",
    "REVEAL MORE",
    "UNLOCK THE NEXT LAYER",
    "CONTINUE THE TRANSMISSION"
  ],
  challenge: [
    "I'M NOT AFRAID",
    "TAKE ME DEEPER",
    "I CAN HANDLE THIS",
    "SHOW ME EVERYTHING"
  ]
};

// Get dramatic text based on slide context
const getDramaticText = (slideIndex: number): string => {
  const texts = dramaticTexts.continue;
  return texts[slideIndex % texts.length];
};

// Mute button
const MuteButton = ({ muted, onToggle }: { muted: boolean; onToggle: () => void }) => (
  <button
    onClick={onToggle}
    className="fixed top-4 right-4 z-50 p-2 bg-black/50 border border-[#00ff41]/30 rounded-lg hover:border-[#00ff41] transition-colors"
    aria-label={muted ? "Unmute" : "Mute"}
  >
    {muted ? (
      <svg className="w-5 h-5 text-[#00ff41]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
      </svg>
    ) : (
      <svg className="w-5 h-5 text-[#00ff41]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      </svg>
    )}
  </button>
);

// ===========================================
// SLIDE COMPONENTS
// ===========================================

// Slide 1: Signal Intercepted
const Slide1 = ({ isActive, onAdvance }: { isActive: boolean; onAdvance: () => void }) => {
  const [phase, setPhase] = useState(0);
  const [glitchIntensity, setGlitchIntensity] = useState(1);
  
  useEffect(() => {
    if (!isActive) {
      setPhase(0);
      return;
    }
    
    // Initial heavy glitch
    playGlitchSound();
    setGlitchIntensity(1);
    
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => { setGlitchIntensity(0.5); playGlitchSound(); }, 1500),
      setTimeout(() => setPhase(2), 2500),
      setTimeout(() => setPhase(3), 4500),
      setTimeout(() => { setGlitchIntensity(0.2); setPhase(4); }, 7000),
    ];
    
    return () => timers.forEach(clearTimeout);
  }, [isActive]);
  
  return (
    <div className={`fixed inset-0 flex items-center justify-center transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Intense glitch overlay */}
      <div 
        className="absolute inset-0 transition-opacity duration-300"
        style={{ 
          opacity: glitchIntensity * 0.3,
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,0,64,0.1) 25%, transparent 50%, rgba(0,255,65,0.1) 75%, transparent 100%)',
          animation: 'glitch-bg 0.15s linear infinite'
        }}
      />
      
      <div className="relative z-10 text-center px-6 max-w-2xl">
        {/* Signal scanning animation */}
        {phase >= 1 && (
          <div className="mb-8 animate-[fadeIn_0.5s_ease-out]">
            <div className="font-mono text-[#00ff41] text-sm tracking-[0.3em] mb-4">
              <TypewriterText text="SIGNAL INTERCEPTED..." speed={60} />
            </div>
          </div>
        )}
        
        {phase >= 2 && (
          <div className="mb-6 animate-[fadeIn_0.5s_ease-out]">
            <div className="font-mono text-[#00ff41]/70 text-sm mb-2">
              <TypewriterText text="SCANNING FREQUENCY..." delay={0} speed={50} />
            </div>
            <div className="w-full h-1 bg-[#00ff41]/20 rounded overflow-hidden">
              <div className="h-full bg-[#00ff41] animate-[scan_2s_ease-in-out]" />
            </div>
          </div>
        )}
        
        {phase >= 3 && (
          <div className="mb-8 animate-[fadeIn_0.5s_ease-out]">
            <div className="font-mono text-[#00ff41] text-lg tracking-wider">
              <TypewriterText text="MATCH FOUND." delay={0} speed={80} />
            </div>
          </div>
        )}
        
        {phase >= 4 && (
          <div className="animate-[fadeIn_0.8s_ease-out]">
            <p className="font-mono text-xl md:text-2xl text-white/90 leading-relaxed mb-8">
              <GlitchText>You weren't supposed to find this.</GlitchText>
            </p>
            
            <DramaticCTA 
              text="I DARE TO KNOW" 
              onClick={onAdvance}
              delay={500}
              variant="primary"
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Slide 2: Classified Transmission
const Slide2 = ({ isActive }: { isActive: boolean }) => {
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    if (isActive) {
      setShowContent(false);
      setTimeout(() => setShowContent(true), 300);
    }
  }, [isActive]);
  
  return (
    <div className={`fixed inset-0 flex items-center justify-center transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="relative z-10 text-left px-6 max-w-2xl w-full">
        {/* Terminal header */}
        <div className="mb-6 font-mono text-[#00ff41]/60 text-xs border-b border-[#00ff41]/20 pb-2">
          <span className="text-[#ff0040]">█</span> CLASSIFIED TRANSMISSION
          <span className="float-right">CLEARANCE: <span className="text-[#00ff41]">COSMIC</span></span>
        </div>
        
        {showContent && (
          <div className="font-mono space-y-6">
            <p className="text-[#00ff41] text-lg leading-relaxed">
              <TypewriterText 
                text="We've been searching for lost souls." 
                speed={40}
                showCursor
              />
            </p>
            
            <p className="text-[#00ff41]/80 text-lg leading-relaxed">
              <TypewriterText 
                text="Souls who forgot who they are."
                delay={2000}
                speed={45}
              />
            </p>
            
            <p className="text-[#00ff41]/80 text-lg leading-relaxed">
              <TypewriterText 
                text="Souls trapped in the simulation."
                delay={4000}
                speed={45}
              />
            </p>
            
            <p className="text-white text-xl leading-relaxed mt-8">
              <TypewriterText 
                text="You are one of them."
                delay={6500}
                speed={70}
              />
            </p>
          </div>
        )}
        
        <div className="mt-12 text-center">
          <DramaticCTA 
            text="SHOW ME THE TRUTH" 
            delay={8000}
            variant="secondary"
          />
        </div>
      </div>
    </div>
  );
};

// Slide 3: The Truth
const Slide3 = ({ isActive }: { isActive: boolean }) => {
  const [visibleBullets, setVisibleBullets] = useState(0);
  const [videoLoading, setVideoLoading] = useState(true);
  
  const truths = [
    "You are not from this dimension",
    "Your DNA contains ancient star codes",
    "You are 1 of 7 cosmic warriors",
    "Earth's frequency is collapsing",
    "You were sent here to remember"
  ];
  
  useEffect(() => {
    if (!isActive) {
      setVisibleBullets(0);
      setVideoLoading(true);
      return;
    }
    
    setVisibleBullets(0);
    const timers: NodeJS.Timeout[] = [];
    
    // Show video after header
    timers.push(setTimeout(() => setVideoLoading(false), 2000));
    
    // Show header after initial delay, then bullets one by one
    truths.forEach((_, i) => {
      timers.push(setTimeout(() => {
        setVisibleBullets(i + 1);
        playSelectSound();
      }, 4000 + i * 1500));
    });
    
    return () => timers.forEach(clearTimeout);
  }, [isActive]);
  
  return (
    <div className={`fixed inset-0 flex items-center justify-center transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="relative z-10 px-6 max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="font-mono text-[#ff0040] text-lg tracking-[0.2em] mb-2">
            {isActive && <TypewriterText text="THE TRUTH THEY HID FROM YOU:" speed={50} />}
          </h2>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#ff0040]/50 to-transparent" />
        </div>
        
        {/* ==================================================================
            VIDEO PLACEHOLDER - Replace the placeholder below with your HeyGen video
            
            To add your video:
            1. Get your HeyGen video embed URL or MP4 URL
            2. Replace the placeholder div below with either:
            
            For HeyGen embed (iframe):
            <iframe 
              src="YOUR_HEYGEN_EMBED_URL_HERE"
              className="w-full aspect-video"
              allowFullScreen
            />
            
            For direct video file (mp4):
            <video 
              src="YOUR_VIDEO_URL_HERE"
              className="w-full aspect-video"
              controls
              autoPlay
              muted
            />
            
            ================================================================== */}
        <div className={`mb-6 transition-all duration-700 ${videoLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          <div className="relative border-2 border-[#ff0040]/50 bg-black/70 aspect-video overflow-hidden group">
            {/* Classified document stamp */}
            <div className="absolute top-3 left-3 z-20">
              <div className="font-mono text-[#ff0040] text-xs tracking-wider flex items-center gap-2">
                <span className="animate-pulse">●</span>
                <span>CLASSIFIED FILE</span>
              </div>
            </div>
            
            {/* File ID */}
            <div className="absolute top-3 right-3 z-20">
              <div className="font-mono text-[#00ff41]/50 text-xs">
                VID-7777-TRUTH
              </div>
            </div>
            
            {/* Static/scan line effect overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              <div 
                className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ff41]/5 to-transparent"
                style={{ animation: 'scanLine 3s linear infinite' }}
              />
              <div 
                className="absolute inset-0"
                style={{
                  background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px)',
                }}
              />
            </div>
            
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-30">
              <div className="relative">
                {/* Glowing ring */}
                <div className="absolute inset-0 rounded-full border-2 border-[#ff0040] animate-ping opacity-30" 
                     style={{ width: '100px', height: '100px', margin: '-50px 0 0 -50px', left: '50%', top: '50%' }} 
                />
                
                {/* Play button */}
                <button 
                  className="w-20 h-20 rounded-full border-2 border-[#ff0040] bg-black/60 flex items-center justify-center hover:bg-[#ff0040]/20 transition-all group-hover:scale-110 hover:shadow-[0_0_30px_rgba(255,0,64,0.5)]"
                  onClick={() => {
                    // Video will play when HeyGen video is added
                    playSelectSound();
                    triggerHaptic('medium');
                  }}
                >
                  <svg className="w-8 h-8 text-[#ff0040] ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Loading/transmission text */}
            <div className="absolute bottom-3 left-3 right-3 z-20">
              <div className="font-mono text-xs flex items-center justify-between">
                <span className="text-[#00ff41]/70">
                  <span className="animate-pulse">◈</span> VIDEO TRANSMISSION LOADING...
                </span>
                <span className="text-[#ff0040]/70">
                  [DECRYPT TO VIEW]
                </span>
              </div>
            </div>
            
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 30%, rgba(255,0,64,0.3) 0%, transparent 40%),
                  radial-gradient(circle at 80% 70%, rgba(0,255,65,0.2) 0%, transparent 40%)
                `,
              }}
            />
          </div>
        </div>
        
        {/* Truth bullets */}
        <div className="space-y-3 font-mono">
          {truths.map((truth, i) => (
            <div 
              key={i}
              className={`flex items-start gap-4 transition-all duration-500 ${
                i < visibleBullets ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
            >
              <span className="text-[#00ff41] mt-1">▸</span>
              <span className={`text-base ${i < visibleBullets ? 'text-white/90' : ''}`}>
                {truth}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <DramaticCTA 
            text="I'M READY TO REMEMBER" 
            delay={12000}
            variant="primary"
          />
        </div>
      </div>
    </div>
  );
};

// Slide 4: Book/Activation File
const Slide4 = ({ isActive }: { isActive: boolean }) => {
  const [loading, setLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    if (isActive) {
      setShowContent(false);
      setTimeout(() => setShowContent(true), 300);
    }
  }, [isActive]);
  
  const handlePurchase = async (productId: string) => {
    setLoading(true);
    playSelectSound();
    triggerHaptic('medium');
    
    const url = await initiateCheckout(productId);
    if (url) {
      window.location.href = url;
    } else {
      alert('Checkout temporarily unavailable. Please try again.');
    }
    setLoading(false);
  };
  
  return (
    <div className={`fixed inset-0 flex items-center justify-center transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="relative z-10 px-6 max-w-2xl w-full">
        {/* Classified document header */}
        <div className="border border-[#00ff41]/30 bg-black/50 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[#ff0040] text-xs tracking-wider">◈ ACTIVATION FILE</span>
            <span className="font-mono text-[#00ff41]/50 text-xs">DOC-7777-CSQ</span>
          </div>
          
          <h2 className="font-mono text-2xl md:text-3xl text-[#00ff41] mb-4 tracking-wider">
            {showContent && <GlitchText>COSMIC SOUL QUEST</GlitchText>}
          </h2>
          
          {showContent && (
            <p className="font-mono text-white/70 text-sm leading-relaxed">
              <TypewriterText 
                text="This file contains activation codes for your dormant DNA. A teenage boy discovers his soul is from another dimension. He's part of an ancient group of seven cosmic warriors who must reunite to save Earth's frequency from collapsing into the void."
                speed={20}
              />
            </p>
          )}
        </div>
        
        {/* Pricing tiers */}
        <div className="space-y-3">
          {[
            { id: 'book_digital', name: 'DIGITAL ACCESS', price: '$14.99' },
            { id: 'book_paperback', name: 'PHYSICAL COPY', price: '$24.99' },
            { id: 'book_collectors', name: 'COLLECTOR\'S EDITION', price: '$39.99' },
          ].map((tier) => (
            <button
              key={tier.id}
              onClick={() => handlePurchase(tier.id)}
              disabled={loading}
              className="w-full font-mono border border-[#00ff41]/40 bg-black/30 p-4 flex justify-between items-center hover:bg-[#00ff41]/10 hover:border-[#00ff41] transition-all group"
            >
              <span className="text-[#00ff41]">[{tier.name}]</span>
              <span className="text-white group-hover:text-[#00ff41] transition-colors">{tier.price}</span>
            </button>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <DramaticCTA 
            text="REVEAL MORE" 
            delay={500}
            variant="secondary"
          />
        </div>
      </div>
    </div>
  );
};

// Slide 5: Academy Classified
const Slide5 = ({ isActive }: { isActive: boolean }) => {
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    if (isActive) {
      setShowContent(false);
      setTimeout(() => setShowContent(true), 300);
    }
  }, [isActive]);
  
  return (
    <div className={`fixed inset-0 flex items-center justify-center transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="relative z-10 px-6 max-w-2xl w-full text-center">
        {/* Classified stamp effect */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 border-4 border-[#ff0040] rotate-[-5deg] opacity-30" />
          <div className="font-mono text-[#ff0040] text-xs tracking-[0.3em] py-2 px-6 border-2 border-[#ff0040]">
            ◈ CLASSIFIED ◈
          </div>
        </div>
        
        <div className="space-y-4 mb-8">
          <div className="font-mono text-[#00ff41]/50 text-sm tracking-wider">
            CLEARANCE LEVEL: <span className="text-[#00ff41]">COSMIC</span>
          </div>
          
          <h2 className="font-mono text-xl md:text-2xl text-white tracking-wider">
            {showContent && <GlitchText>GALACTIC STAR CRYSTAL ACADEMY</GlitchText>}
          </h2>
          
          <div className="font-mono text-[#ff0040] text-sm tracking-[0.2em]">
            ACCESS RESTRICTED
          </div>
        </div>
        
        {/* Redacted text effect */}
        <div className="font-mono text-white/60 text-sm leading-loose space-y-2 max-w-md mx-auto">
          <p>A secret training program for</p>
          <p className="text-[#00ff41]">awakened souls</p>
          <p>operating at highest frequency.</p>
          <div className="py-4">
            <span className="bg-[#00ff41]/20 px-2">███████████████</span>
          </div>
          <p className="text-white/40 italic">
            "You are not ready yet. But you will be."
          </p>
        </div>
        
        <div className="mt-10 font-mono text-[#00ff41]/30 text-xs tracking-wider">
          COMING FOR THE CHOSEN FEW
        </div>
        
        <div className="mt-8 text-center">
          <DramaticCTA 
            text="UNLOCK THE NEXT LAYER" 
            delay={500}
            variant="primary"
          />
        </div>
      </div>
    </div>
  );
};

// Slide 6: Chakra Assessment Questionnaire
interface ChakraQuestion {
  chakra: string;
  chakraName: string;
  color: string;
  question: string;
  symptoms: string[];
}

type FrequencyAnswer = 'never' | 'sometimes' | 'often' | 'always';

interface ChakraResult {
  chakra: string;
  chakraName: string;
  color: string;
  score: number; // 0 = balanced, 1-3 = increasingly unbalanced
  status: 'balanced' | 'slightly-unbalanced' | 'unbalanced' | 'blocked';
}

const chakraQuestions: ChakraQuestion[] = [
  { 
    chakra: "ROOT", 
    chakraName: "Muladhara",
    color: "#e53e3e", 
    question: "Do you feel anxious, unsafe, or financially unstable?",
    symptoms: ["Anxiety about survival", "Financial worries", "Feeling ungrounded", "Fear of change"]
  },
  { 
    chakra: "SACRAL", 
    chakraName: "Svadhisthana",
    color: "#ed8936", 
    question: "Do you struggle with creativity, emotions, or intimacy?",
    symptoms: ["Creative blocks", "Emotional numbness", "Intimacy issues", "Guilt or shame"]
  },
  { 
    chakra: "SOLAR PLEXUS", 
    chakraName: "Manipura",
    color: "#ecc94b", 
    question: "Do you lack confidence, feel powerless, or have digestive issues?",
    symptoms: ["Low self-esteem", "Feeling powerless", "Digestive problems", "Control issues"]
  },
  { 
    chakra: "HEART", 
    chakraName: "Anahata",
    color: "#48bb78", 
    question: "Do you have trouble giving/receiving love or feel disconnected from others?",
    symptoms: ["Fear of intimacy", "Feeling isolated", "Holding grudges", "Lack of empathy"]
  },
  { 
    chakra: "THROAT", 
    chakraName: "Vishuddha",
    color: "#38b2ac", 
    question: "Do you struggle to express yourself or speak your truth?",
    symptoms: ["Fear of speaking", "Feeling unheard", "Dishonesty", "Throat problems"]
  },
  { 
    chakra: "THIRD EYE", 
    chakraName: "Ajna",
    color: "#4c51bf", 
    question: "Do you lack intuition, have trouble visualizing, or feel mentally foggy?",
    symptoms: ["Poor intuition", "Mental confusion", "Lack of imagination", "Headaches"]
  },
  { 
    chakra: "CROWN", 
    chakraName: "Sahasrara",
    color: "#9f7aea", 
    question: "Do you feel spiritually disconnected or lack purpose?",
    symptoms: ["Feeling purposeless", "Spiritual disconnection", "Closed-mindedness", "Depression"]
  },
];

const frequencyOptions: { value: FrequencyAnswer; label: string; score: number }[] = [
  { value: 'never', label: 'Never', score: 0 },
  { value: 'sometimes', label: 'Sometimes', score: 1 },
  { value: 'often', label: 'Often', score: 2 },
  { value: 'always', label: 'Always', score: 3 },
];

const getChakraStatus = (score: number): ChakraResult['status'] => {
  if (score === 0) return 'balanced';
  if (score === 1) return 'slightly-unbalanced';
  if (score === 2) return 'unbalanced';
  return 'blocked';
};

// Chakra text results component - classified report format (no visuals)
const ChakraTextResults = ({ results }: { results: ChakraResult[] }) => {
  const getStatusText = (status: ChakraResult['status']) => {
    switch (status) {
      case 'balanced': return 'BALANCED';
      case 'slightly-unbalanced': return 'SLIGHTLY UNBALANCED';
      case 'unbalanced': return 'UNBALANCED';
      case 'blocked': return 'BLOCKED';
    }
  };
  
  const getRecommendation = (chakra: string, status: ChakraResult['status']) => {
    if (status === 'balanced') return 'Energy flows freely. No action required.';
    
    const recommendations: Record<string, string> = {
      'ROOT': 'Grounding exercises needed.',
      'SACRAL': 'Creative expression required.',
      'SOLAR PLEXUS': 'Personal power restoration needed.',
      'HEART': 'Heart healing exercises recommended.',
      'THROAT': 'Communication work required.',
      'THIRD EYE': 'Intuition development needed.',
      'CROWN': 'Spiritual connection exercises required.'
    };
    return recommendations[chakra] || 'Energy realignment recommended.';
  };
  
  return (
    <div className="font-mono max-w-xl mx-auto border border-[#00ff41]/30 bg-black/70 p-6">
      {/* Report Header */}
      <div className="text-center border-b border-[#00ff41]/30 pb-4 mb-6">
        <div className="text-[#ff0040] text-xs tracking-[0.3em] mb-2">▼ CLASSIFIED ▼</div>
        <div className="text-[#00ff41] text-sm tracking-wider">CHAKRA DIAGNOSTIC REPORT</div>
        <div className="text-white/30 text-xs mt-1">SUBJECT: COSMIC WARRIOR CANDIDATE</div>
      </div>
      
      {/* Results List - Text Line Items Only */}
      <div className="space-y-3">
        {results.map((result, index) => (
          <div 
            key={result.chakra}
            className="animate-[fadeIn_0.3s_ease-out] font-mono text-xs leading-relaxed"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <span className="text-white/90">{result.chakra} CHAKRA</span>
            <span className="text-white/50"> - </span>
            <span className="text-white/70">STATUS: </span>
            <span className={`font-bold ${
              result.status === 'blocked' ? 'text-[#ff0040]'
              : result.status === 'unbalanced' ? 'text-[#ff6b35]'
              : result.status === 'slightly-unbalanced' ? 'text-yellow-500'
              : 'text-[#00ff41]'
            }`}>
              {getStatusText(result.status)}
            </span>
            <span className="text-white/50"> - </span>
            <span className="text-white/70">RECOMMENDATION: </span>
            <span className="text-white/60">{getRecommendation(result.chakra, result.status)}</span>
          </div>
        ))}
      </div>
      
      {/* Report Footer */}
      <div className="mt-6 pt-4 border-t border-[#00ff41]/30 text-center">
        <div className="text-[#00ff41]/40 text-xs">
          ── END OF REPORT ──
        </div>
      </div>
    </div>
  );
};

const Slide6 = ({ isActive }: { isActive: boolean }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, FrequencyAnswer>>({});
  const [phase, setPhase] = useState<'intro' | 'quiz' | 'scanning' | 'result'>('intro');
  const [scanProgress, setScanProgress] = useState(0);
  const [results, setResults] = useState<ChakraResult[]>([]);
  
  useEffect(() => {
    if (!isActive) {
      setCurrentQuestion(0);
      setAnswers({});
      setPhase('intro');
      setScanProgress(0);
      setResults([]);
    } else {
      setTimeout(() => setPhase('intro'), 300);
    }
  }, [isActive]);
  
  const handleAnswer = (answer: FrequencyAnswer) => {
    playSelectSound();
    triggerHaptic('light');
    
    const currentChakra = chakraQuestions[currentQuestion].chakra;
    const newAnswers = { ...answers, [currentChakra]: answer };
    setAnswers(newAnswers);
    
    if (currentQuestion < chakraQuestions.length - 1) {
      setTimeout(() => {
        playTransitionSound();
        setCurrentQuestion(prev => prev + 1);
      }, 300);
    } else {
      // All questions answered, start scanning
      playGlitchSound();
      triggerHaptic('medium');
      setPhase('scanning');
      setScanProgress(0);
      
      // Animate scan progress
      const scanInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(scanInterval);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      
      // Calculate and show results
      setTimeout(() => {
        const chakraResults: ChakraResult[] = chakraQuestions.map(q => {
          const answerValue = newAnswers[q.chakra];
          const score = frequencyOptions.find(f => f.value === answerValue)?.score || 0;
          return {
            chakra: q.chakra,
            chakraName: q.chakraName,
            color: q.color,
            score,
            status: getChakraStatus(score)
          };
        });
        setResults(chakraResults);
        playTransitionSound();
        setPhase('result');
      }, 3000);
    }
  };
  
  const handleStartQuiz = () => {
    playTransitionSound();
    triggerHaptic('light');
    setPhase('quiz');
  };
  
  const blockedChakras = results.filter(r => r.status === 'blocked' || r.status === 'unbalanced');
  const balancedChakras = results.filter(r => r.status === 'balanced');
  
  return (
    <div className={`fixed inset-0 flex items-center justify-center transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="relative z-10 px-4 max-w-3xl w-full overflow-y-auto max-h-[90vh] py-8">
        
        {/* INTRO PHASE */}
        {phase === 'intro' && (
          <div className="text-center animate-[fadeIn_0.8s_ease-out]">
            <div className="font-mono text-[#ff0040] text-xs tracking-[0.3em] mb-4">
              ▼ DIAGNOSTIC INITIATED ▼
            </div>
            
            <h2 className="font-mono text-2xl md:text-3xl text-[#00ff41] mb-6">
              <GlitchText>ENERGY CENTER ASSESSMENT</GlitchText>
            </h2>
            
            <div className="border border-[#00ff41]/30 bg-black/50 p-6 mb-8">
              <p className="font-mono text-white/70 text-sm md:text-base leading-relaxed mb-4">
                Your chakras are the <span className="text-[#00ff41]">seven energy centers</span> that 
                govern your physical, emotional, and spiritual well-being. When blocked, they 
                manifest as specific symptoms in your life.
              </p>
              <p className="font-mono text-[#ff0040]/80 text-xs">
                Answer 7 questions to reveal which of your energy centers need realignment...
              </p>
            </div>
            
            <button
              onClick={handleStartQuiz}
              className="font-mono px-8 py-4 border-2 border-[#00ff41] bg-[#00ff41]/10 text-[#00ff41] 
                         hover:bg-[#00ff41]/30 hover:shadow-[0_0_30px_rgba(0,255,65,0.4)] 
                         transition-all duration-300 tracking-wider"
            >
              BEGIN DIAGNOSTIC
            </button>
          </div>
        )}
        
        {/* QUIZ PHASE */}
        {phase === 'quiz' && (
          <div className="animate-[fadeIn_0.5s_ease-out]">
            {/* Progress indicator - text based */}
            <div className="text-center mb-6">
              <div className="font-mono text-[#00ff41]/60 text-xs tracking-wider mb-2">
                QUESTION {currentQuestion + 1} OF 7
              </div>
              <div className="font-mono text-white/40 text-xs">
                [ {Array(7).fill('').map((_, i) => i <= currentQuestion ? '■' : '□').join(' ')} ]
              </div>
            </div>
            
            {/* Current chakra indicator - text only */}
            <div className="text-center mb-6">
              <span className="font-mono text-sm font-bold tracking-wider text-[#00ff41]">
                {chakraQuestions[currentQuestion].chakra} CHAKRA
              </span>
            </div>
            
            {/* Question */}
            <div className="border border-[#00ff41]/30 bg-black/50 p-6 mb-6">
              <p className="font-mono text-white text-lg md:text-xl text-center leading-relaxed">
                {chakraQuestions[currentQuestion].question}
              </p>
              
              {/* Symptoms hint */}
              <div className="mt-4 pt-4 border-t border-[#00ff41]/20">
                <div className="font-mono text-[#00ff41]/50 text-xs mb-2">RELATED SYMPTOMS:</div>
                <div className="flex flex-wrap justify-center gap-2">
                  {chakraQuestions[currentQuestion].symptoms.map((symptom, i) => (
                    <span 
                      key={i}
                      className="font-mono text-xs px-2 py-1 bg-white/5 border border-white/10 rounded text-white/60"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Answer options */}
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
              {frequencyOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={`
                    relative font-mono px-4 py-4 border-2 transition-all duration-300 rounded-lg
                    ${option.score === 0 
                      ? 'border-[#00ff41]/40 hover:border-[#00ff41] hover:bg-[#00ff41]/10' 
                      : option.score === 3 
                        ? 'border-[#ff0040]/40 hover:border-[#ff0040] hover:bg-[#ff0040]/10'
                        : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                    }
                    active:scale-95
                  `}
                >
                  <span className={`
                    text-sm tracking-wider
                    ${option.score === 0 ? 'text-[#00ff41]' : option.score === 3 ? 'text-[#ff0040]' : 'text-white/70'}
                  `}>
                    {option.label}
                  </span>
                  
                  {/* Visual indicator */}
                  <div className="flex justify-center gap-1 mt-2">
                    {[...Array(4)].map((_, i) => (
                      <div 
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < option.score 
                            ? 'bg-[#ff0040]' 
                            : 'bg-white/20'
                        }`}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* SCANNING PHASE - Text-based processing, no visual animation */}
        {phase === 'scanning' && (
          <div className="text-center animate-[fadeIn_0.5s_ease-out]">
            <div className="font-mono border border-[#00ff41]/30 bg-black/70 p-8 max-w-md mx-auto">
              <div className="text-[#ff0040] text-xs tracking-[0.3em] mb-6">
                ▼ PROCESSING ▼
              </div>
              
              <div className="space-y-3 text-left mb-6">
                <div className="font-mono text-[#00ff41]/80 text-sm">
                  &gt; Analyzing energy signatures...
                </div>
                <div className="font-mono text-[#00ff41]/70 text-sm animate-pulse">
                  &gt; Compiling chakra data...
                </div>
                <div className="font-mono text-[#00ff41]/60 text-sm">
                  &gt; Cross-referencing cosmic database...
                </div>
                <div className="font-mono text-white/50 text-sm">
                  &gt; Generating diagnostic report...
                </div>
              </div>
              
              <div className="font-mono text-[#00ff41] text-xs tracking-wider animate-pulse">
                PLEASE WAIT...
              </div>
            </div>
          </div>
        )}
        
        {/* RESULT PHASE - Simple Text List Format */}
        {phase === 'result' && (
          <div className="animate-[fadeIn_0.8s_ease-out]">
            <div className="text-center mb-6">
              <div className="font-mono text-[#00ff41] text-xs tracking-[0.3em] mb-2">
                DIAGNOSTIC COMPLETE
              </div>
              <h2 className="font-mono text-xl md:text-2xl text-white mb-4">
                <GlitchText>YOUR CHAKRA ANALYSIS</GlitchText>
              </h2>
            </div>
            
            {/* Simple Text Results List */}
            <ChakraTextResults results={results} />
            
            {/* Summary */}
            <div className="text-center border-t border-[#00ff41]/20 pt-6 mt-8">
              {blockedChakras.length > 0 ? (
                <>
                  <p className="font-mono text-[#ff0040] text-sm mb-2">
                    ⚠ {blockedChakras.length} CHAKRA{blockedChakras.length > 1 ? 'S' : ''} REQUIRING IMMEDIATE ATTENTION
                  </p>
                  <p className="font-mono text-white/60 text-xs mb-4">
                    {blockedChakras.map(c => c.chakra).join(', ')} {blockedChakras.length > 1 ? 'are' : 'is'} blocking 
                    your energy flow and spiritual connection.
                  </p>
                </>
              ) : balancedChakras.length === 7 ? (
                <p className="font-mono text-[#00ff41] text-sm mb-4">
                  ✧ ALL CHAKRAS ALIGNED ✧ Your energy centers are in harmony.
                </p>
              ) : (
                <p className="font-mono text-white/60 text-sm mb-4">
                  Minor imbalances detected. Regular energy work recommended.
                </p>
              )}
              
              <div className="font-mono text-[#00ff41]/50 text-xs animate-pulse">
                Your diagnostic has been logged in the cosmic registry.
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <DramaticCTA 
                text="CONTINUE THE AWAKENING" 
                delay={500}
                variant="secondary"
              />
            </div>
          </div>
        )}
        
        {/* Show navigation hint for intro and quiz phases */}
        {(phase === 'intro' || phase === 'quiz') && (
          <div className="mt-8 text-center opacity-50">
            <span className="font-mono text-[#00ff41]/40 text-xs">
              TAP SIDES TO NAVIGATE
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// Slide 7: Final - Transmission Complete
const Slide7 = ({ isActive }: { isActive: boolean }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    if (isActive) {
      setShowContent(false);
      setTimeout(() => setShowContent(true), 300);
    }
  }, [isActive]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      playSelectSound();
      triggerHaptic('heavy');
      setSubmitted(true);
    }
  };
  
  return (
    <div className={`fixed inset-0 flex items-center justify-center transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="relative z-10 px-6 max-w-2xl w-full text-center">
        <div className="mb-8">
          <div className="font-mono text-[#00ff41] text-xl md:text-2xl tracking-wider mb-4">
            {showContent && <TypewriterText text="TRANSMISSION COMPLETE" speed={60} />}
          </div>
          
          <p className="font-mono text-white/60 text-sm">
            Your frequency has been logged.
          </p>
          <p className="font-mono text-white/60 text-sm">
            Await further instructions.
          </p>
        </div>
        
        {/* Email capture */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="mb-10">
            <div className="font-mono text-[#00ff41]/60 text-xs tracking-wider mb-3">
              SECURE CHANNEL REGISTRATION
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER FREQUENCY ID (EMAIL)"
                className="flex-1 font-mono bg-black/50 border border-[#00ff41]/30 text-[#00ff41] px-4 py-3 text-sm focus:outline-none focus:border-[#00ff41] placeholder:text-[#00ff41]/30"
              />
              <button
                type="submit"
                className="font-mono bg-[#00ff41]/20 border border-[#00ff41] text-[#00ff41] px-6 py-3 hover:bg-[#00ff41]/30 transition-colors"
              >
                REGISTER
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-10 font-mono text-[#00ff41] animate-pulse">
            ✓ FREQUENCY REGISTERED
          </div>
        )}
        
        {/* Social links */}
        <div className="flex justify-center gap-6 mb-8">
          <a 
            href="https://instagram.com/Cosmic_soul_quest" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#00ff41]/60 hover:text-[#00ff41] transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a 
            href="https://tiktok.com/@Cosmic_soul_quest" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#00ff41]/60 hover:text-[#00ff41] transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
          </a>
          <a 
            href="https://youtube.com/@Cosmic_soul_quest" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#00ff41]/60 hover:text-[#00ff41] transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
        </div>
        
        {/* End transmission */}
        <div className="font-mono text-[#00ff41]/30 text-sm tracking-[0.2em]">
          [ END TRANSMISSION ]
        </div>
        
        {/* Glitch out effect */}
        <div className="mt-8 animate-pulse">
          <span className="font-mono text-[#ff0040]/50 text-xs">
            ████ SIGNAL FADING ████
          </span>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// MAIN COMPONENT
// ===========================================
const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [muted, setMuted] = useState(false);
  const [initialized, setInitialized] = useState(false);
  
  const TOTAL_SLIDES = 7;
  
  // Initialize audio on first interaction
  useEffect(() => {
    const initAudio = () => {
      if (!initialized) {
        getAudioContext();
        startAmbientSound();
        setInitialized(true);
      }
    };
    
    window.addEventListener('click', initAudio, { once: true });
    window.addEventListener('touchstart', initAudio, { once: true });
    
    return () => {
      window.removeEventListener('click', initAudio);
      window.removeEventListener('touchstart', initAudio);
    };
  }, [initialized]);
  
  // Handle mute toggle
  const toggleMute = () => {
    isMuted = !muted;
    setMuted(!muted);
    if (isMuted) {
      stopAmbientSound();
    } else {
      startAmbientSound();
    }
  };
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);
  
  const goNext = useCallback(() => {
    if (currentSlide < TOTAL_SLIDES - 1) {
      playTransitionSound();
      setCurrentSlide(prev => prev + 1);
    }
  }, [currentSlide]);
  
  const goPrev = useCallback(() => {
    if (currentSlide > 0) {
      playTransitionSound();
      setCurrentSlide(prev => prev - 1);
    }
  }, [currentSlide]);
  
  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, []);
  
  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden select-none">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#000000] via-[#001a00] to-[#000000] opacity-50" />
      
      {/* Visual effects */}
      <ScanLines />
      <ScreenFlicker />
      <StaticCorners />
      
      {/* Mute button */}
      <MuteButton muted={muted} onToggle={toggleMute} />
      
      {/* Tap zones for navigation */}
      <TapZones onPrev={goPrev} onNext={goNext} />
      
      {/* Slides */}
      <Slide1 isActive={currentSlide === 0} onAdvance={goNext} />
      <Slide2 isActive={currentSlide === 1} />
      <Slide3 isActive={currentSlide === 2} />
      <Slide4 isActive={currentSlide === 3} />
      <Slide5 isActive={currentSlide === 4} />
      <Slide6 isActive={currentSlide === 5} />
      <Slide7 isActive={currentSlide === 6} />
      
      {/* Global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
        
        * {
          font-family: 'Share Tech Mono', monospace;
          -webkit-tap-highlight-color: transparent;
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scan {
          0% { width: 0; }
          100% { width: 100%; }
        }
        
        @keyframes glitch-bg {
          0% { transform: translateX(-2px); }
          25% { transform: translateX(2px); }
          50% { transform: translateX(-1px); }
          75% { transform: translateX(1px); }
          100% { transform: translateX(0); }
        }
        
        @keyframes glitch-text {
          0% { clip-path: inset(80% 0 0 0); transform: translateX(-3px); }
          20% { clip-path: inset(10% 0 60% 0); transform: translateX(3px); }
          40% { clip-path: inset(50% 0 20% 0); transform: translateX(-2px); }
          60% { clip-path: inset(20% 0 50% 0); transform: translateX(2px); }
          80% { clip-path: inset(60% 0 10% 0); transform: translateX(-3px); }
          100% { clip-path: inset(0 0 80% 0); transform: translateX(0); }
        }
        
        /* Touch optimization */
        button, a, [role="button"] {
          min-height: 44px;
          min-width: 44px;
          touch-action: manipulation;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #00ff41;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
};

export default Index;
