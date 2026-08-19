<script>
	let { name } = $props();
</script>

<svg viewBox="0 0 24 24" aria-hidden="true">
	{#if name === 'github'}
		<path
			d="M15 22v-4.1c.04-1.25-.44-2.17-1-2.9 3.28-.36 6.72-1.61 6.72-7.25A5.66 5.66 0 0 0 19.22 4 5.28 5.28 0 0 0 19.08.3S17.9-.08 15 1.72a13.4 13.4 0 0 0-6 0C6.1-.08 4.92.3 4.92.3A5.28 5.28 0 0 0 4.78 4a5.66 5.66 0 0 0-1.5 3.75c0 5.63 3.44 6.89 6.72 7.25-.53.58-.9 1.34-1 2.22V22"
		/>
		<path d="M9 19c-3 .92-3-1.5-4.2-2" />
	{:else if name === 'instagram'}
		<rect x="3" y="3" width="18" height="18" rx="5" />
		<circle cx="12" cy="12" r="4" />
		<circle cx="17.5" cy="6.5" r=".7" fill="currentColor" stroke="none" />
	{:else if name === 'hero'}
		<path d="M3.5 10.5 12 3l8.5 7.5v9a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5Z" />
		<path d="M9 21v-7h6v7" />
	{:else if name === 'about'}
		<circle cx="9" cy="8" r="3" />
		<circle cx="17" cy="9" r="2.25" />
		<path d="M3.5 20c.3-4 2.1-6 5.5-6s5.2 2 5.5 6M14 15c3.8-.8 6.1.9 6.5 4" />
	{:else if name === 'projects'}
		<rect x="3.5" y="3.5" width="7" height="7" rx="1" />
		<rect x="13.5" y="3.5" width="7" height="7" rx="1" />
		<rect x="3.5" y="13.5" width="7" height="7" rx="1" />
		<rect x="13.5" y="13.5" width="7" height="7" rx="1" />
	{:else if name === 'game_dev'}
		<path
			d="M7.5 8h9a5 5 0 0 1 4.8 6.4l-1.1 3.8a2.2 2.2 0 0 1-3.7.9L14.6 17H9.4l-1.9 2.1a2.2 2.2 0 0 1-3.7-.9l-1.1-3.8A5 5 0 0 1 7.5 8Z"
		/>
		<path d="M7 11v4M5 13h4M16.5 12h.01M18.5 14h.01" />
	{:else}
		<rect x="2.5" y="5" width="19" height="14" rx="2" />
		<path d="m3.5 7 8.5 6 8.5-6" />
	{/if}
</svg>

<style>
	svg {
		display: block;
		width: 1.45rem;
		height: 1.45rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.7;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
</style>
