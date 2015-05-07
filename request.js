var hyperquest = require('hyperquest')
var pull = require('./pull')
var URL = require('url')
var xtend = require('xtend')

module.exports = function() {
	// domain => path => cookie name => value
	var cookiesDb = {}

	function applicableCookies(host, path) {
		host = host.split('.')
		path = path.split('/').filter(Boolean)
		var applicableCookies = {}
		for(var hi = 0; hi < host.length; hi++) {
			var domain = host.slice(hi).join('.')
			var domainCookies = cookiesDb[domain]
			if(domainCookies) {
				for(var pi = 0; pi <= path.length; pi++) {
					var p = '/' + path.slice(0, pi).join('/')
					var pCookies = domainCookies[p]
					if(pCookies)
						for(var k in pCookies)
							if(({}).hasOwnProperty.call(pCookies, k))
								applicableCookies[k] = pCookies[k]
				}
			}
		}
		return applicableCookies
	}

	return function() {
		var out = {sink: pull.defer.sink(), source: pull.defer.source()}
		function request() {
			var r = hyperquest.apply(null, arguments)
			var url = URL.parse(r.request.uri)
			console.log(url)
			var cookies = applicableCookies(url.host, url.pathname)
			var cookiesHeader = []
			for(var k in cookies)
				if(({}).hasOwnProperty.call(cookies, k))
					cookiesHeader.push([k, cookies[k]])
			cookiesHeader = cookiesHeader
				.map(function(c) { return c.join('=') })
				.join('; ')
			// console.log('cookies', cookies, cookiesHeader)
			r.setHeader('Cookie', cookiesHeader)
			r.on('response', function(res) {
				[].concat(res.headers['set-cookie']).filter(Boolean).forEach(function(header) {
					header = header
						.split(';')
						.map(function(p) { return p.replace(/^\s+/, '').replace(/\s+$/, '') })
						.map(function(p) { return p.split('=') })
					var props = {}
					header.slice(1).forEach(function(kv) {
						props[kv[0]] = kv[1]
					})
					header = header[0]
					props.domain = props.domain ? props.domain.replace(/^\./, '') : url.host
					props.path = props.path || '/'
					var cookies = cookiesDb[props.domain] = cookiesDb[props.domain] || {}
					cookies = cookies[props.path] = cookies[props.path] || {}
					cookies[header[0]] = header[1]
					// console.log('setting cookie', props.domain, props.path, header[0])
					// console.log(header, props, cookiesDb)
				})
				if(res.statusCode >= 300 && res.statusCode < 400 && res.headers['location']) {
					// console.log('redirect', res.headers['location'])
					request(xtend(r.request.options, { uri: URL.resolve(r.request.uri, res.headers['location']) }))
				} else {
					out.sink.resolve(pull.from.sink(r))
					out.source.resolve(pull.from.source(r))
				}
			})
			return r
		}
		var r = request.apply(null, arguments)
		out.setHeader = r.setHeader.bind(r)
		out.setLocation = r.setLocation.bind(r)
		return out
	}
}
