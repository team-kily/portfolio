<script>
	import { onMount } from 'svelte';
	import { createGestureController } from './gestureController.js';
	import { setupSquirrelModel, updateCircleMask } from './modelSetup.js';
	import { createPoseController } from './poseController.js';

	let { onready } = $props();
	let host;
	let canvas;

	onMount(() => {
		let disposed = false;
		let frame = 0;
		let resizeObserver;
		let visibilityObserver;
		let renderer;
		let heroVisible = true;
		let documentVisible = !document.hidden;
		let cleanup = () => {};

		async function setup() {
			const [THREE, { GLTFLoader }, { DRACOLoader }] = await Promise.all([
				import('three'),
				import('three/examples/jsm/loaders/GLTFLoader.js'),
				import('three/examples/jsm/loaders/DRACOLoader.js')
			]);
			if (disposed || !host || !canvas) return;

			const scene = new THREE.Scene();
			const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 100);
			camera.position.set(0, 0.1, 6);

			renderer = new THREE.WebGLRenderer({
				canvas,
				alpha: true,
				antialias: true,
				powerPreference: 'high-performance'
			});
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
			renderer.outputColorSpace = THREE.SRGBColorSpace;
			renderer.toneMapping = THREE.ACESFilmicToneMapping;
			renderer.toneMappingExposure = 0.97;

			scene.add(new THREE.AmbientLight(0xfff4e8, 1.12));
			scene.add(new THREE.HemisphereLight(0xfff5e8, 0x6a5445, 0.74));
			const key = new THREE.DirectionalLight(0xffe2bd, 1.38);
			key.position.set(-2, 3, 6);
			scene.add(key);
			const fill = new THREE.DirectionalLight(0xfff1df, 0.64);
			fill.position.set(4, 1, 5);
			scene.add(fill);
			const rim = new THREE.DirectionalLight(0x4f7a5d, 0.12);
			rim.position.set(4, 2, -3);
			scene.add(rim);

			const dracoLoader = new DRACOLoader();
			dracoLoader.setDecoderPath('/draco/');
			const loader = new GLTFLoader();
			loader.setDRACOLoader(dracoLoader);
			loader.load(
				'/models/squirrel.glb?v=18',
				async (gltf) => {
					if (disposed) return;
					const {
						materials: modelMaterials,
						mixer,
						rig,
						squirrel
					} = setupSquirrelModel({
						THREE,
						gltf,
						renderer,
						scene
					});
					const pointer = new THREE.Vector2();
					const targetPointer = new THREE.Vector2();
					let lastPointerMove = -Infinity;
					let lastFrameTime = performance.now();
					let elapsed = 0;
					const gestures = createGestureController(THREE);
					const poses = createPoseController(THREE, squirrel, rig);
					let heroWasVisible = false;
					let heroHasEntered = false;
					visibilityObserver = new IntersectionObserver(
						([entry]) => {
							const isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.22;
							heroVisible = isVisible;
							if (isVisible && !heroWasVisible) {
								if (heroHasEntered) gestures.triggerRandom();
								else gestures.triggerWave();
								heroHasEntered = true;
							}
							heroWasVisible = isVisible;
						},
						{ threshold: [0, 0.22] }
					);
					visibilityObserver.observe(host);

					const onPointerMove = (event) => {
						lastPointerMove = performance.now();
						const rect = host.getBoundingClientRect();
						targetPointer.x = THREE.MathUtils.clamp(
							((event.clientX - rect.left) / rect.width) * 2 - 1,
							-1,
							1
						);
						targetPointer.y = THREE.MathUtils.clamp(
							-(((event.clientY - rect.top) / rect.height) * 2 - 1),
							-1,
							1
						);
					};
					const resetPointer = () => targetPointer.set(0, 0);
					const onVisibilityChange = () => {
						documentVisible = !document.hidden;
						lastFrameTime = performance.now();
					};

					window.addEventListener('pointermove', onPointerMove, { passive: true });
					window.addEventListener('blur', resetPointer);
					document.addEventListener('visibilitychange', onVisibilityChange);

					const animate = (now = performance.now()) => {
						if (disposed) return;
						frame = requestAnimationFrame(animate);
						if (!heroVisible || !documentVisible) {
							lastFrameTime = now;
							return;
						}
						const delta = Math.min((now - lastFrameTime) / 1000, 0.05);
						lastFrameTime = now;
						elapsed += delta;
						pointer.lerp(targetPointer, 1 - Math.exp(-delta * 4.8));
						const pointerRecentlyActive = performance.now() - lastPointerMove < 1800;
						const gestureState = gestures.update(elapsed, pointerRecentlyActive);
						poses.update({ elapsed, delta, pointer, lastPointerMove, gestures: gestureState });

						updateCircleMask(THREE, renderer, modelMaterials);
						renderer.render(scene, camera);
					};

					cleanup = () => {
						window.removeEventListener('pointermove', onPointerMove);
						window.removeEventListener('blur', resetPointer);
						document.removeEventListener('visibilitychange', onVisibilityChange);
						mixer?.stopAllAction();
						dracoLoader.dispose();
					};

					await renderer.compileAsync(scene, camera);
					if (disposed) return;
					renderer.render(scene, camera);
					requestAnimationFrame(() => {
						if (disposed) return;
						animate();
						requestAnimationFrame(() => {
							if (!disposed) onready?.();
						});
					});
				},
				undefined,
				() => {
					dracoLoader.dispose();
				}
			);

			const resize = () => {
				if (!host || !renderer) return;
				const width = host.clientWidth;
				const height = host.clientHeight;
				renderer.setSize(width, height, false);
				camera.aspect = width / Math.max(height, 1);
				camera.updateProjectionMatrix();
			};
			resizeObserver = new ResizeObserver(resize);
			resizeObserver.observe(host);
			resize();
		}

		setup();

		return () => {
			disposed = true;
			cancelAnimationFrame(frame);
			resizeObserver?.disconnect();
			visibilityObserver?.disconnect();
			cleanup();
			renderer?.dispose();
		};
	});
</script>

<div class="squirrel-scene" bind:this={host} aria-hidden="true">
	<canvas class="scene-layer" bind:this={canvas}></canvas>
</div>

<style>
	.squirrel-scene {
		position: absolute;
		inset: 0;
		overflow: hidden;
		contain: layout paint;
	}

	canvas {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
	}

	.scene-layer {
		z-index: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.squirrel-scene {
			pointer-events: none;
		}
	}
</style>
