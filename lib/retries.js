var deferred, retry;

deferred = require('deferred');

retry = function(func, retries, interval) {
  var d, _retry;
  if (retries == null) {
    retries = 5;
  }
  if (interval == null) {
    interval = 1000;
  }
  d = deferred();
  _retry = function() {
    var done;
    d.count = 0;
    done = function(err, data) {
      if (err != null) {
        if (d.count++ < retries) {
          return setTimeout(function() {
            return func(done);
          }, interval);
        } else {
          err.retries = {
            count: d.count - 1
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
