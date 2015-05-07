var pull = require('../pull')
var curseforge = require('./curseforge')

var re = /^https?:\/\/(?:www\.)?curse.com\/([^\/]+)\/minecraft\/(\d+)-([^#]*)(?:#.+)?$/
module.exports = function(url) {
	if(!re.test(url)) return
	var res = curseforge(url.replace(re, 'http://minecraft.curseforge.com/$1/$2-$3'))
		// console.log('curse', res, !!res)
	// if(!res) console.log('unhandled curse %s (%s)', url, url.replace(re, 'http://minecraft.curseforge.com/mc-mods/$1-$2'))
	if(!res) return pull.values([['curse', url, url.replace(re, 'http://minecraft.curseforge.com/mc-mods/$1-$2')]])
	return res
}
