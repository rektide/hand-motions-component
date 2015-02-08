import * as RafStream from './raf-stream'
import * as Gamepads from './gamepads')

export default class Gamepad {
	constructor(indexOrId) {
		this._index= index
		this._gamepad= null

		// raf loop
		this._tick= ()=>{
			let gamepad= this.gamepad,
			  enqueue= this._enqueue
			if(gamepad && enqueue){
				enqueue(gamepad)
			}else{
				RafStream.removeListener(this._tick)
				this._loop= false
			}
		}
		this._loop= false

		// gamepad finder
		this._gamepadListener= (gamepad)=>{
			if(!this._gamepad){
				this._gamepad= gamepad
				if(!this._pause){
					this.resume()
				}
			}
			this._endGamepadListener()
		}
		this._disconnectListener= ()=>{
			this._gamepad= null
		}
		this._endGamepadListener= ()=>{
			if(this._isFetchingGamepad){
				Gamepads.removeListener(this._index, this._gamepadListener)
			}
			this._isFetchingGamepad= false
		}
		this._isFetchingGamepad= false

		// loop
		this._loop= false
		this._pause= false
	}
	set indexOrId(value){
		if(this._index == value){
			return
		}
		if(!value && value !== 0){
			value= undefined
		}
		this._endGamepadListener()
		this._index= value
		this._gamepad= null
		if(this._enqueue && !this._pause && this.gamepad){
			this.resume()
		}
	}
	get gamepad(){
		if(!this._gamepad){
			if(this._isFetchingGamepad){
				return
			}
			Gamepads(this._index, this._gamepadListener, this._disconnectListener)
			this._isFetchingGamepad= true
		}
		return this._gamepad
	}
	get stream(){
		if(this._stream) {
			return this._stream
		}

		let self= this
		this._stream= new ReadableStream({
			start(enqueue, close, error){
				self._enqueue = enqueue
				self._close = close
				self._error = error
			},
			cancel(){
				self.close()
			}
		})

		if(!this._pause){
			this.resume()
		}
	}
	pause(){
		this._pause= true
		if(!this._loop){
			return false
		}
		RafStream.removeListener('data', this._tick)
		this._loop= false
		return true
	}
	resume(){
		this._pause= false
		if(this._loop || !this.gamepad || !this._enqueue){
			return false
		}
		RafStream.on('data', this._tick)
		this._loop= true
		return true
	}

	close(){
		var opened= false
		if(this._close){
			opened= true
			this._close()
		}
		this._stream= null
		this._enqueue= null
		this._close= null
		this._gamepad= null
		return opened
	}
}
