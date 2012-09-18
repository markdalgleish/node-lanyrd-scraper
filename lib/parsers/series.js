var cheerio = require('cheerio'),
	Page = require('../page');

var parseEvents = function(page) {
	return page.map('.conference-listing', function(eventListing) {
		var $eventListing = page.$(eventListing);
		return {
			title: page.getText($eventListing.find('h4')),
			url: page.getHref($eventListing.find('h4 a'))
		};
	});
};

var parse = function(markup, callback) {
	var $ = cheerio.load(markup),
		page = new Page($);

	callback(null, {
		title: page.getText('h1'),
		events: parseEvents(page)
	});
};

module.exports = parse;