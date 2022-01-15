#!/usr/bin/env node
// Copyright 2021 Wojciech Pawlik. All rights reserved. MIT license.
// @ts-check

/**
 * Runs `@deno/shim-deno-test`'s tests on Node.js.
 *
 * Usage:
 *
 * ```sh
 * $ npm install --save-dev @fromdeno/test
 * $ fdt <testFiles>
 * ```
 */

import mri from "mri";
import { pathToFileURL, URL } from "url";
import * as colors from "./colors.js";
import { help, version } from "./help.js";
import { testDefinitions } from "@deno/shim-deno-test";

function readTests() {
  return testDefinitions.splice(0);
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

const options = mri(process.argv.slice(2), {
  alias: {
    help: "h",
    version: ["v", "V"],
  },
  default: {
    "fail-fast": Infinity,
    filter: "",
  },
  unknown(optionName) {
    process.stderr.write(`fdt: ${optionName}: invalid option\n`);
    return process.exit(2);
  },
});

if (options.help) {
  // @ts-expect-error TypeScript doesn't support top-level await out of the box
  process.stdout.write(await help());
  process.exit(0);
}

if (options.version) {
  process.stdout.write(`fdt v${version()}\n`);
  process.exit(0);
}

if (options["fail-fast"] !== true && typeof options["fail-fast"] !== "number") {
  process.stderr.write(
    `fdt: --fail-fast: expected a number, got ${
      JSON.stringify(options["fail-fast"])
    }\n`,
  );
  process.exit(2);
}

const filter = createTestFilter(options.filter);
const cwd = pathToFileURL(process.cwd() + "/");
const failures = [];
const stats = {
  passed: 0,
  ignored: 0,
  filteredOut: 0,
};

testing: {
  for (const path of options._) {
    const url = new URL(path, cwd);
    // @ts-expect-error TypeScript doesn't support top-level await out of the box
    await import(url.href);
    const tests = readTests();
    const filteredTests = tests.filter(filter);
    stats.filteredOut += tests.length - filteredTests.length;
    process.stdout.write(`running ${filteredTests.length} tests from ${url}\n`);
    for (const test of filteredTests) {
      process.stdout.write(`test ${test.name}${colors.reset} ...`);
      const start = Date.now();
      try {
        if (test.ignore === true) {
          process.stdout.write(`${colors.yellow} ignored`);
          stats.ignored++;
          continue;
        }
        // @ts-expect-error TypeScript doesn't support top-level await out of the box
        await test.fn();
        process.stdout.write(`${colors.green} ok`);
        stats.passed++;
      } catch (error) {
        process.stdout.write(`${colors.red} FAILED`);
        failures.push({ test, error });
      } finally {
        const finish = Date.now();
        process.stdout.write(
          `${colors.gray} (${finish - start}ms)${colors.reset}\n`,
        );
      }
      if (failures.length >= options["fail-fast"]) break testing;
    }
  }
}

if (failures.length) {
  process.stdout.write(`\nfailures:\n`);
  for (const { test, error } of failures) {
    process.stdout.write(`\n${test.name}\n${error.stack}\n`);
  }
  process.stdout.write(`\ntest result:${colors.red} FAILED${colors.reset}. `);
  process.exitCode = 1;
} else {
  process.stdout.write(`\ntest result:${colors.green} ok${colors.reset}. `);
}

process.stdout.write(`\
${stats.passed} passed; \
${failures.length} failed; \
${stats.ignored} ignored; \
${stats.filteredOut} filtered out \
${colors.gray}(${performance.now().toFixed(0)}ms)${colors.reset}
`);

if (options._.length === 0) {
  process.stderr.write("fdt: no test files specified. Do you need --help?\n");
}
