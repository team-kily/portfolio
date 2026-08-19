<script>
	import { onMount } from 'svelte';
	import {
		siDrupal,
		siGooglesearchconsole,
		siJavascript,
		siOpenapiinitiative,
		siPhp,
		siPostgresql,
		siSvelte,
		siTypo3
	} from 'simple-icons';
	import Container from '$lib/components/shared/Container.svelte';
	import AboutPortrait from './portraits/AboutPortrait.svelte';
	import AppIcon from '$lib/components/shared/AppIcon.svelte';
	import ContactForm from './ContactForm.svelte';
	import DogPortrait from './portraits/DogPortrait.svelte';
	import ScrambleText from '$lib/components/shared/ScrambleText.svelte';
	import SquirrelHero from './squirrel/SquirrelHero.svelte';
	import { locale, t } from '$lib/i18n/translation.svelte.js';
	let heroVisualReady = $state(false);
	let gameClipVisible = $state(true);
	let gameClipPlaceholderVisible = $state(true);
	let gameClipCycle = $state(0);
	let gameClipIndex = $state(0);
	let gameClipTimers = [];
	let gameClipImage = $state();
	let bookOpen = $state(false);
	let bookSettled = $state(false);
	let bookClipVisible = $state(false);
	let bookClipIndex = $state(-1);
	let bookVideo = $state();
	let bookVisual = $state();
	let bookTimers = [];
	let bookObserver;
	const gameClips = [
		{ src: '/videos/squirrel-forest-loop.webp', duration: 14000 },
		{ src: '/videos/squirrel-cinematic-idle.webp', duration: 10000 }
	];
	const bookClips = ['/videos/c_book_1.mp4', '/videos/c_book_2.mp4', '/videos/c_book_3.mp4'];
	const skills = [
		siSvelte,
		siJavascript,
		siTypo3,
		siDrupal,
		siPhp,
		{ ...siGooglesearchconsole, title: 'SEO' },
		{ ...siOpenapiinitiative, title: 'API' },
		{ ...siPostgresql, title: 'DB' }
	];

	function clearGameClipSchedule() {
		gameClipTimers.forEach(clearTimeout);
		gameClipTimers = [];
	}

	function startGameClipCycle() {
		clearGameClipSchedule();
		gameClipVisible = true;
		gameClipPlaceholderVisible = true;
		const clipDuration = gameClips[gameClipIndex].duration;

		gameClipTimers.push(
			setTimeout(() => {
				gameClipPlaceholderVisible = false;
			}, 50)
		);

		gameClipTimers.push(
			setTimeout(() => {
				gameClipPlaceholderVisible = true;
			}, clipDuration - 1200)
		);

		gameClipTimers.push(
			setTimeout(() => {
				gameClipVisible = false;
			}, clipDuration)
		);

		gameClipTimers.push(
			setTimeout(() => {
				gameClipIndex = (gameClipIndex + 1) % gameClips.length;
				gameClipCycle += 1;
			}, clipDuration + 6000)
		);
	}

	function clearBookSchedule() {
		bookTimers.forEach(clearTimeout);
		bookTimers = [];
	}

	function pickNextBookClip() {
		if (bookClips.length < 2) return 0;
		let next = bookClipIndex;
		while (next === bookClipIndex) next = Math.floor(Math.random() * bookClips.length);
		return next;
	}

	function startBookCycle() {
		clearBookSchedule();
		bookClipVisible = false;
		bookSettled = false;
		bookClipIndex = pickNextBookClip();
		bookVideo?.load();

		bookTimers.push(
			setTimeout(() => {
				bookOpen = true;
			}, 300)
		);

		bookTimers.push(
			setTimeout(() => {
				bookSettled = true;
			}, 1050)
		);

		bookTimers.push(
			setTimeout(async () => {
				bookClipVisible = true;
				try {
					await bookVideo?.play();
				} catch {
					bookClipVisible = false;
				}
			}, 1600)
		);
	}

	function finishBookCycle() {
		bookClipVisible = false;
		bookTimers.push(
			setTimeout(() => {
				bookOpen = false;
			}, 250)
		);
		bookTimers.push(
			setTimeout(() => {
				bookSettled = false;
			}, 950)
		);
		bookTimers.push(setTimeout(startBookCycle, 8600));
	}

	function pauseBookCycle() {
		clearBookSchedule();
		bookVideo?.pause();
		bookClipVisible = false;
		bookOpen = false;
		bookTimers.push(
			setTimeout(() => {
				bookSettled = false;
			}, 700)
		);
	}

	function resumeBookCycle() {
		clearBookSchedule();
		bookOpen = true;
		bookTimers.push(
			setTimeout(() => {
				bookSettled = true;
			}, 750)
		);
		bookTimers.push(
			setTimeout(async () => {
				bookClipVisible = true;
				try {
					await bookVideo?.play();
				} catch {
					bookClipVisible = false;
				}
			}, 1300)
		);
	}

	onMount(() => {
		if (gameClipImage?.complete) startGameClipCycle();
		if ('IntersectionObserver' in window && bookVisual) {
			bookObserver = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting) {
						if (bookClipIndex < 0 || bookVideo?.ended) startBookCycle();
						else if (bookVideo?.paused) resumeBookCycle();
					} else {
						pauseBookCycle();
					}
				},
				{ threshold: 0.25 }
			);
			bookObserver.observe(bookVisual);
		} else {
			startBookCycle();
		}
		return () => {
			clearGameClipSchedule();
			clearBookSchedule();
			bookObserver?.disconnect();
		};
	});

	function scrollToContact(event) {
		if (event.button !== 0 || event.ctrlKey || event.shiftKey || event.altKey || event.metaKey)
			return;
		event.preventDefault();
		document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	const sections = [
		{ id: 'hero', label: 'nav.hero' },
		{ id: 'about', label: 'nav.about' },
		{ id: 'projects', label: 'nav.projects' },
		{ id: 'game_dev', label: 'nav.game_dev' },
		{ id: 'contact', label: 'nav.contact' }
	];
</script>

<main>
	{#each sections as section, index}
		<section
			id={section.id}
			class:home-hero={index === 0}
			class:about-section={section.id === 'about'}
			class:projects-section={section.id === 'projects'}
			class:game-dev-section={section.id === 'game_dev'}
			class:contact-section={section.id === 'contact'}
			aria-labelledby={`${section.id}-heading`}
		>
			{#if index === 0}
				<div class="hero-visual" class:ready={heroVisualReady}>
					<div class="hero-circle" aria-hidden="true"></div>
					<div class="squirrel-stage">
						<SquirrelHero onready={() => (heroVisualReady = true)} />
					</div>
				</div>
			{/if}
			<Container>
				{#if index === 0}
					<div class="hero-copy">
						<p class="hero-eyebrow">
							<ScrambleText text={t('home.eyebrow')} lang={locale.current} />
						</p>
						<h1 id={`${section.id}-heading`}>
							<span><ScrambleText text={t('home.headline_start')} lang={locale.current} /></span>
							<span><ScrambleText text={t('home.headline_middle')} lang={locale.current} /></span>
							<span><ScrambleText text={t('home.headline_end')} lang={locale.current} /></span>
						</h1>
						<p class="hero-intro">
							<ScrambleText text={t('home.intro')} lang={locale.current} nowrap={false} />
						</p>
					</div>
				{:else if section.id === 'about'}
					<div class="about-stack">
						<div class="about-layout">
							<div class="about-copy">
								<p class="about-eyebrow">
									<ScrambleText text={t('about.eyebrow')} lang={locale.current} />
								</p>
								<h2 id={`${section.id}-heading`}>
									<ScrambleText text={t('about.headline')} lang={locale.current} nowrap={false} />
								</h2>
								<p class="about-intro">
									<ScrambleText text={t('about.intro_before_name')} lang={locale.current} inline />
									<strong class="about-name">
										<ScrambleText text={t('about.name')} lang={locale.current} inline />
									</strong>
									<ScrambleText text={t('about.intro_after_name')} lang={locale.current} inline />
								</p>
								<nav class="about-socials" aria-label="Social Media und Kontakt">
									<a href="https://github.com/flo-kayser" target="_blank" rel="noopener noreferrer">
										<AppIcon name="github" />
										<span>GitHub</span>
									</a>
									<a
										href="https://www.instagram.com/flo.kysr/"
										target="_blank"
										rel="noopener noreferrer"
									>
										<AppIcon name="instagram" />
										<span>Instagram</span>
									</a>
									<a
										href={locale.current === 'en' ? '/en/contact' : '/kontakt'}
										onclick={scrollToContact}
									>
										<AppIcon name="contact" />
										<span>Mail</span>
									</a>
								</nav>
							</div>
							<div class="about-portrait">
								<span class="about-portrait-circle" aria-hidden="true"></span>
								<AboutPortrait />
							</div>
						</div>
						<button
							class="about-dog"
							type="button"
							aria-label="Luki – Mental Coach und Health Manager"
						>
							<div class="about-dog-portrait">
								<DogPortrait />
								<img class="about-dog-photo" src="/images/luki-hover-blurred.png" alt="Luki" />
							</div>
							<div class="about-dog-copy">
								<p class="dog-role">
									<span class="dog-name">Luki</span><span>Mental Coach &amp; Health Manager</span>
								</p>
								<p class="dog-subtext">Wau wau wau.</p>
							</div>
						</button>
					</div>
				{:else if section.id === 'projects'}
					<div class="projects-layout">
						<p class="projects-eyebrow">
							<ScrambleText text={t('projects.eyebrow')} lang={locale.current} />
						</p>
						<h2 id={`${section.id}-heading`} class="projects-heading">
							<ScrambleText text={t('projects.heading')} lang={locale.current} />
						</h2>
						<div class="projects-grid">
							<article class="project-card project-card-featured">
								<div
									class="project-visual project-visual-book"
									aria-hidden="true"
									bind:this={bookVisual}
								>
									<span class="book-decoration"><i></i><i></i><i></i></span>
									<div class="animated-book" class:open={bookOpen} class:settled={bookSettled}>
										<span class="book-back-cover"></span>
										<div class="book-pages">
											<span class="book-page book-page-left"></span>
											<span class="book-page book-page-right"></span>
											<video
												src={bookClips[bookClipIndex]}
												muted
												playsinline
												preload="metadata"
												class:visible={bookClipVisible}
												bind:this={bookVideo}
												onended={finishBookCycle}
											></video>
											<span class="book-fold"></span>
										</div>
										<span class="book-front-cover"><i></i><i></i><i></i></span>
									</div>
								</div>
								<div class="project-copy">
									<span class="project-index">01</span>
									<div>
										<p class="project-type">
											<ScrambleText text={t('projects.collector_type')} lang={locale.current} />
										</p>
										<h3>
											<ScrambleText
												text={t('projects.collector_title')}
												lang={locale.current}
												nowrap={false}
											/>
										</h3>
										<p>
											<ScrambleText
												text={t('projects.collector_description_before_partner')}
												lang={locale.current}
												inline
											/>
											<a
												class="project-partner-link"
												href="https://www.youtube.com/@JulianFGU"
												target="_blank"
												rel="noopener noreferrer">JulianFGU</a
											><ScrambleText
												text={t('projects.collector_description_after_partner')}
												lang={locale.current}
												inline
											/>
										</p>
										<a
											class="project-link-slot"
											href="https://fut-26-sammelheft.vercel.app/"
											target="_blank"
											rel="noopener noreferrer"
										>
											<ScrambleText
												text={t('projects.collector_link')}
												lang={locale.current}
												inline
											/>
											<span aria-hidden="true">↗</span>
										</a>
									</div>
								</div>
							</article>
							<article class="project-card project-card-small project-card-violet project-card-map">
								<div class="project-orbit" aria-hidden="true"><span></span></div>
								<div class="project-copy">
									<span class="project-index">02</span>
									<div>
										<h3>
											<ScrambleText text={t('projects.second_title')} lang={locale.current} />
										</h3>
										<p>
											<ScrambleText
												text={t('projects.second_description')}
												lang={locale.current}
												nowrap={false}
											/>
										</p>
										<a
											class="project-link-slot"
											href="https://map.team-kily.de/"
											target="_blank"
											rel="noopener noreferrer"
										>
											<ScrambleText text={t('projects.second_link')} lang={locale.current} inline />
											<span aria-hidden="true">↗</span>
										</a>
									</div>
								</div>
							</article>
							<article class="project-card project-card-small project-card-light skills-card">
								<span class="project-index">03</span>
								<div class="skills-content">
									<div class="skills-heading">
										<p class="project-type">
											<ScrambleText text={t('projects.skills_type')} lang={locale.current} />
										</p>
										<h3><ScrambleText text={t('projects.skills_title')} lang={locale.current} /></h3>
									</div>
									<ul class="skills-list" aria-label={t('projects.skills_title')}>
										{#each skills as skill}
											<li style={`--skill-color: #${skill.hex}`}>
												<svg viewBox="0 0 24 24" aria-hidden="true">
													<path d={skill.path}></path>
												</svg>
												<span>{skill.title}</span>
											</li>
										{/each}
									</ul>
									<p class="skills-agency">
										<ScrambleText
											text={t('projects.skills_agency_before')}
											lang={locale.current}
											inline
										/>
										<a
											href="https://www.xima.de/leistungen/typo3-agentur"
											target="_blank"
											rel="noopener noreferrer"
											>{t('projects.skills_agency_link')} ↗</a
										>
										<ScrambleText
											text={t('projects.skills_agency_after')}
											lang={locale.current}
											inline
										/>
									</p>
								</div>
							</article>
						</div>
					</div>
				{:else if section.id === 'game_dev'}
					<div class="game-dev-layout">
						<article class="game-dev-card">
							<div class="game-dev-art">
								<div
									class="game-dev-placeholder"
									class:visible={gameClipPlaceholderVisible}
									aria-hidden="true"
								>
									<span class="game-dev-moon"></span>
									<span class="game-dev-tree tree-one"></span>
									<span class="game-dev-tree tree-two"></span>
									<span class="game-dev-tree tree-three"></span>
								</div>
								<img
									src={`${gameClips[gameClipIndex].src}?v=cinematic-1&cycle=${gameClipCycle}`}
									alt={t('game_dev.clip_alt')}
									loading="lazy"
									class:visible={gameClipVisible}
									bind:this={gameClipImage}
									onload={startGameClipCycle}
								/>
							</div>
							<div class="game-dev-copy">
								<div class="game-dev-heading">
									<div class="game-dev-meta">
										<span class="game-dev-tag">Game Dev</span>
										<p class="game-dev-eyebrow">
											<ScrambleText text={t('game_dev.eyebrow')} lang={locale.current} />
										</p>
									</div>
									<h2 id={`${section.id}-heading`}>
										<ScrambleText text={t('game_dev.title')} lang={locale.current} nowrap={false} />
									</h2>
									<div class="game-dev-status">
										<span aria-hidden="true"></span>
										<ScrambleText text={t('game_dev.status')} lang={locale.current} />
									</div>
								</div>
								<div class="game-dev-details">
									<p>
										<ScrambleText
											text={t('game_dev.description')}
											lang={locale.current}
											nowrap={false}
										/>
									</p>
								</div>
							</div>
						</article>
					</div>
				{:else if section.id === 'contact'}
					<ContactForm />
				{:else}
					<h2 id={`${section.id}-heading`}><ScrambleText text={t(section.label)} /></h2>
				{/if}
			</Container>
		</section>
	{/each}
</main>

<style>
	main {
		position: relative;
		z-index: 1;
		transition:
			filter 360ms cubic-bezier(0.22, 1, 0.36, 1),
			opacity 320ms ease;
	}

	:global(body.section-jump-blur) main {
		filter: blur(7px);
		opacity: 0.68;
	}

	section {
		position: relative;
		min-height: 100svh;
		scroll-snap-align: start;
		scroll-snap-stop: normal;
		scroll-margin-top: var(--header-height);
		padding-block: calc(var(--header-height) + 3rem) 3rem;
	}

	section.contact-section {
		--contact-section-gap: 3rem;
		min-height: calc(100svh - var(--header-height));
		padding-block: var(--contact-section-gap);
	}

	section.home-hero :global(.container) {
		position: relative;
		z-index: 2;
		pointer-events: none;
	}

	section.home-hero :global(.container-shell),
	section.home-hero :global(.container) {
		height: 100%;
	}

	section.home-hero {
		display: flex;
		align-items: center;
		overflow: hidden;
		padding-block: var(--header-height) 0;
	}

	.hero-copy {
		display: flex;
		height: 100%;
		max-width: min(56rem, 50%);
		flex-direction: column;
		justify-content: center;
		padding-block: 3rem 4rem;
	}

	.hero-eyebrow {
		margin-bottom: clamp(1rem, 2vw, 1.75rem);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--color-brand);
	}

	.hero-copy h1 {
		font-size: clamp(2.75rem, 4.5vw, 5.8rem);
		line-height: 0.91;
		letter-spacing: -0.06em;
		text-wrap: balance;
	}

	.hero-copy h1 span {
		display: block;
	}

	.hero-copy h1 span:last-child {
		color: var(--color-brand);
	}

	.hero-intro {
		max-width: 38rem;
		margin-top: clamp(1.5rem, 3vw, 2.5rem);
		font-size: clamp(0.95rem, 1.25vw, 1.2rem);
		line-height: 1.55;
		color: color-mix(in srgb, var(--color-light) 76%, transparent);
	}

	.hero-visual {
		--circle-x: calc(50% - 2.5rem);
		--circle-y: 58%;
		--circle-radius: clamp(8.5rem, 23svh, 18rem);
		position: absolute;
		z-index: 1;
		top: var(--header-height);
		right: 0;
		bottom: 0;
		left: 65%;
		overflow: visible;
		pointer-events: none;
	}

	.hero-visual::before {
		position: absolute;
		inset: 22% 2% 6% 22%;
		border-radius: 50%;
		background: color-mix(in srgb, var(--color-brand) 22%, transparent);
		filter: blur(54px);
		opacity: 0;
		transform: scale(0.82);
		transition:
			opacity 500ms ease,
			transform 850ms cubic-bezier(0.16, 1, 0.3, 1);
		content: '';
	}

	.hero-visual.ready::before {
		opacity: 1;
		transform: scale(1);
	}

	.hero-circle {
		position: absolute;
		z-index: 0;
		top: var(--circle-y);
		left: var(--circle-x);
		width: calc(var(--circle-radius) * 2);
		aspect-ratio: 1;
		translate: -50% -50%;
		border-radius: 50%;
		background:
			radial-gradient(
				circle at 42% 30%,
				color-mix(in srgb, var(--color-brand) 72%, var(--color-light)),
				transparent 38%
			),
			linear-gradient(
				155deg,
				var(--color-brand),
				color-mix(in srgb, var(--color-accent) 78%, var(--color-dark)) 82%
			);
		opacity: 0;
		scale: 0.78;
		transition:
			opacity 420ms ease,
			scale 820ms cubic-bezier(0.18, 1.18, 0.3, 1);
	}

	.hero-visual.ready .hero-circle {
		opacity: 1;
		scale: 1;
	}

	.squirrel-stage {
		position: absolute;
		z-index: 2;
		top: var(--circle-y);
		left: var(--circle-x);
		width: calc(var(--circle-radius) * 3.2);
		height: calc(var(--circle-radius) * 4);
		opacity: 0;
		transform: translate(-50%, -50%) translateY(clamp(3rem, 7svh, 5rem)) scale(0.95);
		transition:
			opacity 560ms ease 150ms,
			transform 900ms cubic-bezier(0.16, 1, 0.3, 1) 150ms;
	}

	.hero-visual.ready .squirrel-stage {
		opacity: 1;
		transform: translate(-50%, -50%) translateY(0) scale(1);
	}

	section.projects-section {
		--projects-section-gap: 1.25rem;
		display: flex;
		height: calc(100dvh - var(--header-height));
		min-height: calc(100dvh - var(--header-height));
		max-height: calc(100dvh - var(--header-height));
		align-items: center;
		overflow: hidden;
		padding-block: var(--projects-section-gap);
	}

	section.projects-section :global(.container-shell),
	section.projects-section :global(.container) {
		height: 100%;
	}

	.projects-layout {
		display: flex;
		width: 100%;
		height: 100%;
		min-height: 0;
		flex-direction: column;
	}

	.projects-eyebrow {
		color: var(--color-brand);
		font-size: 0.72rem;
		font-weight: 750;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}

	.projects-heading {
		margin-top: 0.35rem;
		font-size: clamp(2.5rem, 4vw, 4.5rem);
		line-height: 1;
		letter-spacing: -0.055em;
	}

	.projects-grid {
		display: grid;
		min-height: 0;
		flex: 1;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		grid-template-rows: minmax(0, 1.15fr) minmax(0, 0.85fr);
		gap: clamp(0.75rem, 1.4vw, 1.25rem);
		margin-top: clamp(1.25rem, 2.4vw, 2rem);
	}

	.project-card {
		position: relative;
		display: flex;
		overflow: hidden;
		border: 1px solid color-mix(in srgb, var(--color-light) 12%, transparent);
		border-radius: clamp(1.5rem, 2.5vw, 2.75rem);
		background: color-mix(in srgb, var(--color-dark) 92%, var(--color-accent));
		box-shadow: 0 1.5rem 4rem rgb(0 0 0 / 0.18);
	}

	.project-card-featured {
		grid-column: 1 / -1;
		align-items: stretch;
		background: var(--color-brand);
		color: var(--color-dark);
	}

	.project-copy {
		position: relative;
		z-index: 2;
		display: flex;
		flex: 1;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1.5rem;
		padding: clamp(1.5rem, 3vw, 3rem);
	}

	.project-card-featured .project-copy {
		flex: 0 0 52%;
		order: -1;
	}

	.project-index,
	.project-type {
		font-size: 0.68rem;
		font-weight: 750;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.project-index {
		align-self: flex-start;
		opacity: 0.55;
	}

	.project-type {
		margin-bottom: 0.5rem;
		opacity: 0.62;
	}

	.project-copy > div {
		max-width: 31rem;
	}

	.project-copy h3 {
		font-size: clamp(2rem, 3.4vw, 4rem);
		line-height: 0.95;
		letter-spacing: -0.055em;
	}

	.project-card-featured .project-copy h3 {
		color: var(--color-light);
	}

	.project-copy > div > p:not(.project-type) {
		max-width: 32rem;
		margin-top: 0.75rem;
		font-size: clamp(0.85rem, 1vw, 1rem);
		line-height: 1.45;
		opacity: 0.7;
	}

	.project-link-slot {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		margin-top: 1rem;
		padding-bottom: 0.2rem;
		border-bottom: 1px solid currentcolor;
		font-size: 0.75rem;
		font-weight: 750;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.project-card-featured .project-link-slot,
	.project-card-featured .project-partner-link {
		color: var(--color-accent);
	}

	.project-link-slot span {
		font-size: 1rem;
	}

	.project-partner-link {
		color: inherit;
		font-weight: 750;
		text-decoration: underline;
		text-decoration-color: color-mix(in srgb, currentcolor 45%, transparent);
		text-underline-offset: 0.18em;
	}

	.project-partner-link:hover {
		text-decoration-color: currentcolor;
	}

	.project-card-small .project-copy h3 {
		font-size: clamp(1.8rem, 2.7vw, 3.25rem);
	}

	.project-card-map .project-copy h3 {
		max-width: 100%;
		font-size: clamp(1.55rem, 2.15vw, 2.6rem);
		line-height: 1;
		text-wrap: balance;
		overflow-wrap: anywhere;
	}

	.project-card-violet {
		background: var(--color-accent);
	}

	.project-card-light {
		background: color-mix(in srgb, var(--color-light) 96%, var(--color-brand));
		color: var(--color-dark);
	}

	.project-visual-book {
		position: relative;
		flex: 1;
		min-width: 18rem;
		container-type: size;
		perspective: 90rem;
	}

	.book-decoration {
		position: absolute;
		z-index: 0;
		top: 49%;
		left: 55%;
		display: grid;
		width: min(32cqw, 58cqh);
		aspect-ratio: 0.72;
		place-content: center;
		gap: 0.6rem;
		translate: -50% -50%;
		rotate: 13deg;
		border: 1px solid color-mix(in srgb, var(--color-light) 12%, transparent);
		border-radius: 0.4rem 1rem 1rem 0.4rem;
		background: color-mix(in srgb, var(--color-accent) 82%, black);
		box-shadow: 0 1.5rem 3rem rgb(0 0 0 / 0.3);
	}

	.book-decoration i {
		display: block;
		width: 4rem;
		height: 0.4rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-light) 76%, transparent);
	}

	.book-decoration i:nth-child(2) {
		width: 2.8rem;
		background: var(--color-brand);
	}

	.book-decoration i:nth-child(3) {
		width: 2rem;
	}

	.animated-book {
		position: absolute;
		top: 50%;
		left: 50%;
		z-index: 1;
		width: min(92cqw, 143.5cqh);
		aspect-ratio: 1.65;
		filter: drop-shadow(0 1.4rem 1.1rem rgb(0 0 0 / 0.24));
		transform: translate(-50%, -50%) rotate(-3deg) scale(0.96);
		transform-style: preserve-3d;
		transition:
			transform 1300ms cubic-bezier(0.18, 0.76, 0.2, 1),
			filter 1300ms ease;
	}

	.animated-book.open {
		filter: drop-shadow(0 1.8rem 1.5rem rgb(0 0 0 / 0.2));
		transform: translate(-50%, -50%) rotate(0deg) scale(1.03);
	}

	.book-back-cover,
	.book-pages {
		position: absolute;
		inset: 3% 2%;
		border-radius: 0.5rem 1.1rem 1.1rem 0.5rem;
	}

	.book-back-cover {
		border: 1px solid color-mix(in srgb, var(--color-light) 14%, transparent);
		background: var(--color-accent);
		box-shadow: 0 1.75rem 3.5rem rgb(0 0 0 / 0.3);
		clip-path: inset(0 0 0 50% round 0.5rem 1.1rem 1.1rem 0.5rem);
		transform: translate(0.35rem, 0.3rem);
	}

	.animated-book.open .book-back-cover {
		opacity: 1;
	}

	.book-pages {
		display: grid;
		z-index: 1;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		overflow: hidden;
		background: #f4f0e6;
		opacity: 0;
		transition: opacity 260ms ease;
	}

	.animated-book.open .book-pages {
		opacity: 1;
		transition-delay: 340ms;
	}

	.book-page {
		position: relative;
		display: block;
		overflow: hidden;
		box-shadow: inset 0 0 1.8rem rgb(27 22 16 / 0.12);
	}

	.book-page-left {
		border-right: 1px solid rgb(30 25 20 / 0.16);
		background:
			linear-gradient(90deg, transparent 84%, rgb(28 23 18 / 0.1)),
			repeating-linear-gradient(#f4f0e6 0 1.25rem, #d8d0bf 1.3rem 1.34rem);
	}

	.book-page-right {
		background: linear-gradient(90deg, rgb(28 23 18 / 0.08), transparent 16%);
	}

	.book-pages video {
		position: absolute;
		z-index: 2;
		inset: clamp(0.45rem, 0.8vw, 0.75rem);
		display: block;
		width: calc(100% - clamp(0.45rem, 0.8vw, 0.75rem) - clamp(0.45rem, 0.8vw, 0.75rem));
		height: calc(100% - clamp(0.45rem, 0.8vw, 0.75rem) - clamp(0.45rem, 0.8vw, 0.75rem));
		border-radius: 0.45rem 0.8rem 0.8rem 0.45rem;
		object-fit: cover;
		opacity: 0;
		transition: opacity 420ms ease;
	}

	.book-pages video.visible {
		opacity: 1;
	}

	.book-fold {
		position: absolute;
		z-index: 3;
		top: 2%;
		bottom: 2%;
		left: 50%;
		width: 1px;
		background: linear-gradient(transparent, rgb(16 12 8 / 0.28) 12% 88%, transparent);
		box-shadow:
			-0.35rem 0 0.7rem rgb(0 0 0 / 0.1),
			0.35rem 0 0.7rem rgb(255 255 255 / 0.13);
	}

	.book-front-cover {
		position: absolute;
		z-index: 3;
		top: 0;
		right: 0;
		display: grid;
		width: 50%;
		height: 100%;
		place-content: center;
		gap: 0.65rem;
		border-radius: 0.45rem 1rem 1rem 0.45rem;
		background: var(--color-light);
		box-shadow: 0 1.5rem 3rem rgb(0 0 0 / 0.24);
		transform: rotateY(0deg);
		transform-origin: left center;
		transform-style: preserve-3d;
		backface-visibility: visible;
		transition: transform 1350ms cubic-bezier(0.18, 0.76, 0.2, 1);
	}

	.animated-book.open .book-front-cover {
		transform: rotateY(-178deg);
	}

	.animated-book.settled .book-front-cover {
		z-index: 0;
	}

	.book-front-cover::after {
		position: absolute;
		inset: 0;
		border: 1px solid rgb(29 24 19 / 0.12);
		border-radius: inherit;
		background:
			linear-gradient(90deg, rgb(28 23 18 / 0.14), transparent 14%),
			color-mix(in srgb, var(--color-light) 94%, var(--color-brand));
		box-shadow: inset 0 0 2rem rgb(28 23 18 / 0.12);
		transform: rotateY(180deg) translateZ(1px);
		backface-visibility: hidden;
		content: '';
	}

	.book-front-cover i {
		position: relative;
		z-index: 1;
		display: block;
		width: 4.6rem;
		height: 0.45rem;
		border-radius: 999px;
		background: var(--color-dark);
		transform: translateZ(1px);
	}

	.book-front-cover i:nth-child(2) {
		width: 3.2rem;
		background: var(--color-brand);
	}
	.book-front-cover i:nth-child(3) {
		width: 2.2rem;
	}

	.project-orbit {
		position: absolute;
		top: -5rem;
		right: -2rem;
		width: 15rem;
		aspect-ratio: 1;
		border: 1px solid color-mix(in srgb, var(--color-brand) 35%, transparent);
		border-radius: 50%;
	}

	.project-orbit::before,
	.project-orbit::after {
		position: absolute;
		inset: 20%;
		border: inherit;
		border-radius: inherit;
		content: '';
	}

	.project-orbit::after {
		inset: 40%;
		background: var(--color-brand);
	}

	.skills-card {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: clamp(1rem, 1.6vw, 1.5rem);
		padding: clamp(1.35rem, 2.2vw, 2.25rem);
	}

	.skills-content {
		display: grid;
		min-width: 0;
		align-content: space-between;
		gap: clamp(0.75rem, 1.2vw, 1rem);
	}

	.skills-heading h3 {
		font-size: clamp(1.75rem, 2.5vw, 3rem);
		line-height: 0.95;
		letter-spacing: -0.055em;
	}

	.skills-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.skills-list li {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.38rem 0.62rem;
		border: 1px solid color-mix(in srgb, var(--color-dark) 12%, transparent);
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-light) 68%, transparent);
		font-size: clamp(0.68rem, 0.85vw, 0.8rem);
		font-weight: 700;
	}

	.skills-list svg {
		width: 1rem;
		height: 1rem;
		fill: var(--skill-color);
	}

	.skills-agency {
		max-width: 28rem;
		font-size: clamp(0.72rem, 0.9vw, 0.85rem);
		line-height: 1.4;
		color: color-mix(in srgb, var(--color-dark) 70%, transparent);
	}

	.skills-agency a {
		color: var(--color-accent);
		font-weight: 750;
		text-decoration: underline;
		text-decoration-color: color-mix(in srgb, var(--color-accent) 40%, transparent);
		text-underline-offset: 0.18em;
	}

	section.game-dev-section {
		--game-dev-section-gap: clamp(2rem, 4svh, 3rem);
		display: flex;
		min-height: calc(100svh - var(--header-height));
		align-items: flex-start;
		overflow: hidden;
		padding-block: var(--game-dev-section-gap);
	}

	.game-dev-layout {
		width: 100%;
	}

	.game-dev-eyebrow {
		margin: 0;
		color: var(--color-brand);
		font-size: 0.72rem;
		font-weight: 750;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}

	.game-dev-card {
		position: relative;
		display: grid;
		min-height: calc(100svh - var(--header-height) - (2 * var(--game-dev-section-gap)));
		grid-template-columns: minmax(18rem, 0.9fr) minmax(0, 1.1fr);
		overflow: hidden;
		border: 1px solid color-mix(in srgb, var(--color-light) 12%, transparent);
		border-radius: clamp(1.75rem, 3vw, 3.5rem);
		background: color-mix(in srgb, var(--color-dark) 92%, var(--color-accent));
		box-shadow: 0 2.5rem 7rem rgb(0 0 0 / 0.24);
	}

	@media (min-width: 80rem) {
		.game-dev-card {
			grid-template-columns: minmax(0, 1.55fr) minmax(18rem, 0.85fr);
			grid-template-rows: minmax(0, 1fr) auto;
		}

		.game-dev-copy {
			display: contents;
		}

		.game-dev-heading {
			grid-column: 1 / 3;
			grid-row: 1;
			align-self: end;
			padding: clamp(1.75rem, 3vw, 2.75rem);
		}

		.game-dev-details {
			display: flex;
			grid-column: 2;
			grid-row: 2;
			align-self: center;
			flex-direction: column;
			padding: 2rem clamp(2rem, 3vw, 3rem);
		}
	}

	.game-dev-art {
		position: relative;
		min-height: 26rem;
		overflow: hidden;
		background: linear-gradient(
			150deg,
			color-mix(in srgb, var(--color-accent) 84%, black),
			var(--color-dark)
		);
	}

	@media (min-width: 80rem) {
		.game-dev-art {
			grid-column: 1;
			grid-row: 2;
			min-height: 0;
			aspect-ratio: 16 / 9;
			align-self: end;
		}
	}

	.game-dev-art img {
		position: absolute;
		z-index: 1;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		opacity: 0;
		transition: opacity 900ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.game-dev-art img.visible {
		opacity: 1;
	}

	.game-dev-placeholder {
		position: absolute;
		z-index: 2;
		inset: 0;
		overflow: hidden;
		opacity: 0;
		pointer-events: none;
		transition: opacity 700ms cubic-bezier(0.22, 1, 0.36, 1);
		background:
			radial-gradient(
				circle at 50% 35%,
				color-mix(in srgb, var(--color-brand) 40%, transparent),
				transparent 38%
			),
			linear-gradient(150deg, color-mix(in srgb, var(--color-accent) 84%, black), var(--color-dark));
	}

	.game-dev-placeholder.visible {
		opacity: 1;
	}

	.game-dev-moon {
		position: absolute;
		top: 14%;
		left: 50%;
		width: clamp(8rem, 16vw, 14rem);
		aspect-ratio: 1;
		translate: -50% 0;
		border-radius: 50%;
		background: var(--color-brand);
		box-shadow: 0 0 5rem color-mix(in srgb, var(--color-brand) 42%, transparent);
	}

	.game-dev-tree {
		position: absolute;
		bottom: -8%;
		width: 24%;
		height: 72%;
		background: color-mix(in srgb, var(--color-accent) 74%, black);
		clip-path: polygon(
			45% 0,
			55% 0,
			57% 40%,
			100% 56%,
			62% 54%,
			65% 100%,
			35% 100%,
			39% 53%,
			0 64%,
			42% 40%
		);
	}

	.tree-one {
		left: 4%;
		transform: rotate(-5deg) scale(1.12);
	}
	.tree-two {
		right: 3%;
		transform: rotate(6deg) scale(1.24);
	}
	.tree-three {
		right: 29%;
		bottom: -24%;
		transform: scale(0.72);
		opacity: 0.72;
	}

	.game-dev-copy {
		display: flex;
		max-width: 48rem;
		flex-direction: column;
		justify-content: center;
		padding: clamp(2rem, 5vw, 5rem);
	}

	@media (min-width: 80rem) {
		.game-dev-copy {
			display: contents;
		}
	}

	.game-dev-tag {
		align-self: flex-start;
		padding: 0.45rem 0.8rem;
		border: 1px solid color-mix(in srgb, var(--color-brand) 42%, transparent);
		border-radius: 999px;
		color: var(--color-brand);
		font-size: 0.72rem;
		font-weight: 750;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.game-dev-meta {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.75rem 1rem;
	}

	.game-dev-copy h2 {
		margin-top: 1.5rem;
		padding-bottom: 0.08em;
		font-size: clamp(3rem, 6vw, 6.5rem);
		line-height: 0.98;
		letter-spacing: -0.06em;
	}

	.game-dev-details > p {
		max-width: 38rem;
		margin-top: 1.5rem;
		color: color-mix(in srgb, var(--color-light) 68%, transparent);
		font-size: clamp(1rem, 1.3vw, 1.2rem);
		line-height: 1.6;
	}

	.game-dev-status {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		margin-top: 2rem;
		color: var(--color-light);
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.game-dev-status > span:first-child {
		width: 0.6rem;
		aspect-ratio: 1;
		border-radius: 50%;
		background: var(--color-brand);
		box-shadow: 0 0 1rem var(--color-brand);
	}

	@media (max-width: 79.99rem) {
		section.game-dev-section {
			align-items: flex-start;
			overflow: visible;
		}

		.game-dev-card {
			min-height: 0;
			grid-template-columns: 1fr;
		}

		.game-dev-copy {
			order: -1;
			padding: clamp(1.75rem, 5vw, 3rem);
		}

		.game-dev-copy h2 {
			font-size: clamp(2.25rem, 8.5vw, 4.5rem);
			overflow-wrap: anywhere;
		}

		.game-dev-art {
			min-height: clamp(14rem, 42vw, 22rem);
		}
	}

	section.about-section {
		display: flex;
		height: calc(100dvh - var(--header-height));
		min-height: calc(100dvh - var(--header-height));
		max-height: calc(100dvh - var(--header-height));
		align-items: center;
		overflow: hidden;
	}

	section.about-section :global(.container-shell),
	section.about-section :global(.container) {
		height: 100%;
	}

	.about-layout {
		position: relative;
		display: grid;
		width: 100%;
		height: 100%;
		min-height: 0;
		grid-template-columns: minmax(0, 1fr) minmax(20rem, 0.72fr);
		align-items: stretch;
		gap: clamp(2rem, 5vw, 6rem);
		overflow: hidden;
		padding: clamp(1.5rem, 3vw, 3rem) clamp(1.5rem, 4vw, 4rem) 0;
		border: 1px solid color-mix(in srgb, var(--color-dark) 10%, transparent);
		border-radius: clamp(1.75rem, 3vw, 3.5rem);
		background: color-mix(in srgb, var(--color-light) 97%, var(--color-brand));
		box-shadow: 0 2.5rem 7rem rgb(0 0 0 / 0.24);
	}

	.about-stack {
		display: grid;
		height: 100%;
		min-height: 0;
		grid-template-rows: minmax(0, 1fr) clamp(9rem, 20svh, 10rem);
		gap: clamp(0.75rem, 1.5svh, 1.25rem);
		padding-block: 0.5rem;
	}

	.about-dog {
		position: relative;
		display: grid;
		height: 100%;
		grid-template-columns: minmax(9rem, 15rem) minmax(0, 1fr);
		align-items: center;
		gap: clamp(1.5rem, 4vw, 4rem);
		overflow: hidden;
		padding-inline: clamp(2rem, 6vw, 6rem);
		border: 0;
		border-radius: clamp(1.5rem, 2.4vw, 2.5rem);
		background: var(--color-accent);
		box-shadow: 0 1.25rem 3rem rgb(0 0 0 / 0.2);
		font: inherit;
		outline: none;
		text-align: left;
		transition:
			background-color 480ms ease,
			box-shadow 480ms ease;
	}

	.about-dog-portrait {
		position: relative;
		z-index: 1;
		width: min(15rem, 23vw);
		align-self: center;
	}

	.about-dog-portrait :global(.dog) {
		transition:
			opacity 360ms ease,
			transform 520ms cubic-bezier(0.16, 1, 0.3, 1);
	}

	.about-dog-photo {
		position: absolute;
		top: 50%;
		left: 50%;
		width: min(8rem, 76%);
		aspect-ratio: 1;
		border: 0.25rem solid color-mix(in srgb, var(--color-light) 65%, transparent);
		border-radius: 50%;
		object-fit: cover;
		object-position: 50% 46%;
		opacity: 0;
		transform: translate(-50%, -50%) scale(0.82);
		box-shadow: 0 1rem 2rem rgb(0 0 0 / 0.28);
		transition:
			opacity 360ms ease 80ms,
			transform 560ms cubic-bezier(0.16, 1, 0.3, 1) 60ms;
	}

	.about-dog:is(:hover, :focus-visible) {
		background-color: var(--color-accent);
		box-shadow: none;
	}

	.about-dog:is(:hover, :focus-visible) .about-dog-portrait :global(.dog) {
		opacity: 0;
		transform: scale(0.86);
	}

	.about-dog:is(:hover, :focus-visible) .about-dog-photo {
		opacity: 1;
		transform: translate(-50%, -50%) scale(1);
	}

	.dog-role {
		color: var(--color-light);
		font-size: clamp(1.4rem, 2vw, 2.2rem);
		font-weight: 650;
		line-height: 0.95;
		letter-spacing: -0.04em;
		white-space: nowrap;
	}

	.dog-role span {
		display: inline;
	}

	.dog-role span + span::before {
		content: ' — ';
	}

	.dog-name {
		color: var(--color-brand);
	}

	.dog-subtext {
		margin-top: 0.65rem;
		color: color-mix(in srgb, var(--color-light) 62%, transparent);
		font-size: clamp(0.75rem, 1vw, 0.95rem);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.about-copy {
		align-self: center;
		max-width: 48rem;
		padding-bottom: 0;
	}

	.about-eyebrow {
		margin-bottom: 1.25rem;
		color: var(--color-brand);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}

	.about-copy h2 {
		color: var(--color-dark);
		font-size: clamp(2.75rem, 4vw, 5rem);
		line-height: 0.94;
		letter-spacing: -0.055em;
	}

	.about-intro {
		max-width: 40rem;
		margin-top: clamp(0.7rem, 1.4vw, 1.2rem);
		color: color-mix(in srgb, var(--color-dark) 72%, transparent);
		font-size: clamp(1rem, 1.25vw, 1.2rem);
		line-height: 1.6;
	}

	.about-name {
		color: var(--color-brand);
		font-weight: 750;
	}

	.about-socials {
		display: flex;
		flex-wrap: wrap;
		gap: 0.7rem;
		margin-top: clamp(0.5rem, 1vw, 0.85rem);
	}

	.about-socials a {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		min-height: 2.25rem;
		padding: 0.3rem 0.75rem;
		border: 1px solid color-mix(in srgb, var(--color-dark) 14%, transparent);
		border-radius: 999px;
		color: var(--color-dark);
		font-size: 0.88rem;
		font-weight: 650;
		text-decoration: none;
		transition:
			color 180ms ease,
			background-color 180ms ease,
			border-color 180ms ease,
			transform 180ms ease;
	}

	.about-socials a:hover,
	.about-socials a:focus-visible {
		border-color: var(--color-brand);
		background: var(--color-brand);
		color: var(--color-light);
		transform: translateY(-2px);
	}

	.about-socials :global(svg) {
		width: 1.15rem;
		height: 1.15rem;
	}

	.about-portrait {
		position: relative;
		display: grid;
		place-items: center;
		align-self: end;
		min-height: 100%;
	}

	.about-portrait-circle {
		position: absolute;
		z-index: 0;
		width: min(32.5rem, 90%);
		aspect-ratio: 1;
		border-radius: 50%;
		background: var(--color-brand);
		box-shadow: 0 1.5rem 3rem rgb(0 0 0 / 0.14);
		transform: translateY(-1.8rem);
	}

	@media (prefers-reduced-motion: reduce) {
		main {
			transition: none;
		}

		:global(body.section-jump-blur) main {
			filter: none;
			opacity: 1;
		}

		.hero-visual::before,
		.hero-circle,
		.squirrel-stage {
			transform: none;
			transition: opacity 180ms ease;
		}

		.squirrel-stage {
			transform: translate(-50%, -50%);
		}
	}

	@media (min-width: 120rem) and (min-height: 60rem) {
		section.home-hero :global(.container-shell) {
			max-width: 88rem;
		}

		section.home-hero :global(.container) {
			max-width: 88rem;
			margin-inline: 0;
		}

		.hero-copy {
			max-width: min(80rem, 58vw);
			padding-left: clamp(1rem, 2vw, 3rem);
		}

		.hero-eyebrow {
			font-size: clamp(0.78rem, 0.55vw, 1rem);
		}

		.hero-copy h1 {
			font-size: clamp(5.8rem, 5vw, 7.5rem);
		}

		.hero-intro {
			max-width: 46rem;
			font-size: clamp(1.2rem, 1vw, 1.5rem);
		}

		.hero-visual {
			--circle-radius: clamp(18rem, 24svh, 28rem);
			left: 61%;
		}
	}

	@media (min-width: 48rem) and (max-height: 849px) {
		section.about-section {
			padding-block: calc(var(--header-height) + 0.5rem) 0.5rem;
		}

		.about-stack {
			grid-template-columns: minmax(0, 1fr) clamp(16rem, 25vw, 20rem);
			grid-template-rows: minmax(0, 1fr);
			gap: 0.75rem;
		}

		.about-layout {
			grid-template-columns: minmax(0, 1fr) minmax(10rem, 0.48fr);
			gap: 1rem;
			padding: 1.25rem 1.5rem 0;
			border-radius: 1.75rem;
		}

		.about-copy {
			padding-bottom: 1.25rem;
		}

		.about-eyebrow {
			margin-bottom: 0.65rem;
		}

		.about-copy h2 {
			font-size: clamp(2rem, 3.4vw, 3rem);
		}

		.about-copy > p:last-child {
			margin-top: 0.75rem;
			font-size: 0.85rem;
			line-height: 1.4;
		}

		.about-portrait {
			min-height: 0;
		}

		.about-dog {
			grid-template-columns: 1fr;
			grid-template-rows: auto auto;
			align-items: center;
			align-content: center;
			gap: clamp(0.75rem, 3svh, 1.4rem);
			padding: 0.9rem 1.25rem 1.15rem;
			text-align: center;
		}

		.about-dog-portrait {
			width: min(clamp(8rem, 30svh, 12rem), 100%);
			margin-inline: auto;
		}

		.dog-role {
			font-size: clamp(1.05rem, 1.7vw, 1.35rem);
			line-height: 1;
			white-space: normal;
		}

		.dog-role span {
			display: block;
		}

		.dog-role span + span::before {
			content: none;
		}

		.dog-subtext {
			margin-top: 0.35rem;
			font-size: 0.62rem;
		}
	}

	@media (min-width: 48rem) and (min-height: 850px) and (max-height: 1000px) {
		.about-portrait :global(.portrait) {
			width: min(100%, 27rem);
		}

		.about-portrait-circle {
			width: min(26rem, 82%);
		}
	}

	@media (min-width: 48rem) and (max-height: 32rem) {
		.about-layout {
			padding: 1rem 1.5rem 0;
		}

		.about-copy {
			padding-bottom: 1rem;
		}

		.about-eyebrow {
			margin-bottom: 0.4rem;
			font-size: 0.62rem;
		}

		.about-copy h2 {
			font-size: clamp(1.65rem, 3vw, 2.25rem);
		}

		.about-intro {
			margin-top: 0.5rem;
			font-size: 0.72rem;
			line-height: 1.3;
		}

		.about-socials {
			gap: 0.4rem;
			margin-top: 0.45rem;
		}

		.about-socials a {
			min-height: 1.75rem;
			padding: 0.2rem 0.55rem;
			font-size: 0.7rem;
		}

		.about-socials :global(svg) {
			width: 0.9rem;
			height: 0.9rem;
		}
	}

	@media (max-width: 47.99rem) {
		section {
			scroll-snap-align: none;
			scroll-margin-top: 0;
			padding-top: calc(var(--header-height) + 1.5rem);
			padding-bottom: calc(5.25rem + env(safe-area-inset-bottom));
		}

		section.contact-section {
			--contact-section-gap: 1.5rem;
			padding-top: calc(var(--header-height) + var(--contact-section-gap));
			padding-bottom: calc(4.25rem + var(--contact-section-gap) + env(safe-area-inset-bottom));
		}

		section.home-hero {
			align-items: flex-start;
			padding-top: calc(var(--header-height) + 1.5rem);
		}

		section.game-dev-section {
			align-items: safe center;
			padding-top: calc(var(--header-height) + 0.75rem);
			padding-bottom: calc(5.25rem + env(safe-area-inset-bottom));
		}

		.hero-copy {
			max-width: 100%;
			justify-content: flex-start;
			padding-block: 2rem;
		}

		.hero-copy h1 {
			font-size: clamp(2.45rem, 10.5vw, 3.4rem);
		}

		.hero-intro {
			max-width: 90%;
		}

		.hero-visual {
			--circle-x: 50%;
			--circle-y: 61%;
			--circle-radius: min(31vw, 9.5rem);
			top: 43%;
			left: 14%;
			opacity: 0.72;
		}

		.squirrel-stage {
			filter: brightness(1.18) saturate(1.04);
		}

		section.projects-section {
			height: auto;
			min-height: 100svh;
			max-height: none;
			align-items: flex-start;
			overflow: visible;
			padding-top: calc(var(--header-height) + 1.5rem);
			padding-bottom: calc(5.25rem + env(safe-area-inset-bottom));
		}

		section.projects-section :global(.container-shell),
		section.projects-section :global(.container),
		.projects-layout {
			height: auto;
		}

		.projects-heading {
			font-size: clamp(2.45rem, 11vw, 3.35rem);
		}

		.projects-grid {
			grid-template-columns: 1fr;
			grid-template-rows: none;
			min-height: 0;
		}

		.project-card-featured {
			grid-column: auto;
			min-height: 30rem;
			flex-direction: column;
		}

		.project-card-featured .project-copy {
			flex: 0 0 auto;
			order: 0;
		}

		.project-visual-book {
			min-width: 0;
			min-height: 17rem;
			container-type: inline-size;
		}

		.project-visual-book .animated-book {
			width: min(90%, 21rem);
		}

		.project-visual-book .book-decoration {
			width: min(32%, 7.5rem);
		}

		.project-visual-book .book-decoration i {
			width: min(4rem, 70%);
		}

		.project-visual-book .book-decoration i:nth-child(2) {
			width: min(2.8rem, 52%);
		}

		.project-visual-book .book-decoration i:nth-child(3) {
			width: min(2rem, 38%);
		}

		.project-card-small {
			min-height: 18rem;
		}

		.project-copy {
			display: grid;
			grid-template-columns: auto minmax(0, 1fr);
			align-items: end;
			justify-content: initial;
			padding: 1.5rem;
		}

		.project-copy > div {
			min-width: 0;
		}

		.project-copy h3,
		.project-card-small .project-copy h3 {
			font-size: clamp(2rem, 10vw, 3rem);
		}

		.project-card-map .project-copy h3 {
			font-size: clamp(1.45rem, 7vw, 2.05rem);
			line-height: 1.02;
		}

		.game-dev-card {
			border-radius: 1.75rem;
		}

		.game-dev-art {
			min-height: clamp(12rem, 56vw, 16rem);
		}

		.game-dev-copy {
			padding: 2rem 1.5rem 2.5rem;
		}

		.game-dev-copy h2 {
			font-size: clamp(2.2rem, 10vw, 3.25rem);
		}

		.game-dev-details > p {
			font-size: 0.95rem;
		}

		section.about-section {
			height: auto;
			min-height: 100svh;
			max-height: none;
			align-items: flex-start;
			overflow: visible;
			padding-bottom: calc(6.5rem + env(safe-area-inset-bottom));
		}

		section.about-section :global(.container-shell),
		section.about-section :global(.container) {
			height: auto;
		}

		.about-layout {
			grid-template-columns: 1fr;
			grid-template-rows: auto auto;
			align-content: start;
			gap: 0;
			height: auto;
			min-height: 0;
			padding: 2rem 1.5rem 0;
			border-radius: 1.75rem;
		}

		.about-stack {
			height: auto;
			grid-template-rows: auto auto;
			gap: 1rem;
			padding-block: 0;
		}

		.about-copy {
			padding-bottom: 0;
		}

		.about-copy h2 {
			font-size: clamp(2.45rem, 11vw, 3.35rem);
		}

		.about-intro {
			margin-top: 1rem;
			font-size: 0.95rem;
		}

		.about-portrait {
			width: min(76vw, 17rem);
			height: auto;
			min-height: 0;
			align-self: end;
			margin-inline: auto;
		}

		.about-dog {
			height: auto;
			min-height: 8.75rem;
			grid-template-columns: 7.5rem minmax(0, 1fr);
			gap: 0.75rem;
			padding: 0.75rem 1rem;
			border-radius: 1.5rem;
		}

		.about-dog-portrait {
			width: 8rem;
		}

		.dog-role {
			font-size: clamp(1.1rem, 5vw, 1.45rem);
			white-space: normal;
		}

		.dog-role span {
			display: block;
		}

		.dog-role span + span::before {
			content: none;
		}

		.dog-subtext {
			margin-top: 0.4rem;
			font-size: 0.68rem;
		}
	}
</style>
