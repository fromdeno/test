// Based on https://github.com/denoland/deno/blob/de9778949b8eb6eedaf490488ed2a11fa304d9fb/runtime/js/40_testing.js#L281-L376
// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
// @ts-check
"use strict";

const tests = (() => {
  try {
    // try to use the test definitions from @deno/shim-deno
    const importName = "@deno/shim-deno/test-internals";
    return require(importName).testDefinitions;
  } catch {
    return [];
  }
})();

function readTests() {
  return tests.splice(0);
}

function test(
  nameOrFnOrOptions,
  optionsOrFn,
  maybeFn,
) {
  let testDef;
  const defaults = {
    ignore: false,
    only: false,
    sanitizeOps: true,
    sanitizeResources: true,
    sanitizeExit: true,
    permissions: null,
  };

  if (typeof nameOrFnOrOptions === "string") {
    if (!nameOrFnOrOptions) {
      throw new TypeError("The test name can't be empty");
    }
    if (typeof optionsOrFn === "function") {
      testDef = { fn: optionsOrFn, name: nameOrFnOrOptions, ...defaults };
    } else {
      if (!maybeFn || typeof maybeFn !== "function") {
        throw new TypeError("Missing test function");
      }
      if (optionsOrFn.fn != undefined) {
        throw new TypeError(
          "Unexpected 'fn' field in options, test function is already provided as the third argument.",
        );
      }
      if (optionsOrFn.name != undefined) {
        throw new TypeError(
          "Unexpected 'name' field in options, test name is already provided as the first argument.",
        );
      }
      testDef = {
        ...defaults,
        ...optionsOrFn,
        fn: maybeFn,
        name: nameOrFnOrOptions,
      };
    }
  } else if (typeof nameOrFnOrOptions === "function") {
    if (!nameOrFnOrOptions.name) {
      throw new TypeError("The test function must have a name");
    }
    if (optionsOrFn != undefined) {
      throw new TypeError("Unexpected second argument to Deno.test()");
    }
    if (maybeFn != undefined) {
      throw new TypeError("Unexpected third argument to Deno.test()");
    }
    testDef = {
      ...defaults,
      fn: nameOrFnOrOptions,
      name: nameOrFnOrOptions.name,
    };
  } else {
    let fn;
    let name;
    if (typeof optionsOrFn === "function") {
      fn = optionsOrFn;
      if (nameOrFnOrOptions.fn != undefined) {
        throw new TypeError(
          "Unexpected 'fn' field in options, test function is already provided as the second argument.",
        );
      }
      name = nameOrFnOrOptions.name ?? fn.name;
    } else {
      if (
        !nameOrFnOrOptions.fn || typeof nameOrFnOrOptions.fn !== "function"
      ) {
        throw new TypeError(
          "Expected 'fn' field in the first argument to be a test function.",
        );
      }
      fn = nameOrFnOrOptions.fn;
      name = nameOrFnOrOptions.name ?? fn.name;
    }
    if (!name) {
      throw new TypeError("The test name can't be empty");
    }
    testDef = { ...defaults, ...nameOrFnOrOptions, fn, name };
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

module.exports = { createTestFilter, readTests, test };
