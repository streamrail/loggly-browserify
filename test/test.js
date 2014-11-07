var LogglyTracker = require('../index.js');

var tracker = new LogglyTracker('<your_loggly_key>');

window.pushLog = function() {
	tracker.push({
		test: document.getElementById('log-json').value
	});
}