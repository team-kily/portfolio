<script>
	import { onMount } from 'svelte';

	let root;
	let assembled = $state(false);

	onMount(() => {
		const mobile = window.matchMedia('(max-width: 47.99rem)').matches;
		const circle = root.parentElement?.querySelector('.about-portrait-circle');
		const target = mobile && circle ? circle : root;
		const requiredRatio = mobile ? 0.999 : 0.35;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!assembled && entry.isIntersecting && entry.intersectionRatio >= requiredRatio) {
					assembled = true;
					observer.disconnect();
				}
			},
			{ threshold: [requiredRatio] }
		);
		observer.observe(target);
		return () => observer.disconnect();
	});
</script>

<div class="portrait" class:assembled bind:this={root}>
	<svg viewBox="0 0 480 600" role="img" aria-label="Stilisiertes Portrait">
		<defs>
			<linearGradient id="hoodie" x1="0" y1="0" x2="1" y2="1">
				<stop offset="0" stop-color="#5f686d" />
				<stop offset="1" stop-color="#30383d" />
			</linearGradient>
			<linearGradient id="skin" x1="0" y1="0" x2="0.8" y2="1">
				<stop offset="0" stop-color="#efbc99" />
				<stop offset="1" stop-color="#cf896d" />
			</linearGradient>
		</defs>

		<g class="part shoulders" style="--delay: 920ms">
			<path d="M45 600c12-106 75-157 150-174h90c77 18 139 69 151 174z" fill="url(#hoodie)" />
			<path
				d="M45 600c15-82 58-135 126-161 15 34 37 53 69 53s54-19 69-53c68 26 111 79 126 161z"
				fill="#20272b"
				opacity=".28"
			/>
			<path d="M195 410c5 39 21 67 45 78 24-11 40-39 45-78z" fill="#bd765c" />
			<path
				d="M169 444c14 40 39 61 71 61s57-21 71-61"
				fill="none"
				stroke="#20272b"
				stroke-linecap="round"
				stroke-width="8"
			/>
			<g fill="none" stroke="#252b2f" stroke-linecap="round" stroke-width="5">
				<path d="M218 487c-2 22-1 43 3 65" />
				<path d="M262 487c2 22 1 43-3 65" />
			</g>
			<path d="M216 548h11v22c0 5-11 5-11 0z" fill="#1e2428" />
			<path d="M253 548h11v22c0 5-11 5-11 0z" fill="#1e2428" />
		</g>

		<g class="part ears" style="--delay: 530ms">
			<path d="M105 238c-22 1-30 20-24 46 6 24 20 40 40 36l5-75c-7-5-14-7-21-7z" fill="#d18a6e" />
			<path d="M375 238c22 1 30 20 24 46-6 24-20 40-40 36l-5-75c7-5 14-7 21-7z" fill="#b66e59" />
		</g>

		<path
			class="part face"
			style="--delay: 430ms"
			d="M118 188c12-79 232-79 244 0l-6 112c-3 48-27 91-65 117-25 18-77 18-102 0-38-26-62-69-65-117z"
			fill="url(#skin)"
		/>
		<path
			class="part face-shadow"
			style="--delay: 470ms"
			d="M278 116c40 2 70 27 84 72l-6 112c-3 48-27 91-65 117 25-37 36-75 34-114z"
			fill="#9f5847"
			opacity=".11"
		/>

		<g class="part hair" style="--delay: 780ms" fill="#17171b">
			<path
				d="M123 180c-4-35 3-68 21-94 18-27 43-45 74-53 45-12 96-1 125 31 27 30 31 72 12 116-18-17-29-42-32-73-27 17-58 23-94 19-39-4-66 7-82 31-5 12-13 22-24 23z"
			/>
			<path
				d="M143 116c19-45 56-70 102-73 39-2 73 11 96 38-35-14-70-12-102 5-34 18-64 28-96 30z"
				fill="#25242a"
			/>
			<path d="M162 86c25-29 65-42 104-33-34 5-63 18-87 39z" fill="#3b3940" opacity=".55" />
		</g>

		<g class="part brows" style="--delay: 80ms" fill="#242126">
			<path d="M143 235c28-14 61-14 88-2l-7 13c-25-7-50-6-77 3z" />
			<path d="M337 235c-28-14-61-14-88-2l7 13c25-7 50-6 77 3z" />
		</g>

		<g class="part eyes" style="--delay: 200ms">
			<path d="M148 269c22-15 58-15 82-2-25 18-59 19-82 2z" fill="#f4e5d5" />
			<path d="M332 269c-22-15-58-15-82-2 25 18 59 19 82 2z" fill="#f4e5d5" />
			<ellipse cx="194" cy="269" rx="9" ry="9" fill="#4a3025" />
			<ellipse cx="286" cy="269" rx="9" ry="9" fill="#4a3025" />
			<circle cx="194" cy="269" r="5" fill="#111217" />
			<circle cx="286" cy="269" r="5" fill="#111217" />
			<circle cx="191" cy="266" r="2" fill="#fff" />
			<circle cx="283" cy="266" r="2" fill="#fff" />
		</g>

		<g class="part nose" style="--delay: 610ms">
			<path
				d="M240 278c-5 16-9 31-7 43 6 7 15 8 24 3"
				fill="none"
				stroke="#925943"
				stroke-linecap="round"
				stroke-width="7"
			/>
		</g>

		<g class="part smile" style="--delay: 700ms">
			<path d="M181 361c36-8 82-8 118 0-20 25-39 35-59 35s-39-10-59-35z" fill="#914e55" />
			<path d="M190 363c31 4 69 4 100 0-23 14-77 14-100 0z" fill="#f4e5d5" />
			<path d="M204 386c23 8 49 8 72 0-20 15-52 15-72 0z" fill="#c97a80" />
		</g>

		<g
			class="part details"
			style="--delay: 850ms"
			fill="none"
			stroke="#7e493d"
			stroke-linecap="round"
		>
			<path d="M143 307c-2 24 4 46 18 63m176-63c2 24-4 46-18 63" opacity=".12" stroke-width="8" />
			<path d="M188 407c34 16 71 16 104-1" opacity=".16" stroke-width="5" />
		</g>
	</svg>
</div>

<style>
	.portrait {
		width: min(100%, 34rem);
		filter: drop-shadow(0 1.5rem 2.5rem rgb(0 0 0 / 0.24));
	}

	svg {
		display: block;
		width: 100%;
		overflow: visible;
	}

	.part {
		opacity: 0;
		transform-box: fill-box;
		transform-origin: center;
		transition:
			opacity 180ms ease var(--delay),
			transform 500ms cubic-bezier(0.16, 1, 0.3, 1) var(--delay);
	}

	.brows {
		transform: translateY(-2.5rem) scaleX(0.25);
	}

	.eyes {
		transform: translateY(-1.2rem) scale(0.35);
	}

	.face,
	.face-shadow,
	.ears {
		transform: scale(0.72, 0.18);
	}

	.nose {
		transform: translateY(-1.5rem) scale(0.45);
	}

	.smile {
		transform: translateY(1.5rem) scaleX(0.35);
	}

	.hair {
		transform: translateY(-3rem) scale(0.72);
	}

	.details {
		transform: scale(0.7);
	}

	.shoulders {
		transform: translateY(5rem) scaleX(0.6);
	}

	.assembled .part {
		opacity: 1;
		transform: translate(0) scale(1);
	}

	.assembled .hair {
		transform: translateY(2.45rem) scale(1.035, 1.06);
	}

	.assembled .smile {
		transform: scale(0.78);
	}

	@media (prefers-reduced-motion: reduce) {
		.part {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
