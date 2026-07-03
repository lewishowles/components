import { setupVueMounting } from "@lewishowles/testing/vue";
import { mockLocalStorage, setupConsole } from "@lewishowles/testing/vitest";

mockLocalStorage();
setupVueMounting();

export const consoleSpies = setupConsole(["error", "warn"]);
