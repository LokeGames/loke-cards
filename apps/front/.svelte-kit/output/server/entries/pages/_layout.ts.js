import { w as writable } from "../../chunks/index.js";
import { w as wrap } from "../../chunks/comlink.js";
const dataApi = writable(null);
function initDataApi() {
  try {
    const worker = new SharedWorker(new URL("@workers-data/worker.ts", import.meta.url), { type: "module" });
    worker.port.start();
    const api = wrap(worker.port);
    dataApi.set(api);
  } catch (e) {
    dataApi.set(null);
  }
}
const load = () => {
  if (typeof window !== "undefined") initDataApi();
  return {};
};
export {
  load
};
