let menuState = {
	displayedMenu: undefined,
	focusedIndex: 0
}

const levelsMenu = {
	title: 'Choose level',
	items: []
};

function range(start, end){
  const result = [];
  for(let i=start;i<=end;i++){
    result.push(i);
  }
  return result;
}

function getMaxUnlockedLevel(){
	for(let levelId=1;levelId<levels.length;levelId++){
		const bestScoreKey = 'bestScoreForLevel'+levelId;
		if(!isDefined(getFromStorage(bestScoreKey))){
			return levelId;
		}
	}
	return levels.length-1;
}

function generateLevelMenuItems(levelCount){
	levelsMenu.items = range(1, levelCount).map(level=>({
		name: 'Play level ' + level,
		url: '../game/game.html?level=' + level
	}));
}

function displayMenu(menu){
	const menuTitleElement = document.getElementById('menu-title');
	menuTitleElement.innerHTML = 'Choose level';
	
	const menuItemsElement = document.getElementById('menu-items');
	menuItemsElement.innerHTML = '';
	menu.items.forEach((menuItem, index)=>{
		const menuItemElement = document.createElement('li');
		menuItemElement.classList.add('menu-item');
		
		const menuItemLinkElement = document.createElement('a')
		menuItemLinkElement.setAttribute('href', menuItem.url);
		menuItemLinkElement.innerHTML = menuItem.name;
		menuItemElement.appendChild(menuItemLinkElement);
		
		menuItemsElement.appendChild(menuItemElement);
	});
	
	menuState.displayedMenu = menu;
}

function setFocusedItemIndex(focusedIndex){
	const focusedClass = 'menu-item--focused';
	const menuItemsElement = document.getElementById('menu-items');
	const menuItems = [].slice.call(menuItemsElement.children);
	
	menuItems.forEach((menuItemElement, index)=>{
		if(index===focusedIndex && !menuItemElement.classList.contains(focusedClass)){
			menuItemElement.classList.add(focusedClass);
		} else if(index!==focusedIndex && menuItemElement.classList.contains(focusedClass)){
			menuItemElement.classList.remove(focusedClass);
		}
	});
	
	document.documentElement.style.setProperty('--scroll-to-nth-item', focusedIndex);
	
	menuState.focusedIndex = focusedIndex;
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
	});
    
    document.addEventListener("rotarydetent", function(e)
    {
    	const direction = e.detail.direction;

    	if (direction === "CW") {
			moveFocusDown();
    	} else if (direction === "CCW") {
			moveFocusUp();
    	}
    });
    document.addEventListener("tizenhwkey", function(e)
    {
    	if(e.keyName === "back")
    	{
			tizen.application.getCurrentApplication().exit();
    	}
    });
}

function moveFocusDown(){
	if(menuState.focusedIndex+1<=menuState.displayedMenu.items.length-1){
		setFocusedItemIndex(menuState.focusedIndex+1);
	}
}

function moveFocusUp(){
	if(menuState.focusedIndex-1>=0){
		setFocusedItemIndex(menuState.focusedIndex-1);
	}
}

window.onload = function()
{
	initListeners();
	generateLevelMenuItems(getMaxUnlockedLevel());
	displayMenu(levelsMenu);
	setFocusedItemIndex(0);
}