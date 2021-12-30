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
/**
 * Register a test which will be run when `deno test` is used on the command
 * line and the containing module looks like a test module.
 * `fn` can be async if required.
 *
 * ```ts
 * import {assert, fail, assertEquals} from "https://deno.land/std/testing/asserts.ts";
 *
 * Deno.test("My test description", (): void => {
 *   assertEquals("hello", "hello");
 * });
 *
 * Deno.test("My async test description", async (): Promise<void> => {
 *   const decoder = new TextDecoder("utf-8");
 *   const data = await Deno.readFile("hello_world.txt");
 *   assertEquals(decoder.decode(data), "Hello world");
 * });
 * ```
 */
export function test(
  name: string,
  fn: (t: TestContext) => void | Promise<void>,
): void;
/**
 * Register a test which will be run when `deno test` is used on the command
 * line and the containing module looks like a test module.
 * `fn` can be async if required. Declared function must have a name.
 *
 * ```ts
 * import {assert, fail, assertEquals} from "https://deno.land/std/testing/asserts.ts";
 *
 * Deno.test(function myTestName(): void {
 *   assertEquals("hello", "hello");
 * });
 *
 * Deno.test(async function myOtherTestName(): Promise<void> {
 *   const decoder = new TextDecoder("utf-8");
 *   const data = await Deno.readFile("hello_world.txt");
 *   assertEquals(decoder.decode(data), "Hello world");
 * });
 * ```
 */
export function test(fn: (t: TestContext) => void | Promise<void>): void;
/**
 * Register a test which will be run when `deno test` is used on the command
 * line and the containing module looks like a test module.
 * `fn` can be async if required.
 *
 * ```ts
 * import {assert, fail, assertEquals} from "https://deno.land/std/testing/asserts.ts";
 *
 * Deno.test("My test description", { permissions: { read: true } }, (): void => {
 *   assertEquals("hello", "hello");
 * });
 *
 * Deno.test("My async test description", { permissions: { read: false } }, async (): Promise<void> => {
 *   const decoder = new TextDecoder("utf-8");
 *   const data = await Deno.readFile("hello_world.txt");
 *   assertEquals(decoder.decode(data), "Hello world");
 * });
 * ```
 */
export function test(
  name: string,
  options: Omit<TestDefinition, "fn" | "name">,
  fn: (t: TestContext) => void | Promise<void>,
): void;
/**
 * Register a test which will be run when `deno test` is used on the command
 * line and the containing module looks like a test module.
 * `fn` can be async if required.
 *
 * ```ts
 * import {assert, fail, assertEquals} from "https://deno.land/std/testing/asserts.ts";
 *
 * Deno.test({ name: "My test description", permissions: { read: true } }, (): void => {
 *   assertEquals("hello", "hello");
 * });
 *
 * Deno.test({ name: "My async test description", permissions: { read: false } }, async (): Promise<void> => {
 *   const decoder = new TextDecoder("utf-8");
 *   const data = await Deno.readFile("hello_world.txt");
 *   assertEquals(decoder.decode(data), "Hello world");
 * });
 * ```
 */
export function test(
  options: Omit<TestDefinition, "fn">,
  fn: (t: TestContext) => void | Promise<void>,
): void;
/**
 * Register a test which will be run when `deno test` is used on the command
 * line and the containing module looks like a test module.
 * `fn` can be async if required. Declared function must have a name.
 *
 * ```ts
 * import {assert, fail, assertEquals} from "https://deno.land/std/testing/asserts.ts";
 *
 * Deno.test({ permissions: { read: true } }, function myTestName(): void {
 *   assertEquals("hello", "hello");
 * });
 *
 * Deno.test({ permissions: { read: false } }, async function myOtherTestName(): Promise<void> {
 *   const decoder = new TextDecoder("utf-8");
 *   const data = await Deno.readFile("hello_world.txt");
 *   assertEquals(decoder.decode(data), "Hello world");
 * });
 * ```
 */
export function test(
  options: Omit<TestDefinition, "fn" | "name">,
  fn: (t: TestContext) => void | Promise<void>,
): void;

/** @internal */
export function createTestFilter(
  filter: string,
): (def: TestDefinition) => boolean;
