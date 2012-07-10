/*
 * lanyrd-scraper
 * https://github.com/markdalgleish/node-lanyrd-scraper
 *
 * Copyright (c) 2012 Mark Dalgleish
 * Licensed under the MIT license.
 */

var scraper = require('scraper');

var resolveUrl = function(uri) {
	var uriPrefix;

	if (uri.indexOf('http://') !== 0) {

		uriPrefix = 'http://lanyrd.com';
		
		if (uri.indexOf('/') !== 0) {
			uriPrefix += '/';
		}

		uri = uriPrefix + uri;
	}

	return uri;
};

exports.resolveUrl = resolveUrl;

exports.scrape = function(uri, callback) {
	uri = resolveUrl(uri);

	scraper(uri, function(err, $) {
		if (err) {
			callback(err, null);
			return;
		}

		var getText = function(selector) {
			var $results = $(selector);

			if ($results.length === 0) {
				return undefined;
			} else {
				return $results.text();
			}
		};

		var getHref = function(selector) {
			var $results = $(selector),
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
		};

		var getTitle = function(selector) {
			var $results = $(selector);

			if ($results.length === 0) {
				return undefined;
			} else {
				return $results.attr('title');
			}
		};

		var data = {};

		data.title = getText('h1.summary');
		data.tagline = getText('h2.tagline');

		data.websiteUrl = getHref('div.item-meta a.website');
		data.scheduleUrl = getHref('div.item-meta a.seeschedule');

		data.location = '' + getText('p.prominent-place a.sub-place') + ', ' + getText('p.prominent-place span.place-context a');
		if (data.location === ', ') {
			data.location = undefined;
		}

		data.venue = {
			name: getText('#venues h3 a'),
			address: $.trim($('#venues p:eq(1)').text()).split(' - ')[0],
			googleMapsUrl: getHref('#venues a.map-icon')
		};

		data.startDate = getTitle('p.main-date abbr.dtstart');
		data.endDate = getTitle('p.main-date abbr.dtend');
		data.time = getText('p.main-date abbr.dtstart span.time');

		data.hashtag = getText('div.item-meta a.hashtag');
		data.twitterHandle = getText('div.item-meta a.twitter');

		data.speakers = [];
		$('#speaker-list li').each(function(){
			var speaker = {},
				$this = $(this);

			speaker.name = $this.find('span.name').text();
			speaker.twitterHandle = $this.find('span.handle').length === 1 ? $this.find('span.handle').text() : undefined;

			data.speakers.push(speaker);
		});

		data.sessions = [];
		$('li.session-detail').each(function(){
			var session = {},
				$this = $(this),
				$link = $this.find('p a');

			session.title = $this.find('h3 a').text();

			if ($link.length === 1) {
				session.speakerName = $link.text();
				session.speakerTwitterHandle = '@' + $link.attr('href').split('/profile/')[1].replace('/', '');
			} else {
				session.speakerName = $this.text().replace('presented by ', '');
			}

			data.sessions.push(session);
		});

		data.attendees = [];
		$('div.attendees-placeholder ul.user-list li').each(function(){
			var attendee = {},
				$this = $(this);

			attendee.name = $this.find('img:first').attr('alt');
			attendee.twitterHandle = '@' + $this.find('a').attr('href').split('/profile/')[1].replace('/', '');

			data.attendees.push(attendee);
		});

		callback(null, data);
	});
};