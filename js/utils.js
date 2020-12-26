// Math utils
function toDegrees (angle) {
  return angle * (180 / Math.PI);
}

function toRadians (angle) {
  return angle * (Math.PI / 180);
}

function mod(n, m) {
  return ((n % m) + m) % m;
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

function getVectorDirection(vector){
	if(vector.y===0){
		return mod(Math.sign(vector.x)*90, 360);
	}
	const ratio = vector.x / (- vector.y);
	let direction = toDegrees(Math.atan(ratio));
	if(vector.y>0){
		direction += 180;
	}
	return mod(direction, 360);
}

function rotateVector(vector, rotation){
	const direction = getVectorDirection(vector);
	const length = Math.hypot(vector.x, vector.y);
	
	return createVector(direction + rotation, length);
}

function getRectangeVertices(rectangle){
	return [
		{
			x: rectangle.x,
			y: rectangle.y,
		},
		{
			x: rectangle.x+rectangle.width,
			y: rectangle.y,
		},
		{
			x: rectangle.x+rectangle.width,
			y: rectangle.y+rectangle.height,
		},
		{
			x: rectangle.x,
			y: rectangle.y+rectangle.height,
		},
	];
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
