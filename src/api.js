// Based on https://github.com/denoland/deno/blob/f9d29115a0164a861c99b36a0919324920225e42/runtime/js/40_testing.js#L133-L207
// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
// @ts-check
"use strict";

const { fail } = require("assert/strict");
const { exit } = process;
const tests = [];

function readTests() {
  return tests.splice(0);
}

function noExit(exitCode = 0) {
  return fail(`Test case attempted to exit with exit code: ${exitCode}`);
}

// Wrap test function in additional assertion that makes sure
// that the test case does not accidentally exit prematurely.
function assertExit(fn) {
  return async function exitSanitizer() {
    process.exit = noExit;
    try {
      await fn();
    } finally {
      process.exit = exit;
    }
  };
}

// Main test function provided by Deno, as you can see it merely
// creates a new object with "name" and "fn" fields.
function test(t, fn) {
  let testDef;
  const defaults = {
    ignore: false,
    only: false,
    sanitizeOps: true,
    sanitizeResources: true,
    sanitizeExit: true,
    permissions: null,
  };

  if (typeof t === "string") {
    if (typeof fn !== "function") {
      throw new TypeError("Missing test function");
    }
    if (!t) {
      throw new TypeError("The test name can't be empty");
    }
    testDef = { fn: fn, name: t, ...defaults };
  } else {
    if (!t.fn) {
      throw new TypeError("Missing test function");
    }
    if (!t.name) {
      throw new TypeError("The test name can't be empty");
    }
    testDef = { ...defaults, ...t };
  }

  if (testDef.sanitizeExit) {
    testDef.fn = assertExit(testDef.fn);
  }

  tests.push(testDef);
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

const Deno = { test };

module.exports = { createTestFilter, Deno, readTests, test };
