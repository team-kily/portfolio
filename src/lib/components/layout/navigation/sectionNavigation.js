import { goto, pushState, replaceState } from '$app/navigation';

import {
	getLanguageByPath,
	getSectionByPath,
	localizePath,
	stripLanguagePath
} from '$lib/config/navigation.js';

const FOCUS_LINE_RATIO = 0.42;
const NAVIGATION_LOCK_MS = 1200;
const BLUR_DELAY_MS = 110;
const BLUR_DURATION_MS = 720;

export function createSectionNavigation({
	items,
	getActivePath,
	setActivePath,
	getLocale,
	setLocale
}) {
	let scrollFrame;
	let blurTimer;
	let blurDelayTimer;
	let unlockTimer;
	let lockedPath;

	function mount() {
		const initialPath = window.location.pathname;
		const initialSection = getSectionByPath(initialPath);
		setLocale(getLanguageByPath(initialPath));
		setActivePath(stripLanguagePath(initialPath));
		if (initialSection) requestAnimationFrame(() => scrollToSection(initialSection, 'auto'));

		window.addEventListener('scroll', scheduleSectionSync, { passive: true });
		window.addEventListener('scrollend', syncActiveSection);
		window.addEventListener('popstate', restoreHistorySection);

		return destroy;
	}

	function destroy() {
		window.removeEventListener('scroll', scheduleSectionSync);
		window.removeEventListener('scrollend', syncActiveSection);
		window.removeEventListener('popstate', restoreHistorySection);
		if (scrollFrame) cancelAnimationFrame(scrollFrame);
		if (unlockTimer) clearTimeout(unlockTimer);
		clearContentBlur();
	}

	async function navigate(event, item) {
		if (!isPlainPrimaryClick(event)) return;
		event.preventDefault();

		if (!getSectionByPath(window.location.pathname)) {
			setActivePath(item.path);
			await goto(localizePath(item.path, getLocale()), {
				keepFocus: true,
				noScroll: true
			});
			requestAnimationFrame(() => scrollToSection(item.section, 'auto'));
			return;
		}

		const activePath = getActivePath();
		if (activePath === item.path) {
			scrollToSection(item.section, 'smooth');
			return;
		}

		const distance = Math.abs(indexOfPath(items, item.path) - indexOfPath(items, activePath));
		clearContentBlur();
		lockedPath = item.path;
		setActivePath(item.path);
		pushState(localizePath(item.path, getLocale()), {});
		requestAnimationFrame(() => scrollToSection(item.section, 'smooth'));

		if (distance >= 2) scheduleContentBlur();
		scheduleUnlock();
	}

	async function switchLanguage(language) {
		if (getLocale() === language) return;
		const currentPath = window.location.pathname;
		const isSectionRoute = Boolean(getSectionByPath(currentPath));
		const targetPath = localizePath(isSectionRoute ? getActivePath() : currentPath, language);
		setLocale(language);

		if (!isSectionRoute) {
			await goto(targetPath, {
				keepFocus: true,
				noScroll: true,
				replaceState: true
			});
			return;
		}

		replaceState(targetPath, {});
	}

	function restoreHistorySection() {
		const pathname = window.location.pathname;
		const section = getSectionByPath(pathname);
		if (!section) return;
		setLocale(getLanguageByPath(pathname));
		setActivePath(stripLanguagePath(pathname));
		requestAnimationFrame(() => scrollToSection(section, 'smooth'));
	}

	function scheduleSectionSync() {
		if (scrollFrame) return;
		scrollFrame = requestAnimationFrame(() => {
			scrollFrame = undefined;
			syncActiveSection();
		});
	}

	function syncActiveSection() {
		if (lockedPath) {
			if (getActivePath() !== lockedPath) setActivePath(lockedPath);
			return;
		}

		const closestItem = findClosestSection(items, window.innerHeight * FOCUS_LINE_RATIO);
		if (!closestItem || closestItem.path === getActivePath()) return;
		setActivePath(closestItem.path);
		replaceState(localizePath(closestItem.path, getLocale()), {});
	}

	function scheduleUnlock() {
		if (unlockTimer) clearTimeout(unlockTimer);
		unlockTimer = setTimeout(() => {
			lockedPath = undefined;
			unlockTimer = undefined;
			syncActiveSection();
		}, NAVIGATION_LOCK_MS);
	}

	function scheduleContentBlur() {
		blurDelayTimer = setTimeout(() => {
			document.body.classList.add('section-jump-blur');
			blurDelayTimer = undefined;
			blurTimer = setTimeout(clearContentBlur, BLUR_DURATION_MS);
		}, BLUR_DELAY_MS);
	}

	function clearContentBlur() {
		if (blurDelayTimer) clearTimeout(blurDelayTimer);
		if (blurTimer) clearTimeout(blurTimer);
		blurDelayTimer = undefined;
		blurTimer = undefined;
		document.body.classList.remove('section-jump-blur');
	}

	return { mount, navigate, switchLanguage };
}

export function findClosestSection(items, focusLine) {
	let closestItem;
	let closestDistance = Infinity;

	for (const item of items) {
		const section = document.getElementById(item.section);
		if (!section) continue;
		const rectangle = section.getBoundingClientRect();
		const distance = Math.abs(rectangle.top + rectangle.height * 0.5 - focusLine);
		if (distance < closestDistance) {
			closestDistance = distance;
			closestItem = item;
		}
	}

	return closestItem;
}

export function scrollToSection(section, behavior = 'smooth') {
	document.getElementById(section)?.scrollIntoView({ behavior, block: 'start' });
}

function isPlainPrimaryClick(event) {
	return event.button === 0 && !event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey;
}

function indexOfPath(items, path) {
	return items.findIndex((item) => item.path === path);
}
