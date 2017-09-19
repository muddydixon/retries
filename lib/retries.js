const DEBUG = process.env.DEBUG || false;
const wait = (func, timeout, idx)=>{
  return new Promise((resolve, reject)=>{
    setTimeout(()=>{
      try{
        return resolve(func(idx));
      }catch(err){
        return reject(err);
      }
    }, timeout);
  });
};

const Retry = (func, {times = 5, interval = 1000, exponentialBackoff = true} = {})=>{
  return new Promise((Resolve, Reject)=>{
    const tries = new Array(times - 1).join(",").split(",").map((_, idx)=>{
      return ()=>{
        return wait(func, interval * (exponentialBackoff ? Math.pow(2, idx) : 1), idx + 1);
      };
    });
    return tries.reduce((p, c)=>{
      return p.then((result)=>{
        return Resolve(result);
      }).catch((err)=>{
        return c();
      });
    }, wait(func, 0, 0)).catch((err)=>{
      return Reject(err);
    });
  });
};

module.exports = Retry;
