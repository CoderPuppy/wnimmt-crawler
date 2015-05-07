exports.parseCmdLine = function(argv) {
	var res = []
	function parseData(data) {
		var squares = 1
		if(data == '[') {
			data = []
			for(var j = i + 1; j < argv.length; j++) {
				var argJ = argv[j]
				if(argJ == ']') {
					squares--
					if(squares == 0) {
						i = j
						break
					}
				} else if(/(?:^|[^\[])\[$/.test(argJ)) {
					squares++
				}
				if(squares > 0)
					data.push(argJ)
			}
		}
		return data
	}
	for(var i = 0; i < argv.length; i++) {
		var arg = argv[i]
		var match
		if(match = /^\+([a-zA-Z0-9])([\w\W]+)$/.exec(arg)) {
			res.push(['+', match[1], parseData(match[2])])
		} else if(match = /^\+\+([a-zA-Z0-9\-]+)(?=([\w\W]+))?$/.exec(arg)) {
			res.push(['++', match[1], parseData(match[2])])
		} else if(match = /^-([a-zA-Z0-9])([\w\W]+)$/.exec(arg)) {
			res.push(['-', match[1], parseData(match[2])])
		} else if(match = /^--([a-zA-Z0-9][a-zA-Z0-9\-]*)(?=([\w\W]+))?$/.exec(arg)) {
			res.push(['--', match[1], parseData(match[2])])
		} else {
			res.push(['_', undefined, parseData(arg)])
		}
	}
	console.log(res)
	return res
}
exports.interpret = function(argv, options) {
	if(typeof(options) == 'object') options = (function(o) { return function(k) { return o[k] } })(options)
		console.log(argv)
	argv.forEach(function(arg) {)
		var key = arg[0] + (arg[1] || '')
		console.log(key, options(key))
	})
}
