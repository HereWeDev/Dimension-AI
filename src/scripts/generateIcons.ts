const fs = require("fs");
const path = require("path");

const iconsDir = path.join(__dirname, "../app/icons");
const outputFile = path.join(__dirname, "../app/generated/icons.ts");

const icons: string[] = fs
  .readdirSync(iconsDir)
  .filter((file: string): boolean => file.endsWith(".svg"))
  .map((file: string): string => file.replace(".svg", ""));

const imports = icons
  .map((name) => `import ${name} from '@/app/icons/${name}.svg';`)
  .join("\n");

const iconsObject = `export const ICONS = {\n  ${icons
  .map((name) => `${name}: ${name}`)
  .join(",\n  ")}\n};`;

const content = `${imports}\n\n${iconsObject}\n`;

fs.writeFileSync(outputFile, content, "utf-8");
