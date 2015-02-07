var wantedIds= {},
  wantedIndexes= {}

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
	var gamepads= navigator.getGamepads()
	if(isNaN(idOrIndex)){
		var cbs= wantedIds[idOrIndex] || (wantedIds[idOrIndex]= [])
		cbs.push(cb)
		gamepads.forEach(function(gamepad){
			if(gamepad.id.indexOf(idOrIndex) !== -1){
				cb(gamepad)
			}
		})
	}else{
		var cbs= wantedIndexes[idOrIndex] || (wantedIndexes[idOrIndex]= [])
		cbs.push(cb)
		gamepads.forEach(function(gamepad){
			if(gamepad.index === idOrIndex){
				cb(gamepad)
			}
		})
	}
}
