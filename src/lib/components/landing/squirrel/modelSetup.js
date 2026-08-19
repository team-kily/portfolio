const TAIL_BONE_NAMES = [
	'hips008',
	'hips007',
	'hips006',
	'hips005',
	'hips012',
	'hips004',
	'hips009',
	'hips003',
	'hips010',
	'hips002',
	'hips001'
];

export function setupSquirrelModel({ THREE, gltf, renderer, scene }) {
	const model = gltf.scene;
	const materials = prepareMaterials(THREE, model, renderer);
	placeModel(THREE, model);

	const squirrel = new THREE.Group();
	squirrel.add(model);
	squirrel.rotation.y = -0.42;
	squirrel.rotation.z = -0.035;
	scene.add(squirrel);

	const mixer = freezeBasePose(THREE, model, gltf.animations);
	const rig = createSquirrelRig(model);
	return { materials, mixer, rig, squirrel };
}

export function updateCircleMask(THREE, renderer, materials) {
	const drawingBuffer = renderer.getDrawingBufferSize(new THREE.Vector2());
	for (const material of materials) {
		const shader = material.userData.circleShader;
		if (!shader) continue;
		shader.uniforms.circleCenter.value.set(drawingBuffer.x / 2, drawingBuffer.y / 2);
		shader.uniforms.circleRadius.value = Math.min(drawingBuffer.x / 3.2, drawingBuffer.y / 4);
	}
}

function prepareMaterials(THREE, model, renderer) {
	const materials = [];
	model.traverse((child) => {
		if (!child.isMesh) return;
		child.frustumCulled = false;
		for (const material of asArray(child.material)) {
			if (!materials.includes(material)) materials.push(material);
			if (material?.map) material.map.colorSpace = THREE.SRGBColorSpace;
			if (material?.name?.startsWith('Breakout_Head') && material.normalScale) {
				material.normalScale.set(0, 0);
			}
			if (typeof material?.roughness === 'number')
				material.roughness = Math.max(material.roughness, 0.68);
			if (typeof material?.metalness === 'number')
				material.metalness = Math.min(material.metalness, 0.05);
		}
	});

	for (const material of materials) addCircleMask(THREE, renderer, material);
	return materials;
}

function addCircleMask(THREE, renderer, material) {
	if (material.name.startsWith('Breakout_')) return;
	material.onBeforeCompile = (shader) => {
		const drawingBuffer = renderer.getDrawingBufferSize(new THREE.Vector2());
		shader.uniforms.circleCenter = { value: drawingBuffer.multiplyScalar(0.5) };
		shader.uniforms.circleRadius = { value: Math.min(drawingBuffer.x / 1.6, drawingBuffer.y / 2) };
		shader.fragmentShader = shader.fragmentShader.replace(
			'void main() {',
			'uniform vec2 circleCenter;\nuniform float circleRadius;\nvoid main() {\nif (distance(gl_FragCoord.xy, circleCenter) > circleRadius) discard;'
		);
		material.userData.circleShader = shader;
	};
	material.customProgramCacheKey = () => 'circle-clipped-body-v1';
	material.needsUpdate = true;
}

function placeModel(THREE, model) {
	const box = new THREE.Box3().setFromObject(model);
	const size = box.getSize(new THREE.Vector3());
	const center = box.getCenter(new THREE.Vector3());
	const scale = 2.89 / Math.max(size.x, size.y, size.z);
	model.scale.setScalar(scale);
	model.position.set(-center.x * scale + 0.14, -center.y * scale + 0.03, -center.z * scale);
}

function freezeBasePose(THREE, model, animations) {
	if (!animations.length) return undefined;
	const mixer = new THREE.AnimationMixer(model);
	const basePose = mixer.clipAction(animations[0]);
	basePose.play();
	basePose.paused = true;
	mixer.update(0);
	return mixer;
}

function createSquirrelRig(model) {
	const findBone = createBoneFinder(model);
	const findBones = (name) => findAllBones(model, name);
	const head = findBone('head');
	const neck = findBone('neck');
	const leftEye = findBone('eyel');
	const rightEye = findBone('eyer');
	const leftEar = findBone('earl');
	const rightEar = findBone('earr');
	const tailLinks = TAIL_BONE_NAMES.map(findBone).filter(Boolean);

	return {
		head,
		neck,
		leftEye,
		rightEye,
		leftEar,
		rightEar,
		neutralHead: head?.rotation.clone(),
		neutralNeck: neck?.rotation.clone(),
		neutralLeftEye: leftEye?.rotation.clone(),
		neutralRightEye: rightEye?.rotation.clone(),
		neutralLeftEar: leftEar?.rotation.clone(),
		neutralRightEar: rightEar?.rotation.clone(),
		tailLinkNames: TAIL_BONE_NAMES,
		tailLinks,
		neutralTailLinks: tailLinks.map((bone) => bone.rotation.clone()),
		leftArmRigs: findBones('leftarm').map((arm) => createArmRig(arm, 'left')),
		rightArmRigs: findBones('rightarm').map((arm) => createArmRig(arm, 'right'))
	};
}

function createArmRig(arm, side) {
	const foreArm = findChildBone(arm, `${side}forearm`);
	const hand = findChildBone(foreArm, `${side}hand`);
	const fingers = [];
	hand?.traverse((bone) => {
		if (bone !== hand && bone.isBone) {
			fingers.push({
				bone,
				neutral: bone.rotation.clone(),
				isThumb: bone.name.toLowerCase().includes('thumb')
			});
		}
	});
	return {
		arm,
		foreArm,
		hand,
		fingers,
		neutralArm: arm.rotation.clone(),
		neutralForeArm: foreArm?.rotation.clone(),
		neutralHand: hand?.rotation.clone()
	};
}

function createBoneFinder(model) {
	return (name) => findAllBones(model, name)[0];
}

function findAllBones(root, name) {
	const matches = [];
	const target = name.toLowerCase();
	root.traverse((child) => {
		if (child.isBone && normalizeName(child.name).endsWith(target)) matches.push(child);
	});
	return matches;
}

function findChildBone(root, name) {
	return root ? findAllBones(root, name)[0] : undefined;
}

function normalizeName(name) {
	return name.replace(/[^a-z0-9]/gi, '').toLowerCase();
}

function asArray(value) {
	return Array.isArray(value) ? value : [value];
}
