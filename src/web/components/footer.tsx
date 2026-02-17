import { useState } from "react";

// Simple social media icons using SVG
const SocialIcon = ({ platform, href }: { platform: string; href: string }) => {
  const icons: Record<string, JSX.Element> = {
    instagram: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    tiktok: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
      </svg>
    ),
    youtube: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  };
  
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-11 h-11 rounded-full bg-[#0a0a2e] border border-purple-500/30 flex items-center justify-center text-zinc-400 transition-all duration-300 hover:border-[#00ff88]/50 hover:text-[#00ff88] hover:scale-110 hover:shadow-[0_0_15px_rgba(0,255,136,0.3)]"
    >
      {icons[platform]}
    </a>
  );
};

const EmailSignup = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };
  
  if (submitted) {
    return (
      <div className="text-center py-4">
        <div className="text-3xl mb-3">✨</div>
        <h4 className="font-['Orbitron'] text-[#00ff88] text-sm mb-1">
          YOU'RE CONNECTED
        </h4>
        <p className="font-['Rajdhani'] text-zinc-500 text-sm">
          Watch for transmissions from the cosmic network.
        </p>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="text-3xl mb-3 animate-spin">⚡</div>
        <h4 className="font-['Orbitron'] text-purple-400 text-sm animate-pulse">
          ESTABLISHING CONNECTION...
        </h4>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email..."
          className="w-full pl-4 pr-4 py-3 bg-[#0a0a1f] border border-purple-500/30 rounded-lg font-['Rajdhani'] text-white text-sm placeholder:text-zinc-600 focus:border-[#00ff88]/50 focus:outline-none transition-all duration-300"
          required
        />
      </div>
      
      <button
        type="submit"
        className="w-full py-3 font-['Orbitron'] text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-[#00ff88]/70 to-cyan-500 rounded-lg transition-all duration-300 hover:scale-[1.02] uppercase tracking-wider"
      >
        Join the Awakening
      </button>
      
      <p className="font-['Rajdhani'] text-zinc-600 text-xs text-center">
        ✧ No spam, only cosmic wisdom ✧
      </p>
    </form>
  );
};

const Footer = () => {
  return (
    <footer className="relative bg-[#030308] border-t border-purple-500/20 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(100,0,180,0.1)_0%,transparent_60%)]" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
          
          {/* Brand Section */}
          <div>
            <h3 className="font-['Cinzel'] text-xl text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-cyan-400 font-bold mb-3">
              COSMIC SOUL QUEST
            </h3>
            <p className="font-['Rajdhani'] text-zinc-500 text-sm mb-6 leading-relaxed">
              Awakening cosmic warriors to their true identity. 
              Join the journey beyond the simulation.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              <SocialIcon platform="instagram" href="https://instagram.com/Cosmic_soul_quest" />
              <SocialIcon platform="tiktok" href="https://tiktok.com" />
              <SocialIcon platform="youtube" href="https://youtube.com" />
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-['Orbitron'] text-sm text-white mb-4 tracking-wider">
              EXPLORE
            </h4>
            <div className="space-y-2">
              <a href="#book-showcase" className="block font-['Rajdhani'] text-zinc-400 text-sm hover:text-[#00ff88] transition-colors">
                ◈ The Book Series
              </a>
              <a href="#academy" className="block font-['Rajdhani'] text-zinc-400 text-sm hover:text-[#00ff88] transition-colors">
                ◈ Galactic Academy
              </a>
              <a href="#phone-funnel" className="block font-['Rajdhani'] text-zinc-400 text-sm hover:text-[#00ff88] transition-colors">
                ◈ Soul Quiz
              </a>
            </div>
          </div>
          
          {/* Email Signup */}
          <div>
            <h4 className="font-['Orbitron'] text-sm text-white mb-4 tracking-wider">
              STAY CONNECTED
            </h4>
            <p className="font-['Rajdhani'] text-zinc-500 text-sm mb-4">
              Get updates on new releases, academy sessions, and cosmic insights.
            </p>
            <EmailSignup />
          </div>
        </div>
        
        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent mb-8" />
        
        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-['Rajdhani'] text-zinc-600 text-sm">
            © {new Date().getFullYear()} Cosmic Soul Quest. All rights reserved.
          </p>
          
          <div className="flex gap-6 font-['Rajdhani'] text-xs text-zinc-600">
            <a href="#" className="hover:text-zinc-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Terms</a>
          </div>
          
          {/* Sacred symbols */}
          <div className="flex gap-2 opacity-30">
            {["✧", "☽", "◈", "☾", "✧"].map((s, i) => (
              <span key={i} className="text-[#00ff88] text-xs">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
