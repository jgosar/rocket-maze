function isDefined(x){
	return x !== null && x !== undefined;
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
