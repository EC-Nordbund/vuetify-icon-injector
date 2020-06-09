const mdi = require("@mdi/js");
const camelToKebabCase = require("camel-to-kebab");
const mdiIcons = {};

Object.keys(mdi)
  .filter((e) => typeof mdi[e] === "string")
  // Sort keys to avoid false replacements
  .sort((a, b) => {
    return b.length - a.length;
  })
  .forEach((key) => {
    mdiIcons[camelToKebabCase(key)] = mdi[key];
  });

const ts = `import { Icons } from '.';
export const mdi: Icons = ${JSON.stringify(mdiIcons, null, 2)}`;

require("fs").writeFileSync("./src/mdi.ts", ts);
