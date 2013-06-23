
var copy = require('deep-copy');

var ScopedEvents = function ScopedEvents(parent) {
  this.listeners = {};
  this.parentEmit = parent || null;
};

ScopedEvents.prototype = {

  on: function (type, fn) {
    if (!this.listeners[type]) this.listeners[type] = [];
    this.listeners[type].push(fn);
    return this;
  },

  emit: function (type, evt) {
    if (this.parentEmit) {
      this.parentEmit(type, copy(evt));
    }
    if (this.listeners[type]) {
      this.listeners[type].forEach(function (fn) {
        fn(evt);
      });
    }
    return this;
  },

  childEmitter: function (mods) {
    var checkers = [];
    for (var key in mods) {
      if (key.indexOf('*') !== -1) {
        checkers.push([new RegExp('^' + key.replace('*', '.*?') + '$'), mods[key]]);
        delete mods[key];
      }
    }
    return function (type, evt) {
      if (mods.all) {
        mods.all(evt);
      }
      if (mods[type]) {
        mods[type](evt);
      }
      checkers.forEach(function (mod) {
        if (mod[0].test(type)) {
          mod[1](evt);
        }
      });
      return this.emit(type, evt);
    }.bind(this);
  },

  child: function (options) {
    if (typeof options === 'function') {
      options = {all: options};
    }
    return new ScopedEvents(this.childEmitter(options));
  }

};
      
module.exports = ScopedEvents;

