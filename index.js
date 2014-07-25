var Counter = require('jasonkuhrt-counter')

module.exports = setHeartbeat
module.exports.setHeartbeat = setHeartbeat
module.exports.clear = clearHeartbeat



// Heartbeat h; Int c, i, j;  :: ([c] -> *?) i, j? -> h
//
function setHeartbeat(f, ms){
  var thumps = Counter(0)
  var thump = thumps.inc
  var interval = setInterval(onInterval, ms)
  function onInterval(){
    if (did_flatline(thumps)) {
      clearInterval(interval)
      f()
    }
  }
  thump._interval = interval
  return thump
}


// Heartbeat a :: a -> void
//
function clearHeartbeat(heartbeat){
  return clearInterval(heartbeat._interval)
}






// Private

function did_flatline(thumps){
  return !thumps.value() ? thumps.reset() && true : false
}