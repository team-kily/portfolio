export async function handle({ event, resolve }) {
	const language =
		event.url.pathname === '/en' || event.url.pathname.startsWith('/en/') ? 'en' : 'de';

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('<html lang="de">', `<html lang="${language}">`)
	});
}
