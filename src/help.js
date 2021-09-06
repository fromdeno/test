// Copyright 2021 Wojciech Pawlik. All rights reserved. MIT license.
// @ts-check
"use strict";
const { readFile } = require("fs/promises");
exports.help = async () => await readFile(__dirname + "/cli_help.txt");
exports.version = () => require("../package.json").version;
