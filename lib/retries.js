var deferred, retry;

deferred = require('deferred');

retry = function(func, times, interval) {
  var self, _retry;
  if (times == null) {
    times = 5;
  }
  if (interval == null) {
    interval = 1000;
  }
  self = {
    d: deferred(),
    times: times,
    interval: interval,
    count: 0
  };
  _retry = function() {
    var done;
    self.d;
    done = function(err, data) {
      if (err != null) {
        if (self.count++ < self.times) {
          return setTimeout(function() {
            return func(done);
          }, interval);
        } else {
          err.retries = {
            count: self.count - 1
          };
          return self.d.reject(err);
        }
      }
      return self.d.resolve(data);
    };
    func(done);
    return self.d.promise;
  };
  _retry.fail = function(err) {
    return self.d.reject(err);
  };
  return _retry;
};

module.exports = retry;
