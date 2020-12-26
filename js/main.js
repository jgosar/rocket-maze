const config = {
	simulationStepMs: 1000
};

let appState={
	rocket: {
		position: {
			x: 250,
			y: 365,
		},
		speed: {
			x: 0,
			y: -10,
		},
		acceleration: {
			x: 0,
			y: 0,
		},
		rotation: 0,
	}
};

function addVectors(...vectors){
	return vectors.reduce((prev, next)=>({x:prev.x+next.x, y: prev.y+next.y}), {x:0, y:0});
}

function simulatePhysics(object){
	const speed = addVectors(object.speed, object.acceleration);
	const position = addVectors(object.position, object.speed);
	return {
		...object,
		position,
		speed
	};
}

function simulateStep(){
	appState={...appState, rocket: simulatePhysics(appState.rocket)}
}

function repaint(){
	let root = document.documentElement;
	root.style.setProperty('--rocket-x', appState.rocket.position.x + "px");
	root.style.setProperty('--rocket-y', appState.rocket.position.y + "px");
}

function setIntervalStartNow(fn, t) {
	setTimeout(()=>{
		fn();
	});
    return setInterval(fn, t);
}

function setupTransitionInterval(){
	let root = document.documentElement;
	root.style.setProperty('--simulation-step', config.simulationStepMs + "ms");
}

function initSimulation(){
	repaint();
	
	setTimeout(setupTransitionInterval);
	
	setIntervalStartNow(()=>{
		simulateStep();
		repaint();
	}, config.simulationStepMs);
}

window.onload = function()
{
	initSimulation();
}
