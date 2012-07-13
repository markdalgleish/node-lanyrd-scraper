function Helper($) {
	this.$ = $;
}

Helper.prototype = {
	resolveUrl: function(url) {
		var urlPrefix;

		if (url.indexOf('http://') !== 0) {

			urlPrefix = 'http://lanyrd.com';
			
			if (url.indexOf('/') !== 0) {
				urlPrefix += '/';
			}

			url = urlPrefix + url;
		}

		return url;
	},

	setContext: function($) {
		this.$ = $;
	},

	getText: function(selector) {
		var $results = this.$(selector);

		if ($results.length === 0 || this.$.trim($results.text()) === '') {
			return undefined;
		} else {
			return this.$.trim($results.text());
		}
	},

	getHref: function(selector) {
		var $results = this.$(selector),
		href;

		if ($results.length === 0) {
			return undefined;
		} else {
			href = $results.attr('href');
			
			if (href.indexOf('/') === 0) {
				href = 'http://lanyrd.com' + href;
			}

			return href;
		}
	},

	getTitle: function(selector) {
		var $results = this.$(selector);

		if ($results.length === 0) {
			return undefined;
		} else {
			return $results.attr('title');
		}
	},

	getTwitterHandle: function(selector) {
		return '@' + this.$(selector).attr('href').split('/profile/')[1].replace('/', '');
	}
};

module.exports = Helper;