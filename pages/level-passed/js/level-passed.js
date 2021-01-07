let levelPassedState = {
	levelId: 0,
	stepsElapsed: 0,
	fuelUsed: 0
}

function backButtonPressed(){
	window.location = "../../pages/menu/menu.html"; 
}

function initListeners(){
	document.addEventListener('keyup', (e) => {
		// Fake watch events for testing on PC
		if(e.code === "Escape"){
			backButtonPressed();
		}
	});
    
    document.addEventListener("tizenhwkey", function(e)
    {
    	if(e.keyName === "back")
    	{
			backButtonPressed();
    	}
    });
}

function parseUrlParams(){
	const urlParams = new URLSearchParams(window.location.search);
	levelPassedState = {
		levelId: parseInt(urlParams.get('levelId')),
		stepsElapsed: parseInt(urlParams.get('stepsElapsed')),
		fuelUsed: parseInt(urlParams.get('fuelUsed')),
	}
}

function displayData(){
	const levelMaxScore = levels[levelPassedState.levelId].maxScore;
	const thisScore = Math.max(levelMaxScore-levelPassedState.fuelUsed-Math.round(levelPassedState.stepsElapsed/10), 0);
	const bestScoreKey = 'bestScoreForLevel'+levelPassedState.levelId;
	let bestScore = parseInt(getFromStorage(bestScoreKey))||0;
	
	if(thisScore>bestScore){
		bestScore = thisScore;
		saveToStorage(bestScoreKey, bestScore);
	}
	
	const levelIdElement = document.getElementById('level-id');
	levelIdElement.innerHTML = levelPassedState.levelId;
	const thisScoreElement = document.getElementById('this-score');
	thisScoreElement.innerHTML = thisScore;
	const bestScoreElement = document.getElementById('best-score');
	bestScoreElement.innerHTML = bestScore;
	const retryButtonElement = document.getElementById('retry-button');
	retryButtonElement.setAttribute('href', '../game/game.html?level='+levelPassedState.levelId);
	
	const nextButtonElement = document.getElementById('next-button');
	if(levels.length>levelPassedState.levelId+1){
		nextButtonElement.setAttribute('href', '../game/game.html?level='+(levelPassedState.levelId+1));
	} else{
		nextButtonElement.style['display'] = 'none';
	}
}

window.onload = function()
{
	initListeners();
	parseUrlParams();
	displayData();
}