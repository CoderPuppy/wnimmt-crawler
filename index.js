var hyperquest = require('hyperquest')
var pull = require('./pull')

var handlers = [
	require('./handlers/curseforge'),
	require('./handlers/curse'),
	require('./handlers/ignore')(),
	require('./handlers/unknown'),
]

function crawl(start, end) {
	var parallel = 3
	return pull.Source(function() {
		var urls = pull.pushable()
		urls.number = 0
		for(var i = start; i <= end; i++) {
			urls.number++
			pull(
				pull.from.source(hyperquest('http://forum.feed-the-beast.com/threads/whats-new-in-modded-minecraft-today.39595/page-' + i)),
				pull.split(),
				pull.drain(function(d) {
					d.toString().replace(/href="([^"]+)"/g, function($a, url) {
						urls.push(url)
					})
				}, function() {
					urls.number--
					if(urls.number == 0) {
						urls.end()
					}
				})
			)
		}

		return pull(
			urls,
			pull.substream(pull.Through(function(read, d) {
				for(var i = 0; i < handlers.length; i++) {
					var handler = handlers[i]
					var stream = handler(d)
					if(stream) return stream
				}
				return pull.values([])
			}), parallel),
			pull.flow.parallel(parallel),
			pull.unique()
		)
	})()
}

module.exports = crawl
