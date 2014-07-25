/* globals describe, it, afterEach */
var Heartbeat = require('../')
var assert = require('assert')
var Counter = require('jasonkuhrt-counter')



describe('Heartbeat', function(){
  var inter, count = Counter(0)
  afterEach(count.reset)
  afterEach(clearInterval.bind(null, inter))

  it('invokes callback after elapsed ms', function(done){
    Heartbeat(returnsToAsync(done), 10)
  })

  it('callback invoked immediately if timeout is to 0', function(done){
    Heartbeat(returnsToAsync(done), 0)
  })

  it('returns a function that when executed delays callback execution', function(done){
    var thump = Heartbeat(count.inc, 10)
    inter = setInterval(thump, 5)
    setTimeout(assertNoCount(count, done), 20)
  })

  it('.clear(thump) destroys the heartbeat', function(done){
    var thump = Heartbeat(count.inc, 10)
    setTimeout(Heartbeat.clear, 5, thump)
    setTimeout(assertNoCount(count, done), 15)
  })

  it('Calling .clear multiple times is a noop', function(done){
    var thump = Heartbeat(count.inc, 10)
    setTimeout(Heartbeat.clear, 1, thump)
    setTimeout(Heartbeat.clear, 3, thump)
    setTimeout(Heartbeat.clear, 6, thump)
    setTimeout(assertNoCount(count, done), 15)
  })

})



// Domain Helpers

function assertNoCount(counter, done){
  return function check(){
    assert.equal(counter.value(), 0, 'counter never incremented')
    done()
  }
}

function returnsToAsync(cb){
  return function(){
    return cb.apply(null, [null].concat(Array.prototype.slice.apply(arguments)))
  }
}