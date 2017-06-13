"use strict";

const chainable = require("chainable");

module.exports = function(str, val) {
  let self = chainable(this);
  let fn = eval("self." + str);
  return fn.value(val);
}