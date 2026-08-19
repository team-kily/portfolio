export const navigation = [
	{
		label: 'nav.hero',
		section: 'hero',
		path: '/'
	},
	{
		label: 'nav.about',
		section: 'about',
		path: '/about'
	},
	{
		label: 'nav.projects',
		section: 'projects',
		path: '/projects'
	},
	{
		label: 'nav.game_dev',
		section: 'game_dev',
		path: '/game_dev'
	},
	{
		label: 'nav.contact',
		section: 'contact',
		path: '/contact'
	}
];

const sectionPaths = {
	hero: {
		de: '/',
		en: '/en',
		aliases: []
	},
	about: {
		de: '/ueber',
		en: '/en/about',
		aliases: ['/about']
	},
	projects: {
		de: '/projekte',
		en: '/en/projects',
		aliases: ['/projects']
	},
	game_dev: {
		de: '/spielentwicklung',
		en: '/en/game-development',
		aliases: ['/game_dev', '/en/game_dev']
	},
	contact: {
		de: '/kontakt',
		en: '/en/contact',
		aliases: ['/contact']
	}
};

const standalonePaths = {
	imprint: { de: '/impressum', en: '/en/imprint' },
	privacy: { de: '/datenschutz', en: '/en/privacy' }
};

export function getSectionByPath(pathname) {
	return findSectionByPath(pathname);
}

export function getLanguageByPath(pathname) {
	return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'de';
}

export function stripLanguagePath(pathname) {
	const standalone = findStandaloneByPath(pathname);
	if (standalone) return standalonePaths[standalone].de;
	const section = findSectionByPath(pathname);
	return navigation.find((item) => item.section === section)?.path ?? pathname;
}

export function localizePath(pathname, language) {
	const standalone = findStandaloneByPath(pathname);
	if (standalone) return standalonePaths[standalone][language];
	const section = findSectionByPath(pathname);
	return sectionPaths[section]?.[language] ?? pathname;
}

function findStandaloneByPath(pathname) {
	const normalizedPath = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
	return Object.entries(standalonePaths).find(([, paths]) =>
		Object.values(paths).includes(normalizedPath)
	)?.[0];
}

function findSectionByPath(pathname) {
	const normalizedPath = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;

	return Object.entries(sectionPaths).find(([, paths]) =>
		[paths.de, paths.en, ...paths.aliases].includes(normalizedPath)
	)?.[0];
}
