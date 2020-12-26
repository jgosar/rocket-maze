// Math utils
function toDegrees (angle) {
  return angle * (180 / Math.PI);
}

function toRadians (angle) {
  return angle * (Math.PI / 180);
}

function addVectors(...vectors){
	return vectors.reduce((prev, next)=>({x:prev.x+next.x, y: prev.y+next.y}), {x:0, y:0});
}

function createVector(direction, length){
	const directionRadians = toRadians(direction);
	return {
		x: length * Math.sin(directionRadians),
		y: - length * Math.cos(directionRadians),
	}
}

// Physics utils
function simulatePhysics(object, gravity){
	const speed = addVectors(object.speed, gravity)
	return {
		...object,
		position: addVectors(object.position, speed)
	};
}

function rotate(object, degrees){
	return {
		...object,
		rotation: object.rotation+degrees
	};
}

function accelerate(object, direction, deltaV){
	const acceleration = createVector(direction, deltaV);
	return {
		...object,
		speed: addVectors(object.speed, acceleration)
	};
}

// JS utils
function setIntervalStartNow(fn, t) {
	setTimeout(()=>{
		fn();
	});
    return setInterval(fn, t);
}