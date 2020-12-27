let appState = {
	rocket: {
		position: {
			x: 250,
			y: 350,
		},
		speed: {
			x: 0,
			y: 0,
		},
		rotation: 0,
	},
	collisions: [],
	mazeEdges: []
};

let repaintInterval;

function simulateStep(){
	const rocket = simulatePhysics(appState.rocket, config.gravity);
	const collisions = detectRocketMazeCollisions(appState.rocket, appState.mazeEdges);
	if(collisions){
		console.log(getRocketMazeCollisions(appState.rocket, appState.mazeEdges));
		clearInterval(repaintInterval);
		/*
		TODO:
		stroke-width: 0.8px;
    stroke: red;
    stroke-linecap: round;
	*/
	}
	
	appState={
		...appState,
		rocket,
		collisions
	};
}

function repaint(){
	let root = document.documentElement;
	root.style.setProperty('--rocket-x', appState.rocket.position.x + 'px');
	root.style.setProperty('--rocket-y', appState.rocket.position.y + 'px');
	root.style.setProperty('--rocket-rotation', appState.rocket.rotation + 'deg');
}

function setupTransitionInterval(){
	let root = document.documentElement;
	root.style.setProperty('--simulation-step', config.simulationStepMs + 'ms');
}

function createWall(mazeElement, wall){
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
		mazeEdges: getMazeEdges(maze, config.wallThickness)
	};
	
	const root = document.documentElement;
	root.style.setProperty('--maze-width', maze.width + 'px');
	root.style.setProperty('--maze-height', maze.height + 'px');
	
	const mazeElement = document.getElementById('maze');
	maze.walls.forEach(wall=>createWall(mazeElement, wall));
}

function rotateRight(){
	appState={
		...appState,
		rocket: rotate(appState.rocket, 15)
	};
	repaint();
}

function rotateLeft(){
	appState={
		...appState,
		rocket: rotate(appState.rocket, -15)
	};
	repaint();
}

function initListeners(){
	document.addEventListener('keyup', (e) => {
		// Fake watch rotation events for testing on PC
		if(e.code === "KeyD"){
			document.dispatchEvent(new CustomEvent('rotarydetent', {detail:{direction: 'CW'}}));
		}
		if(e.code === "KeyA"){
			document.dispatchEvent(new CustomEvent('rotarydetent', {detail:{direction: 'CCW'}}));
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
	
	setTimeout(setupTransitionInterval);
	
	repaintInterval = setIntervalStartNow(()=>{
		simulateStep();
		repaint();
	}, config.simulationStepMs);
}

window.onload = function()
{
	initSimulation();
}
