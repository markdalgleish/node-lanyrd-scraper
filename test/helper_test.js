var Helper = require('../lib/helper'),
	$ = require('jquery');

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

var helper = new Helper($);

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
		test.expect(1);		
		helper.setContext($);
		test.equal(helper.$, $);
		test.done();
	}
};

var TRIMMED_TEXT = 'Trimmed text',
	$getTextContent = $('<div><div id="blank-text">   </div><div id="text"> ' + TRIMMED_TEXT + ' </div></div>');
exports['getText'] = {
	'returns undefined if not found': function(test) {
		test.expect(2);
		test.equal(helper.getText($getTextContent.find('#nonexistant-text')), undefined);
		test.equal(helper.getText($getTextContent.find('#blank-text')), undefined);
		test.done();
	},
	'returns the text': function(test) {
		test.expect(1);
		test.equal(helper.getText($getTextContent.find('#text')), TRIMMED_TEXT);
		test.done();
	}
};

var DOMAIN = 'http://lanyrd.com',
	PATH = '/test/url',
	$getHrefContent = $('<div><a id="link" href="' + PATH + '">Test Link</a></div>');
exports['getHref'] = {
	'returns undefined if not found': function(test) {
		test.expect(1);
		test.equal(helper.getHref($getHrefContent.find('#nonexistant-link')), undefined);
		test.done();
	},
	'returns the full URL': function(test) {
		test.expect(1);
		test.equal(helper.getHref($getHrefContent.find('#link')), DOMAIN + PATH);
		test.done();
	}
};

var TITLE = ' Trimmed title',
	$getTitleContent = $('<div><div id="title" title="' + TITLE + '" /></div>');
exports['getTitle'] = {
	'returns undefined if not found': function(test) {
		test.expect(1);
		test.equal(helper.getTitle($getTitleContent.find('#nonexistant-title')), undefined);
		test.done();
	},
	'returns the title': function(test) {
		test.expect(1);
		test.equal(helper.getTitle($getTitleContent.find('#title')), TITLE);
		test.done();
	}
};

var TWITTER_HANDLE = '@markdalgleish',
	$getTwitterHandleContent = $('<div><a id="twitter-handle" href="/profile/' + TWITTER_HANDLE.replace('@','') + '" /></div>');
exports['getTwitterHandle'] = {
	'returns the Twitter handle': function(test) {
		test.expect(1);
		test.equal(helper.getTwitterHandle($getTwitterHandleContent.find('#twitter-handle')), TWITTER_HANDLE);
		test.done();
	}
};