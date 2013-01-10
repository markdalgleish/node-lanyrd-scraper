'use strict';

var resolver = require('../lib/urlresolver');

exports['resolveUrl'] = {
	'converts shorthand url without a leading slash into full version': function(test) {
		test.equals(resolver.resolveUrl('series/melbjs'), 'http://lanyrd.com/series/melbjs');
		test.done();
	},
	'converts shorthand url with a leading slash into full version': function(test) {
		test.equals(resolver.resolveUrl('/series/melbjs'), 'http://lanyrd.com/series/melbjs');
		test.done();
	}
};

exports['shortenUrl'] = {
	'shortens full url with www': function(test) {
		test.equals(resolver.shortenUrl('http://www.lanyrd.com/series/melbjs'), 'series/melbjs');
		test.done();
	},
	'shortens full url without www': function(test) {
		test.equals(resolver.shortenUrl('http://lanyrd.com/series/melbjs'), 'series/melbjs');
		test.done();
	},
	'removes leading slash from short url': function(test) {
		test.equals(resolver.shortenUrl('/series/melbjs'), 'series/melbjs');
		test.done();
	}
};

exports['resolvePageType'] = {
	'returns the correct page type': function(test) {
		test.equals(resolver.resolvePageType('2012/melbjs-september'), 'event');
		test.equals(resolver.resolvePageType('series/melbjs'), 'series');
		test.equals(resolver.resolvePageType('foobar', { foo: /foo/ } ), 'foo');
		test.done();
	}
};