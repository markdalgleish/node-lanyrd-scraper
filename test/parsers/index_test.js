'use strict';

var parsers = require('../../lib/parsers');

exports['public API'] = {
	'has "event" function': function(test) {
		test.equals(typeof parsers.event, 'function');
		test.done();
	},
	'has "series" function': function(test) {
		test.equals(typeof parsers.series, 'function');
		test.done();
	}
};