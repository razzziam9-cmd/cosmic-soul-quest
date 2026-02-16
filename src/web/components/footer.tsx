import { useState } from "react";

const SocialIcon = ({ platform, href }: { platform: string; href: string }) => {
  const icons: Record<string, string> = {
    instagram: "📷",
    tiktok: "🎵",
    youtube: "▶️",
    facebook: "👥",
  };
  
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-12 h-12 rounded-xl bg-purple-900/30 border border-purple-500/30 flex items-center justify-center text-xl transition-all duration-300 hover:border-[#00ff88]/50 hover:bg-[#00ff88]/10 hover:scale-110 group"
    >
      <span className="group-hover:scale-110 transition-transform">{icons[platform]}</span>
    </a>
  );
};

const EncryptedSignup = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [encrypting, setEncrypting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setEncrypting(true);
    setTimeout(() => {
      setEncrypting(false);
      setSubmitted(true);
    }, 2000);
  };
  
  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="text-4xl mb-4">✅</div>
        <h4 className="font-['Orbitron'] text-[#00ff88] text-lg mb-2">
          TRANSMISSION SECURED
        </h4>
        <p className="font-['Rajdhani'] text-zinc-400 text-sm">
          Encrypted channel established. Watch for incoming transmissions.
        </p>
      </div>
    );
  }
  
  if (encrypting) {
    return (
      <div className="text-center py-6">
        <div className="text-4xl mb-4 animate-spin">🔐</div>
        <h4 className="font-['Orbitron'] text-purple-400 text-lg mb-2 animate-pulse">
          ENCRYPTING CHANNEL...
        </h4>
        <div className="font-mono text-[#00ff88] text-xs opacity-50">
          {"█".repeat(Math.floor(Math.random() * 20 + 5))}
        </div>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
          📡
        </div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your frequency signature..."
          className="w-full pl-12 pr-4 py-4 bg-[#0a0a1f]/80 border border-purple-500/30 rounded-xl font-['Rajdhani'] text-white placeholder:text-zinc-500 focus:border-[#00ff88]/50 focus:outline-none transition-all duration-300"
          required
        />
      </div>
      
      <button
        type="submit"
        className="w-full py-4 font-['Orbitron'] text-base font-bold text-white bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] rounded-xl transition-all duration-300 hover:scale-[1.02] uppercase tracking-wider"
      >
        👆 Tap to Connect
      </button>
      
      <p className="font-['Rajdhani'] text-zinc-500 text-xs text-center">
        🔒 Your transmission is protected by quantum encryption
      </p>
    </form>
  );
};

const FrequencyLinkForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [transmitting, setTransmitting] = useState(false);
  const [sent, setSent] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTransmitting(true);
    setTimeout(() => {
      setTransmitting(false);
      setSent(true);
    }, 2500);
  };
  
  if (sent) {
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-4">⚡</div>
        <h4 className="font-['Orbitron'] text-[#00ff88] text-xl mb-2">
          FREQUENCY LINK ESTABLISHED
        </h4>
        <p className="font-['Rajdhani'] text-zinc-400">
          Your message has been transmitted through the cosmic network.
          <br />
          Expect a response within 1-2 Earth cycles.
        </p>
      </div>
    );
  }
  
  if (transmitting) {
    return (
      <div className="text-center py-8">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-[#00ff88]/30 animate-ping" />
          <div className="absolute inset-2 rounded-full border border-purple-500/50 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center text-3xl">
            📡
          </div>
        </div>
        <h4 className="font-['Orbitron'] text-purple-400 text-lg mb-2 animate-pulse">
          TRANSMITTING...
        </h4>
        <p className="font-['Rajdhani'] text-zinc-500 text-sm">
          Routing through cosmic relay network...
        </p>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="font-['Orbitron'] text-xs text-purple-400 mb-2 block">
            DESIGNATION
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Your Earth name"
            className="w-full px-4 py-3 bg-[#0a0a1f]/80 border border-purple-500/30 rounded-xl font-['Rajdhani'] text-white placeholder:text-zinc-600 focus:border-[#00ff88]/50 focus:outline-none transition-all"
            required
          />
        </div>
        <div>
          <label className="font-['Orbitron'] text-xs text-purple-400 mb-2 block">
            FREQUENCY SIGNATURE
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="your@frequency.link"
            className="w-full px-4 py-3 bg-[#0a0a1f]/80 border border-purple-500/30 rounded-xl font-['Rajdhani'] text-white placeholder:text-zinc-600 focus:border-[#00ff88]/50 focus:outline-none transition-all"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="font-['Orbitron'] text-xs text-purple-400 mb-2 block">
          TRANSMISSION CONTENT
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Encode your message here..."
          rows={4}
          className="w-full px-4 py-3 bg-[#0a0a1f]/80 border border-purple-500/30 rounded-xl font-['Rajdhani'] text-white placeholder:text-zinc-600 focus:border-[#00ff88]/50 focus:outline-none transition-all resize-none"
          required
        />
      </div>
      
      <button
        type="submit"
        className="w-full py-4 font-['Orbitron'] text-base font-bold text-white bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] rounded-xl transition-all duration-300 hover:scale-[1.02] uppercase tracking-wider flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
        Swipe Up to Send
      </button>
    </form>
  );
};

const Footer = () => {
  return (
    <footer className="relative bg-[#030308] border-t border-purple-500/20 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(100,0,180,0.1)_0%,transparent_60%)]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 mb-16">
          
          {/* Encrypted Communication Channel */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[#00ff88]">🔐</span>
              <h3 className="font-['Orbitron'] text-lg text-white tracking-wider">
                ENCRYPTED CHANNEL
              </h3>
            </div>
            <p className="font-['Rajdhani'] text-zinc-400 mb-6 text-sm">
              Join the cosmic network. Receive transmissions about new awakenings, 
              book releases, and academy updates.
            </p>
            <EncryptedSignup />
          </div>
          
          {/* Direct Frequency Link */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-purple-400">📡</span>
              <h3 className="font-['Orbitron'] text-lg text-white tracking-wider">
                ESTABLISH DIRECT FREQUENCY LINK
              </h3>
            </div>
            <p className="font-['Rajdhani'] text-zinc-400 mb-6 text-sm">
              Need to reach us directly? Use the secure transmission form below.
            </p>
            <FrequencyLinkForm />
          </div>
        </div>
        
        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mb-12" />
        
        {/* Bottom section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo/Brand */}
          <div className="text-center md:text-left">
            <h4 className="font-['Cinzel'] text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-cyan-400 font-bold mb-2">
              COSMIC SOUL QUEST
            </h4>
            <p className="font-['Rajdhani'] text-zinc-500 text-sm">
              Awakening cosmic warriors since the beginning of time
            </p>
          </div>
          
          {/* Social links */}
          <div className="flex flex-col items-center gap-4">
            <span className="font-['Orbitron'] text-xs text-zinc-500 tracking-wider">
              CONNECT ACROSS DIMENSIONS
            </span>
            <div className="flex gap-3">
              <SocialIcon platform="instagram" href="https://instagram.com/Cosmic_soul_quest" />
              <SocialIcon platform="tiktok" href="https://tiktok.com" />
              <SocialIcon platform="youtube" href="https://youtube.com" />
              <SocialIcon platform="facebook" href="https://facebook.com" />
            </div>
          </div>
          
          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-6 font-['Rajdhani'] text-sm">
            <a href="#" className="text-zinc-400 hover:text-[#00ff88] transition-colors">The Book</a>
            <a href="#" className="text-zinc-400 hover:text-[#00ff88] transition-colors">Academy</a>
            <a href="#" className="text-zinc-400 hover:text-[#00ff88] transition-colors">Soul Quiz</a>
            <a href="#" className="text-zinc-400 hover:text-[#00ff88] transition-colors">FAQ</a>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="text-center mt-12 pt-8 border-t border-zinc-800/50">
          <p className="font-['Rajdhani'] text-zinc-600 text-sm">
            © {new Date().getFullYear()} Cosmic Soul Quest. All rights reserved across all dimensions.
          </p>
          <div className="flex justify-center gap-4 mt-4 text-xs font-['Rajdhani'] text-zinc-700">
            <a href="#" className="hover:text-zinc-500 transition-colors">Privacy Protocol</a>
            <span>•</span>
            <a href="#" className="hover:text-zinc-500 transition-colors">Terms of Awakening</a>
            <span>•</span>
            <a href="#" className="hover:text-zinc-500 transition-colors">Cookie Frequencies</a>
          </div>
          
          {/* Decorative symbols */}
          <div className="flex justify-center gap-3 mt-6 opacity-30">
            {["✧", "☽", "◈", "☾", "✧"].map((s, i) => (
              <span key={i} className="text-purple-500">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
