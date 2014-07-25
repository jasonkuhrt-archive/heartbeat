# heartbeat [![Build Status](https://travis-ci.org/jasonkuhrt/heartbeat.png?branch=master)](https://travis-ci.org/jasonkuhrt/heartbeat) [![Code Climate](https://codeclimate.com/github/jasonkuhrt/heartbeat.png)](https://codeclimate.com/github/jasonkuhrt/heartbeat)

A good heartbeat timer


## Installation

    npm install jasonkuhrt-heartbeat

## Example
```js
var tcp = require('net');
var heartbeat = require('heartbeat');

tcp.createServer(9000, function(socket){
  /* If we the socket ever doesn't send data for ten
  consecutive seconds, consider it dead.*/
  var thump = heartbeat(onFlatline, 10000);
  socket.on('data', thump);

  function onFlatline(){
    log.warn('Socket timed out, destroying socket.');
    socket.removeListener('data', thump);
    socket.removeListener('end', onCleanDisconnect);
    socket.destroy();
  }

  /* On a clean disconnect destroy the heartbeat.*/

  socket.once('end', onCleanDisconnect);

  function onCleanDisconnect(){
    socket.removeListener('data', thump);
    heartbeat.clear(thump);
  }
});
```
```
> npm start
...
... (some time passes, your app does stuff, then maybe...)
...
Socket timed out, destroying socket.
```

## API

#### Heartbeat → .setHeartbeat


#### .setHeartbeat(onFlatline, intervalMs)
    Heartbeat h; Int i;  :: ( -> ), i -> h

  Returns a heartbeat instance. A heartbeat instance is a function. Invoke it to keep the heartbeat going. The identifier is typically `thump` (see guide).

  - `onFlatline` is invoked when/if `thump` is *not* invoked during an interval.

  - `intervalMs` sets the time between thump checks.



#### .clear(heartbeat)

    Heartbeat a :: a -> undefined

  Destroy a heartbeat instance. Analagous to `clearInterval`/`clearTimeout`.

  Only use `clearHeartbeat` if you need to abort a heartbeat before `onFlatline`.


## Guide

https://github.com/jasonkuhrt/heartbeat/blob/master/test/index.js