// Copyright 2021 Wojciech Pawlik. All rights reserved. MIT license.
// @ts-check
"use strict";
const noColor = process.env.NO_COLOR != null || process.env.FORCE_COLOR === "0";
/** @param {number} code */
const makeColor = (code) => (noColor ? "" : `\x1b[${code}m`);
exports.reset = makeColor(0);
exports.red = makeColor(31);
exports.green = makeColor(32);
exports.yellow = makeColor(33);
exports.gray = makeColor(90);
