<script>
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	import AppIcon from '$lib/components/shared/AppIcon.svelte';
	import ScrambleText from '$lib/components/shared/ScrambleText.svelte';
	import { createSectionNavigation } from './navigation/sectionNavigation.js';
	import {
		getSectionByPath,
		localizePath,
		navigation,
		stripLanguagePath
	} from '$lib/config/navigation.js';
	import { locale, setLocale, t } from '$lib/i18n/translation.svelte.js';

	let activePath = $state(stripLanguagePath(page.url.pathname));

	$effect(() => {
		const pathname = page.url.pathname;
		activePath = getSectionByPath(pathname) ? stripLanguagePath(pathname) : '';
	});
	const sectionNavigation = createSectionNavigation({
		items: navigation,
		getActivePath: () => activePath,
		setActivePath: (path) => (activePath = path),
		getLocale: () => locale.current,
		setLocale
	});

	onMount(sectionNavigation.mount);
</script>

<header class="topbar">
	<a
		class="brand"
		href={localizePath('/', locale.current)}
		onclick={(event) => sectionNavigation.navigate(event, navigation[0])}>Team Kily</a
	>

	<div class="languages" aria-label="Sprache auswählen">
		<button
			class:active={locale.current === 'de'}
			onclick={() => sectionNavigation.switchLanguage('de')}>DE</button
		>
		<span aria-hidden="true">/</span>
		<button
			class:active={locale.current === 'en'}
			onclick={() => sectionNavigation.switchLanguage('en')}>EN</button
		>
	</div>
</header>

<aside class="sidebar" aria-label="Hauptnavigation">
	<nav>
		{#each navigation as navItem, index}
			<a
				href={localizePath(navItem.path, locale.current)}
				onclick={(event) => sectionNavigation.navigate(event, navItem)}
				aria-label={t(navItem.label)}
				aria-current={activePath === navItem.path ? 'page' : undefined}
				data-active-distance={navigation.some((item) => item.path === activePath)
					? Math.abs(index - navigation.findIndex((item) => item.path === activePath))
					: undefined}
				style:z-index={navigation.length - index}
			>
				<span class="nav-icon"><AppIcon name={navItem.section} /></span>
				<span class="nav-label"><ScrambleText text={t(navItem.label)} lang={locale.current} /></span
				>
			</a>
		{/each}
	</nav>
</aside>

<style>
	:global(:root) {
		--sidebar-width: clamp(9rem, 16vw, 13.5rem);
		--header-height: 4rem;
		--content-left: calc(var(--sidebar-width) + clamp(8rem, 12vw, 12rem));
	}

	.topbar {
		position: fixed;
		z-index: 40;
		inset: 0 0 auto;
		display: flex;
		height: var(--header-height);
		align-items: center;
		justify-content: space-between;
		padding: 0 clamp(1rem, 2.5vw, 2.5rem) 0 var(--content-left);
		border-bottom: 1px solid color-mix(in srgb, var(--color-light) 22%, transparent);
		background: color-mix(in srgb, var(--color-dark) 90%, transparent);
		backdrop-filter: blur(1rem);
	}

	.brand {
		color: var(--color-light);
		font-family: var(--font-space-grotesk);
		font-size: 1rem;
		font-weight: 650;
		letter-spacing: -0.02em;
		text-decoration: none;
	}

	.languages {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: color-mix(in srgb, var(--color-light) 35%, transparent);
	}

	.languages button {
		color: color-mix(in srgb, var(--color-light) 50%, transparent);
		font-size: 0.75rem;
		font-weight: 700;
		cursor: pointer;
		transition: color 220ms ease;
	}

	.languages button:hover,
	.languages button:focus-visible,
	.languages button.active {
		color: var(--color-light);
	}

	.sidebar {
		position: fixed;
		z-index: 50;
		inset: 0 auto 0 0;
		width: var(--sidebar-width);
		pointer-events: none;
	}

	nav {
		display: grid;
		grid-template-rows: repeat(5, minmax(0, 1fr));
		height: 100%;
	}

	nav a {
		--item-color: var(--color-brand);
		--item-text: var(--color-dark);

		display: flex;
		position: relative;
		width: var(--sidebar-width);
		min-width: 0;
		align-items: center;
		padding: 1.25rem clamp(1rem, 1.8vw, 1.75rem);
		background: var(--item-color);
		color: var(--item-text);
		font-family: var(--font-space-grotesk);
		font-size: clamp(1.05rem, 1.65vw, 1.4rem);
		font-weight: 620;
		line-height: 1.1;
		text-decoration: none;
		pointer-events: auto;
		hyphens: auto;
		border-radius: 0 0.4rem 0.4rem 0;
		box-shadow:
			inset 0 1px 0 rgb(255 255 255 / 13%),
			inset 0 -0.32rem 0.5rem rgb(0 0 0 / 14%),
			0 0.24rem 0 rgb(0 0 0 / 24%),
			0 0.7rem 0.9rem rgb(0 0 0 / 28%);
		transition:
			width 560ms cubic-bezier(0.16, 1, 0.3, 1),
			height 560ms cubic-bezier(0.16, 1, 0.3, 1),
			transform 520ms cubic-bezier(0.22, 1, 0.36, 1),
			border-radius 620ms cubic-bezier(0.16, 1, 0.3, 1),
			box-shadow 620ms cubic-bezier(0.16, 1, 0.3, 1);
	}

	nav a:not(:last-child) {
		margin-bottom: -0.5rem;
	}

	nav a::after {
		width: clamp(1rem, 1.8vw, 1.5rem);
		height: 2px;
		margin-left: auto;
		background: currentColor;
		content: '';
		opacity: 0;
		transform: translateX(-0.4rem);
		transition:
			opacity 360ms ease,
			transform 480ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.nav-icon {
		display: none;
	}

	nav a:nth-child(even) {
		--item-color: var(--color-accent);
		--item-text: var(--color-light);
	}

	nav a[aria-current='page'] {
		border-radius: 0 clamp(0.65rem, 1vw, 0.9rem) clamp(0.65rem, 1vw, 0.9rem) 0;
		box-shadow:
			inset 0 1px 0 rgb(255 255 255 / 16%),
			inset 0 -0.4rem 0.65rem rgb(0 0 0 / 17%),
			0 0.32rem 0 rgb(0 0 0 / 28%),
			0 0.95rem 1.25rem rgb(0 0 0 / 36%);
	}

	nav a[data-active-distance='1']:not([aria-current='page']) {
		border-radius: 0 0.6rem 0.6rem 0;
		box-shadow:
			inset 0 1px 0 rgb(255 255 255 / 13%),
			inset 0 -0.34rem 0.55rem rgb(0 0 0 / 15%),
			0 0.26rem 0 rgb(0 0 0 / 25%),
			0 0.78rem 1rem rgb(0 0 0 / 31%);
	}

	nav a[data-active-distance='2']:not([aria-current='page']) {
		border-radius: 0 0.45rem 0.45rem 0;
		box-shadow:
			inset 0 1px 0 rgb(255 255 255 / 12%),
			inset 0 -0.3rem 0.5rem rgb(0 0 0 / 14%),
			0 0.24rem 0 rgb(0 0 0 / 23%),
			0 0.7rem 0.9rem rgb(0 0 0 / 28%);
	}

	nav a:not([aria-current='page']):hover::after,
	nav a:not([aria-current='page']):focus-visible::after {
		opacity: 0.65;
		transform: translateX(0);
	}

	nav a:focus-visible {
		outline: 2px solid var(--color-light);
		outline-offset: -2px;
	}

	@media (min-width: 48rem) {
		nav a[aria-current='page'] {
			width: calc(var(--sidebar-width) + clamp(4rem, 7vw, 7rem));
		}

		nav a[data-active-distance='1']:not([aria-current='page']) {
			width: calc(var(--sidebar-width) + 1.375rem);
		}

		nav a[data-active-distance='2']:not([aria-current='page']) {
			width: calc(var(--sidebar-width) + 0.5rem);
		}

		nav a:nth-child(1),
		nav a:nth-child(3),
		nav a:nth-child(5) {
			filter: drop-shadow(0 0.52rem 0.18rem rgb(0 0 0 / 56%));
		}

		nav a:nth-child(2),
		nav a:nth-child(4) {
			filter: drop-shadow(0 0.38rem 0.52rem rgb(0 0 0 / 25%));
		}

		nav a:not([aria-current='page']):hover,
		nav a:not([aria-current='page']):focus-visible {
			transform: scaleX(1.014);
			transform-origin: left center;
		}
	}

	@media (min-width: 48rem) and (max-height: 32rem) {
		nav a {
			padding-block: 0.55rem;
			font-size: clamp(0.9rem, 1.4vw, 1.1rem);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		nav a,
		.languages button {
			transition-duration: 0.01ms;
		}
	}

	@media (max-width: 47.99rem) {
		:global(:root) {
			--sidebar-width: 0px;
			--header-height: 3.5rem;
			--content-left: clamp(1.25rem, 6vw, 2rem);
		}

		.sidebar {
			inset: auto 0 0;
			width: 100%;
			height: calc(4.25rem + env(safe-area-inset-bottom));
		}

		nav {
			display: grid;
			grid-template-columns: repeat(5, minmax(0, 1fr));
			grid-template-rows: 100%;
			height: 100%;
			align-items: end;
			padding-bottom: env(safe-area-inset-bottom);
		}

		nav a {
			width: 100%;
			height: 4.25rem;
			min-height: 4.25rem;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			gap: 0.18rem;
			padding: 0.55rem 0.2rem;
			border-radius: 0.45rem 0.45rem 0 0;
			box-shadow:
				inset 0 1px 0 rgb(255 255 255 / 13%),
				inset 0 -0.28rem 0.45rem rgb(0 0 0 / 15%),
				0 -0.2rem 0 rgb(255 255 255 / 4%),
				0 -0.55rem 0.95rem rgb(0 0 0 / 30%);
			font-size: clamp(0.62rem, 2.65vw, 0.78rem);
			line-height: 1.05;
			text-align: center;
			hyphens: none;
			overflow: hidden;
		}

		nav a:not(:last-child) {
			margin-bottom: 0;
		}

		nav a::after {
			display: none;
		}

		nav a :global(span) {
			min-width: 0;
			max-width: 100%;
			white-space: normal;
		}

		nav a[aria-current='page'] {
			height: 5rem;
			border-radius: 0.8rem 0.8rem 0 0;
			box-shadow:
				inset 0 1px 0 rgb(255 255 255 / 16%),
				inset 0 -0.35rem 0.55rem rgb(0 0 0 / 17%),
				0 -0.28rem 0 rgb(255 255 255 / 5%),
				0 -0.8rem 1.2rem rgb(0 0 0 / 40%);
		}

		nav a[data-active-distance='1']:not([aria-current='page']) {
			border-radius: 0.5rem 0.5rem 0 0;
		}

		nav a[data-active-distance='2']:not([aria-current='page']) {
			border-radius: 0.45rem 0.45rem 0 0;
		}

		nav a[data-active-distance='1']:not([aria-current='page']),
		nav a[data-active-distance='2']:not([aria-current='page']) {
			box-shadow:
				inset 0 1px 0 rgb(255 255 255 / 13%),
				inset 0 -0.28rem 0.45rem rgb(0 0 0 / 15%),
				0 -0.2rem 0 rgb(255 255 255 / 4%),
				0 -0.55rem 0.95rem rgb(0 0 0 / 30%);
		}

		.topbar {
			inset: 0 0 auto;
			height: var(--header-height);
			align-items: center;
			padding: 0 clamp(1rem, 5vw, 1.5rem);
			border-bottom-color: color-mix(in srgb, var(--color-light) 14%, transparent);
			background: color-mix(in srgb, var(--color-dark) 90%, transparent);
		}

		.brand {
			font-size: 0.88rem;
		}

		.languages {
			gap: 0.38rem;
		}

		.nav-icon {
			display: block;
		}

		.nav-label {
			display: block;
			max-height: 0;
			opacity: 0;
			overflow: hidden;
			transition:
				max-height 280ms ease,
				opacity 220ms ease;
		}

		nav a[aria-current='page'] .nav-label {
			max-height: 1.2rem;
			opacity: 1;
		}
	}
</style>
