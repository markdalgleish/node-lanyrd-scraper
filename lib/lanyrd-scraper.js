/*
 * lanyrd-scraper
 * https://github.com/markdalgleish/node-lanyrd-scraper
 *
 * Copyright (c) 2012 Mark Dalgleish
 * Licensed under the MIT license.
 */

var request = require('request'),
	cheerio = require('cheerio'),
	urlResolver = require('./urlresolver'),
	Page = require('./page'),
	parsers = require('./parsers');

var scrape = function(url, callback) {
	url = urlResolver.resolveUrl(url);

	request(url, function(err, resp, body) {
		if (err) {
			callback(err, null);
			return;
		}

		var pageType = urlResolver.resolvePageType(url) || 'event';
		parsers[pageType].call(this, body, callback);
	});
};

module.exports = {
	scrape: scrape,
	parse: parsers
};