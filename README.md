# loggly-browserify

This module is a CommonJS Loggly module that can be used with browserify.

## example

see test, or follow this example:

```
var LogglyTracker = require('../index.js');

var tracker = new LogglyTracker('<your_loggly_key>');

tracker.push({
		test: document.getElementById('log-json').value
});
```

## license 
MIT (see [LICENSE](https://github.com/streamrail/loggly-browserify/blob/master/LICENSE) file)