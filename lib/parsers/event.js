'use strict';

var cheerio = require('cheerio'),
	Page = require('../page');

var parseLocation = function(page) {
	var location = '' + page.getText('.prominent-place .sub-place') + ', ' + page.getText('.prominent-place .place-context a');
	
	if (location === ', ') {
		location = undefined;
	}

	return location;
};

var parseVenues = function(page) {
	var addressValues = page.$('#venues p').eq(1).text().split('- ');
	var address = addressValues[0].trim();
	addressValues.shift();
	var note = addressValues.length > 0 ? addressValues.join('- ').trim() : undefined;

	return [{
		name: page.getText('#venues h3 a'),
		address: address,
		note: note,
		googleMapsUrl: page.getHref('#venues a.map-icon')
	}];
};

var parseNamesWithTwitterHandles = function(page, elem) {
	return page.map(page.$(elem).find('a'), function(link){
		return {
			name: page.$(link).text(),
			twitterHandle: page.getTwitterHandle(page.$(link))
		};
	});
};

var isNotEmptyString = function(string) {
	return typeof string === 'string' && string.trim() !== '';
};

var parseNamesWithoutTwitterHandles = function(page, elem) {
	var separator = ', ',
		$container = page.$(elem).clone();

	$container.find('strong:contains(presented by), a').remove();

	var names = $container.text().replace(' and ', separator).split(separator).filter(isNotEmptyString);

	return names.map(function(name){
		return {
			name: name.trim()
		};
	});
};

var parseSessionSpeakers = function(page, elem) {
	var $paragraph = page.$(elem).find('p'),
		twitterSpeakers = parseNamesWithTwitterHandles(page, $paragraph),
		nonTwitterSpeakers = parseNamesWithoutTwitterHandles(page, $paragraph);

	return twitterSpeakers.concat(nonTwitterSpeakers);
};

var parseSessions = function(page) {
	return page.map('li.session-detail', function(elem){
		var $elem = page.$(elem),
			$titleLink = $elem.find('h3 a');

		return {
			title: $titleLink.text(),
			url: page.getHref($titleLink),
			startTime: page.getText($elem.find('.time')),
			speakers: parseSessionSpeakers(page, elem)
		};
	});
};

var parseSpeakers = function(page) {
	return page.map('#speaker-list li', function(elem){
		var $elem = page.$(elem);

		return {
			name: $elem.find('span.name').text(),
			twitterHandle: page.getTwitterHandle($elem.find('span.handle'))
		};
	});
};

var parseAttendees = function(page) {
	return page.map('.attendees-placeholder li', function(elem){
		var $elem = page.$(elem);

		return {
			name: $elem.find('img').attr('alt'),
			twitterHandle: page.getTwitterHandle($elem.find('a'))
		};
	});
};

var parseTrackers = function(page) {
	return page.map('.trackers-placeholder li', function(elem){
		var $elem = page.$(elem);

		return {
			name: $elem.find('img').attr('alt'),
			twitterHandle: page.getTwitterHandle($elem.find('a'))
		};
	});
};

var parse = function(markup, callback) {
	var $ = cheerio.load(markup),
		page = new Page($);

	callback(null, {
		title: page.getText('h1.summary'),
		tagline: page.getText('h2.tagline'),
		websiteUrl: page.getHref('.item-meta a.website'),
		scheduleUrl: page.getHref('.item-meta a.seeschedule'),
		location: parseLocation(page),
		venues: parseVenues(page),
		startDate: page.getTitle('.main-date .dtstart'),
		endDate: page.getTitle('.main-date .dtend'),
		time: page.getText('.main-date abbr.dtstart .time'),
		hashtag: page.getHashtag('.item-meta a.hashtag'),
		twitterHandle: page.getTwitterHandle('.item-meta a.twitter'),
		sessions: parseSessions(page),
		speakers: parseSpeakers(page),
		attendees: parseAttendees(page),
		trackers: parseTrackers(page)
	});
};

module.exports = parse;