export function createPoseController(THREE, squirrel, rig) {
	let mouseHeadInfluence = 0;
	let headYawOffset = 0;
	let headPitchOffset = 0;
	let headRollOffset = 0;
	let neckYawOffset = 0;
	let neckPitchOffset = 0;
	let neckRollOffset = 0;

	function update({ elapsed, delta, pointer, lastPointerMove, gestures }) {
		const {
			waveEnvelope,
			thumbsUpEnvelope,
			handWave,
			gestureEnvelope,
			gestureActive,
			happyBounce
		} = gestures;
		const armSway = Math.sin(elapsed * 1.05) * 0.075;

		squirrel.position.y = Math.sin(elapsed * 1.35) * 0.018 + happyBounce * 0.045;
		squirrel.rotation.z = -0.035 + Math.sin(elapsed * 0.72) * 0.008;
		updateThumbsUp(THREE, rig.leftArmRigs, armSway, thumbsUpEnvelope);
		updateWave(THREE, rig.rightArmRigs, armSway, waveEnvelope, handWave);
		updateTail(THREE, rig, elapsed);
		updateHead({
			elapsed,
			delta,
			pointer,
			lastPointerMove,
			waveEnvelope,
			gestureEnvelope,
			gestureActive
		});
	}

	function updateHead({
		elapsed,
		delta,
		pointer,
		lastPointerMove,
		waveEnvelope,
		gestureEnvelope,
		gestureActive
	}) {
		const mouseControlsHead = !gestureActive && performance.now() - lastPointerMove < 1500;
		const targetMouseInfluence = mouseControlsHead ? 1 : 0;
		const blendSpeed = mouseControlsHead ? 7 : 1.25;
		mouseHeadInfluence = THREE.MathUtils.lerp(
			mouseHeadInfluence,
			targetMouseInfluence,
			1 - Math.exp(-delta * blendSpeed)
		);

		const idleHeadYaw = Math.sin(elapsed * 0.42) * 0.21;
		const idleHeadPitch = Math.sin(elapsed * 0.31 + 0.8) * 0.025;
		const trackedHeadYaw = THREE.MathUtils.lerp(idleHeadYaw, pointer.x * 0.26, mouseHeadInfluence);
		const trackedHeadPitch = THREE.MathUtils.lerp(
			idleHeadPitch,
			-pointer.y * 0.16,
			mouseHeadInfluence
		);
		const desiredHeadYaw = THREE.MathUtils.lerp(trackedHeadYaw, 0.18, gestureEnvelope);
		const desiredHeadPitch = THREE.MathUtils.lerp(trackedHeadPitch, -0.018, gestureEnvelope);
		updateHeadBone(desiredHeadYaw, desiredHeadPitch, waveEnvelope, gestureEnvelope, delta);
		updateEyes(elapsed, pointer, mouseHeadInfluence);
		updateEars(elapsed);
		updateNeck(desiredHeadYaw, desiredHeadPitch, waveEnvelope, gestureEnvelope, delta);
	}

	function updateEyes(elapsed, pointer, mouseInfluence) {
		const microYaw = Math.sin(elapsed * 0.73) * 0.018 + Math.sin(elapsed * 1.91 + 0.6) * 0.007;
		const microPitch = Math.sin(elapsed * 0.57 + 1.2) * 0.01;
		const yaw = microYaw + pointer.x * mouseInfluence * 0.055;
		const pitch = microPitch - pointer.y * mouseInfluence * 0.035;
		for (const [eye, neutral] of [
			[rig.leftEye, rig.neutralLeftEye],
			[rig.rightEye, rig.neutralRightEye]
		]) {
			if (!eye || !neutral) continue;
			eye.rotation.copy(neutral);
			eye.rotation.z += yaw;
			eye.rotation.x += pitch;
		}
	}

	function updateHeadBone(yaw, pitch, waveEnvelope, gestureEnvelope, delta) {
		if (!rig.head || !rig.neutralHead) return;
		const speed = gestureEnvelope > 0.05 ? 7 : 4.2;
		const blend = 1 - Math.exp(-delta * speed);
		headYawOffset = THREE.MathUtils.lerp(headYawOffset, yaw, blend);
		headPitchOffset = THREE.MathUtils.lerp(headPitchOffset, pitch, blend);
		headRollOffset = THREE.MathUtils.lerp(headRollOffset, -waveEnvelope * 0.13, blend);
		rig.head.rotation.copy(rig.neutralHead);
		rig.head.rotation.y += headYawOffset;
		rig.head.rotation.x += headPitchOffset;
		rig.head.rotation.z += headRollOffset;
	}

	function updateNeck(yaw, pitch, waveEnvelope, gestureEnvelope, delta) {
		if (!rig.neck || !rig.neutralNeck) return;
		const speed = gestureEnvelope > 0.05 ? 6 : 3.7;
		const blend = 1 - Math.exp(-delta * speed);
		neckYawOffset = THREE.MathUtils.lerp(neckYawOffset, yaw * 0.55, blend);
		neckPitchOffset = THREE.MathUtils.lerp(neckPitchOffset, pitch * 0.34, blend);
		neckRollOffset = THREE.MathUtils.lerp(neckRollOffset, -waveEnvelope * 0.045, blend);
		rig.neck.rotation.copy(rig.neutralNeck);
		rig.neck.rotation.y += neckYawOffset;
		rig.neck.rotation.x += neckPitchOffset;
		rig.neck.rotation.z += neckRollOffset;
	}

	function updateEars(elapsed) {
		const twitchTime = elapsed % 8.6;
		const leftTwitch = twitchPulse(twitchTime, 5.25, 0.46);
		const rightTwitch = twitchPulse(twitchTime, 6.35, 0.4);
		if (rig.leftEar && rig.neutralLeftEar) {
			rig.leftEar.rotation.z = rig.neutralLeftEar.z + leftTwitch * 0.13;
		}
		if (rig.rightEar && rig.neutralRightEar) {
			rig.rightEar.rotation.z = rig.neutralRightEar.z - rightTwitch * 0.13;
		}
	}

	return { update };
}

function updateThumbsUp(THREE, armRigs, armSway, envelope) {
	for (const { arm, foreArm, hand, fingers, neutralArm, neutralForeArm, neutralHand } of armRigs) {
		arm.rotation.copy(neutralArm);
		arm.rotation.z += armSway;
		if (foreArm && neutralForeArm) {
			foreArm.rotation.copy(neutralForeArm);
			foreArm.rotation.z += envelope * 0.55;
		}
		if (hand && neutralHand) hand.rotation.copy(neutralHand);

		let thumbJointIndex = 0;
		for (const { bone, neutral, isThumb } of fingers) {
			bone.rotation.copy(neutral);
			if (!isThumb) {
				bone.rotation.x += envelope * 0.92;
				continue;
			}
			bone.rotation.x = THREE.MathUtils.lerp(neutral.x, 0, envelope * 0.94);
			bone.rotation.y = THREE.MathUtils.lerp(neutral.y, 0, envelope * 0.82);
			bone.rotation.z = THREE.MathUtils.lerp(neutral.z, 0, envelope * 0.58);
			if (thumbJointIndex === 0) {
				bone.rotation.z += envelope * 1.15;
				bone.rotation.y -= envelope * 0.18;
			}
			thumbJointIndex += 1;
		}
	}
}

function updateWave(THREE, armRigs, armSway, envelope, handWave) {
	for (const { arm, foreArm, hand, fingers, neutralArm, neutralForeArm, neutralHand } of armRigs) {
		arm.rotation.copy(neutralArm);
		arm.rotation.x += envelope * 0.12;
		arm.rotation.y += envelope * 0.08;
		arm.rotation.z -= armSway * 0.82 + envelope * 2;
		if (foreArm && neutralForeArm) {
			foreArm.rotation.copy(neutralForeArm);
			foreArm.rotation.x -= envelope * 1.05;
			foreArm.rotation.z -= envelope * 0.35;
			foreArm.rotation.z += handWave * 0.24;
		}
		if (hand && neutralHand) {
			hand.rotation.copy(neutralHand);
			hand.rotation.y -= envelope * 0.04;
			hand.rotation.z += envelope * 0.12;
		}
		for (const { bone, neutral } of fingers) {
			bone.rotation.copy(neutral);
			bone.rotation.x = THREE.MathUtils.lerp(neutral.x, 0, envelope * 0.68);
		}
	}
}

function updateTail(THREE, rig, elapsed) {
	if (rig.tailLinks.length !== rig.tailLinkNames.length) return;
	rig.tailLinks.forEach((bone, index) => bone.rotation.copy(rig.neutralTailLinks[index]));
	rig.tailLinks.forEach((bone, index) => {
		const falloff = THREE.MathUtils.lerp(1, 0.32, index / Math.max(rig.tailLinks.length - 1, 1));
		bone.rotation.z += Math.sin(elapsed * 1.05 - index * 0.32) * 0.095 * falloff;
		bone.rotation.x += Math.sin(elapsed * 0.72 - index * 0.24 + 0.7) * 0.024 * falloff;
	});
}

function twitchPulse(time, start, duration) {
	if (time <= start || time >= start + duration) return 0;
	const progress = (time - start) / duration;
	return Math.sin(progress * Math.PI * 2) * Math.sin(progress * Math.PI);
}
