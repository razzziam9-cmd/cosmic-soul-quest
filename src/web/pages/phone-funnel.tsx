import { useState, useEffect } from "react";

// Sacred cipher symbols for the mystical feel
const CIPHER_SYMBOLS = "ΨΩΦΣΠΘΞΛΚΙΗΖΕΔΓΒΑψωφσπθξλκιηζεδγβα∞∑∏√∂∫⊗⊕⊙◊◈✧✦★☆⚡☽☾☀☁❂✺✹✸";

// Sacred Geometry Phone Frame - cosmic transmission style
const CosmicTransmissionFrame = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative w-full max-w-[420px] mx-auto">
      {/* Phone outer frame with sacred geometry styling */}
      <div className="relative bg-gradient-to-b from-[#0a0a2e] to-[#050520] rounded-[3rem] p-3 shadow-2xl border border-purple-500/20">
        {/* Sacred geometry decorations */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-2 items-center">
          <span className="text-[#00ff88] text-xs animate-pulse">◈</span>
          <span className="text-purple-400 text-xs">✧</span>
          <span className="text-[#00ff88] text-xs animate-pulse">◈</span>
        </div>
        
        {/* Phone screen */}
        <div className="relative bg-gradient-to-b from-[#0a0a1f] to-[#050510] rounded-[2.5rem] overflow-hidden min-h-[650px] border border-purple-500/10">
          {/* Divine Transmission Header */}
          <div className="bg-gradient-to-b from-[#0a0a2e] to-transparent pt-8 pb-4 px-4 border-b border-[#00ff88]/10">
            <div className="flex items-center justify-center gap-4">
              {/* Sacred symbols */}
              <span className="text-[#00ff88]/50 text-lg animate-pulse">✧</span>
              
              {/* Transmission indicator */}
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#00ff88]/30">
                  <img 
                    src="./cloaked-messenger-portrait-KakJfYU78kjRavrkE3GIf.png" 
                    alt="Divine Messenger" 
                    className="w-full h-full object-cover"
                  />
                  {/* Glowing overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#00ff88]/20 to-transparent" />
                </div>
                <div className="text-center">
                  <p className="font-['Orbitron'] text-[#00ff88] text-xs font-bold tracking-wider">
                    DIVINE TRANSMISSION
                  </p>
                  <p className="font-['Rajdhani'] text-purple-300/60 text-xs">Signal Strength: ∞</p>
                </div>
              </div>
              
              <span className="text-[#00ff88]/50 text-lg animate-pulse">✧</span>
            </div>
          </div>
          
          {/* Screen content - Cosmic messages area */}
          <div className="relative z-0 px-4 py-4 pb-20 min-h-[450px]">
            {/* Encryption badge - cosmic style */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-900/40 to-[#00ff88]/10 border border-[#00ff88]/20">
                <span className="text-[#00ff88] animate-pulse">⚡</span>
                <span className="font-['Orbitron'] text-[#00ff88]/70 text-xs tracking-wider">ENCRYPTED COSMIC CHANNEL</span>
                <span className="text-[#00ff88] animate-pulse">⚡</span>
              </div>
            </div>
            
            {children}
          </div>
          
          {/* Bottom sacred bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a0a2e] to-transparent p-4 rounded-b-[2.5rem]">
            <div className="flex items-center justify-center gap-4">
              {["☽", "◈", "Ψ", "◈", "☾"].map((symbol, i) => (
                <span 
                  key={i}
                  className="text-[#00ff88]/30 text-lg animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  {symbol}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Home indicator - sacred style */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-[#00ff88]/30 to-transparent rounded-full" />
      </div>
    </div>
  );
};

interface CosmicMessageProps {
  text: string;
  delay: number;
  type: "received" | "sent" | "system";
  onComplete?: () => void;
  showAvatar?: boolean;
}

const CosmicMessage = ({ text, delay, type, onComplete, showAvatar = true }: CosmicMessageProps) => {
  const [visible, setVisible] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [decrypting, setDecrypting] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      if (type === "received") {
        setDecrypting(true);
        // Show decryption animation
        setTimeout(() => {
          setDecrypting(false);
          setVisible(true);
          let index = 0;
          const typeInterval = setInterval(() => {
            if (index <= text.length) {
              setDisplayText(text.slice(0, index));
              index++;
            } else {
              clearInterval(typeInterval);
              onComplete?.();
            }
          }, 25);
        }, 1200);
      } else {
        setVisible(true);
        setDisplayText(text);
        setTimeout(() => onComplete?.(), 300);
      }
    }, delay);

    return () => clearTimeout(showTimer);
  }, [text, delay, type, onComplete]);

  if (type === "system") {
    return visible ? (
      <div className="flex justify-center my-4 animate-[fadeIn_0.3s_ease-out]">
        <span className="font-['Orbitron'] text-purple-400/70 text-xs px-4 py-2 bg-purple-900/20 rounded-full border border-purple-500/20">
          {text}
        </span>
      </div>
    ) : null;
  }

  // Decrypting indicator
  if (decrypting && type === "received") {
    return (
      <div className="flex items-end gap-2 mb-3">
        {showAvatar && (
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-[#00ff88]/30">
            <img 
              src="./cloaked-messenger-portrait-KakJfYU78kjRavrkE3GIf.png" 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="bg-gradient-to-r from-purple-900/40 to-[#00ff88]/10 rounded-2xl rounded-bl-md px-4 py-3 border border-[#00ff88]/20">
          <div className="flex gap-1 items-center">
            <span className="font-['Orbitron'] text-[#00ff88]/60 text-xs animate-pulse">DECRYPTING</span>
            <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    );
  }

  if (!visible) return null;

  if (type === "received") {
    return (
      <div className="flex items-end gap-2 mb-3 animate-[fadeIn_0.3s_ease-out]">
        {showAvatar && (
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-[#00ff88]/30">
            <img 
              src="./cloaked-messenger-portrait-KakJfYU78kjRavrkE3GIf.png" 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="max-w-[75%]">
          <div className="bg-gradient-to-r from-purple-900/40 to-[#00ff88]/10 rounded-2xl rounded-bl-md px-4 py-2.5 border border-[#00ff88]/20">
            <p className="font-['Rajdhani'] text-white/90 text-[15px] leading-snug">
              {displayText}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Sent message (user reply) - styled as frequency response
  return (
    <div className="flex justify-end mb-3 animate-[fadeIn_0.3s_ease-out]">
      <div className="max-w-[75%]">
        <div className="bg-gradient-to-r from-purple-600/40 to-cyan-500/30 rounded-2xl rounded-br-md px-4 py-2.5 border border-cyan-500/30">
          <p className="font-['Rajdhani'] text-white/90 text-[15px] leading-snug">
            {displayText}
          </p>
        </div>
      </div>
    </div>
  );
};

const CipherSymbols = () => {
  const [symbols, setSymbols] = useState<string[]>([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const newSymbols = Array.from({ length: 8 }, () => 
        CIPHER_SYMBOLS[Math.floor(Math.random() * CIPHER_SYMBOLS.length)]
      );
      setSymbols(newSymbols);
    }, 300);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center gap-2 py-2 opacity-30">
      {symbols.map((symbol, i) => (
        <span 
          key={i} 
          className="font-mono text-[#00ff88] text-sm"
          style={{ 
            textShadow: "0 0 8px #00ff88",
          }}
        >
          {symbol}
        </span>
      ))}
    </div>
  );
};

const PhoneFunnel = () => {
  const [showButton, setShowButton] = useState(false);
  const [messagesComplete, setMessagesComplete] = useState(0);

  const messages = [
    { text: "📡 Incoming transmission...", type: "received" as const, delay: 800 },
    { text: "I've been waiting for you", type: "received" as const, delay: 3500 },
    { text: "⚡ Your frequency detected...", type: "received" as const, delay: 6000 },
    { text: "What frequency? 🤔", type: "sent" as const, delay: 8500 },
    { text: "🔮 Initiating soul scan...", type: "received" as const, delay: 10500 },
    { text: "Analyzing your cosmic signature...", type: "received" as const, delay: 13000 },
    { text: "✨ MATCH FOUND: Cosmic Warrior Soul", type: "received" as const, delay: 16000 },
    { text: "You are one of the seven. The prophecy is real.", type: "received" as const, delay: 19000 },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#050510]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(100,0,180,0.15)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,255,136,0.05)_0%,transparent_50%)]" />
      
      {/* Background phone image with overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "url('./phone-hack-interface-72df7t1UWTdEO8pTIA_gK.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      
      {/* Matrix code effect on sides */}
      <div className="absolute left-0 top-0 w-24 h-full overflow-hidden opacity-15 pointer-events-none">
        <div className="font-mono text-[#00ff88] text-xs leading-tight whitespace-nowrap animate-[matrix-rain_20s_linear_infinite]">
          {Array.from({ length: 100 }, () => 
            CIPHER_SYMBOLS[Math.floor(Math.random() * CIPHER_SYMBOLS.length)]
          ).join('\n')}
        </div>
      </div>
      <div className="absolute right-0 top-0 w-24 h-full overflow-hidden opacity-15 pointer-events-none">
        <div className="font-mono text-[#00ff88] text-xs leading-tight whitespace-nowrap animate-[matrix-rain_25s_linear_infinite]">
          {Array.from({ length: 100 }, () => 
            CIPHER_SYMBOLS[Math.floor(Math.random() * CIPHER_SYMBOLS.length)]
          ).join('\n')}
        </div>
      </div>

      <div className="relative z-10">
        {/* Header - Cosmic style */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 mb-3">
            <span className="text-[#00ff88]/60 text-lg">☽</span>
            <h2 className="font-['Orbitron'] text-lg md:text-xl text-white tracking-wide">
              Cosmic Transmission
            </h2>
            <span className="text-[#00ff88]/60 text-lg">☾</span>
          </div>
          <p className="font-['Rajdhani'] text-purple-300/60 text-sm">
            A higher dimensional being is attempting contact...
          </p>
        </div>
        
        <CosmicTransmissionFrame>
          {/* Messages */}
          <div className="space-y-1">
            {messages.map((msg, i) => (
              <CosmicMessage
                key={i}
                text={msg.text}
                type={msg.type}
                delay={msg.delay}
                showAvatar={i === 0 || messages[i-1]?.type !== "received"}
                onComplete={() => {
                  const newCount = messagesComplete + 1;
                  setMessagesComplete(newCount);
                  if (i === messages.length - 1) {
                    setTimeout(() => setShowButton(true), 500);
                  }
                }}
              />
            ))}
          </div>
          
          <CipherSymbols />
          
          {/* Action button - cosmic style */}
          {showButton && (
            <div className="mt-4 animate-[fadeIn_0.5s_ease-out]">
              <button className="w-full py-3.5 font-['Orbitron'] text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-[#00ff88]/70 to-cyan-500 rounded-xl transition-all duration-300 hover:scale-[1.02] uppercase tracking-wider relative overflow-hidden group">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span>⚡</span>
                  DECRYPT MESSAGE
                  <span>⚡</span>
                </span>
                
                {/* Button glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-[#00ff88]/70 to-cyan-500 blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
              </button>
              
              <p className="text-center mt-3 font-['Rajdhani'] text-[#00ff88]/50 text-xs">
                Your cosmic identity awaits...
              </p>
            </div>
          )}
        </CosmicTransmissionFrame>
        
        {/* Bottom decorative elements */}
        <div className="mt-6 flex justify-center gap-4 opacity-30">
          {["◈", "✧", "☽", "⚡", "☾", "✧", "◈"].map((symbol, i) => (
            <span 
              key={i}
              className="text-[#00ff88] text-lg animate-pulse"
              style={{ 
                animationDelay: `${i * 0.2}s`,
                textShadow: "0 0 8px #00ff88"
              }}
            >
              {symbol}
            </span>
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes matrix-rain {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </section>
  );
};

export default PhoneFunnel;
