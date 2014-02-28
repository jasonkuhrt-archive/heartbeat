'use strict';
var Counter = require('jasonkuhrt-counter');

function existy(x){
  return typeof x !== 'undefined' && x !== null;
}



// Heartbeat h; Int c, i, j;  :: ([c] -> *?) i, j? -> h
//
function setHeartbeat(f, ms, maxHistory){
  if (!existy(maxHistory)) maxHistory = 600;
  var history = [];
  var count = Counter(0);
  var thumper = count.inc;
  var timer = setInterval(onInterval, ms);
  function onInterval(){
    if (!_checkIn(count, history, maxHistory)) _onFlatline(timer, history, f);
  }
  thumper._timer = timer;
  return thumper;
}


// Heartbeat a :: a -> void
//
function clearHeartbeat(heartbeat){
  return clearInterval(heartbeat._timer);
}



// Domain helpers

function _checkIn(count, history, maxHistory){
  history.push(count.value());
  if (history.length > maxHistory) history.shift();
  return count.value() ? count.reset() && true : false ;
}

function _onFlatline(timer, history, f){
  clearInterval(timer);
  f(history);
}



module.exports = setHeartbeat;
module.exports.setHeartbeat = setHeartbeat;
module.exports.clearHeartbeat = clearHeartbeat;