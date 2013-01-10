[![Build Status](https://secure.travis-ci.org/markdalgleish/node-lanyrd-scraper.png)](http://travis-ci.org/markdalgleish/node-lanyrd-scraper)
# lanyrd-scraper

### [Lanyrd](http://lanyrd.com) event scraper for Node.js.

Why a Scraper? They don't have an API (yet).

## Setup

Install the module with: `npm install lanyrd-scraper`

## Basic Usage

The `scrape` function accepts an event or series URL and a callback.

The examples below use the shorthand URL format:

``` js
var lanyrd = require('lanyrd-scraper');

lanyrd.scrape('2012/web-directions-code', function(err, event){
  console.log(event); // Object containing event data
});

lanyrd.scrape('series/melbjs', function(err, series){
  console.log(series); // Object containing series data
});
```

## Advanced Usage

If you want more control than the basic `scrape` function, the parsing functions it uses internally are exposed to you via the `parse` object.

You can parse markup with the following functions:

``` js
var lanyrd = require('lanyrd-scraper');

lanyrd.parse.event(markup, function(err, event) {
  console.log(event); // Object containing event data
});

lanyrd.parse.series(markup, function(err, series) {
  console.log(series); // Object containing series data
});
```

Using this method, you are free to load the markup however you wish.

### Event Data

The following properties are available on the returned `event` object:

```javascript
{
  'title': String,
  'tagline': String,
  'websiteUrl': String,
  'scheduleUrl': String,
  'location': String,
  'startDate': String,
  'endDate': String,
  'time': String,
  'hashtag': String,
  'twitterHandle': String,
  'venues': [
    {
      'name': String,
      'address': String,
      'note': String,
      'googleMapsUrl': String
    }
  ],
  'speakers': [
    {
      'name': String,
      'twitterHandle': String
    }
  ],
  'sessions': [
    {
      'title': String,
      'url': String,
      'startTime': String,
      'speakers': [
        {
          'name': String,
          'twitterHandle': String
        }
      ]
    }
  ],
  'attendees': [
    {
      'name': String,
      'twitterHandle': String
    }
  ]
}
```

### Series Data

The following properties are available on the returned `series` object:

```javascript
{
  'title': String,
  'events': [
    {
      'title': String,
      'url': String,
      'date': String,
      'time': String
    }
  ]
}
```

## Websites using lanyrd-scraper

* [MelbJS](http://melbjs.com) ([Source](https://github.com/melbjs/melbjs))

If you'd like to see your site on this list, send me a pull request.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality.

Lint your code with `grunt lint` and run tests with `grunt test`

All code is linted and tested automatically once pushed using [Travis CI](http://travis-ci.org/markdalgleish/node-lanyrd-scraper).

## License
Copyright (c) 2013 Mark Dalgleish  
Licensed under the MIT license.
