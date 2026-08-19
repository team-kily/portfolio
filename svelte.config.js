import adapter from '@sveltejs/adapter-vercel';

const config = {
	kit: {
		adapter: adapter({ runtime: 'nodejs24.x' }),
		prerender: {
			origin: 'https://team-kily.de'
		}
	}
};

export default config;
