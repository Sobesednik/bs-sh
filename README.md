# bs-sh

`bs-sh` is a Node.js npm package to test `browserify` + `babelify` + `common-shakeify` and `export default` statement.

## Project

We will be compiling the following project structure:

```
  ./project:
    - import-B.test.js
    - import-default.test.js
    - index.js
```

### index.js

```js
export default function testFunctionA () {
  console.log('this is a test function');
}

export function testFunctionB() {
  console.log('this is b test function');
}

export function testFunctionC() {
  console.log('this is c test function');
}
```

### import-default.test.js

```js
import testFunctionA from '.'

testFunctionA()
```

### import-B.test.js
```js
import { testFunctionB } from '.'

testFunctionB()
```

## Source

This is the source code to execute browserify:

```js
const { resolve } = require('path');
const browserify = require('browserify')

const babelRc = {
    plugins: ['transform-es2015-modules-commonjs'],
}

async function build(files) {
    const deletedModules = {}
    const b = browserify()
        .add(files)
        .plugin('common-shakeify', {
            onExportDelete(filename, exportName) {
                if (!(filename in deletedModules)) {
                    deletedModules[filename] = []
                }
                deletedModules[filename].push(exportName)
            },
        })
        .transform('babelify', babelRc)

    const code = await new Promise((resolve, reject) => {
        b.bundle((err, src) => {
            if (err) {
                return reject(err);
            }
            const s = src.toString();
            return resolve(s);
        });
    });
    return code;
}

module.exports = build
```

## Test

We create tests to run automatically.

```js
npm run test
```

```c
 test/spec
   index.js
     import-B
      ✓  should shake off default
      ✓  should shake off other methods
     import-default
      ✓  should not shake off default
      ✗  should shake off other methods
      | Error: /* common-shake removed: exports.testFunctionB = */ void testFunctionB; not found
      |     at assertFound (/Users/zavr/bs-sh/test/spec/index.js:11:15)
      |     at should shake off other methods (/Users/zavr/bs-sh/test/spec/index.js:43:13)
```

## build.js

The actual output can be found in the `build.js` file, and it has the following
lines:

```js
18| exports.default = testFunctionA;
19| exports.testFunctionB = testFunctionB;
20| exports.testFunctionC = testFunctionC;
```

which we don't expect when importing only the default export.

---

(c) [sobes][1] 2018

[1]: https://sobes.io
