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
	
	setIntervalStartNow(()=>{
		simulateStep();
		repaint();
	}, config.simulationStepMs);
}

window.onload = function()
{
	initSimulation();
}
