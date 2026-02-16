import { useState } from "react";

interface PricingTierProps {
  name: string;
  price: string;
  period: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

const PricingTier = ({ name, price, period, features, highlighted = false, badge }: PricingTierProps) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <div 
      className={`relative p-6 md:p-8 rounded-2xl transition-all duration-500 ${
        highlighted 
          ? 'bg-gradient-to-br from-purple-900/60 via-[#0a0a2e] to-cyan-900/40 border-2 border-[#00ff88]/50 scale-105' 
          : 'bg-[#0a0a1f]/80 border border-purple-500/20 hover:border-purple-500/40'
      } ${hovered ? 'transform scale-[1.02]' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        boxShadow: highlighted 
          ? "0 0 40px rgba(0, 255, 136, 0.2), inset 0 0 40px rgba(0, 255, 136, 0.05)"
          : "0 0 20px rgba(100, 0, 180, 0.1)",
      }}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#00ff88] to-emerald-400 text-[#050510] font-['Orbitron'] text-xs font-bold px-4 py-1.5 rounded-full">
          {badge}
        </div>
      )}
      
      {/* Tier name */}
      <div className="text-center mb-6">
        <span className="text-3xl mb-2 block">
          {name === "Initiate" && "☆"}
          {name === "Warrior" && "✧"}
          {name === "Master" && "◈"}
        </span>
        <h3 className={`font-['Orbitron'] text-xl md:text-2xl font-bold ${
          highlighted ? 'text-[#00ff88]' : 'text-purple-300'
        }`}>
          {name}
        </h3>
      </div>
      
      {/* Price */}
      <div className="text-center mb-6">
        <div className="font-['Orbitron'] text-4xl md:text-5xl font-black text-white mb-1">
          {price}
        </div>
        <span className="font-['Rajdhani'] text-zinc-400 text-sm">{period}</span>
      </div>
      
      {/* Divider */}
      <div className={`w-full h-px mb-6 ${
        highlighted 
          ? 'bg-gradient-to-r from-transparent via-[#00ff88]/50 to-transparent' 
          : 'bg-gradient-to-r from-transparent via-purple-500/30 to-transparent'
      }`} />
      
      {/* Features */}
      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3 font-['Rajdhani'] text-zinc-300">
            <span className={`mt-0.5 ${highlighted ? 'text-[#00ff88]' : 'text-purple-400'}`}>✦</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      {/* CTA Button */}
      <button className={`w-full py-4 rounded-xl font-['Orbitron'] text-base font-bold uppercase tracking-wider transition-all duration-300 ${
        highlighted 
          ? 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white hover:scale-[1.02]' 
          : 'border-2 border-white/30 text-white/80 hover:border-white/50 hover:bg-white/5'
      }`}>
        {highlighted ? '👆 Tap to Join' : '👆 Tap to Select'}
      </button>
    </div>
  );
};

const AcademySection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: "url('./mystical-physics-symbols-lYqViB_x7rGKlaTO5WzCY.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      
      {/* Dark overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510]/95 via-[#050510]/85 to-[#050510]/95" />
      
      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-500/5 blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple-500/10 blur-[80px]" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-12 h-px bg-gradient-to-r from-transparent to-[#00ff88]" />
            <span className="font-['Orbitron'] text-[#00ff88] text-sm tracking-[0.3em] uppercase">
              Advanced Training
            </span>
            <span className="w-12 h-px bg-gradient-to-l from-transparent to-[#00ff88]" />
          </div>
          
          <h2 className="font-['Cinzel'] text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 font-bold tracking-wider mb-6"
            style={{ textShadow: "0 0 40px rgba(255, 200, 0, 0.3)" }}
          >
            GALACTIC STAR CRYSTAL
            <span className="block mt-2">ACADEMY</span>
          </h2>
          
          <div className="max-w-3xl mx-auto">
            <p className="font-['Rajdhani'] text-lg md:text-xl text-zinc-300 leading-relaxed mb-4">
              Advanced training for awakened souls. Learn the{" "}
              <span className="text-amber-300 font-semibold">seven secret steps</span>{" "}
              to remember who you truly are.
            </p>
            <p className="font-['Rajdhani'] text-base md:text-lg text-purple-300/80">
              Master <span className="text-cyan-300">quantum manifestation</span> and{" "}
              <span className="text-amber-200">cosmic frequency alignment</span>.
            </p>
          </div>
          
          {/* Decorative symbols */}
          <div className="flex justify-center gap-6 mt-8 opacity-50">
            {["☉", "☽", "✧", "◈", "✧", "☽", "☉"].map((symbol, i) => (
              <span 
                key={i}
                className="text-amber-400 text-xl md:text-2xl animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                {symbol}
              </span>
            ))}
          </div>
        </div>
        
        {/* Core teachings preview */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: "Ψ", title: "Soul Recognition", desc: "Discover your true cosmic origin and remember your mission" },
            { icon: "Ω", title: "Frequency Mastery", desc: "Align your vibration with higher dimensional energies" },
            { icon: "∞", title: "Quantum Creation", desc: "Learn to manifest reality through consciousness" },
          ].map((teaching, i) => (
            <div 
              key={i}
              className="p-6 rounded-2xl bg-[#0a0a1f]/60 border border-amber-500/20 backdrop-blur-sm text-center hover:border-amber-500/40 transition-all duration-300"
            >
              <span className="text-4xl text-amber-400 block mb-4"
                style={{ textShadow: "0 0 20px rgba(255, 200, 0, 0.5)" }}
              >
                {teaching.icon}
              </span>
              <h4 className="font-['Orbitron'] text-lg text-amber-200 mb-2">{teaching.title}</h4>
              <p className="font-['Rajdhani'] text-zinc-400 text-sm">{teaching.desc}</p>
            </div>
          ))}
        </div>
        
        {/* Pricing tiers */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          <PricingTier
            name="Initiate"
            price="$47"
            period="/month"
            features={[
              "Access to foundational modules",
              "Weekly group meditations",
              "Community forum access",
              "Soul archetype assessment",
            ]}
          />
          
          <PricingTier
            name="Warrior"
            price="$97"
            period="/month"
            features={[
              "All Initiate features",
              "Advanced frequency training",
              "Monthly 1-on-1 guidance session",
              "Exclusive warrior transmissions",
              "Crystal activation ceremony",
            ]}
            highlighted
            badge="MOST POPULAR"
          />
          
          <PricingTier
            name="Master"
            price="$197"
            period="/month"
            features={[
              "All Warrior features",
              "Weekly private mentorship",
              "Master-level teachings",
              "Certification program",
              "Lead group ceremonies",
              "Lifetime community access",
            ]}
          />
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="font-['Rajdhani'] text-zinc-400 mb-6">
            Not sure which path is right for you?
          </p>
          <button className="px-8 py-4 font-['Orbitron'] text-base font-medium text-white/80 border-2 border-white/30 rounded-xl transition-all duration-300 hover:border-white/50 hover:bg-white/5 uppercase tracking-wider">
            👆 Tap for Soul Assessment
          </button>
          
          {/* Instagram Share Button */}
          <div className="mt-6">
            <a
              href="https://instagram.com/Cosmic_soul_quest"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#833AB4]/20 to-[#FD1D1D]/20 border border-[#FD1D1D]/30 text-white/80 font-['Rajdhani'] text-sm hover:border-[#FD1D1D]/60 transition-all hover:scale-105"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
              </svg>
              Share Academy to Story 🎓
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AcademySection;
