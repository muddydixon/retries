Retries [![Build Status](https://travis-ci.org/muddydixon/retries.svg?branch=master)](https://travis-ci.org/muddydixon/retries)
-----

Simple Retry framework with deferred.

```javascript
const Retry = require("retries");

Retry(func: Function|Promise, options: Object).then((result)=>{
  console.log(result);
}).catch((err)=>{
  console.log("err", err);
});
```

* `options`

|Attr              |Type  |Default|
|------------------|------|------:|
|times             |Int   |5      |
|interval          |Number|1000   |
|exponentialBackoff|Bool  |true   |
