// Based on https://github.com/denoland/deno/blob/f9d29115a0164a861c99b36a0919324920225e42/cli/dts/lib.deno.ns.d.ts#L116-L187
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

export const tests: Array<Required<TestDefinition>>;

/** Register a test which will be run when `deno test` is used on the command
  * line and the containing module looks like a test module.
  * `fn` can be async if required.
  * ```ts
  * import {assert, fail, assertEquals} from "https://deno.land/std/testing/asserts.ts";
  *
  * Deno.test({
  *   name: "example test",
  *   fn(): void {
  *     assertEquals("world", "world");
  *   },
  * });
  *
  * Deno.test({
  *   name: "example ignored test",
  *   ignore: Deno.build.os === "windows",
  *   fn(): void {
  *     // This test is ignored only on Windows machines
  *   },
  * });
  *
  * Deno.test({
  *   name: "example async test",
  *   async fn() {
  *     const decoder = new TextDecoder("utf-8");
  *     const data = await Deno.readFile("hello_world.txt");
  *     assertEquals(decoder.decode(data), "Hello world");
  *   }
  * });
  * ```
  */
export function test(t: TestDefinition): void;

/** Register a test which will be run when `deno test` is used on the command
  * line and the containing module looks like a test module.
  * `fn` can be async if required.
  *
  * ```ts
  * import {assert, fail, assertEquals} from "https://deno.land/std/testing/asserts.ts";
  *
  * Deno.test("My test description", ():void => {
  *   assertEquals("hello", "hello");
  * });
  *
  * Deno.test("My async test description", async ():Promise<void> => {
  *   const decoder = new TextDecoder("utf-8");
  *   const data = await Deno.readFile("hello_world.txt");
  *   assertEquals(decoder.decode(data), "Hello world");
  * });
  * ```
  */
export function test(name: string, fn: () => void | Promise<void>): void;

/** @internal */
export function createTestFilter(
  filter: string,
): (def: TestDefinition) => boolean;
