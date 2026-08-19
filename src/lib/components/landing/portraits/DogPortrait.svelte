<script>
	import { onMount } from 'svelte';
	let root;
	let assembled = $state(false);

	onMount(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					assembled = true;
					observer.disconnect();
				}
			},
			{ threshold: 0.3 }
		);
		observer.observe(root);
		return () => observer.disconnect();
	});
</script>

<div class="dog" class:assembled bind:this={root}>
	<svg viewBox="0 0 420 230" role="img" aria-label="Stilisiertes Portrait eines Rauhaarhundes">
		<g class="part chest" style="--delay: 80ms">
			<path d="M102 230c10-63 51-92 108-92s98 29 108 92z" fill="#eee9df" />
		</g>

		<g class="head-turn">
			<g class="part ears" style="--delay: 180ms">
				<path
					d="M158 55c-18-9-32 2-32 27 0 35 11 71 27 95 12-26 19-63 17-94-1-14-6-24-12-28z"
					fill="#685f5b"
				/>
				<path
					d="M274 57c26-8 38 13 32 51-6 36-19 61-38 73-14-27-19-65-15-96 3-14 10-23 21-28z"
					fill="#746863"
				/>
				<path
					d="M137 86c3 32 9 57 17 76m134-66c-4 31-12 54-23 69"
					fill="none"
					stroke="#a2968f"
					stroke-linecap="round"
					stroke-width="6"
					opacity=".55"
				/>
			</g>

			<path
				class="part head"
				style="--delay: 250ms"
				d="M145 66c13-53 131-53 144 0l-6 70c-4 44-29 71-66 71s-62-27-66-71z"
				fill="#b98157"
			/>

			<g class="part blaze" style="--delay: 340ms">
				<path d="M200 24c11-6 24-6 35 0l10 70-28 53-31-50z" fill="#f2eee5" />
				<path d="M150 67c10-29 27-45 50-47l-14 78c-16 4-28-6-36-31z" fill="#c79870" opacity=".75" />
				<path d="M235 20c26 3 43 18 53 47-9 25-23 37-43 30z" fill="#c79870" opacity=".72" />
				<path
					d="M174 51l7-17 6 16 10-21 4 24m61 0-6-15-7 15-8-20-6 23"
					fill="none"
					stroke="#e9e1d5"
					stroke-linecap="round"
					stroke-width="4"
				/>
			</g>

			<g class="part eyes" style="--delay: 460ms">
				<ellipse cx="185" cy="102" rx="14" ry="12" fill="#241f1f" />
				<ellipse cx="247" cy="102" rx="13" ry="11" fill="#241f1f" />
				<ellipse cx="185" cy="102" rx="8.5" ry="9" fill="#a97646" />
				<ellipse cx="247" cy="102" rx="8" ry="8.5" fill="#a97646" />
				<circle cx="185" cy="103" r="5" fill="#111011" />
				<circle cx="247" cy="103" r="5" fill="#111011" />
				<circle cx="182" cy="98" r="2.5" fill="#fff" />
				<circle cx="244" cy="98" r="2.5" fill="#fff" />
			</g>

			<g class="part muzzle" style="--delay: 590ms">
				<path
					d="M151 126c13-27 35-39 64-35 29-5 53 8 66 35l-8 50c-12 20-32 31-60 33-27-2-48-13-59-33z"
					fill="#f4f0e7"
				/>
				<path
					d="M164 161l-8 19 16-4 3 20 14-9 6 21 12-12 12 14 7-22 15 9 3-20 17 4-8-20z"
					fill="#eae3d8"
				/>
				<path d="M178 131c14-15 50-15 64 0-4 23-16 32-32 32s-28-9-32-32z" fill="#211f20" />
				<path
					d="M188 132c10-5 31-5 42 0"
					fill="none"
					stroke="#555051"
					stroke-linecap="round"
					stroke-width="4"
					opacity=".65"
				/>
				<path
					d="M210 163c-1 11-10 18-23 21m23-21c1 11 10 18 23 21"
					fill="none"
					stroke="#725044"
					stroke-linecap="round"
					stroke-width="4"
				/>
			</g>
		</g>
	</svg>
</div>

<style>
	.dog,
	svg {
		display: block;
		width: 100%;
	}
	.part {
		opacity: 0;
		transform-box: fill-box;
		transform-origin: center;
		transition:
			opacity 180ms ease var(--delay),
			transform 500ms cubic-bezier(0.16, 1, 0.3, 1) var(--delay);
	}
	.chest {
		transform: translateY(2rem) scaleX(0.7);
	}
	.head {
		transform: scale(0.7, 0.2);
	}
	.ears,
	.blaze {
		transform: translateY(-1rem) scale(0.68);
	}
	.eyes {
		transform: scale(0.35);
	}
	.muzzle {
		transform: translateY(1rem) scale(0.45);
	}
	.head-turn {
		transform: translateX(-0.1rem) skewY(-0.8deg);
		transform-origin: 52% 56%;
	}
	.assembled .part {
		opacity: 1;
		transform: none;
	}
	.assembled .muzzle {
		transform: translate(0.25rem, 0.18rem) scale(0.84);
	}
	.assembled .chest {
		transform: translateY(0.35rem);
	}
	@media (prefers-reduced-motion: reduce) {
		.part {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
