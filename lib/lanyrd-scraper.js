/*
 * lanyrd-scraper
 * https://github.com/markdalgleish/node-lanyrd-scraper
 *
 * Copyright (c) 2012 Mark Dalgleish
 * Licensed under the MIT license.
 */

var scraper = require('scraper'),
	Helper = require('./helper');

exports.scrape = function(url, callback) {
	var helper = new Helper();

	url = helper.resolveUrl(url);

	scraper(url, function(err, $) {
		if (err) {
			callback(err, null);
			return;
		}

		helper.setContext($);

		var data = {};

		data.title = helper.getText('h1.summary');
		data.tagline = helper.getText('h2.tagline');

		data.websiteUrl = helper.getHref('div.item-meta a.website');
		data.scheduleUrl = helper.getHref('div.item-meta a.seeschedule');

		data.location = '' + helper.getText('p.prominent-place a.sub-place') + ', ' + helper.getText('p.prominent-place span.place-context a');
		if (data.location === ', ') {
			data.location = undefined;
		}

		// Parse the address and notes
		var addressValues = $('#venues p:eq(1)').text().split('- ');
		var address = $.trim(addressValues[0]);
		addressValues.shift();
		var note = addressValues.length > 0 ? $.trim(addressValues.join('- ')) : undefined;

		data.venues = [];

		data.venues.push({
			name: helper.getText('#venues h3 a'),
			address: address,
			note: note,
			googleMapsUrl: helper.getHref('#venues a.map-icon')
		});

		data.startDate = helper.getTitle('p.main-date abbr.dtstart');
		data.endDate = helper.getTitle('p.main-date abbr.dtend');
		data.time = helper.getText('p.main-date abbr.dtstart span.time');

		data.hashtag = helper.getText('div.item-meta a.hashtag');
		data.twitterHandle = helper.getText('div.item-meta a.twitter');

		data.speakers = [];
		$('#speaker-list li').each(function(){
			var speaker = {},
				$this = $(this);

			speaker.name = $this.find('span.name').text();
			speaker.twitterHandle = helper.getText($this.find('span.handle'));

			data.speakers.push(speaker);
		});

		data.sessions = [];
		$('li.session-detail').each(function(){
			var $this = $(this),
				$titleLink = $this.find('h3 a'),
				$link = $this.find('p a'),
				$time = $this.find('.time');

			var session = {
				title: $titleLink.text(),
				url: helper.getHref($titleLink),
				startTime: helper.getText($time),
				speakers: []
			};

			var $paragraph = $this.find('p');

			// Remove 'presented by'
			$paragraph.find('strong').remove();

			// Loop through all speakers with accounts, remove tags from DOM
			$paragraph.find('a').remove().each(function(){
				var $link = $(this);
				
				session.speakers.push({
					name: $link.text(),
					twitterHandle: helper.getTwitterHandle($link)
				});
			});

			// Convert remaining names into an array
			$paragraph.text().replace(' and ', ', ').split(', ').forEach(function(speakerName){
				speakerName = $.trim(speakerName);

				if (speakerName !== '') {
					session.speakers.push({
						name: speakerName
					});
				}
			});

			data.sessions.push(session);
		});

		data.attendees = [];
		$('div.attendees-placeholder ul.user-list li').each(function(){
			var attendee = {},
				$this = $(this);

			attendee.name = $this.find('img:first').attr('alt');
			attendee.twitterHandle = helper.getTwitterHandle($this.find('a'));

			data.attendees.push(attendee);
		});

		data.trackers = [];
		$('div.trackers-placeholder ul.user-list li').each(function(){
			var tracker = {},
				$this = $(this);

			tracker.name = $this.find('img:first').attr('alt');
			tracker.twitterHandle = helper.getTwitterHandle($this.find('a'));

			data.trackers.push(tracker);
		});

		callback(null, data);
	});
};