var lanyrd = require('../lib/lanyrd-scraper');

exports['public API'] = {
	'has "scrape" function': function(test) {
		test.equals(typeof lanyrd.scrape, 'function');
		test.done();
	},
	'has "parse" object containing parse functions': function(test) {
		test.equals(typeof lanyrd.parse, 'object');
		test.equals(typeof lanyrd.parse.event, 'function');
		test.done();
	}
};