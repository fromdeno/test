// Based on https://github.com/denoland/deno/blob/de9778949b8eb6eedaf490488ed2a11fa304d9fb/runtime/js/40_testing.js#L281-L376
// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
// @ts-check
"use strict";

const { test, testDefinitions: tests } = require("@deno/shim-deno-test");

function readTests() {
  return tests.splice(0);
}

/** @param {string} filter */
function createTestFilter(filter) {
  /** @param {{ name: string }} def */
  return (def) => {
    if (!filter) return true;
    if (filter.startsWith("/") && filter.endsWith("/")) {
      const regex = new RegExp(filter.slice(1, filter.length - 1));
      return regex.test(def.name);
    }
    return def.name.includes(filter);
  };
}

module.exports = { createTestFilter, readTests, test };
