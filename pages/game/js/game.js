let gameState = {
	rocket: undefined,
	wallEdges: [],
	finishEdges: [],
	levelId: 0,
	temporaryHtmlElements: [],
	temporaryCssClasses: [],
	repaintInterval: undefined,
	stopRepaintingTimeout: undefined,
	stepsElapsed: 0,
	fuelUsed: 0,
	htmlElements: {
		root: undefined,
		maze: undefined,
		rocket: undefined,
	},
};

function simulateStep(){
	gameState.stepsElapsed++;
	
	const rocket = simulatePhysics(gameState.rocket, config.gravity);
	const wallCollisions = getRocketCollisions(gameState.rocket, gameState.wallEdges);
	const finishCollisions = getRocketCollisions(gameState.rocket, gameState.finishEdges);
	if(wallCollisions.length>0){
		wallCollisions.forEach(createExplosionElement);
		if(!rocket.exploded){
			// We could stop repainting immediately, but if we wait for a bit, there will be more spectacular explosions :)
			gameState.stopRepaintingTimeout = setTimeout(()=>clearInterval(gameState.repaintInterval), config.explosionDurationMs);
		}
		rocket.exploded = true;
	} else if(!rocket.exploded && finishCollisions.length>0){
		// Looks like the player finished the level, let's redirect him to the level summary
		clearInterval(gameState.repaintInterval);
		window.location = "../../pages/level-passed/level-passed.html?levelId="+gameState.levelId+"&stepsElapsed="+gameState.stepsElapsed+"&fuelUsed="+gameState.fuelUsed; 
	}
	
	gameState.rocket = rocket;
}

function repaint(){
	gameState.htmlElements.root.style.setProperty('--rocket-x', gameState.rocket.position.x + 'px');
	gameState.htmlElements.root.style.setProperty('--rocket-y', gameState.rocket.position.y + 'px');
	gameState.htmlElements.root.style.setProperty('--rocket-rotation', gameState.rocket.rotation + 'deg');
	
	if(gameState.rocket.exploded){
		addTemporaryCssClass(gameState.htmlElements.rocket, 'rocket--exploded');
	}
	if(gameState.rocket.engineOn){
		gameState.rocket.engineOn = false;
		addTemporaryCssClass(gameState.htmlElements.rocket, 'rocket--engine-on');
	}
}

function addTemporaryCssClass(element, cssClass){
	if(!element.classList.contains(cssClass)){
		element.classList.add(cssClass);
		gameState.temporaryCssClasses.push({element, cssClass});
	}
}

function addTemporaryHtmlElement(parent, element){
	parent.appendChild(element);
	gameState.temporaryHtmlElements.push(element);
}

function setupAnimations(){
	gameState.htmlElements.root.style.setProperty('--simulation-step', config.simulationStepMs + 'ms');
	gameState.htmlElements.root.style.setProperty('--explosion-duration', config.explosionDurationMs + 'ms');
}

function createExplosionElement([x, y]){
	createDivFromRectangle(gameState.htmlElements.maze, 'explosion', {x, y})
}

function createWallElement(wall){
	const wallRectangle = getWallRectangle(wall, config.wallThickness);
	createDivFromRectangle(gameState.htmlElements.maze, 'wall', wallRectangle);
}

function createFinishElement(maze){
	const finishRectangle = getFinishRectangle(maze);
	createDivFromRectangle(gameState.htmlElements.maze, 'finish', finishRectangle);
}

function createDivFromRectangle(parent, cssClass, rectangle){
	const element = document.createElement('div');
	element.setAttribute('class', cssClass);
	element.style.left = rectangle.x+'px';
	element.style.top = rectangle.y+'px';
	if(rectangle.width!==undefined){
		element.style.width = rectangle.width+'px';
	}
	if(rectangle.height!==undefined){
		element.style.height = rectangle.height+'px';
	}
	
	parent.appendChild(element);
}

function loadMaze(){
	clearTemporaryHtmlElementsAndCssClasses();
	const maze = levels[gameState.levelId];
	gameState = {
		...gameState,
		wallEdges: getMazeWallEdges(maze, config.wallThickness),
		finishEdges: getMazeFinishEdges(maze),
		rocket: initRocket(maze)
	};
	
	gameState.htmlElements.root.style.setProperty('--maze-width', maze.width + 'px');
	gameState.htmlElements.root.style.setProperty('--maze-height', maze.height + 'px');
	
	maze.walls.forEach(createWallElement);
	createFinishElement(maze);
}

function clearTemporaryHtmlElementsAndCssClasses(){
	gameState.temporaryHtmlElements.forEach(removeHtmlElement);
	gameState.temporaryCssClasses.forEach(removeCssClass);
	gameState.temporaryHtmlElements = [];
	gameState.temporaryCssClasses = [];
}

function backButtonPressed(){
	if(gameState.rocket.exploded){
		restartLevel();
	} else{
		window.location = "../../pages/menu/menu.html"; 
	}
}

function restartLevel(){
	clearTemporaryHtmlElementsAndCssClasses();
	const maze = levels[gameState.levelId];
	gameState.rocket = initRocket(maze);
	startSimulation();
}

function initRocket(maze){
	return {
		position: maze.startPosition,
		speed: {
			x: 0,
			y: 0,
		},
		rotation: 0,
		exploded: false,
		engineOn: false
	};
}

function rotateRocketRight(){
	gameState.rocket = rotate(gameState.rocket, 15);
	repaint();
}

function rotateRocketLeft(){
	gameState.rocket = rotate(gameState.rocket, -15);
	repaint();
}

function accelerateRocket(){
	gameState.htmlElements.rocket.classList.remove('rocket--engine-on');
	gameState.fuelUsed++;
	gameState.rocket = accelerate(gameState.rocket, gameState.rocket.rotation, config.accelerateOnClick);
	gameState.rocket.engineOn = true;
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
		if(e.code === "Escape"){
			backButtonPressed();
		}
	});
    
    document.addEventListener("rotarydetent", function(e)
    {
    	const direction = e.detail.direction;

    	if (direction === "CW") {
			rotateRocketRight();
    	} else if (direction === "CCW") {
			rotateRocketLeft();
    	}
    });
	document.addEventListener("click", ()=>{
		accelerateRocket();
	});
    document.addEventListener("tizenhwkey", function(e)
    {
    	if(e.keyName === "back")
    	{
			backButtonPressed();
    	}
    });
}

function startSimulation(){
	gameState.stepsElapsed = 0;
	gameState.fuelUsed = 0;
	if(gameState.stopRepaintingTimeout!==undefined){
		clearTimeout(gameState.stopRepaintingTimeout);
	}
	if(gameState.repaintInterval!==undefined){
		clearInterval(gameState.repaintInterval);
	}
	gameState.repaintInterval = setIntervalStartNow(()=>{
		simulateStep();
		repaint();
	}, config.simulationStepMs);
}

function initSimulation(){
	initListeners();
	loadMaze();
	repaint();
	startSimulation();
	
	setTimeout(setupAnimations);
}

function loadHtmlElements(){
	gameState.htmlElements = {
		root: document.documentElement,
		maze: document.getElementById('maze'),
		rocket: document.getElementById('rocket'),
	};
}

function startGame(levelId)
{
	gameState = {
		...gameState,
		rocket: undefined,
		wallEdges: [],
		finishEdges: [],
		levelId,
		temporaryHtmlElements: [],
		temporaryCssClasses: [],
	}
	
	loadHtmlElements();
	generateMazeWalls();
	initSimulation();
}

window.onload = function()
{
	const urlParams = new URLSearchParams(window.location.search);
	const levelId = parseInt(urlParams.get('level'));
	startGame(levelId);
}