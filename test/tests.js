
var ScopedEvents = require('../')
  , expect = require('chai').expect;

describe('The event manager', function () {
  var event, called;

  beforeEach(function () {
    event = new ScopedEvents();
    event.on('one', function (evt) {
      called = evt;
    });
  });

  describe('with a child all-hitter', function () {
    var child, chcalled;

    beforeEach(function () {
      child = event.child(function (evt) {
        evt.childed = true;
      });

      child.on('one', function (evt) {
        chcalled = evt;
      });

      child.emit('one', {childed: false, name: 'good'});

    });

    it('should propagate', function () {
      expect(called.childed).to.be.true;
    });

    it("shouldn't effect sideways", function () {
      expect(chcalled.childed).to.be.false;
    });

  });

  describe('with a star', function () {
    var child, scope1, scope2;
    beforeEach(function () {
      scope1 = false;
      scope2 = false;
      child = event.child({
        'scope:*': function () {
          scope1 = true;
        },
        'scope:two': function () {
          scope2 = true;
        }
      });
    });

    it('should catch the star', function () {
      child.emit('scope:one', {});
      expect(scope1).to.be.true;
      expect(scope2).to.be.false;
    });

    it('should catch both', function () {
      child.emit('scope:two', {});
      expect(scope1).to.be.true;
      expect(scope2).to.be.true;
    });

    it("should ignore things that don't match", function () {
      child.emit('unscope:one', {});
      child.emit('wrongs:two', {});
      expect(scope1).to.be.false;
      expect(scope2).to.be.false;
    });

  });
    
});
