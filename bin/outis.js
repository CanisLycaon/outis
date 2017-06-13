#!/usr/bin/env node

const outis = require("../src/index");

// parse the args
const argv = require('minimist')(process.argv.slice(2));

outis(argv);