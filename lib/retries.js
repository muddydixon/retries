var deferred, retry;

deferred = require('deferred');

retry = function(func, times, interval) {
  var count, d, _retry;
  if (times == null) {
    times = 5;
  }
  if (interval == null) {
    interval = 1000;
  }
  d = deferred();
  count = 0;
  _retry = function() {
    var done;
    done = function(err, data) {
      if (err != null) {
        if (count++ < times) {
          return setTimeout(function() {
            return func(done);
          }, interval);
        } else {
          err.retries = {
            count: count - 1
          };
          return d.reject(err);
        }
      }
      return d.resolve(data);
    };
    func(done);
    return d.promise;
  };
  _retry.fail = function(err) {
    return d.reject(err);
  };
  return _retry;
};

module.exports = retry;
