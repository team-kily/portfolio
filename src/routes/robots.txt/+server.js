export const prerender = false;

export function GET({ url }) {
	const sitemap = new URL('/sitemap.xml', url.origin).href;
	return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' }
	});
}
