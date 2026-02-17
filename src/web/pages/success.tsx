import { useEffect, useState } from "react";
import { useLocation } from "wouter";

// Matrix rain canvas effect
const MatrixRain = () => {
  return (
    <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,136,0.1)_0%,transparent_70%)]" />
    </div>
  );
};

// Product information mapping
const productInfo: Record<string, { name: string; type: "book" | "academy" | "bundle"; description: string; icon: string; hasDigitalDownload: boolean }> = {
  book_digital: {
    name: "Cosmic Soul Quest - Digital",
    type: "book",
    description: "Your digital copy is ready for download. Begin your journey through the cosmos.",
    icon: "📱",
    hasDigitalDownload: true
  },
  book_paperback: {
    name: "Cosmic Soul Quest - Paperback",
    type: "book",
    description: "Your paperback edition is on its way. Expect delivery within 5-7 days.",
    icon: "📚",
    hasDigitalDownload: false
  },
  book_collector: {
    name: "Cosmic Soul Quest - Collector's Edition",
    type: "book",
    description: "Your exclusive Collector's Edition with premium materials is being prepared. Digital version included!",
    icon: "✨",
    hasDigitalDownload: true
  },
  academy_initiate: {
    name: "Academy - Initiate Path",
    type: "academy",
    description: "Welcome, Initiate. Your training begins now. Access the portal below.",
    icon: "🌟",
    hasDigitalDownload: false
  },
  academy_warrior: {
    name: "Academy - Warrior Path",
    type: "academy",
    description: "Warrior, you've chosen the path of power. Advanced training awaits.",
    icon: "⚔️",
    hasDigitalDownload: false
  },
  academy_master: {
    name: "Academy - Master Path",
    type: "academy",
    description: "Master, the highest secrets are now within your reach. Ascend.",
    icon: "👁️",
    hasDigitalDownload: false
  },
  awakening_bundle: {
    name: "Complete Awakening Bundle",
    type: "bundle",
    description: "You've unlocked the full cosmic experience. Book series, Academy access, and Crystal Kit are all yours.",
    icon: "💎",
    hasDigitalDownload: true
  }
};

const SuccessPage = () => {
  const [, navigate] = useLocation();
  const [productId, setProductId] = useState<string | null>(null);
  const [showContent, setShowContent] = useState(false);
  const [downloadPulse, setDownloadPulse] = useState(true);
  
  useEffect(() => {
    // Get product from URL params
    const params = new URLSearchParams(window.location.search);
    const product = params.get("product");
    setProductId(product);
    
    // Animate in content
    setTimeout(() => setShowContent(true), 300);
    
    // Pulse download button periodically
    const pulseInterval = setInterval(() => {
      setDownloadPulse(prev => !prev);
    }, 2000);
    
    return () => clearInterval(pulseInterval);
  }, []);
  
  const product = productId ? productInfo[productId] : null;
  const showDownloadButton = product?.hasDigitalDownload || product?.type === "bundle";
  
  const handleDownload = () => {
    // Create download link
    const link = document.createElement("a");
    link.href = "./cosmic-soul-quest-book.pdf";
    link.download = "Cosmic-Soul-Quest-Book.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="min-h-screen bg-[#050510] text-white overflow-hidden">
      <MatrixRain />
      
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#050510] via-[#0a0a2e] to-[#050510] z-0" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-600/10 blur-[100px] animate-pulse" />
      <div className="fixed bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#00ff88]/10 blur-[80px] animate-pulse" style={{ animationDelay: "1s" }} />
      
      {/* Content */}
      <div className={`relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12 transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Success icon */}
        <div className="relative mb-8">
          <div className="absolute -inset-8 bg-[#00ff88]/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#00ff88]/20 to-purple-600/20 border-2 border-[#00ff88]/50 flex items-center justify-center">
            <span className="text-5xl">{product?.icon || "✨"}</span>
          </div>
          {/* Orbiting rings */}
          <div className="absolute -inset-4 rounded-full border border-[#00ff88]/30 animate-[spin_10s_linear_infinite]" />
          <div className="absolute -inset-8 rounded-full border border-purple-500/20 animate-[spin_15s_linear_infinite_reverse]" />
        </div>
        
        {/* Success header */}
        <h1 
          className="font-['Orbitron'] text-3xl md:text-4xl font-black text-center mb-4 tracking-wider"
          style={{ textShadow: "0 0 30px rgba(0, 255, 136, 0.5)" }}
        >
          <span className="text-[#00ff88]">AWAKENING</span>
          <br />
          <span className="text-white">CONFIRMED</span>
        </h1>
        
        {/* Product info */}
        {product && (
          <div className="max-w-md mx-auto text-center mb-8">
            <h2 className="font-['Cinzel'] text-xl text-purple-300 mb-3">
              {product.name}
            </h2>
            <p className="font-['Rajdhani'] text-zinc-400 leading-relaxed">
              {product.description}
            </p>
          </div>
        )}
        
        {/* PROMINENT DOWNLOAD SECTION for digital products */}
        {showDownloadButton && (
          <div className="w-full max-w-md mb-8">
            <div className="relative">
              {/* Glowing background effect */}
              <div className={`absolute -inset-2 bg-gradient-to-r from-[#00ff88]/30 via-cyan-400/30 to-purple-500/30 rounded-3xl blur-xl transition-opacity duration-1000 ${downloadPulse ? 'opacity-100' : 'opacity-50'}`} />
              
              <div className="relative bg-gradient-to-b from-[#0a0a2e] to-[#0a0a1f] border-2 border-[#00ff88]/50 rounded-2xl p-6 backdrop-blur-sm">
                {/* Header */}
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-2xl">📖</span>
                  <h3 className="font-['Orbitron'] text-lg text-[#00ff88] tracking-wide">
                    YOUR BOOK IS READY!
                  </h3>
                  <span className="text-2xl">✨</span>
                </div>
                
                <p className="font-['Rajdhani'] text-center text-zinc-300 mb-5">
                  Click below to download your copy of <span className="text-[#00ff88]">Cosmic Soul Quest</span>. 
                  Your awakening journey begins now.
                </p>
                
                {/* Download button */}
                <button 
                  onClick={handleDownload}
                  className={`relative w-full py-4 font-['Orbitron'] text-base font-bold text-white rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] uppercase tracking-wider flex items-center justify-center gap-3 overflow-hidden group ${downloadPulse ? 'shadow-[0_0_40px_rgba(0,255,136,0.4)]' : 'shadow-[0_0_20px_rgba(0,255,136,0.2)]'}`}
                  style={{
                    background: "linear-gradient(135deg, #00ff88 0%, #00d4aa 30%, #8b5cf6 70%, #a855f7 100%)"
                  }}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download Your Book Now</span>
                </button>
                
                {/* File info */}
                <div className="flex items-center justify-center gap-4 mt-4 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    PDF Format
                  </span>
                  <span className="w-1 h-1 bg-zinc-600 rounded-full" />
                  <span>Instant Download</span>
                  <span className="w-1 h-1 bg-zinc-600 rounded-full" />
                  <span>Read Anywhere</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Order confirmation box */}
        <div className="w-full max-w-md bg-[#0a0a1f]/80 border border-[#00ff88]/30 rounded-2xl p-6 backdrop-blur-sm mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-[#00ff88]">◈</span>
            <span className="font-['Orbitron'] text-sm text-[#00ff88] tracking-widest">ORDER COMPLETE</span>
            <span className="text-[#00ff88]">◈</span>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="font-['Rajdhani'] text-zinc-500">Status</span>
              <span className="font-['Rajdhani'] text-[#00ff88]">✓ Confirmed</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-['Rajdhani'] text-zinc-500">Payment</span>
              <span className="font-['Rajdhani'] text-[#00ff88]">✓ Processed</span>
            </div>
            {showDownloadButton && (
              <div className="flex justify-between items-center">
                <span className="font-['Rajdhani'] text-zinc-500">Digital Book</span>
                <span className="font-['Rajdhani'] text-[#00ff88]">✓ Ready to Download</span>
              </div>
            )}
            {product?.type === "book" && !product.hasDigitalDownload && (
              <div className="flex justify-between items-center">
                <span className="font-['Rajdhani'] text-zinc-500">Shipping</span>
                <span className="font-['Rajdhani'] text-amber-400">⏳ Processing</span>
              </div>
            )}
            {(product?.type === "academy" || product?.type === "bundle") && (
              <div className="flex justify-between items-center">
                <span className="font-['Rajdhani'] text-zinc-500">Academy Access</span>
                <span className="font-['Rajdhani'] text-[#00ff88]">✓ Activated</span>
              </div>
            )}
          </div>
          
          {/* Additional action buttons for non-digital purchases */}
          <div className="space-y-3">
            {(product?.type === "academy" || product?.type === "bundle") && (
              <button className="w-full py-3 font-['Orbitron'] text-sm font-bold text-white bg-gradient-to-r from-amber-500/80 via-yellow-500/80 to-amber-600/80 rounded-xl transition-all duration-300 hover:scale-[1.02] uppercase tracking-wider flex items-center justify-center gap-2">
                <span>🎓</span>
                Access Academy Portal
              </button>
            )}
          </div>
        </div>
        
        {/* Next steps */}
        <div className="w-full max-w-md">
          <h3 className="font-['Orbitron'] text-sm text-zinc-500 tracking-widest text-center mb-4">
            NEXT STEPS
          </h3>
          <div className="space-y-3">
            {showDownloadButton && (
              <div className="flex items-start gap-3 p-3 bg-[#00ff88]/5 rounded-xl border border-[#00ff88]/30">
                <span className="text-lg">⬇️</span>
                <p className="font-['Rajdhani'] text-sm text-zinc-300">
                  <span className="text-[#00ff88] font-bold">Download your book now</span> using the button above. Your awakening awaits!
                </p>
              </div>
            )}
            <div className="flex items-start gap-3 p-3 bg-[#0a0a1f]/50 rounded-xl border border-purple-500/20">
              <span className="text-lg">📧</span>
              <p className="font-['Rajdhani'] text-sm text-zinc-400">
                Check your email for confirmation and additional access details
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-[#0a0a1f]/50 rounded-xl border border-purple-500/20">
              <span className="text-lg">🔮</span>
              <p className="font-['Rajdhani'] text-sm text-zinc-400">
                Join our community of awakened souls on Instagram @Cosmic_soul_quest
              </p>
            </div>
          </div>
        </div>
        
        {/* Return home button */}
        <button 
          onClick={() => navigate("/")}
          className="mt-8 font-['Rajdhani'] text-zinc-500 hover:text-[#00ff88] transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Return to Home
        </button>
        
        {/* Cosmic symbols footer */}
        <div className="flex justify-center gap-4 mt-12 opacity-30">
          {["Ψ", "Ω", "∞", "Φ", "Σ", "◈", "✧"].map((symbol, i) => (
            <span
              key={i}
              className="font-['Cinzel'] text-xl text-[#00ff88] animate-pulse"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {symbol}
            </span>
          ))}
        </div>
      </div>
      
      {/* Animation keyframes */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SuccessPage;
