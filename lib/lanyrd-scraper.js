/*
 * lanyrd-scraper
 * https://github.com/markdalgleish/node-lanyrd-scraper
 *
 * Copyright (c) 2012 Mark Dalgleish
 * Licensed under the MIT license.
 */

var request = require('request'),
	cheerio = require('cheerio'),
	resolve = require('./urlresolver').resolveUrl,
	Page = require('./page');

var parseEvent = function(markup, callback) {
	var $ = cheerio.load(markup),
		page = new Page($);

	if ($('h1').text().trim() === '404: Whoops!') {
		callback(new Error('Event not found'), null);
		return;
	}

	if ($('h1.summary').length === 0) {
		callback(new Error('Invalid page format'), null);
		return;
	}

	var data = {};

	data.title = page.getText('h1.summary');
	data.tagline = page.getText('h2.tagline');

	data.websiteUrl = page.getHref('.item-meta a.website');
	data.scheduleUrl = page.getHref('.item-meta a.seeschedule');

	data.location = '' + page.getText('.prominent-place .sub-place') + ', ' + page.getText('.prominent-place .place-context a');
	if (data.location === ', ') {
		data.location = undefined;
	}

	// Parse the address and notes
	var addressValues = $('#venues p').eq(1).text().split('- ');
	var address = addressValues[0].trim();
	addressValues.shift();
	var note = addressValues.length > 0 ? addressValues.join('- ').trim() : undefined;

	data.venues = [];

	data.venues.push({
		name: page.getText('#venues h3 a'),
		address: address,
		note: note,
		googleMapsUrl: page.getHref('#venues a.map-icon')
	});

	data.startDate = page.getTitle('.main-date .dtstart');
	data.endDate = page.getTitle('.main-date .dtend');
	data.time = page.getText('.main-date abbr.dtstart .time');

	data.hashtag = page.getHashtag('.item-meta a.hashtag');
	data.twitterHandle = page.getTwitterHandle('.item-meta a.twitter');

	data.speakers = [];
	$('#speaker-list li').each(function(){
		var speaker = {},
			$this = $(this);

		speaker.name = $this.find('span.name').text();
		speaker.twitterHandle = page.getTwitterHandle($this.find('span.handle'));

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
			url: page.getHref($titleLink),
			startTime: page.getText($time),
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
				twitterHandle: page.getTwitterHandle($link)
			});
		});

		// Convert remaining names into an array
		$paragraph.text().replace(' and ', ', ').split(', ').forEach(function(speakerName){
			speakerName = speakerName.trim();

			if (speakerName !== '') {
				session.speakers.push({
					name: speakerName
				});
			}
		});

		data.sessions.push(session);
	});

	data.attendees = [];
	$('.attendees-placeholder li').each(function(){
		var attendee = {},
			$this = $(this);

		attendee.name = $this.find('img:first').attr('alt');
		attendee.twitterHandle = page.getTwitterHandle($this.find('a'));

		data.attendees.push(attendee);
	});

	data.trackers = [];
	$('.trackers-placeholder li').each(function(){
		var tracker = {},
			$this = $(this);

		tracker.name = $this.find('img:first').attr('alt');
		tracker.twitterHandle = page.getTwitterHandle($this.find('a'));

		data.trackers.push(tracker);
	});

	callback(null, data);
};

var scrape = function(url, callback) {
	url = resolve(url);

	request(url, function(err, resp, body) {
		if (err) {
			callback(err, null);
			return;
		}

		parseEvent(body, callback);
	});
};

module.exports = {
	scrape: scrape,
	parseEvent: parseEvent
};