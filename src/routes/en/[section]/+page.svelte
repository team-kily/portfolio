<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { getLanguageByPath, localizePath } from '$lib/config/navigation.js';

	onMount(() => {
		const canonicalPath = localizePath(page.url.pathname, getLanguageByPath(page.url.pathname));
		if (canonicalPath !== page.url.pathname) {
			goto(canonicalPath, { replaceState: true, noScroll: true, keepFocus: true });
		}
	});
</script>
