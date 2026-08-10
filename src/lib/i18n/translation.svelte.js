const modules = import.meta.glob(['./de/*.js', './en/*.js'], {
	eager: true,
	import: 'default'
});

const translations = {};

for (const [path, content] of Object.entries(modules)) {
	const match = path.match(/^\.\/(de|en)\/(.+)\.js$/);

	if (!match) continue;

	const [, language, file] = match;

	translations[language] ??= {};
	translations[language][file] = content;
}

export const locale = $state({
	current: 'de'
});

export function setLocale(language) {
	if (!translations[language]) {
		console.warn(`Unknown locale: ${language}`);
		return;
	}

	locale.current = language;
}

export function t(key) {
	const value = key
		.split('.')
		.reduce((result, part) => result?.[part], translations[locale.current]);

	return value ?? key;
}
