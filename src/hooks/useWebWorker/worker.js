onmessage = async function (event) {
  const funcStr = event.data.func;
  const arg = event.data.arg;
  
  const func = new Function( 'return ' + funcStr)();
  const ret = await func(arg);

  self.postMessage(ret);
  };