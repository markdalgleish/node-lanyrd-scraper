'use strict';

var Page = require('../lib/page'),
	cheerio = require('cheerio'),
	$ = cheerio.load();

var TRIMMED_TEXT = 'Trimmed text',
	getTextpage = new Page('<div><div id="blank-text">   </div><div id="text"> ' + TRIMMED_TEXT + ' </div></div>');
exports['getText'] = {
	'returns undefined if not found': function(test) {
		test.expect(1);
		test.equal(getTextpage.getText('#nonexistant-text'), undefined);
		test.done();
	},
	'returns undefined if blank': function(test) {
		test.expect(1);
		test.equal(getTextpage.getText('#blank-text'), undefined);
		test.done();
	},
	'returns the text': function(test) {
		test.expect(1);
		test.equal(getTextpage.getText('#text'), TRIMMED_TEXT);
		test.done();
	}
};

var DOMAIN = 'http://lanyrd.com',
	PATH = '/test/url',
	getHrefpage = new Page('<div><a id="link" href="' + PATH + '">Test Link</a></div>');
exports['getHref'] = {
	'returns undefined if not found': function(test) {
		test.expect(1);
		test.equal(getHrefpage.getHref('#nonexistant-link'), undefined);
		test.done();
	},
	'returns the full URL': function(test) {
		test.expect(1);
		test.equal(getHrefpage.getHref('#link'), DOMAIN + PATH);
		test.done();
	}
};

var TITLE = ' Trimmed title',
	getTitlepage = new Page('<div><div id="title" title="' + TITLE + '" /></div>');
exports['getTitle'] = {
	'returns undefined if not found': function(test) {
		test.expect(1);
		test.equal(getTitlepage.getTitle('#nonexistant-title'), undefined);
		test.done();
	},
	'returns the title': function(test) {
		test.expect(1);
		test.equal(getTitlepage.getTitle('#title'), TITLE);
		test.done();
	}
};

var TWITTER_HANDLE = 'markdalgleish',
	getTwitterHandlepage = new Page('<div><a id="twitter-handle" href="/profile/' + TWITTER_HANDLE + '" /></div>');
exports['getTwitterHandle'] = {
	'returns the Twitter handle': function(test) {
		test.expect(1);
		test.equal(getTwitterHandlepage.getTwitterHandle('#twitter-handle'), TWITTER_HANDLE);
		test.done();
	}
};

var HASHTAG = 'melbjs',
	getHashTagpage = new Page('<div><div id="hashtag">' + HASHTAG + '</div></div>');
exports['getHashTag'] = {
	'returns the hash tag': function(test) {
		test.expect(1);
		test.equal(getHashTagpage.getHashtag('#hashtag'), HASHTAG);
		test.done();
	}
};

var mapPage = new Page('<b>foo</b><b>foo</b><b>foo</b>');
exports['map'] = {
	'returns an array': function(test) {
		var expected = mapPage.map('b', function(elem){
			return $(elem).text();
		});
		test.expect(2);
		test.equal(expected.length, 3);
		test.equal(expected[0], 'foo');
		test.done();
	}
};