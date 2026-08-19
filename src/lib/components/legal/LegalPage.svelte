<script>
	import { onMount } from 'svelte';
	import ScrambleText from '$lib/components/shared/ScrambleText.svelte';

	let { kind = 'imprint', language = 'de' } = $props();

	const content = {
		de: {
			imprint: {
				eyebrow: 'Rechtliches',
				title: 'Impressum',
				intro: 'Angaben gemäß § 5 DDG',
				sections: [
					[
						'Diensteanbieter',
						'Florian Kayser, Einzelunternehmer, handelnd unter Kily',
						'Hermsdorfer Straße 15',
						'01159 Dresden',
						'Deutschland'
					],
					[
						'Kontakt',
						'E-Mail: info@team-kily.de',
						{ text: 'Zum Kontaktformular', href: '/kontakt' }
					],
					[
						'Wirtschafts-Identifikationsnummer',
						'Wirtschafts-Identifikationsnummer: DE457675665-00001'
					],
					[
						'Haftung für Inhalte',
						'Wir sind für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Eine Verpflichtung zur Überwachung übermittelter oder gespeicherter fremder Informationen besteht nur im Rahmen der gesetzlichen Vorgaben. Verpflichtungen zur Entfernung oder Sperrung rechtswidriger Inhalte bleiben unberührt.'
					],
					[
						'Haftung für Links',
						'Diese Website enthält Links zu externen Websites Dritter. Auf deren Inhalte haben wir keinen Einfluss; verantwortlich ist jeweils der jeweilige Anbieter. Bei Bekanntwerden konkreter Rechtsverletzungen entfernen wir entsprechende Links.'
					],
					[
						'Urheberrecht',
						'Die auf dieser Website erstellten Inhalte und Werke unterliegen dem deutschen Urheberrecht. Jede Verwertung außerhalb der gesetzlich erlaubten Grenzen bedarf der vorherigen Zustimmung der jeweiligen Rechteinhaber. Inhalte Dritter werden als solche gekennzeichnet.'
					]
				]
			},
			privacy: {
				eyebrow: 'Rechtliches',
				title: 'Datenschutz',
				intro: 'Hinweise zur Verarbeitung personenbezogener Daten',
				sections: [
					[
						'Verantwortlicher',
						'Florian Kayser, Einzelunternehmer, handelnd unter Kily',
						'Hermsdorfer Straße 15',
						'01159 Dresden, Deutschland',
						'E-Mail: info@team-kily.de'
					],
					[
						'Hosting über Vercel',
						'Diese Website wird über Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, USA, bereitgestellt. Beim Aufruf verarbeitet Vercel technisch erforderliche Verbindungsdaten, insbesondere IP-Adresse, Datum und Uhrzeit, angeforderte Ressource, Referrer sowie Browser- und Geräteinformationen. Die Verarbeitung ist erforderlich, um die Website auszuliefern, ihre Stabilität zu gewährleisten und Angriffe abzuwehren.',
						'Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt im sicheren und zuverlässigen Betrieb dieser Website. Vercel kann Daten auch in den USA verarbeiten. Die Absicherung erfolgt nach den von Vercel bereitgestellten datenschutzrechtlichen Garantien, insbesondere dem EU-US Data Privacy Framework und ergänzenden vertraglichen Regelungen.'
					],
					[
						'Kontaktformular und E-Mail-Versand',
						'Bei Nutzung des Kontaktformulars verarbeiten wir deinen Namen, deine E-Mail-Adresse, den Inhalt deiner Nachricht, die gewählte Sprache sowie technisch notwendige Angaben zur Missbrauchserkennung. Die Angaben werden zur Bearbeitung deiner Anfrage und zum Versand einer Eingangsbestätigung verwendet.',
						'Für die Zustellung nutzen wir Resend, einen Dienst der Plus Five Five, Inc., 2261 Market Street #5039, San Francisco, CA 94114, USA. Die eingegebenen Kontaktdaten und Nachrichteninhalte werden hierfür an Resend übermittelt. Resend verarbeitet Daten in den USA und stellt für internationale Übermittlungen vertragliche Garantien einschließlich EU-Standardvertragsklauseln bereit.',
						'Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, wenn deine Nachricht der Anbahnung oder Durchführung eines Vertrags dient, andernfalls Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse ist die Bearbeitung eingehender Anfragen.'
					],
					[
						'Missbrauchsschutz',
						'Zum Schutz des Kontaktformulars vor automatisierten oder übermäßigen Anfragen verwenden wir ein unsichtbares Formularfeld, eine Mindest-Ausfüllzeit und eine temporäre Begrenzung von Anfragen anhand der IP-Adresse. Die dabei geführten Zeitstempel werden nur vorübergehend im Arbeitsspeicher verarbeitet und spätestens nach 15 Minuten nicht mehr für die Begrenzung berücksichtigt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse ist der Schutz der Website und des E-Mail-Dienstes vor Missbrauch.'
					],
					[
						'Speicherdauer',
						'Anfragen und die damit verbundenen personenbezogenen Daten speichern wir nur so lange, wie dies zur Bearbeitung erforderlich ist. Anschließend werden sie gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten, die Geltendmachung oder Abwehr von Ansprüchen oder eine weitere vertragliche Beziehung eine längere Speicherung erfordern. Technische Protokolldaten werden nach den für den Hostingdienst festgelegten Fristen gelöscht.'
					],
					[
						'Reichweitenmessung mit Vercel Web Analytics',
						'Wir verwenden Vercel Web Analytics, um die Nutzung dieser Website statistisch auszuwerten. Dabei werden insbesondere Seitenaufrufe, aufgerufene Pfade, Referrer, Zeitpunkt, ungefähres Herkunftsland sowie Browser-, Betriebssystem- und Gerätetyp in aggregierter Form verarbeitet. Vercel Web Analytics verwendet keine Cookies und ordnet die Daten keiner dauerhaft identifizierbaren Person zu. Zur Unterscheidung von Besuchen wird aus der eingehenden Anfrage ein Hash gebildet, der nach 24 Stunden verworfen wird.',
						'Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt darin, Reichweite und Nutzung unseres Angebots zu verstehen und die Website zu verbessern. Anbieter ist Vercel Inc.; die Hinweise zur möglichen Verarbeitung in den USA und zu den eingesetzten Garantien gelten wie im Abschnitt „Hosting über Vercel“ beschrieben.'
					],
					[
						'Cookies und externe Medien',
						'Diese Website setzt keine nicht technisch erforderlichen Cookies ein und lädt keine extern gehosteten Schriftarten. Externe Websites wie GitHub, Instagram, YouTube oder das digitale Sammelheft werden erst aufgerufen, wenn du den jeweiligen Link aktiv auswählst. Ab diesem Zeitpunkt gelten die Datenschutzbestimmungen des jeweiligen Anbieters.'
					],
					[
						'Empfänger und Drittlandübermittlung',
						'Empfänger personenbezogener Daten sind – soweit für die beschriebenen Zwecke erforderlich – Vercel als Hostinganbieter und Resend als E-Mail-Dienstleister. Beide Anbieter haben ihren Sitz in den USA. Übermittlungen werden auf die jeweils verfügbaren Garantien nach Art. 44 ff. DSGVO gestützt. Darüber hinaus geben wir Daten nur weiter, wenn eine gesetzliche Verpflichtung besteht, dies zur Vertragsabwicklung erforderlich ist oder du eingewilligt hast.'
					],
					[
						'Deine Rechte',
						'Du hast im Rahmen der gesetzlichen Voraussetzungen das Recht auf Auskunft nach Art. 15 DSGVO, Berichtigung nach Art. 16 DSGVO, Löschung nach Art. 17 DSGVO, Einschränkung der Verarbeitung nach Art. 18 DSGVO, Datenübertragbarkeit nach Art. 20 DSGVO und Widerspruch nach Art. 21 DSGVO. Eine erteilte Einwilligung kannst du jederzeit mit Wirkung für die Zukunft widerrufen.'
					],
					[
						'Beschwerderecht',
						'Du kannst dich bei einer Datenschutz-Aufsichtsbehörde beschweren, insbesondere in dem Mitgliedstaat deines gewöhnlichen Aufenthalts, deines Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes. Zuständig ist die Sächsische Datenschutz- und Transparenzbeauftragte, Maternistraße 17, 01067 Dresden, E-Mail: post@sdtb.sachsen.de, www.datenschutz.sachsen.de.'
					],
					[
						'Pflicht zur Bereitstellung',
						'Die Bereitstellung von Name, E-Mail-Adresse und einer Nachricht ist für die Nutzung des Kontaktformulars erforderlich. Ohne diese Angaben können wir deine Anfrage nicht bearbeiten. Eine automatisierte Entscheidungsfindung einschließlich Profiling findet nicht statt.'
					],
					[
						'Stand',
						'August 2026. Wir aktualisieren diese Datenschutzhinweise, wenn sich die eingesetzten Dienste oder die rechtlichen Anforderungen ändern.'
					]
				]
			}
		},
		en: {
			imprint: {
				eyebrow: 'Legal',
				title: 'Imprint',
				intro: 'Information pursuant to Section 5 DDG (German Digital Services Act)',
				sections: [
					[
						'Provider',
						'Florian Kayser, sole proprietor trading as Kily',
						'Hermsdorfer Straße 15',
						'01159 Dresden',
						'Germany'
					],
					[
						'Contact',
						'Email: info@team-kily.de',
						{ text: 'Open contact form', href: '/en/contact' }
					],
					[
						'Business identification number',
						'German business identification number (W-IdNr.): DE457675665-00001'
					],
					[
						'Liability for content',
						'We are responsible for our own content on this website under the general laws. Duties to remove or block unlawful content under applicable law remain unaffected.'
					],
					[
						'Liability for links',
						'This website contains links to third-party websites whose content we do not control. The respective provider is responsible for that content. We will remove links if we become aware of a specific legal violation.'
					],
					[
						'Copyright',
						'Content and works created for this website are protected by German copyright law. Any use beyond statutory permissions requires prior approval from the respective rights holder. Third-party content is identified where applicable.'
					]
				]
			},
			privacy: {
				eyebrow: 'Legal',
				title: 'Privacy',
				intro: 'Information about the processing of personal data',
				sections: [
					[
						'Controller',
						'Florian Kayser, sole proprietor trading as Kily',
						'Hermsdorfer Straße 15',
						'01159 Dresden, Germany',
						'Email: info@team-kily.de'
					],
					[
						'Hosting by Vercel',
						'This website is delivered through Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, United States. When the website is accessed, Vercel processes technically necessary connection data such as the IP address, time, requested resource, referrer, browser and device information. This is necessary to deliver the website, maintain its stability and prevent attacks.',
						'The legal basis is Article 6(1)(f) GDPR. Our legitimate interest is the secure and reliable operation of this website. Vercel may process data in the United States. Transfers are protected by the safeguards provided by Vercel, including the EU-US Data Privacy Framework and supplementary contractual arrangements.'
					],
					[
						'Contact form and email delivery',
						'When you use the contact form, we process your name, email address, message, selected language and technical information required to prevent abuse. We use this information to respond to your enquiry and send a confirmation of receipt.',
						'Email delivery is provided by Resend, a service of Plus Five Five, Inc., 2261 Market Street #5039, San Francisco, CA 94114, United States. Contact details and message content are transmitted to Resend for this purpose. Resend processes data in the United States and provides contractual safeguards for international transfers, including the EU Standard Contractual Clauses.',
						'The legal basis is Article 6(1)(b) GDPR where the enquiry relates to a contract or pre-contractual measures, and otherwise Article 6(1)(f) GDPR. Our legitimate interest is responding to incoming enquiries.'
					],
					[
						'Abuse prevention',
						'To protect the contact form, we use an invisible form field, a minimum completion time and temporary rate limiting based on the IP address. Associated timestamps are processed only temporarily in memory and are no longer considered for rate limiting after 15 minutes. The legal basis is Article 6(1)(f) GDPR; our legitimate interest is protecting the website and email service from abuse.'
					],
					[
						'Retention',
						'We retain enquiries and related personal data only for as long as necessary to respond. They are then deleted unless statutory retention obligations, the establishment or defence of legal claims, or an ongoing contractual relationship require longer storage. Technical logs are deleted in accordance with the retention settings of the hosting service.'
					],
					[
						'Audience measurement with Vercel Web Analytics',
						'We use Vercel Web Analytics to obtain aggregate statistics about the use of this website. The data processed includes page views, requested paths, referrers, timestamps, approximate country, browser, operating system and device type. Vercel Web Analytics does not use cookies or associate the data with a permanently identifiable individual. A hash derived from the incoming request is used to distinguish visits and is discarded after 24 hours.',
						'The legal basis is Article 6(1)(f) GDPR. Our legitimate interest is understanding the reach and use of the website and improving it. The provider is Vercel Inc.; the information about possible processing in the United States and the safeguards used applies as described in the “Hosting by Vercel” section.'
					],
					[
						'Cookies and external media',
						'This website does not set non-essential cookies and does not load externally hosted fonts. External websites such as GitHub, Instagram, YouTube or the digital collector album are contacted only when you actively select the relevant link. Their own privacy policies apply from that point.'
					],
					[
						'Recipients and international transfers',
						'Where necessary for the purposes described above, recipients are Vercel as hosting provider and Resend as email service provider. Both are based in the United States. Transfers rely on the applicable safeguards under Articles 44 et seq. GDPR. We otherwise disclose data only where required by law, necessary for a contract or based on your consent.'
					],
					[
						'Your rights',
						'Subject to the statutory requirements, you have rights of access under Article 15 GDPR, rectification under Article 16, erasure under Article 17, restriction under Article 18, data portability under Article 20 and objection under Article 21. You may withdraw consent at any time with future effect.'
					],
					[
						'Right to lodge a complaint',
						'You may lodge a complaint with a data protection supervisory authority, particularly in the member state of your habitual residence, workplace or the alleged infringement. The competent authority is the Saxon Data Protection and Transparency Commissioner, Maternistraße 17, 01067 Dresden, Germany, email: post@sdtb.sachsen.de, www.datenschutz.sachsen.de.'
					],
					[
						'Required information',
						'Your name, email address and a message are required to use the contact form. Without this information, we cannot process your enquiry. No automated decision-making, including profiling, takes place.'
					],
					[
						'Last updated',
						'August 2026. We update this notice if the services used or the legal requirements change.'
					]
				]
			}
		}
	};

	let pageContent = $derived(content[language][kind]);

	onMount(() => {
		document.documentElement.scrollTop = 0;
		document.body.scrollTop = 0;
	});
</script>

<svelte:head>
	<title>{pageContent.title} | Team Kily</title>
	<meta name="description" content={pageContent.intro} />
</svelte:head>

<main class="legal-page">
	<header>
		<p class="eyebrow">
			<ScrambleText text={pageContent.eyebrow} lang={language} animateOnMount />
		</p>
		<h1><ScrambleText text={pageContent.title} lang={language} animateOnMount /></h1>
		<p class="intro">
			<ScrambleText text={pageContent.intro} lang={language} nowrap={false} animateOnMount />
		</p>
	</header>
	<div class="legal-grid">
		{#each pageContent.sections as section}
			<section>
				<h2>
					<ScrambleText text={section[0]} lang={language} nowrap={false} animateOnMount />
				</h2>
				{#each section.slice(1) as paragraph}
					{#if typeof paragraph === 'string'}
						<p>
							<ScrambleText text={paragraph} lang={language} nowrap={false} animateOnMount />
						</p>
					{:else}
						<p>
							<a href={paragraph.href}>
								<ScrambleText text={paragraph.text} lang={language} inline animateOnMount />
							</a>
						</p>
					{/if}
				{/each}
			</section>
		{/each}
	</div>
</main>

<style>
	:global(html:has(.legal-page)) {
		scroll-snap-type: none;
	}

	main {
		position: relative;
		z-index: 1;
		min-height: 100svh;
		padding: calc(var(--header-height) + clamp(3rem, 8vw, 7rem)) clamp(1.25rem, 5vw, 5rem)
			clamp(5rem, 10vw, 9rem) var(--content-left);
	}
	header {
		max-width: 58rem;
		margin-bottom: clamp(3rem, 7vw, 6rem);
	}
	.eyebrow {
		margin-bottom: 1rem;
		color: var(--color-brand);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}
	h1 {
		color: var(--color-light);
	}
	.intro {
		margin-top: 1.25rem;
		color: color-mix(in srgb, var(--color-light) 68%, transparent);
		font-size: clamp(1rem, 1.4vw, 1.25rem);
	}
	.legal-grid {
		display: grid;
		max-width: 68rem;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: clamp(2.5rem, 6vw, 5rem);
	}
	section {
		border-top: 1px solid color-mix(in srgb, var(--color-light) 24%, transparent);
		padding-top: 1.25rem;
	}
	h2 {
		margin-bottom: 1.1rem;
		font-size: clamp(1.35rem, 2vw, 1.8rem);
	}
	section p {
		color: color-mix(in srgb, var(--color-light) 76%, transparent);
		line-height: 1.7;
	}
	section p + p {
		margin-top: 0.2rem;
	}
	section a {
		color: var(--color-brand);
		font-weight: 700;
		text-underline-offset: 0.25rem;
	}
	section a:hover,
	section a:focus-visible {
		color: var(--color-light);
	}
	@media (max-width: 47.99rem) {
		main {
			padding-bottom: 7rem;
		}
		.legal-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
