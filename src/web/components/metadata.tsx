import siteConfig from "../../../website.config.json";

export function Metadata() {
	return (
		<>
			<title>{siteConfig.name}</title>
			<meta name="description" content={siteConfig.description} />

			{/* Open Graph / Instagram optimization */}
			<meta property="og:title" content={siteConfig.name} />
			<meta property="og:description" content={siteConfig.description} />
			<meta property="og:image" content={siteConfig.ogImage} />
			<meta property="og:image:width" content="1200" />
			<meta property="og:image:height" content="630" />
			<meta property="og:image:alt" content="Cosmic Soul Quest - Mystical Cloaked Messenger" />
			<meta property="og:url" content={siteConfig.url} />
			<meta property="og:type" content="website" />
			<meta property="og:site_name" content="Cosmic Soul Quest" />
			<meta property="og:locale" content="en_US" />

			{/* Instagram specific */}
			<meta property="instagram:creator" content="@Cosmic_soul_quest" />
			<meta name="instagram:account" content="Cosmic_soul_quest" />

			{/* Twitter */}
			<meta name="twitter:card" content={siteConfig.twitter.card} />
			<meta name="twitter:site" content={siteConfig.twitter.site} />
			<meta name="twitter:title" content={siteConfig.name} />
			<meta name="twitter:description" content={siteConfig.description} />
			<meta name="twitter:image" content={siteConfig.ogImage} />
			<meta name="twitter:image:alt" content="Cosmic Soul Quest - Mystical Cloaked Messenger" />

			{/* Additional SEO */}
			<meta name="author" content="@Cosmic_soul_quest" />
			<meta name="keywords" content="cosmic soul quest, spiritual awakening, cosmic warrior, soul archetype, quantum mysticism, instagram spirituality, awakening journey" />
			<meta name="robots" content="index, follow" />
			
			{/* Theme */}
			<meta name="theme-color" content={siteConfig.themeColor} />
			<meta name="msapplication-TileColor" content={siteConfig.themeColor} />
			
			{/* Apple */}
			<meta name="apple-mobile-web-app-capable" content="yes" />
			<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
			<meta name="apple-mobile-web-app-title" content="Cosmic Soul Quest" />
		</>
	);
}
