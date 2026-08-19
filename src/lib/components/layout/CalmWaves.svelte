<script>
	import { onMount } from 'svelte';

	let canvas;

	onMount(() => {
		const context = canvas.getContext('2d');
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		const precisePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
		let width = 0;
		let height = 0;
		let frame;
		let lastDrawAt = 0;
		const pointer = {
			x: -500,
			y: -500,
			targetX: -500,
			targetY: -500,
			influence: 0,
			targetInfluence: 0
		};

		const followPointer = (event) => {
			if (!precisePointer.matches || reduceMotion.matches) return;
			pointer.targetX = event.clientX;
			pointer.targetY = event.clientY;
			pointer.targetInfluence = 1;
			if (pointer.x < 0) {
				pointer.x = event.clientX;
				pointer.y = event.clientY;
			}
		};

		const releasePointer = () => {
			pointer.targetInfluence = 0;
		};

		const resize = () => {
			const ratio = Math.min(window.devicePixelRatio || 1, 2);
			width = window.innerWidth;
			height = window.innerHeight;
			canvas.width = Math.round(width * ratio);
			canvas.height = Math.round(height * ratio);
			canvas.style.width = `${width}px`;
			canvas.style.height = `${height}px`;
			context.setTransform(ratio, 0, 0, ratio, 0, 0);
		};

		const draw = (time = 0) => {
			const minimumFrameTime = width < 700 ? 1000 / 30 : 0;
			if (!reduceMotion.matches && time - lastDrawAt < minimumFrameTime) {
				frame = requestAnimationFrame(draw);
				return;
			}
			lastDrawAt = time;
			pointer.x += (pointer.targetX - pointer.x) * 0.055;
			pointer.y += (pointer.targetY - pointer.y) * 0.055;
			pointer.influence += (pointer.targetInfluence - pointer.influence) * 0.045;
			context.clearRect(0, 0, width, height);
			context.lineWidth = 1.05;
			context.lineCap = 'round';
			context.lineJoin = 'round';
			context.strokeStyle = 'rgb(255 255 255 / 0.09)';

			const cell = width < 700 ? 14 : 12;
			const columns = Math.ceil(width / cell) + 2;
			const rows = Math.ceil(height / cell) + 2;
			const motion = reduceMotion.matches ? 0 : time * 0.00006;
			const values = new Float32Array(columns * rows);

			const ellipse = (x, y, centerX, centerY, radiusX, radiusY, angle, strength) => {
				const cosine = Math.cos(angle);
				const sine = Math.sin(angle);
				const deltaX = x - centerX;
				const deltaY = y - centerY;
				const rotatedX = deltaX * cosine + deltaY * sine;
				const rotatedY = -deltaX * sine + deltaY * cosine;
				return (
					Math.exp(
						-(rotatedX * rotatedX) / (radiusX * radiusX) -
							(rotatedY * rotatedY) / (radiusY * radiusY)
					) * strength
				);
			};

			const field = (x, y) => {
				const horizontalWarp =
					Math.sin(y * 0.0025 - motion * 0.63) * 112 + Math.sin(y * 0.0052 + motion * 0.29) * 25;
				const verticalWarp =
					Math.sin(x * 0.0022 + motion * 0.51) * 108 + Math.sin(x * 0.0048 - motion * 0.37) * 22;
				const broad = Math.sin((x + horizontalWarp) * 0.0036 + motion * 0.34) * 0.76;
				const crossing = Math.sin((y + verticalWarp) * 0.0041 - motion * 0.27) * 0.7;
				const diagonal = Math.sin((x * 0.61 + y * 0.79) * 0.0027 + motion * 0.19) * 0.34;

				const firstStretch = 205 + Math.sin(motion * 0.47) * 88;
				const secondStretch = 190 + Math.sin(motion * 0.31 + 2.4) * 74;
				const firstIsland = ellipse(
					x,
					y,
					width * (0.24 + Math.sin(motion * 0.38) * 0.13),
					height * (0.28 + Math.cos(motion * 0.29) * 0.18),
					firstStretch,
					118 + Math.cos(motion * 0.41) * 38,
					motion * 0.22 + Math.sin(motion * 0.17),
					2.2
				);
				const secondIsland = ellipse(
					x,
					y,
					width * (0.7 + Math.cos(motion * 0.26 + 1.7) * 0.17),
					height * (0.64 + Math.sin(motion * 0.34 + 0.8) * 0.2),
					112 + Math.cos(motion * 0.36) * 34,
					secondStretch,
					-motion * 0.18 + 1.1,
					-2.05
				);
				const thirdIsland = ellipse(
					x,
					y,
					width * (0.52 + Math.sin(motion * 0.21 + 4.2) * 0.24),
					height * (0.46 + Math.cos(motion * 0.25 + 2.1) * 0.27),
					158 + Math.sin(motion * 0.28 + 1.3) * 62,
					96 + Math.cos(motion * 0.33) * 29,
					motion * 0.15 - 0.7,
					1.5
				);
				const pointerDent = ellipse(
					x,
					y,
					pointer.x,
					pointer.y,
					235,
					180,
					0,
					-0.2 * pointer.influence
				);

				return broad + crossing + diagonal + firstIsland + secondIsland + thirdIsland + pointerDent;
			};

			for (let row = 0; row < rows; row += 1) {
				for (let column = 0; column < columns; column += 1) {
					values[row * columns + column] = field((column - 1) * cell, (row - 1) * cell);
				}
			}

			const pointOnEdge = (edge, x, y, corners, level) => {
				const edgeCorners = [
					[0, 1],
					[1, 2],
					[2, 3],
					[3, 0]
				];
				const positions = [
					[0, 0],
					[cell, 0],
					[cell, cell],
					[0, cell]
				];
				const [from, to] = edgeCorners[edge];
				const difference = corners[to] - corners[from];
				const amount = difference === 0 ? 0.5 : (level - corners[from]) / difference;
				return [
					x + positions[from][0] + (positions[to][0] - positions[from][0]) * amount,
					y + positions[from][1] + (positions[to][1] - positions[from][1]) * amount
				];
			};

			const levels = [-2.15, -1.72, -1.29, -0.86, -0.43, 0, 0.43, 0.86, 1.29, 1.72, 2.15];
			for (const level of levels) {
				context.beginPath();
				for (let row = 0; row < rows - 1; row += 1) {
					for (let column = 0; column < columns - 1; column += 1) {
						const corners = [
							values[row * columns + column],
							values[row * columns + column + 1],
							values[(row + 1) * columns + column + 1],
							values[(row + 1) * columns + column]
						];
						const edges = [];
						for (let edge = 0; edge < 4; edge += 1) {
							const next = (edge + 1) % 4;
							if (corners[edge] >= level !== corners[next] >= level) edges.push(edge);
						}

						if (edges.length < 2) continue;
						const x = (column - 1) * cell;
						const y = (row - 1) * cell;
						const connect = (first, second) => {
							const start = pointOnEdge(first, x, y, corners, level);
							const end = pointOnEdge(second, x, y, corners, level);
							context.moveTo(start[0], start[1]);
							context.lineTo(end[0], end[1]);
						};

						if (edges.length === 2) {
							connect(edges[0], edges[1]);
						} else {
							const center = corners.reduce((sum, value) => sum + value, 0) / 4;
							if (center >= level) {
								connect(edges[0], edges[3]);
								connect(edges[1], edges[2]);
							} else {
								connect(edges[0], edges[1]);
								connect(edges[2], edges[3]);
							}
						}
					}
				}
				context.stroke();
			}

			if (!reduceMotion.matches) frame = requestAnimationFrame(draw);
		};

		const restart = () => {
			if (frame) cancelAnimationFrame(frame);
			draw();
		};

		resize();
		draw();
		window.addEventListener('resize', resize);
		window.addEventListener('pointermove', followPointer, { passive: true });
		document.documentElement.addEventListener('mouseleave', releasePointer);
		window.addEventListener('blur', releasePointer);
		reduceMotion.addEventListener('change', restart);

		return () => {
			if (frame) cancelAnimationFrame(frame);
			window.removeEventListener('resize', resize);
			window.removeEventListener('pointermove', followPointer);
			document.documentElement.removeEventListener('mouseleave', releasePointer);
			window.removeEventListener('blur', releasePointer);
			reduceMotion.removeEventListener('change', restart);
		};
	});
</script>

<canvas bind:this={canvas} aria-hidden="true"></canvas>

<style>
	canvas {
		position: fixed;
		z-index: 0;
		inset: 0;
		pointer-events: none;
	}
</style>
