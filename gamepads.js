var wantedIds= {},
  wantedIndexes= {},
  wantAll= []

function signalAll(gamepad, waiting){
	for(var i= 0; i < waiting.length; ++i){
		waiting[i](gamepad)
	}
}

function match(gamepad){
	for(var id in wantedIds){
		if(gamepad.id.indexOf(id) !== -1){
			signalAll(wantedIds[id])
		}
	}
	for(var index in wantedIndexes){
		if(gamepad.index === index){
			signalAll(wantedIndexes[index])
		}
	}
}

window.addEventListener('gamepadconnected', function(e){
	match(e.gamepad)
})

module.exports = function(idOrIndex, cb){
	if(idOrIndex instanceof Function){
		cb= idOrIndex
		idOrIndex= undefined
	}

	if(!idOrIndex){
		if(cb){
			wantAll.push(cb)
		}
		filter= function(gamepad){
			return true
		}
	}else if(isNaN(idOrIndex)){
		if(cb){
			var cbs= wantedIds[idOrIndex] || (wantedIds[idOrIndex]= [])
			cbs.push(cb)
		}
		filter= function(gamepad){
			return gamepad.id.indexOf(idOrIndex) !== -1
		}
	}else{
		if(cb){
			var cbs= wantedIndexes[idOrIndex] || (wantedIndexes[idOrIndex]= [])
			cbs.push(cb)
		}
		filter= function(gamepad){
			return gamepad.index === idOrIndex
		}
	}

	var gamepads= navigator.getGamepads(),
	  found= 0
	gamepads.forEach(function(gamepad){
		if(!filter(gamepad)){
			return
		}
		++found
		if(cb)
			cb(gamepad)
	})

	return found
}
