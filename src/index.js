"use strict";

const fs = require("fs"),
      path = require("path");


const parse = function (str) {
  //Remove whitespace
  str = str.replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, "");

  // Logic borrowed from http://json.org/json2.js
  if (/^[\],:{}\s]*$/.test(str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
      .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
      .replace(/(?:^|:|,)(?:\s*\[)+/g, ":")
      .replace(/\w*\s*\:/g, ":"))) { //Handle unquoted strings here - same as json2 up till this point
    return (new Function("return " + str))();

  } else {
    throw("Cannot Parse: " + str);
  }
};

const normalize = function(arg) {
  if (typeof arg === "string") {
    if (arg.startsWith("function") || arg.indexOf("=>") > -1) {
      try {
        let fn;

        // has to be eval
        eval("fn = " + arg);
        return fn;
      } catch (e) { }
    }

    // not a function match
    // general parse
    try {
      return parse(arg);
    } catch (e) { }
  }

  return arg;
}

// the store contains all handlers
const Store = {};

const Outis = function (option) {
  let name = option._[0];
  if (!name) throw "Method name requried!";

  // load from customize path
  if (option.load) {
    try {
      Outis.load({ path: option.load });
    } catch (e) {};
  }

  // now execute it
  if (!Store.hasOwnProperty(name)) {
    throw "Method not defined!";
  }

  let result = Store[name].apply(Store, option._.slice(1).map(normalize));

  if (option.print) console.log(result);
  return result;
};

// register a new handler
Outis.register = function(name, handler) {
  Store[name] = handler;
};

// load handlers from a path / npm package / etc
Outis.load = function(option = {}) {
  let handlers = {};
  if (option.path) {
    handlers = require(option.path);
  } else if (option.npm) {
    handlers = {
      [option.npm.replace("outis-", "")]: require(option.npm)
    }
  } else if (option.lib) {
    handlers = option.lib;
  }

  // register all existing handlers
  Object.keys(handlers).forEach(name => {
    Outis.register(name, handlers[name]);
  })
};

// load default hanlders
Outis.load({ path: path.join(__dirname, "handlers") });

// load from node_modules
try {
  const modules = fs.readdirSync(path.join(__dirname, "../node_modules")).filter(name => name.startsWith("outis-"));
  modules.forEach(m => {
    Outis.load({
      npm: m
    })
  });
} catch (e) { }

// load lodash
try {
  Outis.load( {
    lib: require("lodash")
  });
} catch(e) {};


module.exports = Outis;