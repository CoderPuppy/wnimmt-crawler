var pull = require('../pull')

var A = require('../args')
A.interpret(A.parseCmdLine(process.argv.slice(2)), {

})

// var argv = require('minimist')(process.argv.slice(2), {
// 	boolean: ['help'],
// 	string: ['download'],
// 	default: {
// 		'download': 'off'
// 	},
// 	alias: {
// 		'help': ['h'],
// 		'download': ['d'],
// 	},
// })
// console.log(argv)
// function printUsage() {
// 	console.log('USAGE: wnimmt-crawl <start page> <end page>')
// }
// if(argv.h || argv.help || argv._[0] == 'help')
// 	return printUsage()
// var start = parseInt(argv._[0]), end = parseInt(argv._[1])
// if(isNaN(start) || isNaN(end))
// 	return printUsage()
// var download = {}
// argv.download.split(',').map(function(p) {
// 	var s = p.split('=')
// 	if(s.length > 1)
// 		return [s[0], s.slice(1).join('=')]
// 	else
// 		return [s[0]]
// }).forEach(function(a) {
// 	switch(a[0]) {
//
// 	}
// 		download[a[0]] = a[1]
// 	} else {
// 		if(/^no-/.test(a)) {
// 			download[a] = false
// 		} else {
// 			download[a] = true
// 		}
// 	}
// })
// console.log(download)
//
// pull(
// 	require('../')(start, end),
// 	pull.drain(function(d) {
// 		console.log([].concat(d).join(' ').toString())
// 	})
// )
