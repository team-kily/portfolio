<script>
	import { page } from '$app/state';
	import { localizePath, stripLanguagePath } from '$lib/config/navigation.js';
	import { locale } from '$lib/i18n/translation.svelte.js';

	const content = {
		de: {
			hero: {
				title: 'Team Kily – Digitale Erlebnisse und interaktive Entwicklung',
				description:
					'Team Kily entwickelt individuelle Websites, interaktive Erlebnisse und digitale Projekte mit Charakter.'
			},
			about: {
				title: 'Über uns | Team Kily',
				description:
					'Lerne Team Kily, unsere Arbeitsweise und den kreativen Ansatz hinter unseren digitalen Projekten kennen.'
			},
			projects: {
				title: 'Projekte | Team Kily',
				description:
					'Eine Auswahl unserer Websites, digitalen Anwendungen und interaktiven Arbeiten.'
			},
			game_dev: {
				title: 'Spielentwicklung | Team Kily',
				description:
					'Einblicke in unsere Arbeit rund um Spiele, Echtzeitgrafik und interaktive 3D-Erlebnisse.'
			},
			contact: {
				title: 'Kontakt | Team Kily',
				description:
					'Sprich mit Team Kily über deine Idee, ein digitales Projekt oder eine mögliche Zusammenarbeit.'
			},
			imprint: {
				title: 'Impressum | Team Kily',
				description: 'Impressum und Anbieterkennzeichnung von Team Kily.'
			},
			privacy: {
				title: 'Datenschutz | Team Kily',
				description: 'Informationen zum Datenschutz auf der Website von Team Kily.'
			}
		},
		en: {
			hero: {
				title: 'Team Kily – Digital Experiences and Interactive Development',
				description:
					'Team Kily creates distinctive websites, interactive experiences and digital projects.'
			},
			about: {
				title: 'About | Team Kily',
				description:
					'Get to know Team Kily, our way of working and the creative approach behind our digital projects.'
			},
			projects: {
				title: 'Projects | Team Kily',
				description: 'A selection of our websites, digital applications and interactive work.'
			},
			game_dev: {
				title: 'Game Development | Team Kily',
				description:
					'Explore our work across games, real-time graphics and interactive 3D experiences.'
			},
			contact: {
				title: 'Contact | Team Kily',
				description:
					'Talk to Team Kily about your idea, a digital project or a potential collaboration.'
			},
			imprint: {
				title: 'Imprint | Team Kily',
				description: 'Legal notice and provider information for Team Kily.'
			},
			privacy: {
				title: 'Privacy | Team Kily',
				description: 'Information about privacy and data protection on the Team Kily website.'
			}
		}
	};

	const pathToSection = {
		'/': 'hero',
		'/about': 'about',
		'/projects': 'projects',
		'/game_dev': 'game_dev',
		'/contact': 'contact',
		'/impressum': 'imprint',
		'/datenschutz': 'privacy'
	};

	let section = $derived(pathToSection[stripLanguagePath(page.url.pathname)] ?? 'hero');
	let seo = $derived(content[locale.current]?.[section] ?? content.de.hero);
	let basePath = $derived(stripLanguagePath(page.url.pathname));
	let canonicalUrl = $derived(
		new URL(localizePath(basePath, locale.current), page.url.origin).href
	);
	let germanUrl = $derived(new URL(localizePath(basePath, 'de'), page.url.origin).href);
	let englishUrl = $derived(new URL(localizePath(basePath, 'en'), page.url.origin).href);
	let socialImageUrl = $derived(new URL('/images/og-image.png', page.url.origin).href);
	let isErrorPage = $derived(page.status >= 400);
	let structuredData = $derived({
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: 'Team Kily',
		url: new URL(locale.current === 'en' ? '/en' : '/', page.url.origin).href,
		logo: new URL('/favicon.svg', page.url.origin).href,
		sameAs: ['https://github.com/flo-kayser', 'https://www.instagram.com/flo.kysr/']
	});

	$effect(() => {
		document.documentElement.lang = locale.current;
	});
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<meta name="robots" content={isErrorPage ? 'noindex, nofollow' : 'index, follow'} />
	<link rel="canonical" href={canonicalUrl} />
	<link rel="alternate" hreflang="de" href={germanUrl} />
	<link rel="alternate" hreflang="en" href={englishUrl} />
	<link rel="alternate" hreflang="x-default" href={germanUrl} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Team Kily" />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:title" content={seo.title} />
	<meta property="og:description" content={seo.description} />
	<meta property="og:image" content={socialImageUrl} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="Team Kily – Digitale Erlebnisse mit Charakter" />
	<meta property="og:locale" content={locale.current === 'de' ? 'de_DE' : 'en_US'} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={seo.title} />
	<meta name="twitter:description" content={seo.description} />
	<meta name="twitter:image" content={socialImageUrl} />
	<svelte:element this={"script"} type="application/ld+json">
		{JSON.stringify(structuredData)}
	</svelte:element>
</svelte:head>
