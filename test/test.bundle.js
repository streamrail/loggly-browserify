(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var LOGGLY_INPUT_PREFIX = 'http' + (('https:' === document.location.protocol ? 's' : '')) + '://',
    LOGGLY_COLLECTOR_DOMAIN = 'logs-01.loggly.com',
    LOGGLY_INPUT_SUFFIX = '.gif?',
    LOGGLY_SESSION_KEY = 'logglytrackingsession',
    LOGGLY_SESSION_KEY_LENGTH = LOGGLY_SESSION_KEY.length + 1;

function uuid() {
    // lifted from here -> http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function LogglyTracker(key) {
    setKey(this, key);
}

function setKey(tracker, key) {
    tracker.key = key;
    tracker.setSession();
    setInputUrl(tracker);
}

function setInputUrl(tracker) {
    tracker.inputUrl = LOGGLY_INPUT_PREFIX + (tracker.logglyCollectorDomain || LOGGLY_COLLECTOR_DOMAIN) + '/inputs/' + tracker.key + LOGGLY_INPUT_SUFFIX;
}

LogglyTracker.prototype = {
    setSession: function(session_id) {
        if (session_id) {
            this.session_id = session_id;
            this.setCookie(this.session_id);
        } else if (!this.session_id) {
            this.session_id = this.readCookie();
            if (!this.session_id) {
                this.session_id = uuid();
                this.setCookie(this.session_id);
            }
        }
    },
    push: function(data) {
        var type = typeof data;

        if (!data || !(type === 'object' || type === 'string')) {
            return;
        }

        var self = this;

        setTimeout(function() {
            if (type === 'string') {
                data = {
                    'text': data
                };
            } else {
                if (data.logglyCollectorDomain) {
                    self.logglyCollectorDomain = data.logglyCollectorDomain;
                    return;
                }

                if (data.logglyKey) {
                    setKey(self, data.logglyKey);
                    return;
                }

                if (data.session_id) {
                    self.setSession(data.session_id);
                    return;
                }
            }

            if (!self.key) {
                return;
            }

            self.track(data);
        }, 0);

    },
    track: function(data) {
        // inject session id
        data.sessionId = this.session_id;

        try {
            var im = new Image(),
                q = 'PLAINTEXT=' + encodeURIComponent(JSON.stringify(data));
            im.src = this.inputUrl + q;
        } catch (ex) {
            if (window && window.console && typeof window.console.log === 'function') {
                console.log("Failed to log to loggly because of this exception:\n" + ex);
                console.log("Failed log data:", data);
            }
        }
    },
    /**
     *  These cookie functions are not a global utilities.  It is for purpose of this tracker only
     */
    readCookie: function() {
        var cookie = document.cookie,
            i = cookie.indexOf(LOGGLY_SESSION_KEY);
        if (i < 0) {
            return false;
        } else {
            var end = cookie.indexOf(';', i + 1);
            end = end < 0 ? cookie.length : end;
            return cookie.slice(i + LOGGLY_SESSION_KEY_LENGTH, end);
        }
    },
    setCookie: function(value) {
        document.cookie = LOGGLY_SESSION_KEY + '=' + value;
    }
};

module.exports = LogglyTracker;
},{}],2:[function(require,module,exports){
var LogglyTracker = require('../index.js');

var tracker = new LogglyTracker('bbed58d4-37f4-4544-8096-499819ec7ba1');

window.pushLog = function() {
	tracker.push({
		test: document.getElementById('log-json').value
	});
}
},{"../index.js":1}]},{},[2]);
