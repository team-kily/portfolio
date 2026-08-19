const WAVE_DURATION = 2.8;
const THUMBS_UP_DURATION = 2.7;
const GESTURE_DELAY_MIN = 5;
const GESTURE_DELAY_VARIANCE = 2;

export function createGestureController(THREE) {
	let nextGestureAt = GESTURE_DELAY_MIN + Math.random() * GESTURE_DELAY_VARIANCE;
	let activeGesture;
	let queuedGesture;
	let forceQueuedGesture = false;
	let waveStartedAt = -Infinity;
	let thumbsUpStartedAt = -Infinity;

	function triggerWave() {
		queuedGesture = 'wave';
		forceQueuedGesture = true;
		if (!activeGesture) nextGestureAt = 0;
	}

	function triggerRandom() {
		queuedGesture = Math.random() < 0.5 ? 'wave' : 'thumbs-up';
		forceQueuedGesture = true;
		if (!activeGesture) nextGestureAt = 0;
	}

	function update(elapsed, pointerRecentlyActive) {
		startNextGesture(elapsed, pointerRecentlyActive);

		const waveProgress = progress(elapsed, waveStartedAt, WAVE_DURATION);
		const waveEnvelope =
			THREE.MathUtils.smoothstep(waveProgress, 0.02, 0.18) *
			(1 - THREE.MathUtils.smoothstep(waveProgress, 0.76, 0.98));
		const handWaveEnvelope = waveEnvelope * THREE.MathUtils.smoothstep(waveProgress, 0.3, 0.4);
		const handWave = handWaveEnvelope * Math.sin((waveProgress - 0.32) * Math.PI * 10);
		finishGesture('wave', waveProgress, elapsed);

		const thumbsUpProgress = progress(elapsed, thumbsUpStartedAt, THUMBS_UP_DURATION);
		const thumbsUpEnvelope =
			THREE.MathUtils.smoothstep(thumbsUpProgress, 0.02, 0.18) *
			(1 - THREE.MathUtils.smoothstep(thumbsUpProgress, 0.76, 0.98));
		finishGesture('thumbs-up', thumbsUpProgress, elapsed);

		const gestureEnvelope = Math.max(waveEnvelope, thumbsUpEnvelope);
		return {
			waveEnvelope,
			thumbsUpEnvelope,
			handWave,
			gestureEnvelope,
			gestureActive: activeGesture !== undefined,
			happyBounce:
				gestureEnvelope * Math.abs(Math.sin(Math.max(waveProgress, thumbsUpProgress) * Math.PI * 6))
		};
	}

	function startNextGesture(elapsed, pointerRecentlyActive) {
		if (activeGesture || elapsed < nextGestureAt) return;
		if (pointerRecentlyActive && !forceQueuedGesture) {
			nextGestureAt = elapsed + 2.5;
			return;
		}

		activeGesture = queuedGesture ?? (Math.random() < 0.5 ? 'wave' : 'thumbs-up');
		queuedGesture = undefined;
		forceQueuedGesture = false;
		if (activeGesture === 'wave') {
			waveStartedAt = elapsed;
		} else {
			thumbsUpStartedAt = elapsed;
		}
		nextGestureAt = Infinity;
	}

	function finishGesture(type, gestureProgress, elapsed) {
		if (gestureProgress < 1 || activeGesture !== type) return;
		activeGesture = undefined;
		nextGestureAt = queuedGesture
			? 0
			: elapsed + GESTURE_DELAY_MIN + Math.random() * GESTURE_DELAY_VARIANCE;
	}

	return { triggerRandom, triggerWave, update };
}

function progress(elapsed, startedAt, duration) {
	return Math.min(Math.max((elapsed - startedAt) / duration, 0), 1);
}
