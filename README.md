# heartbeat

A good heartbeat timer


## Installation

    npm install set-heartbeat

## Example
```js
var tcp = require('net');
var heartbeat = require('heartbeat'),
    clearHeartbeat = heartbeat.clearHeartbeat;

tcp.createServer(9000, function(socket){
  /* If we the socket ever doesn't send data for ten
  consecutive seconds, consider it dead.*/
  var thump = heartbeat(onFlatline, 10000, 300);
  socket.on('data', thump);

  function onFlatline(history){
    log.warn('Socket timed out. Hearbeat history prior to death was: %j', history);
    socket.removeListener('data', thump);
    socket.removeListener('end', onCleanDisconnect);
    socket.destroy();
  }

  /* On a clean disconnect destroy the heartbeat.*/

  socket.once('end', onCleanDisconnect);

  function onCleanDisconnect(){
    socket.removeListener('data', thump);
    clearHeartbeat(thump);
  }
});
```
```
> npm start
...
... (some time passes, your app does stuff, then maybe...)
...
Socket timed out. Hearbeat history prior to death was: [..., 30, 28, 34, 30, 56, 157, 124, 0]
```

## API

#### Heartbeat(onFlatline, intervalMs, maxHistory = 600)

    Heartbeat h; Int c, i, j;  :: ([c] -> *?) i, j? -> h

  Returns a heartbeat instance. A heartbeat instance is a function. Invoke it to keep the heartbeat going. The identifier is typically `thump` (see guide).

  - `onFlatline` is invoked when/if `thump` is *not* invoked during an interval.

  A heartbeat history is passed to `onFlatline` (see `maxHistory`).

  - `intervalMs` sets the time between thump checks.

  - `maxHistory` sets the size of heartbeat history to keep.

  On every interval the number of times `thump` was invoked is pushed to this history.

  Set to `0` to disable.


#### .setHeartbeat → Heartbeat

#### .clearHeartbeat(heartbeat)

    Heartbeat a :: a -> undefined

  Destroy a heartbeat instance. Analagous to `clearInterval`/`clearTimeout`.

  Only use `clearHeartbeat` if you need to abort a heartbeat before `onFlatline`.


## Guide

https://github.com/jasonkuhrt/heartbeat/blob/master/test/index.js