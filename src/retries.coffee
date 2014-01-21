deferred = require 'deferred'

retry = (func, times = 5, interval = 1000)->
  d = deferred()
  count = 0

  _retry = ()->
    done = (err, data)->
      if err?
        if count++ < times
          return setTimeout ()->
            func(done)
          , interval
        else
          err.retries =
            count: count - 1
          return d.reject(err)
      d.resolve(data)
    func(done)
    d.promise

  _retry.fail = (err)->
    d.reject(err)

  _retry

module.exports = retry
