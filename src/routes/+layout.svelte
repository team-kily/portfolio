<script>
	import '$lib/Css/app.css';
    import GlobalNavigation from '$lib/components/global/globalNavigation.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href='/favicon.svg' /></svelte:head>

<GlobalNavigation />
{@render children()}

