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
		var $results = this.$(selector),
			trimmedText = $results.text().trim();

		if ($results.length === 0 || trimmedText === '') {
			return undefined;
		}
		
		return trimmedText;
	},

	getHref: function(selector) {
		var $results = this.$(selector);

		if ($results.length === 0) {
			return undefined;
		}

		var href = $results.attr('href');
		
		if (href.indexOf('/') === 0) {
			href = 'http://lanyrd.com' + href;
		}

		return href;
	},

	getTitle: function(selector) {
		var $results = this.$(selector);

		if ($results.length === 0) {
			return undefined;
		}
		
		return $results.attr('title');
	},

	getTwitterHandle: function(selector) {
		var $results = this.$(selector);

		if ($results.length === 0) {
			return undefined;
		}

		var twitterHandle,
			href = $results.attr('href'),
			text = $results.text();



		if (href && href.indexOf('/profile/') === 0) {
			twitterHandle = href.split('/profile/')[1].replace('/', '');
		} else if (text.indexOf('@') >= 0) {
			twitterHandle = text.replace('@', '');
		}

		return twitterHandle;
	},

	getHashtag: function(selector) {
		var $results = this.$(selector);

		if ($results.length === 0) {
			return undefined;
		}

		return $results.text().replace('#', '');
	}
};

module.exports = Helper;