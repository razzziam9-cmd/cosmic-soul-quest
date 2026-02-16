import { useState, useEffect, useRef } from "react";

// Cipher symbols for the mystical feel
const CIPHER_SYMBOLS = "ΨΩΦΣΠΘΞΛΚΙΗΖΕΔΓΒΑψωφσπθξλκιηζεδγβα∞∑∏√∂∫⊗⊕⊙◊◈✧✦★☆⚡☽☾☀☁❂✺✹✸";

const PhoneFrame = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative w-full max-w-[380px] mx-auto">
      {/* Phone outer frame */}
      <div className="relative bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-[3rem] p-3 shadow-2xl">
        {/* Phone notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20" />
        
        {/* Phone screen */}
        <div className="relative bg-[#050510] rounded-[2.5rem] overflow-hidden min-h-[600px] border border-zinc-700/50">
          {/* Screen glare effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none z-10" />
          
          {/* Screen content */}
          <div className="relative z-0 p-6 pt-12">
            {children}
          </div>
          
          {/* Scan line effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div 
              className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#00ff88]/30 to-transparent"
              style={{
                animation: "scan-line 3s linear infinite"
              }}
            />
          </div>
        </div>
        
        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-zinc-600 rounded-full" />
      </div>
    </div>
  );
};

interface MessageProps {
  text: string;
  delay: number;
  type: "incoming" | "system" | "alert";
  onComplete?: () => void;
}

const HackMessage = ({ text, delay, type, onComplete }: MessageProps) => {
  const [visible, setVisible] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setVisible(true);
      setGlitching(true);
      
      // Glitch effect before revealing
      setTimeout(() => {
        setGlitching(false);
        let index = 0;
        const typeInterval = setInterval(() => {
          if (index <= text.length) {
            setDisplayText(text.slice(0, index));
            index++;
          } else {
            clearInterval(typeInterval);
            onComplete?.();
          }
        }, 30);
      }, 500);
    }, delay);

    return () => clearTimeout(showTimer);
  }, [text, delay, onComplete]);

  if (!visible) return null;

  const getStyles = () => {
    switch (type) {
      case "incoming":
        return "bg-gradient-to-r from-purple-900/80 to-indigo-900/80 border-purple-500/50 text-purple-100";
      case "system":
        return "bg-gradient-to-r from-cyan-900/60 to-blue-900/60 border-cyan-500/30 text-cyan-200";
      case "alert":
        return "bg-gradient-to-r from-[#00ff88]/20 to-emerald-900/40 border-[#00ff88]/50 text-[#00ff88]";
    }
  };

  return (
    <div 
      className={`relative p-4 rounded-xl border backdrop-blur-sm mb-4 transition-all duration-500 ${getStyles()} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{
        boxShadow: type === "alert" 
          ? "0 0 20px rgba(0, 255, 136, 0.3), inset 0 0 20px rgba(0, 255, 136, 0.05)"
          : "0 0 15px rgba(100, 0, 180, 0.2)",
      }}
    >
      {/* Glitch effect overlay */}
      {glitching && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-[#00ff88] animate-pulse">
            {CIPHER_SYMBOLS.slice(0, 20).split('').map((char, i) => (
              <span key={i} style={{ animationDelay: `${i * 50}ms` }}>{char}</span>
            ))}
          </span>
        </div>
      )}
      
      <p className={`font-['Rajdhani'] text-base md:text-lg font-medium ${glitching ? 'opacity-0' : 'opacity-100'}`}>
        {displayText}
        {displayText.length < text.length && <span className="animate-pulse">▋</span>}
      </p>
    </div>
  );
};

const CipherSymbols = () => {
  const [symbols, setSymbols] = useState<string[]>([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const newSymbols = Array.from({ length: 12 }, () => 
        CIPHER_SYMBOLS[Math.floor(Math.random() * CIPHER_SYMBOLS.length)]
      );
      setSymbols(newSymbols);
    }, 200);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center gap-2 py-4 opacity-40">
      {symbols.map((symbol, i) => (
        <span 
          key={i} 
          className="font-mono text-[#00ff88] text-lg"
          style={{ 
            textShadow: "0 0 10px #00ff88",
            animationDelay: `${i * 0.1}s` 
          }}
        >
          {symbol}
        </span>
      ))}
    </div>
  );
};

const SignalBars = () => {
  return (
    <div className="flex items-end gap-1 h-4">
      {[0.4, 0.6, 0.8, 1].map((height, i) => (
        <div 
          key={i}
          className="w-1.5 bg-[#00ff88] rounded-sm animate-pulse"
          style={{ 
            height: `${height * 100}%`,
            animationDelay: `${i * 0.2}s`,
            boxShadow: "0 0 5px #00ff88"
          }}
        />
      ))}
    </div>
  );
};

const PhoneFunnel = () => {
  const [stage, setStage] = useState(0);
  const [showButton, setShowButton] = useState(false);

  const messages = [
    { text: "📡 Incoming transmission...", type: "system" as const, delay: 500 },
    { text: "⚡ Your frequency detected...", type: "incoming" as const, delay: 2500 },
    { text: "🔮 Initiating soul scan...", type: "system" as const, delay: 4500 },
    { text: "✨ MATCH FOUND: Cosmic Warrior Soul", type: "alert" as const, delay: 7000 },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#050510]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(100,0,180,0.2)_0%,transparent_60%)]" />
      
      {/* Background phone image with overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url('./phone-hack-interface-72df7t1UWTdEO8pTIA_gK.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      
      {/* Matrix code effect on sides */}
      <div className="absolute left-0 top-0 w-32 h-full overflow-hidden opacity-20 pointer-events-none">
        <div className="font-mono text-[#00ff88] text-xs leading-tight whitespace-nowrap animate-[matrix-rain_20s_linear_infinite]">
          {Array.from({ length: 100 }, () => 
            CIPHER_SYMBOLS[Math.floor(Math.random() * CIPHER_SYMBOLS.length)]
          ).join('\n')}
        </div>
      </div>
      <div className="absolute right-0 top-0 w-32 h-full overflow-hidden opacity-20 pointer-events-none">
        <div className="font-mono text-[#00ff88] text-xs leading-tight whitespace-nowrap animate-[matrix-rain_25s_linear_infinite]">
          {Array.from({ length: 100 }, () => 
            CIPHER_SYMBOLS[Math.floor(Math.random() * CIPHER_SYMBOLS.length)]
          ).join('\n')}
        </div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="font-['Orbitron'] text-xl md:text-2xl text-[#00ff88] tracking-widest mb-2"
            style={{ textShadow: "0 0 20px #00ff88" }}
          >
            ◈ SECURE CHANNEL ◈
          </h2>
          <div className="flex items-center justify-center gap-4">
            <SignalBars />
            <span className="font-['Rajdhani'] text-cyan-400 text-sm">ENCRYPTED</span>
            <div className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse" />
          </div>
        </div>
        
        <PhoneFrame>
          {/* Status bar */}
          <div className="flex justify-between items-center text-xs text-zinc-400 mb-6 px-2">
            <span>●●●○○</span>
            <span className="font-['Orbitron'] text-[#00ff88]">FREQUENCY LINK</span>
            <span>100%</span>
          </div>
          
          <CipherSymbols />
          
          {/* Messages */}
          <div className="space-y-2">
            {messages.map((msg, i) => (
              <HackMessage
                key={i}
                text={msg.text}
                type={msg.type}
                delay={msg.delay}
                onComplete={i === messages.length - 1 ? () => setShowButton(true) : undefined}
              />
            ))}
          </div>
          
          <CipherSymbols />
          
          {/* Action button */}
          {showButton && (
            <div 
              className="mt-6 animate-[fadeIn_0.5s_ease-out]"
              style={{
                animation: "fadeIn 0.5s ease-out forwards",
              }}
            >
              <button className="w-full py-4 font-['Orbitron'] text-lg font-bold text-[#050510] bg-[#00ff88] rounded-xl transition-all duration-300 hover:scale-[1.02] hover:bg-[#00ffaa] uppercase tracking-wider relative overflow-hidden group">
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <span>🔓</span>
                  Decrypt Message
                  <span>🔓</span>
                </span>
                
                {/* Button glow */}
                <div className="absolute inset-0 bg-[#00ff88] blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
              </button>
              
              <p className="text-center mt-4 font-['Rajdhani'] text-purple-300/70 text-sm">
                Your cosmic identity awaits...
              </p>
            </div>
          )}
        </PhoneFrame>
        
        {/* Bottom decorative elements */}
        <div className="mt-8 flex justify-center gap-6 opacity-40">
          {["◈", "✧", "☽", "⚡", "☾", "✧", "◈"].map((symbol, i) => (
            <span 
              key={i}
              className="text-[#00ff88] text-xl animate-pulse"
              style={{ 
                animationDelay: `${i * 0.2}s`,
                textShadow: "0 0 10px #00ff88"
              }}
            >
              {symbol}
            </span>
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scan-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(600px); }
        }
      `}</style>
    </section>
  );
};

export default PhoneFunnel;
