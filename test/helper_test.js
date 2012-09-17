var Helper = require('../lib/helper'),
	cheerio = require('cheerio');

/*
	======== A Handy Little Nodeunit Reference ========
	https://github.com/caolan/nodeunit

	Test methods:
	test.expect(numAssertions)
	test.done()
	Test assertions:
	test.ok(value, [message])
	test.equal(actual, expected, [message])
	test.notEqual(actual, expected, [message])
	test.deepEqual(actual, expected, [message])
	test.notDeepEqual(actual, expected, [message])
	test.strictEqual(actual, expected, [message])
	test.notStrictEqual(actual, expected, [message])
	test.throws(block, [error], [message])
	test.doesNotThrow(block, [error], [message])
	test.ifError(value)
*/

var helper = new Helper();

var EVENT_URL = 'http://lanyrd.com/2012/web-directions-code';
exports['resolveUrl'] = {
	'ignores complete url': function(test) {
		test.expect(1);
		test.equal(helper.resolveUrl(EVENT_URL), EVENT_URL);
		test.done();
	},
	'resolves urls correctly': function(test) {
		test.expect(2);
		test.equal(helper.resolveUrl('2012/web-directions-code'), EVENT_URL);
		test.equal(helper.resolveUrl('/2012/web-directions-code'), EVENT_URL);
		test.done();
	}
};

exports['setContext'] = {
	'sets the context': function(test)	{
		var $ = cheerio.load();
		
		test.expect(1);
		helper.setContext($);
		test.equal(helper.$, $);
		test.done();
	}
};

var TRIMMED_TEXT = 'Trimmed text',
	getTextHelper = new Helper(cheerio.load('<div><div id="blank-text">   </div><div id="text"> ' + TRIMMED_TEXT + ' </div></div>'));
exports['getText'] = {
	'returns undefined if not found': function(test) {
		test.expect(1);
		test.equal(getTextHelper.getText('#nonexistant-text'), undefined);
		test.done();
	},
	'returns undefined if blank': function(test) {
		test.expect(1);
		test.equal(getTextHelper.getText('#blank-text'), undefined);
		test.done();
	},
	'returns the text': function(test) {
		test.expect(1);
		test.equal(getTextHelper.getText('#text'), TRIMMED_TEXT);
		test.done();
	}
};

var DOMAIN = 'http://lanyrd.com',
	PATH = '/test/url',
	getHrefHelper = new Helper(cheerio.load('<div><a id="link" href="' + PATH + '">Test Link</a></div>'));
exports['getHref'] = {
	'returns undefined if not found': function(test) {
		test.expect(1);
		test.equal(getHrefHelper.getHref('#nonexistant-link'), undefined);
		test.done();
	},
	'returns the full URL': function(test) {
		test.expect(1);
		test.equal(getHrefHelper.getHref('#link'), DOMAIN + PATH);
		test.done();
	}
};

var TITLE = ' Trimmed title',
	getTitleHelper = new Helper(cheerio.load('<div><div id="title" title="' + TITLE + '" /></div>'));
exports['getTitle'] = {
	'returns undefined if not found': function(test) {
		test.expect(1);
		test.equal(getTitleHelper.getTitle('#nonexistant-title'), undefined);
		test.done();
	},
	'returns the title': function(test) {
		test.expect(1);
		test.equal(getTitleHelper.getTitle('#title'), TITLE);
		test.done();
	}
};

var TWITTER_HANDLE = 'markdalgleish',
	getTwitterHandleHelper = new Helper(cheerio.load('<div><a id="twitter-handle" href="/profile/' + TWITTER_HANDLE + '" /></div>'));
exports['getTwitterHandle'] = {
	'returns the Twitter handle': function(test) {
		test.expect(1);
		test.equal(getTwitterHandleHelper.getTwitterHandle('#twitter-handle'), TWITTER_HANDLE);
		test.done();
	}
};

var HASHTAG = 'melbjs',
	getHashTagHelper = new Helper(cheerio.load('<div><div id="hashtag">' + HASHTAG + '</div></div>'));
exports['getHashTag'] = {
	'returns the hash tag': function(test) {
		test.expect(1);
		test.equal(getHashTagHelper.getHashtag('#hashtag'), HASHTAG);
		test.done();
	}
};