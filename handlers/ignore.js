var pull = require('../pull')
var rescape = require('escape-string-regexp')

exports = module.exports = function(patterns) {
	patterns = patterns || exports.default
	return function(url) {
		var res = pull.values([])
		for(var i = 0; i < patterns.length; i++) {
			if(patterns[i].test(url)) {
				return res
			}
		}
	}
}
function not(s) {
	var out = ''
	for(var i = 0; i < s.length; i++)
		if(i == s.length - 1)
			out += '[^' + rescape(s[i]) + ']'
		else
			out += '(?:[^' + rescape(s[i]) + ']|' + rescape(s[i])
	for(var i = 0; i < s.length - 1; i++)
		out += ')'
	return out
}
exports.default = [
	RegExp('^' + not('http')),
	/^https?:\/\/(?:www\.)?(?:youtube|twitter|facebook|guildwars2guru|lolpro|mmo-champion|wowstead|wowace|skyrimforge|sc2mapster|exilepro|forums.bukkit|(?:wiki\.)?terrariaonline|arenajunkies|gw2db|diablofans|fpsgeneral|(?:db\.)?darthhater|defianceforum|wildstarforums|zybez|aionarmory|wowdb|marriland|minecraftwiki|wowpedia|skyrimwiki|wikiswtor|dragonnestwiki|vindictuswiki|xenforo|8wayrun|gamevox|bukkit|curseforge|patreon|twitch|society6|google)/,
	RegExp('^http://forum\\.feed-the-beast\\.com(?:/(?:$|' + not('threads') + ')|$)'),
	RegExp('^https?://github.com/[^/]+/[^/]+/' + not('releases')),
	RegExp('^https?://(?:www\\.)?curse\\.com(?:$|/(?:$|' + not('mc-mods') + '))'),
	RegExp('^https?://(?:www\\.)?minecraft\\.curseforge\\.com'),//(?:$|/(?:$|' + not('mc-mods') + '|' + not('texture-packs') + '|' + not('modpacks') + '))'),
	RegExp('^' + rescape('http://forum.feed-the-beast.com/threads/whats-new-in-modded-minecraft-today.39595')),
	RegExp('^https?://[^/]+/?$'),
]
