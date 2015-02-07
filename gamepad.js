import * as rafStream from 'rafStream'

class Gamepad {
	constructor(index) {
		if(typeof navigator === 'undefined')
			throw new ReferenceError('\'navigator\' is not defined')
		if(typeof navigator.gamepads === 'undefined')
			throw new ReferenceError('\'navigator.gamepads\' is not defined')
		
	}

}
