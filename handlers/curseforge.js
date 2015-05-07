var pull = require('../pull')
var request = require('../request')

var versions = {
	'1.8.x': '1107734681%3A4',
	'1.8.3': '2020709689%3A4466',
	'1.8.2': '2020709689%3A4465',
	'1.8.1': '2020709689%3A4463',
	'1.8': '2020709689%3A4455',
	'1.8-snapshot': '2020709689%3A4450',

	'1.7.x': '1107734681:3',
	'1.7.10': '2020709689:4449',
	'1.7.9': '2020709689%3A4448',
	'1.7.8': '2020709689%3A4447',
	'1.7.7': '2020709689%3A4446',
	'1.7.6': '2020709689%3A4445',
	'1.7.5': '2020709689%3A4444',
	'1.7.4': '2020709689%3A367',
	'1.7.2': '2020709689:361',

	'1.6.x': '1107734681:2',
	'1.6.4': '2020709689:326',
	'1.6.2': '2020709689:320',
	'1.6.2': '2020709689%3A318',

	'1.5.x': '1107734681%3A1',
	'1.5.2': '2020709689%3A312',
	'1.5.1': '2020709689%3A280',
	'1.5.0': '2020709689%3A279',
}

var re = /https?:\/\/minecraft\.curseforge\.com\/([^\/]+)\/(\d+)-([^\/]*)/
module.exports = function(url) {
	var match = re.exec(url)
	if(!match) return
		// console.log(match)
	var out = pull.defer.source()
	var tr = pull.trumpet()
	pull(tr.select('title').createReadStream(), pull.collect(function(err, d) {
		d = d.map(function(d) { return d.toString() }).join('')
		out.resolve(pull.values([['curseforge', d.replace(/^Overview - /, '').replace(/ - [^-]+ - Projects - Minecraft CurseForge $/, ''), match[0]]]))
	}))
	pull(request()(match[0]), tr)
	return out
	// return request()(match[0])
	// return pull.values([['curseforge', match[0]]])
}
