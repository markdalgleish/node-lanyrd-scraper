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
		var twitterHandle,
			href = this.$(selector).attr('href'),
			text = this.$(selector).text();

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
		} else {
			return $results.text().replace('#', '');
		}
	}
};

module.exports = Helper;