Retries for drone

====================

Simple Retry framework with deferred.

```javascript
var Retry = require("retries");
var someFunction = function(done){
  // ... processes line get html, select databases, and so on

  if(success){
    done(null, data);
  }else{
    done(new Error("error"));
  }
};

var times = 5;       // retry times
var interval = 1000; // msecond

var retry = Retry(someFunction, times, interval);
retry().then(function(data){
  console.log(data);
  // do next
}, function(err){
  console.log(err); // err.count = 5
  process.exit(-1);
});
```

If you want to fail forcely

```javascript
var retry = Retry(someFunction, times, interval);
retry().then(function(data){
  console.log(data);
  // do next
}, function(err){
  if(someCondition){
    retry.fail(new Error('forcely stop'));
  }
  console.log(err); // err.count = 5
  process.exit(-1);
});

```

if `times` and `interval` omitted, they are set 5 and 1000 msec in default.

# LICENSE

Apache License Version 2.0
