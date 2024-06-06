import { assert, variableExists } from "@/utils";

onmessage = async function (event) {
  const { funcStr, arg } = event.data as { funcStr: string; arg: unknown };

  assert(variableExists(funcStr), "funcStr not provided");
  assert(variableExists(arg), "arg not provided");

  const func = new Function("return " + funcStr)();
  const ret = await func(arg);

  self.postMessage(ret);
};
