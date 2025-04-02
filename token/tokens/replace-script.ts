const fs = require("fs");

const tokens = fs.readFileSync("./tokens/tokens.json").toString();
console.log(tokens);
const newTokens = tokens.replace(/Neutral\./g, "Palette/Mode 1.Neutral.");
fs.writeFileSync("./tokens/tokens.json", newTokens);
