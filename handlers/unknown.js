var pull = require('../pull')
module.exports = function(url) {
	return pull.values([['unknown', url]])
}
