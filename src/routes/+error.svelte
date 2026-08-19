<script>
	import { page } from '$app/state';
	import ScrambleText from '$lib/components/shared/ScrambleText.svelte';
	import { locale } from '$lib/i18n/translation.svelte.js';

	const copy = {
		de: {
			eyebrow: 'Fehler 404',
			title: 'Diese Seite ist wohl abgehauen.',
			text: 'Unter dieser Adresse konnten wir nichts finden.',
			link: 'Zurück zur Startseite'
		},
		en: {
			eyebrow: 'Error 404',
			title: 'This page seems to have wandered off.',
			text: 'We could not find anything at this address.',
			link: 'Back to the homepage'
		}
	};

	let content = $derived(copy[locale.current]);
	let isNotFound = $derived(page.status === 404);
</script>

<svelte:head>
	<title>{isNotFound ? '404' : page.status} · Team Kily</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="error-page">
	<section class="error-card">
		<div class="error-copy">
			<p class="error-eyebrow">
				<ScrambleText
					text={isNotFound
						? content.eyebrow
						: `${locale.current === 'en' ? 'Error' : 'Fehler'} ${page.status}`}
					lang={locale.current}
					animateOnMount
				/>
			</p>
			<h1>
				<ScrambleText
					text={isNotFound ? content.title : page.error?.message || content.title}
					lang={locale.current}
					nowrap={false}
					animateOnMount
				/>
			</h1>
			<p class="error-text">
				<ScrambleText text={content.text} lang={locale.current} nowrap={false} animateOnMount />
			</p>
			<a class="home-link" href={locale.current === 'en' ? '/en' : '/'}>
				<ScrambleText text={content.link} lang={locale.current} inline animateOnMount />
				<span aria-hidden="true">↗</span>
			</a>
		</div>

		<div class="error-visual" aria-hidden="true">
			<span class="number number-left">4</span>
			<span class="lost-card">
				<i></i><i></i><i></i>
			</span>
			<span class="number number-right">4</span>
		</div>
	</section>
</main>

<style>
	.error-page {
		position: relative;
		z-index: 2;
		display: flex;
		min-height: calc(100svh - 8.5rem);
		align-items: center;
		padding: calc(var(--header-height) + 2rem) clamp(1rem, 2.5vw, 2.5rem) 2rem var(--content-left);
	}

	.error-card {
		display: grid;
		width: 100%;
		max-width: 96rem;
		min-height: min(38rem, calc(100svh - var(--header-height) - 4rem));
		grid-template-columns: minmax(0, 1fr) minmax(20rem, 0.82fr);
		margin-inline: auto;
		overflow: hidden;
		border: 1px solid color-mix(in srgb, var(--color-light) 20%, transparent);
		border-radius: clamp(1.5rem, 3vw, 3.5rem);
		background: var(--color-brand);
		box-shadow: 0 2rem 5rem rgb(0 0 0 / 24%);
		color: var(--color-light);
	}

	.error-copy {
		display: flex;
		max-width: 50rem;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		padding: clamp(2rem, 5vw, 5.5rem);
	}

	.error-eyebrow {
		margin-bottom: clamp(1.25rem, 3vh, 2.5rem);
		font-family: var(--font-space-grotesk);
		font-size: 0.82rem;
		font-weight: 700;
		letter-spacing: 0.2em;
		text-transform: uppercase;
	}

	h1 {
		max-width: 12ch;
		font-size: clamp(3rem, 6vw, 6.75rem);
		line-height: 0.91;
	}

	.error-text {
		max-width: 34rem;
		margin-top: clamp(1.5rem, 3vh, 2.5rem);
		color: color-mix(in srgb, var(--color-light) 82%, transparent);
		font-size: clamp(1rem, 1.4vw, 1.25rem);
		line-height: 1.55;
	}

	.home-link {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		margin-top: clamp(2rem, 4vh, 3.5rem);
		padding-bottom: 0.5rem;
		border-bottom: 2px solid currentColor;
		color: var(--color-accent);
		font-family: var(--font-space-grotesk);
		font-size: 0.92rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-decoration: none;
		text-transform: uppercase;
	}

	.home-link span:last-child {
		font-size: 1.35rem;
		transition: transform 200ms ease;
	}

	.home-link:hover span:last-child,
	.home-link:focus-visible span:last-child {
		transform: translate(0.2rem, -0.2rem);
	}

	.error-visual {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		background: var(--color-accent);
	}

	.error-visual::before,
	.error-visual::after {
		position: absolute;
		width: 70%;
		aspect-ratio: 1;
		border: 1px solid color-mix(in srgb, var(--color-light) 16%, transparent);
		border-radius: 50%;
		content: '';
	}

	.error-visual::after {
		width: 105%;
	}

	.number {
		position: relative;
		z-index: 1;
		font-family: var(--font-space-grotesk);
		font-size: clamp(6rem, 11vw, 12rem);
		font-weight: 650;
		line-height: 1;
	}

	.lost-card {
		position: relative;
		z-index: 2;
		display: grid;
		width: clamp(5rem, 9vw, 9rem);
		aspect-ratio: 0.72;
		place-items: center;
		margin-inline: clamp(-1rem, -1vw, -0.4rem);
		border: 0.55rem solid var(--color-light);
		border-radius: 0.8rem;
		background: var(--color-brand);
		box-shadow: 1rem 1.25rem 2.5rem rgb(0 0 0 / 30%);
		transform: rotate(9deg);
	}

	.lost-card i {
		position: absolute;
		width: 42%;
		aspect-ratio: 1;
		border: 2px solid var(--color-accent);
		border-radius: 50%;
	}

	.lost-card i:nth-child(2) {
		width: 65%;
	}

	.lost-card i:nth-child(3) {
		width: 86%;
	}

	@media (max-width: 70rem) {
		.error-card {
			grid-template-columns: 1fr;
		}

		.error-visual {
			min-height: 15rem;
		}
	}

	@media (max-width: 47.99rem) {
		.error-page {
			min-height: auto;
			padding: calc(var(--header-height) + 1.25rem) var(--content-left) 1.25rem;
		}

		.error-card {
			min-height: calc(100svh - var(--header-height) - 7rem);
			border-radius: 1.5rem;
		}

		.error-copy {
			padding: 2rem 1.5rem 2.5rem;
		}

		h1 {
			font-size: clamp(2.7rem, 13vw, 4.5rem);
		}

		.error-visual {
			min-height: 11rem;
		}

		.number {
			font-size: clamp(5rem, 24vw, 8rem);
		}

		.lost-card {
			width: clamp(4.5rem, 20vw, 6.5rem);
			border-width: 0.4rem;
		}
	}
</style>
