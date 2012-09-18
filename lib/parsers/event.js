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

var parseSessionSpeakers = function(page, elem) {
	var $paragraph = page.$(elem).find('p');

	$paragraph.find('strong:contains(presented by)').remove();

	var speakers = page.map($paragraph.find('a').remove(), function(link){
		return {
			name: page.$(link).text(),
			twitterHandle: page.getTwitterHandle(page.$(link))
		};
	});

	// Add non-Twitter, non-linked speaker names
	var nonTwitterSpeakers = $paragraph.text().replace(' and ', ', ').split(', ');
	nonTwitterSpeakers.forEach(function(name){
		if (name.trim() !== '') {
			speakers.push({
				name: name.trim()
			});
		}
	});

	return speakers;
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
		speakers: page.map('#speaker-list li', function(elem){
			return {
				name: $(elem).find('span.name').text(),
				twitterHandle: page.getTwitterHandle($(elem).find('span.handle'))
			};
		}),
		attendees: page.map('.attendees-placeholder li', function(elem){
			return {
				name: $(elem).find('img:first').attr('alt'),
				twitterHandle: page.getTwitterHandle($(elem).find('a'))
			};
		}),
		trackers: page.map('.trackers-placeholder li', function(elem){
			return {
				name: $(elem).find('img:first').attr('alt'),
				twitterHandle: page.getTwitterHandle($(elem).find('a'))
			};
		})
	});
};

module.exports = parse;