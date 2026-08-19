import { error } from '@sveltejs/kit';

const sections = ['about', 'projects', 'game-development', 'contact', 'game_dev'];

export function entries() {
	return sections.map((section) => ({ section }));
}

export function load({ params }) {
	if (!sections.includes(params.section)) {
		error(404, 'Page not found');
	}
}
