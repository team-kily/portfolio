<script>
	import { locale } from '$lib/i18n/translation.svelte.js';

	const copy = {
		de: {
			claim: 'Digitale Erlebnisse mit Charakter.',
			imprint: 'Impressum',
			privacy: 'Datenschutz'
		},
		en: { claim: 'Digital experiences with character.', imprint: 'Imprint', privacy: 'Privacy' }
	};
</script>

<div class="footer-snap-area">
	<footer>
		<div class="footer-brand">
			<a href={locale.current === 'en' ? '/en' : '/'}>Team Kily</a>
			<span>{copy[locale.current].claim}</span>
		</div>
		<nav aria-label={locale.current === 'en' ? 'Legal information' : 'Rechtliche Hinweise'}>
			<a href={locale.current === 'en' ? '/en/imprint' : '/impressum'}
				>{copy[locale.current].imprint}</a
			>
			<a href={locale.current === 'en' ? '/en/privacy' : '/datenschutz'}
				>{copy[locale.current].privacy}</a
			>
			<a href="https://github.com/team-kily" target="_blank" rel="noopener noreferrer">GitHub</a>
		</nav>
		<p class="copyright">© {new Date().getFullYear()} Team Kily</p>
	</footer>
</div>

<style>
	.footer-snap-area {
		position: relative;
		z-index: 1;
		scroll-snap-align: end;
		scroll-snap-stop: always;
	}

	footer {
		display: grid;
		grid-template-columns: 1fr auto auto;
		min-height: 8.5rem;
		align-items: center;
		gap: clamp(1.5rem, 4vw, 4rem);
		padding: 0 clamp(1rem, 2.5vw, 2.5rem) 0 var(--content-left);
		border-top: 1px solid color-mix(in srgb, var(--color-light) 22%, transparent);
		background: color-mix(in srgb, var(--color-dark) 90%, transparent);
		color: var(--color-light);
		font-family: var(--font-space-grotesk);
		font-size: 0.85rem;
		letter-spacing: -0.02em;
	}

	.footer-brand {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}
	.footer-brand a {
		color: var(--color-light);
		font-size: 1.15rem;
		font-weight: 650;
		text-decoration: none;
	}
	.footer-brand span,
	.copyright {
		color: color-mix(in srgb, var(--color-light) 55%, transparent);
	}
	nav {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem 1.5rem;
	}
	nav a {
		color: var(--color-light);
		text-underline-offset: 0.3rem;
	}
	nav a:hover,
	nav a:focus-visible {
		color: var(--color-brand);
	}
	.copyright {
		white-space: nowrap;
	}

	@media (max-width: 47.99rem) {
		.footer-snap-area {
			display: flex;
			min-height: 38svh;
			align-items: flex-end;
			padding-bottom: calc(4.25rem + env(safe-area-inset-bottom));
		}

		footer {
			width: 100%;
			grid-template-columns: 1fr;
			gap: 1.5rem;
			padding: 2.25rem var(--content-left);
		}
	}
</style>
