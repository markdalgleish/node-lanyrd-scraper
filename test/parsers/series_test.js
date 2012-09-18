var parse = require('../../lib/parsers/series'),
	fs = require('fs'),
	path = require('path');

var seriesData;
exports['series'] = {
	setUp: function(done) {
		if (seriesData) {
			done();
			return;
		}

		fs.readFile(path.join(__dirname, 'series/series.html'), 'utf-8', function(err, data){
			parse(data, function(err, eventData) {
				seriesData = eventData;
				done();
			});
		});
	},
	'has title': function(test) {
		test.expect(1);
		test.equal(seriesData.title, 'MelbJS');
		test.done();
	},
	'has events': function(test) {
		test.expect(3);
		test.equal(seriesData.events.length, 5);
		test.equal(seriesData.events[0].title, 'MelbJS');
		test.equal(seriesData.events[0].url, 'http://lanyrd.com/2012/melbjs-november/');
		test.done();
	}
};