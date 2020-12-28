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

function median(arr){
  const mid = Math.floor(arr.length / 2);
  const nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

function isBetween(num, start, end){
	return num>=Math.min(start, end) && num<=Math.max(start, end);
}

function rangesOverlap(start1, end1, start2, end2){
	return isBetween(start1, start2, end2) || 
			isBetween(end1, start2, end2) || 
			isBetween(start2, start1, end1) || 
			isBetween(end2, start1, end1);
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

// DOM utils
function removeHtmlElement(element){
	element.parentNode.removeChild(element);
}

function removeCssClass({element, cssClass}){
	element.classList.remove(cssClass);
}

// JS utils
function setIntervalStartNow(fn, t) {
	setTimeout(()=>{
		fn();
	});
    return setInterval(fn, t);
}

function concatIfDefined(items, newItem){
	if(newItem!==undefined){
		return items.concat([newItem]);
	} else{
		return items;
	}
}
