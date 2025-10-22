import { w as writable } from "../../chunks/index.js";
import { d as db } from "../../chunks/database.js";
const dataApi = writable(db);
function initDataApi() {
  dataApi.set(db);
}
const load = () => {
  if (typeof window !== "undefined") initDataApi();
  return {};
};
export {
  load
};
