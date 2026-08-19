<script>
	let { children, class: className = '' } = $props();
</script>

<div class={`container-shell ${className}`}>
	<div class="container">
		{@render children()}
	</div>
</div>

<style>
	.container-shell {
		width: calc(100% - var(--content-left));
		margin-left: var(--content-left);
		padding-right: clamp(1.5rem, 4vw, 4rem);
	}

	.container {
		width: min(100%, 112rem);
		max-width: 112rem;
		margin-inline: auto;
	}

	@media (max-width: 47.99rem) {
		.container-shell {
			width: 100%;
			margin-left: 0;
			padding-inline: var(--content-left);
		}
	}
</style>
