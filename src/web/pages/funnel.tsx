import { useState, useEffect } from "react";

// Step 1: Secret Code Entry
const SecretCodeEntry = ({ onComplete }: { onComplete: () => void }) => {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  
  const secretCode = "777333"; // The "correct" code
  
  const handleKeyPress = (digit: string) => {
    if (activeIndex >= 6 || verified) return;
    
    const newCode = [...code];
    newCode[activeIndex] = digit;
    setCode(newCode);
    setActiveIndex(prev => prev + 1);
    
    // Check if complete
    if (activeIndex === 5) {
      const enteredCode = [...newCode.slice(0, 5), digit].join("");
      if (enteredCode === secretCode) {
        setVerified(true);
        setTimeout(onComplete, 1500);
      } else {
        // Auto-accept any code for demo purposes
        setVerified(true);
        setTimeout(onComplete, 1500);
      }
    }
  };
  
  const handleDelete = () => {
    if (activeIndex > 0) {
      const newCode = [...code];
      newCode[activeIndex - 1] = "";
      setCode(newCode);
      setActiveIndex(prev => prev - 1);
      setError(false);
    }
  };
  
  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center p-6">
      {/* Lock icon */}
      <div className={`text-6xl mb-8 transition-all duration-500 ${verified ? 'text-[#00ff88] animate-pulse' : 'text-purple-400'}`}>
        {verified ? "🔓" : "🔐"}
      </div>
      
      <h3 className="font-['Orbitron'] text-xl text-white mb-2 text-center">
        {verified ? "ACCESS GRANTED" : "ENTER SACRED CODE"}
      </h3>
      <p className="font-['Rajdhani'] text-zinc-400 text-sm mb-8 text-center">
        {verified ? "Preparing frequency link..." : "The code was sent to your soul at birth"}
      </p>
      
      {/* Code input display */}
      <div className="flex gap-3 mb-8">
        {code.map((digit, i) => (
          <div 
            key={i}
            className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center font-['Orbitron'] text-2xl transition-all duration-300 ${
              verified 
                ? 'border-[#00ff88] bg-[#00ff88]/10 text-[#00ff88]' 
                : i === activeIndex 
                  ? 'border-purple-400 bg-purple-500/10 animate-pulse' 
                  : digit 
                    ? 'border-purple-500/50 bg-purple-900/20 text-white' 
                    : 'border-zinc-700 bg-zinc-900/50 text-zinc-600'
            }`}
            style={{
              boxShadow: i === activeIndex && !verified ? "0 0 15px rgba(168, 85, 247, 0.5)" : undefined,
            }}
          >
            {digit || (i === activeIndex && !verified ? "▋" : "●")}
          </div>
        ))}
      </div>
      
      {/* Keypad */}
      {!verified && (
        <div className="grid grid-cols-3 gap-3 max-w-xs">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "✧", "0", "⌫"].map((key) => (
            <button
              key={key}
              onClick={() => key === "⌫" ? handleDelete() : key !== "✧" && handleKeyPress(key)}
              className={`w-16 h-16 rounded-xl font-['Orbitron'] text-xl transition-all duration-200 ${
                key === "✧" 
                  ? 'bg-transparent text-purple-500/30 cursor-default' 
                  : key === "⌫"
                    ? 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700/50 active:scale-95'
                    : 'bg-purple-900/30 text-white hover:bg-purple-800/40 active:scale-95 border border-purple-500/20 hover:border-purple-500/40'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      )}
      
      {/* Verified animation */}
      {verified && (
        <div className="flex gap-2">
          {["◈", "✧", "☽", "⚡", "☾", "✧", "◈"].map((s, i) => (
            <span 
              key={i}
              className="text-[#00ff88] text-2xl animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// Step 2: Soul Recognition Quiz
const SoulRecognition = ({ onComplete }: { onComplete: (archetype: string) => void }) => {
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
  
  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setScanning(true);
      // Determine archetype based on most common answer position
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
      <div className="min-h-[500px] flex flex-col items-center justify-center p-6">
        <div className="relative w-32 h-32 mb-8">
          {/* Scanning animation */}
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
          <p className="animate-pulse" style={{ animationDelay: "1s" }}>Decoding soul blueprint...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center p-6">
      {/* Progress */}
      <div className="flex gap-2 mb-8">
        {questions.map((_, i) => (
          <div 
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i < currentQuestion ? 'bg-[#00ff88]' : i === currentQuestion ? 'bg-purple-400 animate-pulse' : 'bg-zinc-700'
            }`}
          />
        ))}
      </div>
      
      <h3 className="font-['Orbitron'] text-lg text-purple-300 mb-2 text-center">
        SOUL RECOGNITION SCAN
      </h3>
      <p className="font-['Rajdhani'] text-xl text-white mb-8 text-center max-w-md">
        {questions[currentQuestion].q}
      </p>
      
      <div className="space-y-3 w-full max-w-md">
        {questions[currentQuestion].options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(option)}
            className="w-full p-4 rounded-xl bg-purple-900/30 border border-purple-500/30 text-left font-['Rajdhani'] text-white hover:bg-purple-800/40 hover:border-purple-500/50 transition-all duration-200 active:scale-[0.98]"
          >
            <span className="text-purple-400 mr-3">◈</span>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

// Step 3: Frequency Match (Archetype Reveal)
const FrequencyMatch = ({ archetype, onComplete }: { archetype: string; onComplete: () => void }) => {
  const [revealed, setRevealed] = useState(false);
  
  useEffect(() => {
    setTimeout(() => setRevealed(true), 500);
  }, []);
  
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
    <div className="min-h-[500px] flex flex-col items-center justify-center p-6 text-center">
      {/* Reveal animation */}
      <div className={`transition-all duration-1000 ${revealed ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
        <div className="relative inline-block mb-6">
          <div className={`text-8xl bg-gradient-to-br ${data.color} bg-clip-text text-transparent`}
            style={{ textShadow: "0 0 60px currentColor" }}
          >
            {data.symbol}
          </div>
          <div className="absolute -inset-8 rounded-full bg-gradient-to-br opacity-20 blur-2xl animate-pulse"
            style={{ background: `linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-to))` }}
          />
        </div>
        
        <h3 className="font-['Orbitron'] text-sm text-[#00ff88] tracking-[0.3em] mb-4">
          FREQUENCY MATCH CONFIRMED
        </h3>
        
        <h2 className={`font-['Cinzel'] text-3xl md:text-4xl font-bold bg-gradient-to-r ${data.color} bg-clip-text text-transparent mb-4`}>
          {archetype}
        </h2>
        
        <p className="font-['Rajdhani'] text-lg text-zinc-300 max-w-md mb-8">
          {data.desc}
        </p>
        
        <div className="flex justify-center gap-4 mb-8">
          {["Ψ", "Ω", archetype[0], "Φ", "Σ"].map((s, i) => (
            <span 
              key={i}
              className={`text-xl bg-gradient-to-r ${data.color} bg-clip-text text-transparent animate-pulse`}
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              {s}
            </span>
          ))}
        </div>
        
        <button
          onClick={onComplete}
          className="px-8 py-4 font-['Orbitron'] text-base font-bold text-[#050510] bg-[#00ff88] rounded-xl transition-all duration-300 hover:scale-105 hover:bg-[#00ffaa] uppercase tracking-wider"
        >
          Unlock Your Destiny
        </button>
      </div>
    </div>
  );
};

// Step 4: Awakening Offer
const AwakeningOffer = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 37, seconds: 42 });
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          return { hours: 2, minutes: 37, seconds: 42 }; // Reset for demo
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center p-6 text-center">
      {/* Urgent header */}
      <div className="bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-2 mb-6 animate-pulse">
        <span className="font-['Orbitron'] text-red-400 text-sm">⚠ CLASSIFIED OFFER EXPIRES IN</span>
      </div>
      
      {/* Countdown */}
      <div className="flex gap-4 mb-8">
        {[
          { value: timeLeft.hours, label: "HRS" },
          { value: timeLeft.minutes, label: "MIN" },
          { value: timeLeft.seconds, label: "SEC" },
        ].map((unit, i) => (
          <div key={i} className="text-center">
            <div className="w-16 h-16 rounded-xl bg-[#0a0a2e] border border-[#00ff88]/30 flex items-center justify-center font-['Orbitron'] text-2xl text-[#00ff88] mb-1"
              style={{ boxShadow: "0 0 20px rgba(0, 255, 136, 0.2)" }}
            >
              {String(unit.value).padStart(2, '0')}
            </div>
            <span className="font-['Rajdhani'] text-xs text-zinc-500">{unit.label}</span>
          </div>
        ))}
      </div>
      
      <h2 className="font-['Cinzel'] text-2xl md:text-3xl text-white font-bold mb-4">
        Complete Awakening Bundle
      </h2>
      
      <p className="font-['Rajdhani'] text-zinc-400 mb-6 max-w-md">
        Your soul recognition qualifies you for this exclusive one-time offer
      </p>
      
      {/* Bundle contents */}
      <div className="bg-[#0a0a1f]/80 border border-purple-500/30 rounded-2xl p-6 mb-6 max-w-md w-full">
        <div className="space-y-3 text-left">
          {[
            { icon: "📚", item: "Cosmic Soul Quest - Complete 7-Book Series", value: "$99" },
            { icon: "🎓", item: "Galactic Academy - 3 Month Access", value: "$291" },
            { icon: "💎", item: "Soul Archetype Crystal Kit", value: "$49" },
            { icon: "🔮", item: "Private Frequency Alignment Session", value: "$197" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="font-['Rajdhani'] text-zinc-300">
                <span className="mr-2">{item.icon}</span>
                {item.item}
              </span>
              <span className="font-['Rajdhani'] text-zinc-500 line-through text-sm">{item.value}</span>
            </div>
          ))}
        </div>
        
        <div className="border-t border-purple-500/20 mt-4 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-['Rajdhani'] text-zinc-400">Total Value:</span>
            <span className="font-['Orbitron'] text-zinc-400 line-through">$636</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-['Orbitron'] text-lg text-white">Your Price:</span>
            <span className="font-['Orbitron'] text-3xl text-[#00ff88]">$197</span>
          </div>
        </div>
      </div>
      
      {/* CTA */}
      <button className="w-full max-w-md py-5 font-['Orbitron'] text-lg font-bold text-[#050510] bg-gradient-to-r from-[#00ff88] to-emerald-400 rounded-xl transition-all duration-300 hover:scale-[1.02] uppercase tracking-wider relative overflow-hidden group">
        <span className="relative z-10">CLAIM YOUR DESTINY</span>
        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
      </button>
      
      <p className="font-['Rajdhani'] text-zinc-500 text-sm mt-4">
        🔒 Secure checkout • Instant access • 30-day guarantee
      </p>
    </div>
  );
};

// Main Funnel Component
const FunnelFlow = () => {
  const [step, setStep] = useState(1);
  const [archetype, setArchetype] = useState("");
  
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#050510]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(100,0,180,0.15)_0%,transparent_60%)]" />
      
      <div className="relative z-10 w-full max-w-lg mx-auto">
        {/* Step indicator */}
        <div className="flex justify-center gap-3 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s}
              className={`flex items-center gap-2 ${s <= step ? 'opacity-100' : 'opacity-30'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-['Orbitron'] text-sm ${
                s < step ? 'bg-[#00ff88] text-[#050510]' : s === step ? 'border-2 border-[#00ff88] text-[#00ff88]' : 'border border-zinc-600 text-zinc-600'
              }`}>
                {s < step ? "✓" : s}
              </div>
              {s < 4 && <div className={`w-8 h-0.5 ${s < step ? 'bg-[#00ff88]' : 'bg-zinc-700'}`} />}
            </div>
          ))}
        </div>
        
        {/* Step titles */}
        <div className="text-center mb-6">
          <span className="font-['Orbitron'] text-[#00ff88] text-xs tracking-[0.3em]">
            {step === 1 && "STEP 1: VERIFICATION"}
            {step === 2 && "STEP 2: SOUL SCAN"}
            {step === 3 && "STEP 3: FREQUENCY MATCH"}
            {step === 4 && "STEP 4: ACTIVATION"}
          </span>
        </div>
        
        {/* Content card */}
        <div className="bg-[#0a0a1f]/80 backdrop-blur-xl border border-purple-500/30 rounded-3xl overflow-hidden"
          style={{ boxShadow: "0 0 40px rgba(100, 0, 180, 0.2)" }}
        >
          {step === 1 && <SecretCodeEntry onComplete={() => setStep(2)} />}
          {step === 2 && <SoulRecognition onComplete={(a) => { setArchetype(a); setStep(3); }} />}
          {step === 3 && <FrequencyMatch archetype={archetype} onComplete={() => setStep(4)} />}
          {step === 4 && <AwakeningOffer />}
        </div>
        
        {/* Security badge */}
        <div className="flex justify-center items-center gap-2 mt-6 opacity-50">
          <span className="text-[#00ff88]">🔒</span>
          <span className="font-['Rajdhani'] text-zinc-500 text-sm">CLASSIFIED PROTOCOL ACTIVE</span>
        </div>
      </div>
    </section>
  );
};

export default FunnelFlow;
