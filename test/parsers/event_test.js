'use strict';

var parse = require('../../lib/parsers/event'),
	fs = require('fs'),
	path = require('path');

var multiDayEventData;
exports['multi-day event'] = {
	setUp: function(done) {
		if (multiDayEventData) {
			done();
			return;
		}

		fs.readFile(path.join(__dirname, 'event/multi-day-event.html'), 'utf-8', function(err, data){
			parse(data, function(err, eventData) {
				multiDayEventData = eventData;
				done();
			});
		});
	},
	'has title': function(test) {
		test.expect(1);
		test.equal(multiDayEventData.title, 'Web Directions Code');
		test.done();
	},
	'has tagline': function(test) {
		test.expect(1);
		test.equal(multiDayEventData.tagline, 'Melbourne, get your code on.');
		test.done();
	},
	'has website': function(test) {
		test.expect(1);
		test.equal(multiDayEventData.websiteUrl, 'http://code12melb.webdirections.org/');
		test.done();
	},
	'has schedule': function(test) {
		test.expect(1);
		test.equal(multiDayEventData.scheduleUrl, 'http://lanyrd.com/2012/web-directions-code/schedule/');
		test.done();
	},
	'has location': function(test) {
		test.expect(1);
		test.equal(multiDayEventData.location, 'Melbourne, Australia');
		test.done();
	},
	'has venue': function(test) {
		test.expect(5);
		test.equal(multiDayEventData.venues.length, 1);
		test.equal(multiDayEventData.venues[0].name, 'The RACV City Club');
		test.equal(multiDayEventData.venues[0].address, '501 Bourke St, Melbourne, 3000');
		test.equal(multiDayEventData.venues[0].note, 'Enter through the front door - you\'ll see where to go');
		test.equal(multiDayEventData.venues[0].googleMapsUrl, 'http://maps.google.com/maps?q=-37.8154734594,144.959473427+(The RACV City Club)');
		test.done();
	},
	'has start date': function(test) {
		test.expect(1);
		test.equal(multiDayEventData.startDate, 'May 23, 2012');
		test.done();
	},
	'has end date': function(test) {
		test.expect(1);
		test.equal(multiDayEventData.endDate, 'May 24, 2012');
		test.done();
	},
	'has hashtag': function(test) {
		test.expect(1);
		test.equal(multiDayEventData.hashtag, 'wdc12');
		test.done();
	},
	'has Twitter account': function(test) {
		test.expect(1);
		test.equal(multiDayEventData.twitterHandle, 'webdirections');
		test.done();
	},
	'has speakers': function(test) {
		test.expect(5);
		test.equal(multiDayEventData.speakers.length, 19);
		test.equal(multiDayEventData.speakers[15].name, 'Mark Dalgleish');
		test.equal(multiDayEventData.speakers[15].twitterHandle, 'markdalgleish');
		test.equal(multiDayEventData.speakers[11].name, 'Anette Bergo', 'supports speakers without Twitter handles');
		test.equal(multiDayEventData.speakers[11].twitterHandle, undefined, 'supports speakers without Twitter handles');
		test.done();
	},
	'has sessions': function(test) {
		test.expect(3);
		test.equal(multiDayEventData.sessions.length, 20);
		test.equal(multiDayEventData.sessions[14].title, 'JavaScript: Getting Closure');
		test.equal(multiDayEventData.sessions[14].url, 'http://lanyrd.com/2012/web-directions-code/swmwz/');
		test.done();
	},
	'session has speaker details': function(test) {
		test.expect(2);
		test.equal(multiDayEventData.sessions[14].speakers.length, 1);
		test.equal(multiDayEventData.sessions[14].speakers[0].name, 'Mark Dalgleish');
		test.done();
	},
	'session supports start time': function(test) {
		test.expect(2);
		test.equal(multiDayEventData.sessions[9].title, 'Getting Touchy Feely with the Web');
		test.equal(multiDayEventData.sessions[9].startTime, '1:20pm');
		test.done();
	},
	'session doesnt require start time': function(test) {
		test.expect(1);
		test.equal(multiDayEventData.sessions[10].startTime, undefined);
		test.done();
	},
	'session supports multiple speakers': function(test) {
		test.expect(5);
		test.equal(multiDayEventData.sessions[15].speakers.length, 2);
		test.equal(multiDayEventData.sessions[15].speakers[0].name, 'Jed Schmidt');
		test.equal(multiDayEventData.sessions[15].speakers[0].twitterHandle, 'jedschmidt');
		test.equal(multiDayEventData.sessions[15].speakers[1].name, 'Dinkumiser');
		test.equal(multiDayEventData.sessions[15].speakers[1].twitterHandle, 'dinkumiser');
		test.done();
	},
	'session supports speakers without twitter handles': function(test) {
		test.expect(3);
		test.equal(multiDayEventData.sessions[14].speakers[0].twitterHandle, 'markdalgleish');
		test.equal(multiDayEventData.sessions[18].speakers[0].name, 'Anette Bergo', 'supports speakers without Twitter handles');
		test.equal(multiDayEventData.sessions[18].speakers[0].twitterHandle, undefined, 'supports speakers without Twitter handles');
		test.done();
	},
	'session doesnt require speakers': function(test) {
		test.expect(2);
		test.equal(multiDayEventData.sessions[10].title, 'Clientside templates for reactive UI');
		test.equal(multiDayEventData.sessions[10].speakers.length, 0);
		test.done();
	},
	'has attendees': function(test) {
		test.expect(3);
		test.equal(multiDayEventData.attendees.length, 27);
		test.equal(multiDayEventData.attendees[15].name, 'Mark Dalgleish');
		test.equal(multiDayEventData.attendees[15].twitterHandle, 'markdalgleish');
		test.done();
	},
	'has trackers': function(test) {
		test.expect(3);
		test.equal(multiDayEventData.trackers.length, 25);
		test.equal(multiDayEventData.trackers[0].name, 'Paul Irish ◕‿◕');
		test.equal(multiDayEventData.trackers[0].twitterHandle, 'paul_irish');
		test.done();
	}
};