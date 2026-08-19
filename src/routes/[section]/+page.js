import { error } from '@sveltejs/kit';

const sections = [
	'ueber',
	'projekte',
	'spielentwicklung',
	'kontakt',
	'about',
	'projects',
	'game_dev',
	'contact'
];

export function entries() {
	return sections.map((section) => ({ section }));
}

export function load({ params }) {
	if (!sections.includes(params.section)) {
		error(404, 'Page not found');
	}
}
