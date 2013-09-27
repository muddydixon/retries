Retries

====================

Simple Retry framework with deferred.

```
var retry = require("retries");
var someFunction = (done)->
  // ... processes line get html, select databases, and so on

  if(success){
    done(null, data);
  else{
    done(new Error("error"));
  }
}

var retries = 5;     // times
var interval = 1000; // msecond

var myretry = retry(someFunction, retries, interval)
myretry().then(function(data){
  console.log(data);
  // do next
}, function(err){
  console.log(err); // err.count = 5
  process.exit(-1);
});

// if you want to fail forcely

var myretry = retry(someFunction, retries, interval)
myretry().then(function(data){
  console.log(data);
  // do next
}, function(err){
  if(someCondition){
    myretry.fail(new Error('forcely stop'));
  }
  console.log(err); // err.count = 5
  process.exit(-1);
});

```

if `retries` and `interval` omitted, they are set 5 and 1000 msec in default.
