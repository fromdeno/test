#!/usr/bin/env node
// Copyright 2021 Wojciech Pawlik. All rights reserved. MIT license.
// @ts-check

/**
 * Runs `deno.ns`'s `Deno.test`s on Node.js.
 *
 * Usage:
 *
 * ```sh
 * $ npm install --save-dev @fromdeno/test
 * $ fdt <testFiles>
 * ```
 */

import { pathToFileURL, URL } from "url";
import * as colors from "./colors.js";
import { tests } from "./api.js";

const cwd = pathToFileURL(process.cwd() + "/");
const failures = [];
const stats = {
  passed: 0,
  ignored: 0,
};

for (const path of process.argv.slice(2)) {
  tests.length = 0;
  const url = new URL(path, cwd);
  // @ts-expect-error TypeScript doesn't support top-level await out of the box
  await import(url.href);
  process.stdout.write(`running ${tests.length} tests from ${url}\n`);
  for (const test of tests) {
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
${stats.ignored} ignored \
${colors.gray}(${performance.now().toFixed(0)}ms)${colors.reset}
`);
