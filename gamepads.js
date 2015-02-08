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

function Gamepads(opts, cb){
	var idOrIndex
	if(opts instanceof Function){
		cb= idOrIndex
		opts= undefined
	}else if(opts instanceof String || opts instanceof Number){
		idOrIndex= opts
	}
	if(opts && opts.index !== undefined && opts.id !== undefined){
		throw new TypeError('Cannot have both a \'index\' and \'id\'')
	}
	if(opts && opts.index !== undefined){
		if(!opts.index){
			opts.index= 0
		}
		if(isNaN(opts.index)){
			throw new TypeError('Expected a numerical index from \'opts.index\'')
		}
		idOrIndex= opts.index
	}
	if(opts && opts.id !== undefined)
		idOrIndex= opts.id
	}
	var oneShot= !!(opts && opts.oneShot)

	if(!idOrIndex){
		if(cb){
			wantAll.push(cb)
		}
		filter= function(gamepad){
			return true
		}
		wantAll.push(cb)
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
	  found= []
	gamepads.forEach(function(gamepad){
		if(!filter(gamepad)){
			return
		}
		if(cb)
			cb(gamepad)
		if(oneShot){
			cb= null
		}else{
			found.push(gamepad)
		}
	})

	return found.length ? found : null
}

function remove(arr, o){
	if(!arr){
		return
	}
	var index= arr.indexOf(o)
	if(index === -1){
		return
	}
	arr.splice(index, 1)
	return arr
}

Gamepads.removeListener= function (idOrIndex, listener){
	if(index instanceof Function){
		listener= index
		index= null
	}
	if(!idOrIndex){
		remove(wantAll, listener)
		for(var wants of wantedIds){
			remove(wants, listener)
		}
		for(var wants of wantedIndexes){
			remove(wants, listener)
		}
	}else if(isNaN(idOrIndex)){
		remove(wantedIds[idOrIndex])
	}else{
		remove(wantedIndexes[idOrIndex])
	}
}

export default Gamepads
