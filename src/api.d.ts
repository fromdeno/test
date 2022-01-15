// Based on https://github.com/denoland/node_deno_shims/blob/430ad2bfade33c532a9a078fc4e79a48831ce5fe/packages/shim-deno/lib/shim-deno.lib.d.ts#L1257-L1389
// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.

export interface TestDefinition {
  fn: () => void | Promise<void>;
  name: string;
  ignore?: boolean;
  /** If at least one test has `only` set to true, only run tests that have
   * `only` set to true and fail the test suite. */
  only?: boolean;
  /** Check that the number of async completed ops after the test is the same
   * as number of dispatched ops. Defaults to true. */
  sanitizeOps?: boolean;
  /** Ensure the test case does not "leak" resources - ie. the resource table
   * after the test has exactly the same contents as before the test. Defaults
   * to true. */
  sanitizeResources?: boolean;

  /** Ensure the test case does not prematurely cause the process to exit,
   * for example via a call to `Deno.exit`. Defaults to true. */
  sanitizeExit?: boolean;
}

export function readTests(): Array<Required<TestDefinition>>;

export { test } from "@deno/shim-deno-test";

/** @internal */
export function createTestFilter(
  filter: string,
): (def: TestDefinition) => boolean;
