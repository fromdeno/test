# `@fromdeno/test`

Minimal test runner, compatible with `Deno.test()`.

[![cli](https://badgen.net/badge/icon/terminal?icon=terminal&label&labelColor=blue)](https://github.com/fromdeno/test/blob/main/src/cli_help.txt)
[![api](https://img.shields.io/static/v1?label&message=api&color=08C&logo=Node.js&logoColor=white)](https://github.com/fromdeno/test/blob/main/src/api.d.ts)
[![install size](https://packagephobia.com/badge?p=@fromdeno/test)](https://packagephobia.com/result?p=@fromdeno/test)

```js
// @filename: test/example_test.js
const assert = require("assert/strict");
const { test } = require("@fromdeno/test");

test("example", () => {
  assert.equal(2 + 2, 4);
});
```

```sh
$ npm install --save-dev @fromdeno/test
$ fdt test/example_test.js
```
