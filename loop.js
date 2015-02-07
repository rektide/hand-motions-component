import * as RafStream from 'raf-stream'

var stream = new RafStream(),
  ref= 0
stream.pause()
stream.on('newListener', function(e, l){
	if(e !== 'data')
		return
	if(ref++ === 0){
		stream.resume()
	}
})
stream.on('removeListener', function(e, l){
	if(e !== 'data')
		return
	if(ref > 0)
		--ref;
	if(ref <= 0)
		stream.pause()
})

export default stream
