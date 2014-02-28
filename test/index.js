/* globals describe, it, afterEach */
'use strict';
var Heartbeat = require('../');
var assert = require('assert');
var Counter = require('jasonkuhrt-counter');



describe('Heartbeat', function(){
  var inter, count = Counter(0);
  afterEach(count.reset);
  afterEach(clearInterval.bind(null, inter));

  it('invokes callback after elapsed ms', function(done){
    Heartbeat(returnsToAsync(done), 10);
  });

  it('returns a function that when executed delays callback execution', function(done){
    var thump = Heartbeat(count.inc, 10);
    inter = setInterval(thump, 5);
    setTimeout(assertNoCount(count, done), 20);
  });

  it('callback is passed a heartbeat history', function(done){
    var ms = 5;
    var succTimes = 10;

    var thump = Heartbeat(function(history){
      assert.deepEqual(history, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0]);
      done();
    }, ms);

    setTimeout(function(){
      thump(); count.incBy(2);
      inter = setInterval(function(){
        times(count.value(), thump);
        if (count.value() === succTimes) clearInterval(inter);
        count.inc();
      }, ms);
    }, ms/2);
  });

  it('heartbeat history can be set to 0 to disable', function(done){
    var thump = Heartbeat(function(history){
      assert(Array.isArray(history), 'disabled history still an error');
      assert(!history.length, 'no history');
      done();
    }, 20, 0);
    thump(); thump(); thump(); thump();
  });

  it('clearHeartbeat(thump) destroys the heartbeat', function(done){
    var thump = Heartbeat(count.inc, 10);
    setTimeout(Heartbeat.clearHeartbeat, 5, thump);
    setTimeout(assertNoCount(count, done), 15);

  });

});



// Domain Helpers

function assertNoCount(counter, done){
  return function check(){
    assert.equal(counter.value(), 0, 'counter never incremented');
    done();
  };
}

function returnsToAsync(cb){
  return function(){
    return cb.apply(null, [null].concat(Array.prototype.slice.apply(arguments)));
  };
}

function times(x, f){
  var a = [];
  var i = 0;
  while(i++ !== x) a.push(f(i));
  return a;
}