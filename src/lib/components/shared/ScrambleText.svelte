<script>
	import { onDestroy, onMount, untrack } from 'svelte';

	let { text, lang, nowrap = true, inline = false, animateOnMount = false } = $props();
	let displayedText = $state(untrack(() => text));
	let previousText = untrack(() => text);
	let animationFrame;
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ0123456789@#$%&*+=<>?/\\|{}[]()~^:;!§°×÷_—◇◆○●△▽░▒▓';

	$effect(() => {
		const nextText = text;
		if (nextText === previousText) return;

		const oldText = previousText;
		previousText = nextText;
		startScramble(oldText, nextText);
	});

	onMount(() => {
		if (animateOnMount) startScramble('', text);
	});

	onDestroy(() => {
		if (animationFrame) cancelAnimationFrame(animationFrame);
	});

	function startScramble(from, to) {
		if (animationFrame) cancelAnimationFrame(animationFrame);
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			displayedText = to;
			return;
		}

		const startedAt = performance.now();
		const duration = 460;
		const length = inline ? to.length : Math.max(from.length, to.length);

		const animate = (time) => {
			const progress = Math.min(1, (time - startedAt) / duration);
			const revealed = Math.floor(progress * (length + 1));

			displayedText = Array.from({ length }, (_, index) => {
				if (index < revealed) return to[index] ?? '';
				if (to[index] === ' ') return ' ';
				if (progress < 0.18 && from[index]) return from[index];
				return characters[Math.floor(Math.random() * characters.length)];
			}).join('');

			if (progress < 1) {
				animationFrame = requestAnimationFrame(animate);
			} else {
				displayedText = to;
				animationFrame = undefined;
			}
		};

		animationFrame = requestAnimationFrame(animate);
	}
</script>

{#if inline}
	<span {lang} aria-label={text} class="inline-flow">{displayedText}</span>
{:else}
	<span {lang} aria-label={text} class:wrap={!nowrap}>
		<span class="text-size" aria-hidden="true">{text}</span>
		<span class="text-animation" aria-hidden="true">{displayedText}</span>
	</span>
{/if}

<style>
	span:not(.text-size, .text-animation) {
		position: relative;
		display: inline-block;
		min-width: max-content;
	}

	span.inline-flow {
		display: inline;
		min-width: 0;
	}

	span.wrap:not(.text-size, .text-animation) {
		display: block;
		width: 100%;
		min-width: 0;
		white-space: normal;
	}

	.text-size {
		visibility: hidden;
	}

	.text-animation {
		position: absolute;
		inset: 0;
		display: block;
		overflow: hidden;
	}

	span:not(.wrap) .text-size,
	span:not(.wrap) .text-animation {
		white-space: nowrap;
	}

	@media (prefers-reduced-motion: reduce) {
		span {
			transition: none;
		}
	}
</style>
