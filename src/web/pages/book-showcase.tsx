import { useState, useEffect } from "react";

const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-purple-400 rounded-full animate-pulse"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
            boxShadow: "0 0 10px rgba(168, 85, 247, 0.5)",
          }}
        />
      ))}
    </div>
  );
};

const SacredGeometry = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
      {/* Outer circle */}
      <div className="absolute w-[500px] h-[500px] border border-purple-500/30 rounded-full animate-[spin_60s_linear_infinite]" />
      {/* Middle circles */}
      <div className="absolute w-[400px] h-[400px] border border-cyan-500/20 rounded-full animate-[spin_45s_linear_infinite_reverse]" />
      <div className="absolute w-[300px] h-[300px] border border-[#00ff88]/20 rounded-full animate-[spin_30s_linear_infinite]" />
      {/* Inner geometric shapes */}
      <div className="absolute w-[200px] h-[200px] border border-purple-400/30 rotate-45 animate-[spin_20s_linear_infinite_reverse]" />
    </div>
  );
};

const BookShowcase = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: "url('./cosmic-quantum-background-jw2jNpfQM2YTBpDEPtpac.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510]/90 via-[#050510]/80 to-[#050510]/95" />
      
      <FloatingParticles />
      <SacredGeometry />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Book Cover */}
          <div 
            className="relative group cursor-pointer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <div className={`relative transition-all duration-700 ${hovered ? 'scale-105' : 'scale-100'}`}>
              {/* Glow effect behind book */}
              <div className="absolute -inset-8 bg-gradient-to-r from-purple-600/30 via-[#00ff88]/20 to-cyan-500/30 rounded-3xl blur-2xl opacity-60 animate-pulse" />
              
              {/* Book placeholder */}
              <div className="relative bg-gradient-to-br from-[#1a0a2e] via-[#0a0a2e] to-[#050520] rounded-2xl overflow-hidden aspect-[3/4] border border-purple-500/30 shadow-2xl">
                {/* Book spine */}
                <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/50 to-transparent" />
                
                {/* Cover art placeholder */}
                <div className="absolute inset-4 flex flex-col items-center justify-center text-center p-6">
                  {/* Mystical symbols */}
                  <div className="text-4xl mb-4 opacity-60">
                    <span className="text-[#00ff88]">◈</span>
                    <span className="text-purple-400 mx-2">✧</span>
                    <span className="text-cyan-400">☽</span>
                  </div>
                  
                  <h3 className="font-['Cinzel'] text-2xl md:text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-b from-[#00ff88] via-purple-300 to-cyan-400 font-bold tracking-wider mb-4">
                    COSMIC
                    <br />
                    SOUL
                    <br />
                    QUEST
                  </h3>
                  
                  <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#00ff88] to-transparent my-4" />
                  
                  <p className="font-['Rajdhani'] text-purple-300/80 text-sm uppercase tracking-widest">
                    Book One
                  </p>
                  <p className="font-['Rajdhani'] text-cyan-300/60 text-xs uppercase tracking-widest mt-1">
                    The Awakening
                  </p>
                  
                  {/* Decorative bottom symbols */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 opacity-40">
                    {["Ψ", "Ω", "∞", "Φ", "Σ"].map((s, i) => (
                      <span key={i} className="text-[#00ff88] text-lg">{s}</span>
                    ))}
                  </div>
                </div>
                
                {/* Glowing edge effect */}
                <div className="absolute inset-0 border-2 border-[#00ff88]/20 rounded-2xl pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none" />
              </div>
              
              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-[#00ff88] to-emerald-500 text-[#050510] font-['Orbitron'] text-xs font-bold px-4 py-2 rounded-full shadow-lg animate-bounce"
                style={{ animationDuration: "2s" }}
              >
                NEW SERIES
              </div>
            </div>
          </div>
          
          {/* Book Info */}
          <div className="text-center md:text-left">
            <div className="inline-block mb-4">
              <span className="font-['Orbitron'] text-[#00ff88] text-sm tracking-[0.3em] uppercase px-4 py-2 border border-[#00ff88]/30 rounded-full"
                style={{ textShadow: "0 0 10px #00ff88" }}
              >
                ◈ The Prophecy Begins ◈
              </span>
            </div>
            
            <h2 className="font-['Cinzel'] text-3xl md:text-4xl lg:text-5xl text-white font-bold mb-6 leading-tight">
              Cosmic Soul Quest
              <span className="block text-lg md:text-xl text-purple-300 font-normal mt-2">
                A Journey Beyond the Simulation
              </span>
            </h2>
            
            <div className="w-24 h-0.5 bg-gradient-to-r from-[#00ff88] to-transparent mb-6 mx-auto md:mx-0" />
            
            <p className="font-['Rajdhani'] text-lg md:text-xl text-zinc-300 leading-relaxed mb-8">
              A teenage boy discovers his soul is from another dimension. He's part of an ancient group of{" "}
              <span className="text-[#00ff88] font-semibold">seven cosmic warriors</span> who must reunite to save Earth's frequency from collapsing into the void.
            </p>
            
            <p className="font-['Rajdhani'] text-base md:text-lg text-purple-300/90 leading-relaxed mb-8">
              Blending <span className="text-cyan-300">quantum physics</span> with <span className="text-purple-300">ancient mysticism</span>, this series will awaken your true cosmic identity.
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { icon: "✧", label: "7 Books" },
                { icon: "☽", label: "Mystical" },
                { icon: "⚡", label: "Awakening" },
              ].map((feature, i) => (
                <div key={i} className="text-center p-3 rounded-xl bg-purple-900/20 border border-purple-500/20">
                  <span className="text-2xl text-[#00ff88] block mb-1">{feature.icon}</span>
                  <span className="font-['Rajdhani'] text-sm text-zinc-400">{feature.label}</span>
                </div>
              ))}
            </div>
            
            {/* Pricing & CTA */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button className="relative px-8 py-4 font-['Orbitron'] text-base font-bold text-[#050510] bg-[#00ff88] rounded-xl transition-all duration-300 hover:scale-105 hover:bg-[#00ffaa] uppercase tracking-wider overflow-hidden group">
                  <span className="relative z-10">Get Book Now</span>
                  <div className="absolute inset-0 bg-[#00ff88] blur-lg opacity-50 group-hover:opacity-70 transition-opacity" />
                </button>
                
                <button className="px-8 py-4 font-['Orbitron'] text-base font-medium text-[#00ff88] border-2 border-[#00ff88]/50 rounded-xl transition-all duration-300 hover:border-[#00ff88] hover:bg-[#00ff88]/10 uppercase tracking-wider">
                  Read Sample
                </button>
              </div>
              
              {/* Pricing tiers hint */}
              <div className="flex justify-center md:justify-start gap-6 text-sm font-['Rajdhani']">
                <span className="text-zinc-400">
                  <span className="text-[#00ff88]">$14.99</span> Digital
                </span>
                <span className="text-zinc-500">|</span>
                <span className="text-zinc-400">
                  <span className="text-purple-300">$24.99</span> Paperback
                </span>
                <span className="text-zinc-500">|</span>
                <span className="text-zinc-400">
                  <span className="text-cyan-300">$39.99</span> Collector
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookShowcase;
