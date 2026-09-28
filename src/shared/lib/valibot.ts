import * as v from "valibot";
import "@valibot/i18n/ru";

v.setGlobalConfig({ lang: "ru" });

// todo: deal with global internalization without re-export OR change validator
export { v };
