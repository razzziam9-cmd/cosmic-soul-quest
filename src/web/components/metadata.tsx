import siteConfig from "../../../website.config.json";

export function Metadata() {
	return (
		<>
			<title>{siteConfig.name}</title>
			<meta name="description" content={siteConfig.description} />

			{/* Open Graph / Facebook / Instagram optimization */}
			<meta property="og:title" content="Cosmic Soul Quest ✨ Discover Your Cosmic Warrior Archetype" />
			<meta property="og:description" content="It's no coincidence you're here. Your soul remembers. Take the cosmic soul scan and discover if you're one of the seven cosmic warriors. 🔮 @Cosmic_soul_quest" />
			<meta property="og:image" content={siteConfig.ogImage} />
			<meta property="og:image:width" content="1200" />
			<meta property="og:image:height" content="630" />
			<meta property="og:image:alt" content="Cosmic Soul Quest - A mystical cloaked messenger awaits to reveal your cosmic warrior archetype" />
			<meta property="og:url" content={siteConfig.url} />
			<meta property="og:type" content="website" />
			<meta property="og:site_name" content="Cosmic Soul Quest" />
			<meta property="og:locale" content="en_US" />

			{/* Instagram specific - helps with link previews */}
			<meta property="instagram:creator" content="@Cosmic_soul_quest" />
			<meta name="instagram:account" content="Cosmic_soul_quest" />
			
			{/* Article tags - improves Instagram link preview */}
			<meta property="article:author" content="@Cosmic_soul_quest" />
			<meta property="article:publisher" content="https://instagram.com/Cosmic_soul_quest" />

			{/* Twitter / X */}
			<meta name="twitter:card" content={siteConfig.twitter.card} />
			<meta name="twitter:site" content={siteConfig.twitter.site} />
			<meta name="twitter:creator" content="@Cosmic_soul_quest" />
			<meta name="twitter:title" content="Cosmic Soul Quest ✨ Discover Your Cosmic Warrior Archetype" />
			<meta name="twitter:description" content="It's no coincidence you're here. Your soul remembers. Take the cosmic soul scan and discover if you're one of the seven cosmic warriors. 🔮" />
			<meta name="twitter:image" content={siteConfig.ogImage} />
			<meta name="twitter:image:alt" content="Cosmic Soul Quest - A mystical cloaked messenger awaits" />

			{/* Additional SEO */}
			<meta name="author" content="@Cosmic_soul_quest" />
			<meta name="keywords" content="cosmic soul quest, spiritual awakening, cosmic warrior, soul archetype, quantum mysticism, instagram spirituality, awakening journey, seven cosmic warriors, frequency awakening" />
			<meta name="robots" content="index, follow" />
			
			{/* Mobile viewport optimization */}
			<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
			
			{/* Theme */}
			<meta name="theme-color" content={siteConfig.themeColor} />
			<meta name="msapplication-TileColor" content={siteConfig.themeColor} />
			<meta name="msapplication-TileImage" content={siteConfig.ogImage} />
			
			{/* Apple / iOS */}
			<meta name="apple-mobile-web-app-capable" content="yes" />
			<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
			<meta name="apple-mobile-web-app-title" content="Cosmic Soul Quest" />
			<link rel="apple-touch-icon" href={siteConfig.ogImage} />
			
			{/* Canonical URL */}
			<link rel="canonical" href={siteConfig.url} />
		</>
	);
}
