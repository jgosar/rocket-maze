let appState = {
	rocket: undefined,
	mazeEdges: []
};

let repaintInterval;
let rootElement;
let mazeElement;
let rocketElement;

function simulateStep(){
	const rocket = simulatePhysics(appState.rocket, config.gravity);
	const collisions = getRocketMazeCollisions(appState.rocket, appState.mazeEdges);
	if(collisions.length>0){
		console.log(collisions);
		collisions.forEach(createExplosionElement);
		if(!rocket.exploded){
			// We could stop repainting immediately, but if we wait for a bit, there will be more spectacular explosions :)
			setTimeout(()=>clearInterval(repaintInterval), config.explosionDurationMs);
		}
		rocket.exploded = true;
	}
	
	appState={
		...appState,
		rocket,
	};
}

function repaint(){
	rootElement.style.setProperty('--rocket-x', appState.rocket.position.x + 'px');
	rootElement.style.setProperty('--rocket-y', appState.rocket.position.y + 'px');
	rootElement.style.setProperty('--rocket-rotation', appState.rocket.rotation + 'deg');
	
	if(appState.rocket.exploded){
		rocketElement.setAttribute('class', 'rocket rocket--exploded');
	}
}

function setupAnimations(){
	rootElement.style.setProperty('--simulation-step', config.simulationStepMs + 'ms');
	rootElement.style.setProperty('--explosion-duration', config.explosionDurationMs + 'ms');
}

function createExplosionElement([x, y]){
	const explosionElement = document.createElement('div');
	explosionElement.setAttribute('class', 'explosion');
	explosionElement.style.left = x+'px';
	explosionElement.style.top = y+'px';
	
	mazeElement.appendChild(explosionElement);
}

function createWallElement(wall){
	const wallRectangle = getWallRectangle(wall, config.wallThickness);
	
	const wallElement = document.createElement('div');
	wallElement.setAttribute('class', 'wall');
	wallElement.style.left = wallRectangle.x+'px';
	wallElement.style.top = wallRectangle.y+'px';
	wallElement.style.width = wallRectangle.width+'px';
	wallElement.style.height = wallRectangle.height+'px';
	
	mazeElement.appendChild(wallElement);
}

function initMaze(maze){
	appState = {
		...appState,
		mazeEdges: getMazeEdges(maze, config.wallThickness),
		rocket: initRocket(maze)
	};
	
	rootElement.style.setProperty('--maze-width', maze.width + 'px');
	rootElement.style.setProperty('--maze-height', maze.height + 'px');
	
	maze.walls.forEach(createWallElement);
}

function initRocket(maze){
	return {
		position: maze.startPosition,
		speed: {
			x: 0,
			y: 0,
		},
		rotation: 0,
		exploded: false
	};
}

function rotateRight(){
	appState= {
		...appState,
		rocket: rotate(appState.rocket, 15)
	};
	repaint();
}

function rotateLeft(){
	appState= {
		...appState,
		rocket: rotate(appState.rocket, -15)
	};
	repaint();
}

function initListeners(){
	document.addEventListener('keyup', (e) => {
		// Fake watch events for testing on PC
		if(e.code === "KeyD"){
			document.dispatchEvent(new CustomEvent('rotarydetent', {detail:{direction: 'CW'}}));
		}
		if(e.code === "KeyA"){
			document.dispatchEvent(new CustomEvent('rotarydetent', {detail:{direction: 'CCW'}}));
		}
		if(e.code === "KeyW"){
			document.dispatchEvent(new Event('click'));
		}
	});
    
    document.addEventListener("rotarydetent", function(e)
    {
    	const direction = e.detail.direction;

    	if (direction === "CW") {
			rotateRight();
    	} else if (direction === "CCW") {
			rotateLeft();
    	}
    });
	document.addEventListener("click", ()=>{
		appState={
			...appState,
			rocket: accelerate(appState.rocket, appState.rocket.rotation, config.accelerateOnClick)
		};
	});
}

function initSimulation(){
	initListeners();
	initMaze(levels[0]);
	repaint();
	
	setTimeout(setupAnimations);
	
	repaintInterval = setIntervalStartNow(()=>{
		simulateStep();
		repaint();
	}, config.simulationStepMs);
}

function loadHtmlElements(){
	rootElement = document.documentElement;
	mazeElement = document.getElementById('maze');
	rocketElement = document.getElementById('rocket');
}

window.onload = function()
{
	loadHtmlElements();
	generateMazeWalls();
	initSimulation();
}
