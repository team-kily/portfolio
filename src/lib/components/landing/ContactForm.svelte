<script>
	import ScrambleText from '$lib/components/shared/ScrambleText.svelte';
	import { locale, t } from '$lib/i18n/translation.svelte.js';

	let form;
	let state = $state('idle');
	let startedAt = $state(Date.now());

	async function submit(event) {
		event.preventDefault();
		if (state === 'sending') return;

		state = 'sending';
		const data = new FormData(form);

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					name: data.get('name'),
					email: data.get('email'),
					message: data.get('message'),
					website: data.get('website'),
					startedAt,
					language: locale.current
				})
			});

			if (!response.ok) throw new Error('Contact request failed');

			form.reset();
			startedAt = Date.now();
			state = 'success';
		} catch {
			state = 'error';
		}
	}
</script>

<div class="contact-layout">
	<div class="contact-copy">
		<p class="contact-eyebrow">
			<ScrambleText text={t('contact.eyebrow')} lang={locale.current} />
		</p>
		<h2 id="contact-heading">
			<ScrambleText text={t('contact.headline')} lang={locale.current} nowrap={false} />
		</h2>
		<p class="contact-intro">
			<ScrambleText text={t('contact.intro')} lang={locale.current} nowrap={false} />
		</p>
	</div>

	<form bind:this={form} onsubmit={submit} autocomplete="off">
		<div class="field-row">
			<label>
				<span><ScrambleText text={t('contact.name')} lang={locale.current} inline /></span>
				<input
					name="name"
					type="text"
					autocomplete="off"
					placeholder={t('contact.name_placeholder')}
					minlength="2"
					maxlength="80"
					required
				/>
			</label>
			<label>
				<span><ScrambleText text={t('contact.email')} lang={locale.current} inline /></span>
				<input
					name="email"
					type="email"
					autocomplete="off"
					placeholder={t('contact.email_placeholder')}
					maxlength="254"
					required
				/>
			</label>
		</div>

		<label>
			<span><ScrambleText text={t('contact.message')} lang={locale.current} inline /></span>
			<textarea
				name="message"
				placeholder={t('contact.message_placeholder')}
				minlength="10"
				maxlength="3000"
				required></textarea>
		</label>

		<label class="honeypot" aria-hidden="true">
			<span>Website</span>
			<input name="website" type="text" tabindex="-1" autocomplete="off" />
		</label>

		<div class="form-footer">
			<button type="submit" disabled={state === 'sending'}>
				<ScrambleText
					text={state === 'sending' ? t('contact.sending') : t('contact.submit')}
					lang={locale.current}
				/>
			</button>
			<p class="privacy">
				<ScrambleText text={t('contact.privacy')} lang={locale.current} nowrap={false} />
			</p>
		</div>

		{#if state === 'success'}
			<p class="status success" role="status">
				<ScrambleText text={t('contact.success')} lang={locale.current} nowrap={false} />
			</p>
		{:else if state === 'error'}
			<p class="status error" role="alert">
				<ScrambleText text={t('contact.error')} lang={locale.current} nowrap={false} />
			</p>
		{/if}
	</form>
</div>

<style>
	.contact-layout {
		display: grid;
		grid-template-columns: minmax(0, 0.82fr) minmax(22rem, 1.18fr);
		align-items: center;
		gap: clamp(2rem, 6vw, 7rem);
		min-height: calc(100svh - var(--header-height) - (2 * var(--contact-section-gap, 3rem)));
		padding: clamp(2rem, 4vw, 4rem);
		border-radius: clamp(1.75rem, 3vw, 3.5rem);
		background: var(--color-accent);
		box-shadow: 0 2.5rem 7rem rgb(0 0 0 / 0.24);
	}

	.contact-eyebrow {
		margin-bottom: 1rem;
		color: var(--color-brand);
		font-size: 0.72rem;
		font-weight: 750;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}

	h2 {
		max-width: 9ch;
		color: var(--color-light);
		font-size: clamp(3rem, 5vw, 6rem);
		line-height: 0.92;
		letter-spacing: -0.06em;
	}

	.contact-intro {
		max-width: 32rem;
		margin-top: 1.5rem;
		color: color-mix(in srgb, var(--color-light) 72%, transparent);
		font-size: clamp(1rem, 1.3vw, 1.2rem);
		line-height: 1.55;
	}

	form {
		position: relative;
		display: grid;
		gap: 1rem;
		padding: clamp(1.5rem, 3vw, 2.5rem);
		border-radius: clamp(1.4rem, 2.2vw, 2.5rem);
		background: color-mix(in srgb, var(--color-light) 97%, var(--color-brand));
		box-shadow: 0 1.5rem 4rem rgb(0 0 0 / 0.2);
	}

	.field-row {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}

	label {
		display: grid;
		gap: 0.45rem;
		color: var(--color-dark);
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	input,
	textarea {
		width: 100%;
		border: 1px solid color-mix(in srgb, var(--color-dark) 15%, transparent);
		border-radius: 0.9rem;
		background: color-mix(in srgb, var(--color-light) 82%, transparent);
		color: var(--color-dark);
		font: inherit;
		font-size: 1rem;
		font-weight: 450;
		letter-spacing: 0;
		outline: none;
		text-transform: none;
		transition:
			border-color 180ms ease,
			box-shadow 180ms ease,
			background-color 180ms ease;
	}

	input {
		height: 3.25rem;
		padding-inline: 1rem;
	}
	textarea {
		min-height: 9rem;
		resize: vertical;
		padding: 0.9rem 1rem;
	}

	input:focus,
	textarea:focus {
		border-color: var(--color-brand);
		background: var(--color-light);
		box-shadow: 0 0 0 0.2rem color-mix(in srgb, var(--color-brand) 22%, transparent);
	}

	.form-footer {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	button {
		flex: none;
		min-height: 3rem;
		padding-inline: 1.25rem;
		border: 0;
		border-radius: 0.9rem;
		background: var(--color-brand);
		color: var(--color-light);
		font: inherit;
		font-weight: 750;
		cursor: pointer;
		transition:
			transform 180ms ease,
			filter 180ms ease;
	}

	button:hover:not(:disabled),
	button:focus-visible {
		transform: translateY(-2px);
		filter: saturate(1.12);
	}
	button:disabled {
		cursor: wait;
		opacity: 0.65;
	}

	.privacy {
		max-width: 26rem;
		color: color-mix(in srgb, var(--color-dark) 58%, transparent);
		font-size: 0.72rem;
		line-height: 1.35;
	}

	.status {
		font-size: 0.85rem;
		font-weight: 700;
	}
	.success {
		color: var(--color-accent);
	}
	.error {
		color: #9d281f;
	}

	.honeypot {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
	}

	@media (max-width: 47.99rem) {
		.contact-layout {
			min-height: auto;
			grid-template-columns: 1fr;
			gap: 1.5rem;
			padding: 1.5rem;
			border-radius: 1.75rem;
		}

		h2 {
			font-size: clamp(2.5rem, 12vw, 3.5rem);
		}
		.contact-intro {
			margin-top: 0.8rem;
			font-size: 0.9rem;
		}
		form {
			gap: 0.8rem;
			padding: 1.1rem;
			border-radius: 1.35rem;
		}
		.field-row {
			grid-template-columns: 1fr;
			gap: 0.8rem;
		}
		input {
			height: 2.8rem;
		}
		textarea {
			min-height: 6.5rem;
		}
		.form-footer {
			align-items: flex-start;
			flex-direction: column;
		}
	}
</style>
