<script>
	import { pushState } from '$app/navigation';
	import { page } from '$app/state';

	import { navigation } from '$lib/config/navigation.js';
	import { t, setLocale } from '$lib/i18n/translation.svelte.js';

	function navigate(event, item) {
		if (event.button !== 0 || event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) {
			return;
		}

		event.preventDefault();

		if (page.url.pathname === item.path) {
			scrollToSection(item.section);
			return;
		}

		pushState(item.path, { section: item.path });
	}

	function scrollToSection(section) {
		document.getElementById(section)?.scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		});
	}
</script>

<nav>
	{#each navigation as navItem}
		<a href={navItem.path}
			onclick={(event) => navigate(event, navItem)}
			aria-current={page.url.pathname === navItem.path ? 'page' : undefined}
		>
			{t(navItem.label)}
		</a>
	{/each}
</nav>

<button onclick={() => setLocale('de')}>DE</button>
<button onclick={() => setLocale('en')}>EN</button>
