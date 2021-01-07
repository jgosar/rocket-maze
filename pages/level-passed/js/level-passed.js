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

function saveToStorage(key, value){
	if(typeof tizen !== 'undefined'){
		tizen.preference.setValue(key, value);
	} else{
		// Testing on PC
		localStorage.setItem(key, value);
	}
}

function getFromStorage(key){
	if(typeof tizen !== 'undefined'){
		if(tizen.preference.exists(key)) {
			return tizen.preference.getValue(key);
		} else {
			return null;
		}
	} else{
		// Testing on PC
		return localStorage.getItem(key)
	}
}

function displayData(){
	const thisScore = Math.max(100-levelPassedState.fuelUsed-Math.round(levelPassedState.stepsElapsed/10));
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
	nextButtonElement.setAttribute('href', '../game/game.html?level='+(levelPassedState.levelId+1)); //TODO: Check if next level exists
}

window.onload = function()
{
	initListeners();
	parseUrlParams();
	displayData();
}