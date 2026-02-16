import { useState, useEffect } from "react";

// Cipher symbols for the mystical feel
const CIPHER_SYMBOLS = "ΨΩΦΣΠΘΞΛΚΙΗΖΕΔΓΒΑψωφσπθξλκιηζεδγβα∞∑∏√∂∫⊗⊕⊙◊◈✧✦★☆⚡☽☾☀☁❂✺✹✸";

// Instagram icon component
const InstagramIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
    <circle cx="12" cy="12" r="3.5"/>
    <circle cx="18.5" cy="5.5" r="1.5"/>
  </svg>
);

// Instagram DM Phone Frame - mimics DM interface
const InstagramDMFrame = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative w-full max-w-[420px] mx-auto">
      {/* Phone outer frame */}
      <div className="relative bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-[3rem] p-3 shadow-2xl">
        {/* Phone notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20" />
        
        {/* Phone screen */}
        <div className="relative bg-black rounded-[2.5rem] overflow-hidden min-h-[650px] border border-zinc-700/50">
          {/* Instagram DM Header */}
          <div className="bg-black pt-12 pb-3 px-4 border-b border-zinc-800">
            <div className="flex items-center justify-between">
              {/* Back arrow */}
              <button className="text-white p-2 -ml-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              </button>
              
              {/* Profile info center */}
              <a 
                href="https://instagram.com/Cosmic_soul_quest" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#833AB4] via-[#FD1D1D] to-[#F77737] p-0.5">
                  <div className="w-full h-full rounded-full bg-black overflow-hidden">
                    <img 
                      src="./cloaked-messenger-portrait-KakJfYU78kjRavrkE3GIf.png" 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-['Rajdhani'] text-white text-sm font-semibold group-hover:opacity-70 transition-opacity">
                    Cosmic_soul_quest
                  </p>
                  <p className="font-['Rajdhani'] text-zinc-500 text-xs">Active now</p>
                </div>
              </a>
              
              {/* Right icons */}
              <div className="flex items-center gap-2">
                {/* Video call icon */}
                <button className="text-white p-2">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M15 10l5-3v10l-5-3m-3 0H5a2 2 0 01-2-2V8a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2z"/>
                  </svg>
                </button>
                {/* Info icon */}
                <button className="text-white p-2 -mr-2">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4M12 8h.01"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Screen content - DM messages area */}
          <div className="relative z-0 px-4 py-4 pb-20 min-h-[450px] bg-black">
            {/* Encryption badge */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80">
                <svg className="w-3 h-3 text-zinc-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                </svg>
                <span className="font-['Rajdhani'] text-zinc-500 text-xs">Messages encrypted • Cosmic channel</span>
              </div>
            </div>
            
            {children}
          </div>
          
          {/* Instagram DM Input Bar - Fixed at bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-black border-t border-zinc-800 p-3 rounded-b-[2.5rem]">
            <div className="flex items-center gap-3">
              {/* Camera icon */}
              <button className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#833AB4] via-[#FD1D1D] to-[#F77737] flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
                  <path d="M20 4h-3.17L15 2H9L7.17 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm-8 13a5 5 0 110-10 5 5 0 010 10z"/>
                </svg>
              </button>
              
              {/* Message input */}
              <div className="flex-1 bg-zinc-900 rounded-full px-4 py-2.5 flex items-center">
                <input 
                  type="text" 
                  placeholder="Message..."
                  className="bg-transparent text-white text-sm font-['Rajdhani'] w-full outline-none placeholder:text-zinc-500"
                  readOnly
                />
              </div>
              
              {/* Mic icon */}
              <button className="text-white p-2 shrink-0">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3z"/>
                  <path d="M19 11a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 10-2 0 7 7 0 006 6.92V21h-3a1 1 0 100 2h8a1 1 0 100-2h-3v-3.08A7 7 0 0019 11z"/>
                </svg>
              </button>
              
              {/* Image icon */}
              <button className="text-white p-2 shrink-0">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M21 15l-5-5L5 21"/>
                </svg>
              </button>
              
              {/* Sticker/GIF icon */}
              <button className="text-white p-2 shrink-0">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                  <line x1="9" y1="9" x2="9.01" y2="9"/>
                  <line x1="15" y1="9" x2="15.01" y2="9"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-zinc-600 rounded-full" />
      </div>
    </div>
  );
};

interface DMMessageProps {
  text: string;
  delay: number;
  type: "received" | "sent" | "system";
  onComplete?: () => void;
  showAvatar?: boolean;
}

const DMMessage = ({ text, delay, type, onComplete, showAvatar = true }: DMMessageProps) => {
  const [visible, setVisible] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      if (type === "received") {
        setTyping(true);
        // Show typing indicator for 1.5s
        setTimeout(() => {
          setTyping(false);
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
        }, 1500);
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
        <span className="font-['Rajdhani'] text-zinc-500 text-xs px-3 py-1 bg-zinc-900/50 rounded-full">
          {text}
        </span>
      </div>
    ) : null;
  }

  // Typing indicator
  if (typing && type === "received") {
    return (
      <div className="flex items-end gap-2 mb-3">
        {showAvatar && (
          <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
            <img 
              src="./cloaked-messenger-portrait-KakJfYU78kjRavrkE3GIf.png" 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="bg-zinc-800 rounded-2xl rounded-bl-md px-4 py-3">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
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
          <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
            <img 
              src="./cloaked-messenger-portrait-KakJfYU78kjRavrkE3GIf.png" 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="max-w-[75%]">
          <div className="bg-zinc-800 rounded-2xl rounded-bl-md px-4 py-2.5">
            <p className="font-['Rajdhani'] text-white text-[15px] leading-snug">
              {displayText}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Sent message (user reply)
  return (
    <div className="flex justify-end mb-3 animate-[fadeIn_0.3s_ease-out]">
      <div className="max-w-[75%]">
        <div className="bg-gradient-to-r from-[#833AB4] via-[#C13584] to-[#E1306C] rounded-2xl rounded-br-md px-4 py-2.5">
          <p className="font-['Rajdhani'] text-white text-[15px] leading-snug">
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
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 mb-3">
            <InstagramIcon className="w-5 h-5 text-white" />
            <h2 className="font-['Orbitron'] text-lg md:text-xl text-white tracking-wide">
              Direct Messages
            </h2>
          </div>
          <p className="font-['Rajdhani'] text-zinc-500 text-sm">
            @Cosmic_soul_quest is sending you a message
          </p>
        </div>
        
        <InstagramDMFrame>
          {/* Messages */}
          <div className="space-y-1">
            {messages.map((msg, i) => (
              <DMMessage
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
          
          {/* Action button */}
          {showButton && (
            <div className="mt-4 animate-[fadeIn_0.5s_ease-out]">
              <button className="w-full py-3.5 font-['Orbitron'] text-sm font-bold text-white bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] rounded-xl transition-all duration-300 hover:scale-[1.02] uppercase tracking-wider relative overflow-hidden group">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span>👆</span>
                  Tap to Reply
                  <span>👆</span>
                </span>
                
                {/* Button glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
              </button>
              
              <p className="text-center mt-3 font-['Rajdhani'] text-zinc-500 text-xs">
                Your cosmic identity awaits...
              </p>
            </div>
          )}
        </InstagramDMFrame>
        
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
