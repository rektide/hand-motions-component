var _ = require('lodash')

module.exports = (function sortOrder(collection, iteratee){
	if(iteratee){
		var capture= iteratee
		iteratee= (function iteratee(value){
			return capture(collection[value])
		})
	}else{
		iteratee= (function iteratee(value){
			return collection[value]
		})
	}



	var sortOrder= []
	_.each(collection, function(key, value, collection){
		var index= _.sortedIndex(collection, value, iteratee)
		sortOrder.splice(index, 0, key)
	})
	return sortOrder
})
