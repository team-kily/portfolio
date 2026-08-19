import { navigation, localizePath } from '$lib/config/navigation.js';

export const prerender = false;

export function GET({ url }) {
	const paths = [
		...navigation.flatMap((item) => [localizePath(item.path, 'de'), localizePath(item.path, 'en')]),
		'/impressum',
		'/en/imprint',
		'/datenschutz',
		'/en/privacy'
	];
	const urls = [...new Set(paths)].map((path) => new URL(path, url.origin).href);
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((location) => `  <url><loc>${location}</loc></url>`).join('\n')}
</urlset>`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' }
	});
}
