var sortOrder = require('./sort-order')

module.exports= (function ordinalize(gp){
	gp.axesOrder= sortOrder(gp.axes, Math.abs)
})
