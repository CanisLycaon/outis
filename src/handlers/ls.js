"use strict";
const fs = require("fs");
module.exports = function(...paths) {
  paths.forEach(path => {
    console.log("===========", path, "============");
    console.log(fs.readdirSync(path).join("\n"));
  });
}