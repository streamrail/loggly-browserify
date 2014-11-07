# loggly-browserify

This module is a CommonJS Loggly module that can be used with browserify.

## example

see test, or follow this example:

```
'use strict';

var LogglyTracker = require('loggly-browserify');

function ClassWithLogger(opts) {
	var _loggly = new LogglyTracker('<your_loggly_key>');

	_self.log = function(params) {
		_loggly.push(data);
	};
}

module.exports = ClassWithLogger;
```

## license 
MIT (see [LICENSE](https://github.com/streamrail/loggly-browserify/blob/master/LICENSE) file)