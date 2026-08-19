import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';

export const prerender = false;

const attempts = new Map();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value, maxLength) {
	return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function escapeHtml(value) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#039;');
}

function isRateLimited(ip) {
	const now = Date.now();
	const recent = (attempts.get(ip) ?? []).filter((timestamp) => now - timestamp < 15 * 60 * 1000);
	recent.push(now);
	attempts.set(ip, recent);
	return recent.length > 4;
}

export async function POST({ request, url, getClientAddress }) {
	if (request.headers.get('origin') !== url.origin) {
		return json({ message: 'Invalid origin' }, { status: 403 });
	}

	let body;
	try {
		body = await request.json();
	} catch {
		return json({ message: 'Invalid request' }, { status: 400 });
	}

	if (clean(body.website, 200)) return json({ ok: true });

	const startedAt = Number(body.startedAt);
	const elapsed = Date.now() - startedAt;
	if (!Number.isFinite(startedAt) || elapsed < 1500 || elapsed > 2 * 60 * 60 * 1000) {
		return json({ message: 'Invalid form timing' }, { status: 400 });
	}

	let ip = 'unknown';
	try {
		ip = getClientAddress();
	} catch {
		ip = 'unknown';
	}

	if (isRateLimited(ip)) return json({ message: 'Too many requests' }, { status: 429 });

	const name = clean(body.name, 80);
	const email = clean(body.email, 254).toLowerCase();
	const message = clean(body.message, 3000);
	const language = body.language === 'en' ? 'en' : 'de';

	if (name.length < 2 || !emailPattern.test(email) || message.length < 10) {
		return json({ message: 'Invalid fields' }, { status: 400 });
	}

	const apiKey = env.RESEND_API_KEY;
	const to = env.CONTACT_TO_EMAIL;
	const from = env.CONTACT_FROM_EMAIL;

	if (!apiKey || !to || !from) {
		console.error('Missing contact email environment variables');
		return json({ message: 'Contact service unavailable' }, { status: 503 });
	}

	const safeName = escapeHtml(name);
	const safeEmail = escapeHtml(email);
	const safeMessage = escapeHtml(message).replaceAll('\n', '<br>');
	const response = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			authorization: `Bearer ${apiKey}`,
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			from,
			to: [to],
			reply_to: email,
			subject: `Portfolio-Anfrage von ${name}`,
			text: `Name: ${name}\nE-Mail: ${email}\nSprache: ${language}\n\n${message}`,
			html: `<h2>Neue Portfolio-Anfrage</h2><p><strong>Name:</strong> ${safeName}<br><strong>E-Mail:</strong> ${safeEmail}<br><strong>Sprache:</strong> ${language}</p><p>${safeMessage}</p>`
		})
	});

	if (!response.ok) {
		console.error('Resend rejected contact email', response.status, await response.text());
		return json({ message: 'Email delivery failed' }, { status: 502 });
	}

	const confirmation =
		language === 'en'
			? {
					subject: 'We received your message',
					text: `Hi ${name},\n\nthank you for your message. We received your request and will get back to you soon.\n\nBest,\nTeam Kily`,
					html: `<p>Hi ${safeName},</p><p>Thank you for your message. We received your request and will get back to you soon.</p><p>Best,<br>Team Kily</p>`
				}
			: {
					subject: 'Wir haben deine Nachricht erhalten',
					text: `Hallo ${name},\n\nvielen Dank für deine Nachricht. Wir haben deine Anfrage erhalten und melden uns bald bei dir.\n\nViele Grüße\nTeam Kily`,
					html: `<p>Hallo ${safeName},</p><p>vielen Dank für deine Nachricht. Wir haben deine Anfrage erhalten und melden uns bald bei dir.</p><p>Viele Grüße<br>Team Kily</p>`
				};

	const confirmationResponse = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			authorization: `Bearer ${apiKey}`,
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			from,
			to: [email],
			reply_to: to,
			subject: confirmation.subject,
			text: confirmation.text,
			html: confirmation.html
		})
	});

	if (!confirmationResponse.ok) {
		console.error(
			'Resend rejected contact confirmation',
			confirmationResponse.status,
			await confirmationResponse.text()
		);
	}

	return json({ ok: true });
}
