const config = {
	simulationStepMs: 100,
	wallThickness: 10,
	accelerateOnClick: 1,
	gravity: {
		x: 0,
		y: 0.2
	}
};

const mazes = {
	maze1: {
		width: 800,
		height: 800,
		walls: [
			{
				position: {
					x: 200,
					y: 400,
				},
				length: 100,
				direction: 'x'
			},
			{
				position: {
					x: 200,
					y: 300,
				},
				length: 100,
				direction: 'y'
			},
			{
				position: {
					x: 300,
					y: 300,
				},
				length: 100,
				direction: 'y'
			},
		]
	}
}

let appState = {
	rocket: {
		position: {
			x: 250,
			y: 365,
		},
		speed: {
			x: 0,
			y: 0,
		},
		rotation: 0,
	}
};

function simulateStep(){
	appState={
		...appState,
		rocket: simulatePhysics(appState.rocket, config.gravity)
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
	const wallElement = document.createElement('div');
	wallElement.setAttribute('class', 'wall');
	wallElement.style.top = (wall.position.y-(config.wallThickness/2))+'px';
	wallElement.style.left = (wall.position.x-(config.wallThickness/2))+'px';
	
	if(wall.direction==='x'){
		wallElement.style.width = (wall.length+config.wallThickness)+'px';
		wallElement.style.height = config.wallThickness+'px';
	} else{
		wallElement.style.width = config.wallThickness+'px';
		wallElement.style.height = (wall.length+config.wallThickness)+'px';
	}
	
	mazeElement.appendChild(wallElement);
}

function initMaze(maze){
	const root = document.documentElement;
	root.style.setProperty('--maze-width', maze.width + 'px');
	root.style.setProperty('--maze-height', maze.height + 'px');
	
	const mazeElement = document.getElementById('maze');
	maze.walls.forEach(wall=>createWall(mazeElement, wall));
}

function initListeners(){
	// TODO: listeners for watch bezel events
	document.addEventListener('keyup', (e) => {
		if(e.code === "KeyA"){
			appState={
				...appState,
				rocket: rotate(appState.rocket, -30)
			};
			repaint();
		}
		if(e.code === "KeyD"){
			appState={
				...appState,
				rocket: rotate(appState.rocket, 30)
			};
			repaint();
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
	initMaze(mazes.maze1);
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
