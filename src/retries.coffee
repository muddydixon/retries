deferred = require 'deferred'

retry = (func, retries = 5, interval = 1000)->
  d = deferred()
  _retry = ()->
    d.count = 0
    done = (err, data)->
      if err?
        if d.count++ < retries
          return setTimeout ()->
            func(done)
          , interval
        else
          err.retries =
            count: d.count - 1
          return d.reject(err)
      d.resolve(data)
    func(done)
    d.promise

  _retry.fail = (err)->
    d.reject(err)

  _retry

module.exports = retry
