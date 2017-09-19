const Retry = require("../lib/retries");
const assert = require("assert");

describe("retries", ()=>{
  it("should retry 5 times", (next)=>{
    let cnt = 0;
    const exceptionFunc = (idx)=>{
      if(idx >= 5) return next(new Error("should stop 5 times (default)"));
      cnt = idx;
      throw new Error("ok");
    };
    Retry(exceptionFunc, {interval: 100}).then(()=>{
      next(new Error("should be exception"));
    }).catch(()=>{
      assert(cnt === 5 - 1);
      next();
    });
  });
  it("should retry 3 times", (next)=>{
    let cnt = 0;
    const exceptionFunc = (idx)=>{
      if(idx >= 3) return next(new Error("should stop 3 times"));
      cnt = idx;
      throw new Error("ok");
    };
    Retry(exceptionFunc, {times: 3, interval: 100}).then(()=>{
      next(new Error("should be exception"));
    }).catch(()=>{
      assert(cnt === 3 - 1);
      next();
    });
  });
  it("retry interval should be exponential ", (next)=>{
    let prev = new Date();
    let curr = new Date();
    const exceptionFunc = (idx)=>{
      [prev, curr] = [curr, new Date()];
      throw new Error("ok");
    };
    Retry(exceptionFunc, {interval: 100}).then(()=>{
      next(new Error("should be exception"));
    }).catch(()=>{
      assert(750 < (curr - prev) && (curr - prev) < 850);
      next();
    });
  });
  it("retry interval should be constant ", (next)=>{
    let prev = new Date();
    let curr = new Date();
    const exceptionFunc = (idx)=>{
      [prev, curr] = [curr, new Date()];
      throw new Error("ok");
    };
    Retry(exceptionFunc, {interval: 100, exponentialBackoff: false}).then(()=>{
      next(new Error("should be exception"));
    }).catch(()=>{
      assert(90 < (curr - prev) && (curr - prev) < 150);
      next();
    });
  });
  it("should return value and not retry if success ", (next)=>{
    let cnt = 0;
    const successFunc = (idx)=>{
      cnt = idx;
      return "success";
    };
    Retry(successFunc, {interval: 100, exponentialBackoff: false}).then(()=>{
      assert(cnt === 0);
      next();
    }).catch(()=>{
      next(new Error("should not retry"));
    });
  });
  it("should return value and not retry if Promise ", (next)=>{
    let cnt = 0;
    const successFuncPromise = (idx)=>{
      cnt = idx;
      return Promise.resolve("success");
    };
    Retry(successFuncPromise, {interval: 100, exponentialBackoff: false}).then(()=>{
      assert(cnt === 0);
      next();
    }).catch(()=>{
      next(new Error("should not retry"));
    });
  });
  it("should retry if Promise ", (next)=>{
    let cnt = 0;
    const exceptionFuncPromise = (idx)=>{
      cnt = idx;
      return Promise.reject("failuer");
    };
    Retry(exceptionFuncPromise, {interval: 100, exponentialBackoff: false}).then(()=>{
      next(new Error("should be exception"));
    }).catch(()=>{
      assert(cnt === 5 - 1);
      next();
    });
  });
});
