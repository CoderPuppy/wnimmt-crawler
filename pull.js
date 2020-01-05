var pull = require('pull-stream')

pull.from = require('stream-to-pull-stream')
pull.pushable = require('pull-pushable')
pull.split = require('pull-split')
pull.defer = require('pull-defer')
pull.trumpet = (function() {
	var trumpet = require('trumpet')
	return function(opts) {
		var tr = trumpet(opts)
		var res = pull.from.duplex(tr)
		function wrapElem(elem) {
			var res = {}
			res.name = elem.name
			res.getAttribute = elem.getAttribute.bind(elem)
			res.getAttributes = elem.getAttributes.bind(elem)
			res.setAttribute = elem.setAttribute.bind(elem)
			res.removeAttribute = elem.removeAttribute.bind(elem)
			res.createReadStream = function(opts) { return pull.from.source(elem.createReadStream(opts)) }
			res.createWriteStream = function(opts) { return pull.from.sink(elem.createWriteStream(opts)) }
			res.createStream = function(opts) { return pull.from.duplex(elem.createStream(opts)) }
			return res
		}
		res.select = function(selector) {
			return wrapElem(tr.select(selector))
		}
		res.selectAll = function(selector, cb) {
			// should this be a stream
			tr.selectAll(selector, function(elem) {
				cb(wrapElem(elem))
			})
		}
		return res
	}
})()

module.exports = pull
