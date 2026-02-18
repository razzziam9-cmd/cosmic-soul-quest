import { useState, useEffect, useRef } from "react";

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
// VISUAL EFFECTS
// ===========================================

// Cosmic particle field
const CosmicParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;
    }
    
    const particles: Particle[] = [];
    const colors = ['#00ffaa', '#ff006e', '#8338ec', '#00d4ff', '#ffbe0b'];
    
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
        
        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
      });
      
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// Glowing book effect
const GlowingBook = () => {
  const [glowIntensity, setGlowIntensity] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity(prev => (prev + 0.02) % (Math.PI * 2));
    }, 50);
    return () => clearInterval(interval);
  }, []);
  
  const glow = 0.4 + Math.sin(glowIntensity) * 0.3;
  
  return (
    <div className="relative w-full max-w-xs mx-auto">
      {/* Outer glow layers */}
      <div 
        className="absolute -inset-8 rounded-3xl blur-3xl transition-opacity duration-300"
        style={{
          background: `radial-gradient(ellipse at center, rgba(0, 255, 170, ${glow * 0.4}) 0%, rgba(131, 56, 236, ${glow * 0.3}) 40%, transparent 70%)`,
        }}
      />
      <div 
        className="absolute -inset-4 rounded-2xl blur-xl"
        style={{
          background: `radial-gradient(ellipse at center, rgba(255, 0, 110, ${glow * 0.2}) 0%, transparent 60%)`,
        }}
      />
      
      {/* Book container */}
      <div className="relative bg-gradient-to-br from-[#0d0d1a] via-[#1a0a2e] to-[#0a0a1f] rounded-xl overflow-hidden aspect-[3/4] border border-[#00ffaa]/30"
        style={{
          boxShadow: `0 0 ${30 + glow * 30}px rgba(0, 255, 170, ${glow * 0.5}), 
                      0 0 ${60 + glow * 40}px rgba(131, 56, 236, ${glow * 0.3}),
                      inset 0 0 30px rgba(0, 255, 170, 0.1)`
        }}
      >
        {/* Book spine shadow */}
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-black/60 to-transparent" />
        
        {/* Cover content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          {/* Sacred symbols */}
          <div className="flex items-center gap-2 mb-4 text-2xl opacity-70">
            <span className="text-[#00ffaa] animate-pulse">◈</span>
            <span className="text-[#ff006e]">✧</span>
            <span className="text-[#8338ec]">☽</span>
            <span className="text-[#00d4ff]">⚡</span>
            <span className="text-[#ffbe0b]">☾</span>
            <span className="text-[#ff006e]">✧</span>
            <span className="text-[#00ffaa] animate-pulse">◈</span>
          </div>
          
          {/* Title */}
          <h3 
            className="font-['Cinzel'] text-2xl sm:text-3xl font-bold tracking-wider mb-3 leading-tight"
            style={{
              background: 'linear-gradient(180deg, #00ffaa 0%, #ffffff 50%, #8338ec 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 40px rgba(0, 255, 170, 0.5)'
            }}
          >
            COSMIC
            <br />
            SOUL
            <br />
            QUEST
          </h3>
          
          {/* Divider */}
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#00ffaa] to-transparent my-3" />
          
          <p className="font-['Cormorant_Garamond'] text-[#8338ec] text-sm tracking-[0.2em] uppercase">
            Book One
          </p>
          <p className="font-['Cormorant_Garamond'] text-[#00d4ff]/70 text-xs tracking-widest uppercase mt-1">
            The Awakening
          </p>
          
          {/* Bottom symbols */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 opacity-40">
            {["Ψ", "Ω", "∞", "Φ", "Σ"].map((s, i) => (
              <span key={i} className="text-[#00ffaa] text-sm">{s}</span>
            ))}
          </div>
        </div>
        
        {/* Edge highlight */}
        <div className="absolute inset-0 border border-[#00ffaa]/20 rounded-xl pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-[#00ffaa]/10 to-transparent pointer-events-none" />
      </div>
      
      {/* Secret badge */}
      <div className="absolute -top-3 -right-3 z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-[#ff006e] blur-md opacity-60" />
          <div className="relative bg-gradient-to-br from-[#ff006e] to-[#8338ec] text-white font-['Space_Mono'] text-[10px] font-bold px-3 py-1.5 rounded-full tracking-wider">
            SECRET
          </div>
        </div>
      </div>
    </div>
  );
};

// Pricing card component
interface PricingCardProps {
  title: string;
  price: string;
  originalPrice?: string;
  features: string[];
  productId: string;
  popular?: boolean;
  icon: string;
  accentColor: string;
}

const PricingCard = ({ title, price, originalPrice, features, productId, popular, icon, accentColor }: PricingCardProps) => {
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);
  
  const handleBuy = async () => {
    setLoading(true);
    const url = await initiateCheckout(productId);
    if (url) {
      window.location.href = url;
    } else {
      setLoading(false);
    }
  };
  
  return (
    <div 
      className={`relative rounded-2xl p-px transition-all duration-500 ${hovered ? 'scale-[1.02]' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: popular 
          ? `linear-gradient(135deg, ${accentColor}40 0%, #8338ec40 50%, #00ffaa40 100%)`
          : 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
      }}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-[#ff006e] via-[#ffbe0b] to-[#ff006e] text-black font-['Space_Mono'] text-[10px] font-bold px-4 py-1 rounded-full tracking-wider animate-pulse">
            ★ MOST AWAKENED ★
          </div>
        </div>
      )}
      
      <div className={`relative rounded-2xl p-6 backdrop-blur-sm h-full ${popular ? 'bg-[#0a0a1f]/90' : 'bg-[#0a0a1f]/70'}`}>
        {/* Icon */}
        <div className="text-4xl mb-4 text-center">{icon}</div>
        
        {/* Title */}
        <h3 className="font-['Cinzel'] text-xl text-center mb-2" style={{ color: accentColor }}>
          {title}
        </h3>
        
        {/* Price */}
        <div className="text-center mb-4">
          {originalPrice && (
            <span className="font-['Space_Mono'] text-zinc-500 line-through text-sm mr-2">{originalPrice}</span>
          )}
          <span className="font-['Space_Mono'] text-3xl font-bold text-white">{price}</span>
        </div>
        
        {/* Features */}
        <ul className="space-y-2 mb-6">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 font-['Cormorant_Garamond'] text-zinc-300 text-sm">
              <span className="text-[#00ffaa] mt-0.5">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        {/* CTA Button */}
        <button
          onClick={handleBuy}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-['Space_Mono'] text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.03] active:scale-[0.98]'
          }`}
          style={{
            background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}cc 100%)`,
            boxShadow: hovered ? `0 0 30px ${accentColor}60` : 'none',
            color: accentColor === '#ffbe0b' ? '#000' : '#fff'
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">◈</span> Processing...
            </span>
          ) : (
            <>⚡ BUY NOW ⚡</>
          )}
        </button>
      </div>
    </div>
  );
};

// Testimonial placeholder
const Testimonial = ({ quote, name, title }: { quote: string; name: string; title: string }) => (
  <div className="relative bg-[#0a0a1f]/60 backdrop-blur-sm rounded-xl p-5 border border-[#8338ec]/20">
    <div className="absolute -top-2 left-4 text-3xl text-[#00ffaa]/40">"</div>
    <p className="font-['Cormorant_Garamond'] text-zinc-300 italic text-sm leading-relaxed mb-3 pt-2">
      {quote}
    </p>
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8338ec] to-[#00ffaa] flex items-center justify-center text-xs">
        {name[0]}
      </div>
      <div>
        <p className="font-['Space_Mono'] text-white text-xs">{name}</p>
        <p className="font-['Cormorant_Garamond'] text-[#8338ec] text-[10px]">{title}</p>
      </div>
    </div>
  </div>
);

// Typewriter effect
const TypewriterText = ({ text, className = "" }: { text: string; className?: string }) => {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
      }
    }, 60);
    
    return () => clearInterval(interval);
  }, [text]);
  
  return (
    <span className={className}>
      {displayText}
      {!isComplete && <span className="animate-pulse">|</span>}
    </span>
  );
};

// ===========================================
// MAIN PAGE COMPONENT
// ===========================================

const CosmoPage = () => {
  const [showContent, setShowContent] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  
  useEffect(() => {
    setTimeout(() => setShowContent(true), 300);
    setTimeout(() => setShowPricing(true), 1500);
  }, []);
  
  return (
    <div className="min-h-screen bg-[#050510] text-white overflow-x-hidden">
      {/* Cosmic background */}
      <CosmicParticles />
      
      {/* Background gradients */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(131,56,236,0.15)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,255,170,0.1)_0%,transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(255,0,110,0.1)_0%,transparent_30%)]" />
      </div>
      
      {/* Main content */}
      <div className="relative z-10">
        
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center">
          {/* Secret transmission header */}
          <div className={`transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 border border-[#ff006e]/40 rounded-full bg-[#ff006e]/10 backdrop-blur-sm">
              <span className="w-2 h-2 bg-[#ff006e] rounded-full animate-pulse" />
              <span className="font-['Space_Mono'] text-[#ff006e] text-xs tracking-widest uppercase">
                Classified Transmission
              </span>
            </div>
            
            <h1 
              className="font-['Cinzel'] text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-wide"
              style={{
                background: 'linear-gradient(135deg, #00ffaa 0%, #ffffff 30%, #ff006e 70%, #8338ec 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 60px rgba(0, 255, 170, 0.3)'
              }}
            >
              <TypewriterText text="YOU FOUND THE SECRET TRANSMISSION" />
            </h1>
            
            <p className="font-['Cormorant_Garamond'] text-xl sm:text-2xl text-[#8338ec] italic mb-8 max-w-lg mx-auto">
              Your soul led you here for a reason.
            </p>
          </div>
          
          {/* Book Display */}
          <div className={`mb-10 transition-all duration-1000 delay-300 ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <GlowingBook />
          </div>
          
          {/* What's inside */}
          <div className={`max-w-2xl mx-auto mb-12 transition-all duration-1000 delay-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-['Cinzel'] text-lg text-[#00ffaa] tracking-widest uppercase mb-6">
              ◈ What Awaits Inside ◈
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-4 text-left">
              {[
                { icon: "🌌", text: "Discover your true cosmic origin and soul mission" },
                { icon: "⚡", text: "Unlock the quantum codes hidden in your DNA" },
                { icon: "🔮", text: "Learn why you've always felt different from others" },
                { icon: "✨", text: "Connect with the 7 cosmic warrior archetypes" },
                { icon: "🌙", text: "Ancient wisdom merged with modern physics" },
                { icon: "💫", text: "Activate dormant abilities within you" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-[#0a0a1f]/50 rounded-lg border border-[#8338ec]/20 backdrop-blur-sm">
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-['Cormorant_Garamond'] text-zinc-300 text-sm leading-relaxed">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div className="animate-bounce text-[#00ffaa]/60">
            <svg className="w-6 h-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>
        
        {/* Pricing Section */}
        <section className={`py-20 px-4 transition-all duration-1000 ${showPricing ? 'opacity-100' : 'opacity-0'}`}>
          <div className="max-w-5xl mx-auto">
            {/* Urgency banner */}
            <div className="text-center mb-12">
              <div className="inline-block mb-4 px-6 py-3 bg-gradient-to-r from-[#ff006e]/20 via-[#8338ec]/20 to-[#ff006e]/20 border border-[#ff006e]/40 rounded-full backdrop-blur-sm">
                <span className="font-['Space_Mono'] text-[#ff006e] text-sm tracking-wider">
                  ⚠ Only awakened souls receive this link ⚠
                </span>
              </div>
              
              <h2 className="font-['Cinzel'] text-2xl sm:text-3xl text-white font-bold mb-2">
                Choose Your Path to Awakening
              </h2>
              <p className="font-['Cormorant_Garamond'] text-zinc-400 text-lg">
                The universe doesn't offer second chances
              </p>
            </div>
            
            {/* Pricing cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <PricingCard
                title="Digital Seeker"
                price="$14.99"
                originalPrice="$19.99"
                productId="book_digital"
                icon="📱"
                accentColor="#00ffaa"
                features={[
                  "Instant PDF download",
                  "Read on any device",
                  "Bonus: Chakra Activation Guide",
                  "Lifetime access"
                ]}
              />
              
              <PricingCard
                title="Sacred Paperback"
                price="$24.99"
                originalPrice="$34.99"
                productId="book_paperback"
                icon="📖"
                accentColor="#ffbe0b"
                popular
                features={[
                  "Physical sacred text",
                  "Premium matte cover",
                  "Ritual-ready paper",
                  "Digital version included",
                  "Free sacred bookmark"
                ]}
              />
              
              <PricingCard
                title="Collector's Artifact"
                price="$39.99"
                originalPrice="$59.99"
                productId="book_collector"
                icon="✨"
                accentColor="#8338ec"
                features={[
                  "Limited edition hardcover",
                  "Gold-foil cosmic symbols",
                  "Signed certificate of awakening",
                  "Exclusive bonus chapters",
                  "Digital version included"
                ]}
              />
            </div>
            
            {/* Testimonials */}
            <div className="mb-16">
              <h3 className="font-['Cinzel'] text-lg text-[#8338ec] text-center tracking-widest uppercase mb-8">
                ◈ Fellow Awakened Souls ◈
              </h3>
              
              <div className="grid sm:grid-cols-3 gap-4">
                <Testimonial
                  quote="I always knew I was different. This book confirmed everything my soul has been trying to tell me."
                  name="Aurora M."
                  title="Starweaver Awakened"
                />
                <Testimonial
                  quote="The quantum codes in chapter 7 literally changed my reality. I can't explain it, but I feel it."
                  name="Zephyr K."
                  title="Crystal Healer"
                />
                <Testimonial
                  quote="Found this through a strange synchronicity. My dreams haven't been the same since."
                  name="Nova R."
                  title="Knowledge Keeper"
                />
              </div>
            </div>
            
            {/* Final CTA */}
            <div className="text-center">
              <div className="inline-block p-8 bg-[#0a0a1f]/80 rounded-2xl border border-[#00ffaa]/30 backdrop-blur-sm">
                <p className="font-['Cormorant_Garamond'] text-[#8338ec] text-lg italic mb-4">
                  "In every generation, seven souls awaken to save the cosmic frequency."
                </p>
                <p className="font-['Space_Mono'] text-[#00ffaa] text-sm tracking-wider mb-6">
                  Are you one of them?
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  {["Ψ", "Ω", "∞", "Φ", "Σ", "◈", "✧"].map((symbol, i) => (
                    <span 
                      key={i}
                      className="text-[#00ffaa]/60 text-xl animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    >
                      {symbol}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer - minimal */}
        <footer className="py-8 text-center">
          <p className="font-['Space_Mono'] text-zinc-600 text-xs">
            © {new Date().getFullYear()} Cosmic Soul Quest • Only for awakened souls
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CosmoPage;
