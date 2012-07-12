var Helper = require('../lib/helper');

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