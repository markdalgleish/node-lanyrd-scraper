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

var parseSessions = function(page) {
	return page.map('li.session-detail', function(elem){
		var $this = page.$(elem),
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
			var $link = page.$(this);
			
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

		return session;
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