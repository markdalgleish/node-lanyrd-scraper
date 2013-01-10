'use strict';

var cheerio = require('cheerio'),
	Page = require('../page');

var parseDate = function(page, elem) {
	var date = page.$(elem).find('p.date').text();

	return date.trim() ? date.trim().split(', ')[0] : undefined;
};

var parseTime = function(page, elem) {
	var $elem = page.$(elem).find('p.date').clone().remove('abbr'),
		startDate = $elem.find('p.date').text();
	
	return startDate.trim() ? startDate.trim().replace(/^,\s/, '') : undefined;
};

var parseLocation = function(page, elem) {
	var $elem = page.$(elem).find('p.location').remove('a.flag-small').find('a'),
		locationFragments = $elem.map(function(){
			return page.$(this).text();
		});

	return locationFragments.join(', ');
};

var parseEvents = function(page) {
	return page.map('.conference-listing', function(eventListing) {
		var $eventListing = page.$(eventListing);

		return {
			title: page.getText($eventListing.find('h4')),
			url: page.getHref($eventListing.find('h4 a')),
			date: parseDate(page, $eventListing),
			time: parseTime(page, $eventListing),
			location: parseLocation(page, $eventListing)
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