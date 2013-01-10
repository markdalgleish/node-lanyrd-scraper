'use strict';

var cheerio = require('cheerio');

function Page($) {
	this.$ = (typeof $ === 'function' ? $ : cheerio.load($));
}

Page.prototype = {
	getText: function(selector) {
		var $results = this.$(selector),
			trimmedText = $results.text().trim();

		if ($results.length === 0 || trimmedText === '') {
			return;
		}
		
		return trimmedText;
	},

	getHref: function(selector) {
		var $results = this.$(selector);

		if ($results.length === 0) {
			return;
		}

		var href = $results.attr('href');
		
		if (/^\//.test(href)) {
			href = 'http://lanyrd.com' + href;
		}

		return href;
	},

	getTitle: function(selector) {
		var $results = this.$(selector);

		if ($results.length === 0) {
			return;
		}
		
		return $results.attr('title');
	},

	getTwitterHandle: function(selector) {
		var $results = this.$(selector);

		if ($results.length === 0) {
			return;
		}

		var twitterHandle,
			href = $results.attr('href'),
			text = $results.text();

		if (href && /^\/profile\//.test(href)) {
			twitterHandle = href.split('/profile/')[1].replace('/', '');
		} else if (text.indexOf('@') >= 0) {
			twitterHandle = text.replace('@', '');
		}

		return twitterHandle;
	},

	getHashtag: function(selector) {
		var $results = this.$(selector);

		if ($results.length === 0) {
			return;
		}

		return $results.text().replace('#', '');
	},

	map: function(selector, callback) {
		return [].slice.call(this.$(selector)).map(callback);
	}
};

module.exports = Page;