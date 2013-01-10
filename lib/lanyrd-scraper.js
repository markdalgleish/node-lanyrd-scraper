/*
 * lanyrd-scraper
 * https://github.com/markdalgleish/node-lanyrd-scraper
 *
 * Copyright (c) 2013 Mark Dalgleish
 * Licensed under the MIT license.
 */

'use strict';

var request = require('request'),
	urlResolver = require('./urlresolver'),
	parsers = require('./parsers');

var loadDataFromUrl = function(url, callback) {
	request(url, function(err, resp, body) {
		var pageType;

		if (err) {
			callback(err, null);
		} else {
			pageType = urlResolver.resolvePageType(url) || 'event';
			parsers[pageType].call(this, body, callback);
		}
	});
};

var scrape = function(url, callback) {
	url = urlResolver.resolveUrl(url);
	loadDataFromUrl(url, callback);
};

module.exports = {
	scrape: scrape,
	parse: parsers
};