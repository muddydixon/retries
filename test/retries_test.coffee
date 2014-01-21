mocha = require 'mocha'
expect = require('chai').expect
Retry = require '../src/retries'


describe "retries", ->
  it "resolve function fires if success", (next)->
    success = (done)->
      setTimeout(()->
        done(null, "success")
      , 100)

    retry = Retry(success)
    retry().then((data)->
      expect(data).to.be.equal "success"
      next()
    , (err)->
      next(err)
    )

  it "err function fires if fail", (next)->
    fail = (done)->
      setTimeout ()->
        done new Error("fail")
      , 100

    retry = Retry(fail)
    retry().then(()->
        next(new Error("should be error"))
      , (err)->
        expect(err).to.be.an.instanceof Error
        expect(err.retries.count).to.be.equal 5
        next())

  it "err function fires if fail. try 3 times", (next)->
    fail = (done)->
      setTimeout ()->
        done new Error("fail")
      , 100

    retry = Retry(fail, 3)
    retry().then(()->
        next(new Error("should be error"))
      , (err)->
        expect(err).to.be.an.instanceof Error
        expect(err.retries.count).to.be.equal 3
        next())

  it "err function fires if fail. try 3 times and interval 1500", (next)->
    fail = (done)->
      setTimeout ()->
        done new Error("fail")
      , 100

    retry = Retry(fail, 3, 1500)
    retry().then(()->
        next(new Error("should be error"))
      , (err)->
        expect(err).to.be.an.instanceof Error
        expect(err.retries.count).to.be.equal 3
        next())

  it "force stop", (next)->
    fail = (done)->
      setTimeout ()->
        done new Error("fail")
      , 100

    retry = Retry(fail, 3, 1500)
    retry().then(()->
      next(new Error("should be error"))
    , (err)->
      expect(err).to.be.an.instanceof Error
      next())

    setTimeout ()->
      retry.fail(new Error("force stop"))
    , 2000
