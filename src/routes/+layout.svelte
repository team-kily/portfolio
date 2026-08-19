<script>
	import '$lib/Css/app.css';
	import { page } from '$app/state';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import CalmWaves from '$lib/components/layout/CalmWaves.svelte';
	import GlobalFooter from '$lib/components/layout/GlobalFooter.svelte';
	import GlobalNavigation from '$lib/components/layout/GlobalNavigation.svelte';
	import LandingPage from '$lib/components/landing/LandingPage.svelte';
	import Seo from '$lib/components/shared/Seo.svelte';
	import { getLanguageByPath, getSectionByPath } from '$lib/config/navigation.js';
	import { setLocale } from '$lib/i18n/translation.svelte.js';

	injectAnalytics();

	let { children } = $props();
	let isLandingRoute = $derived(Boolean(getSectionByPath(page.url.pathname)));
	setLocale(getLanguageByPath(page.url.pathname));
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
	<meta name="theme-color" content="#171412" />
</svelte:head>

<Seo />
<GlobalNavigation />
<CalmWaves />
{#if isLandingRoute}
	<LandingPage />
	<GlobalFooter />
{:else}
	{@render children()}
	<GlobalFooter />
{/if}
