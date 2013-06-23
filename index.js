
function copy(obj) {
  var nw = {};
  for (var key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    if (obj instanceof Array) {
      nw[key] = obj[key].slice();
    } else if (typeof(obj) == 'object') {
      nw[key] = copy(obj[key]);
    } else {
      nw[key] = obj[key];
    }
  }
  return nw;
}

var EventManager = function EventManager(parent) {
  this.listeners = {};
  this.parentEmit = parent || null;
};

EventManager.prototype = {

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
    return new EventManager(this.childEmitter(options));
  }

};
      
module.exports = EventManager;

