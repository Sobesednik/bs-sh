const { assert } = require('zoroaster/assert')
const context = require('../context')
const build = require('../../src')

const cRemoved = '/* common-shake removed: exports.testFunctionC = */ void testFunctionC;';
const bRemoved = '/* common-shake removed: exports.testFunctionB = */ void testFunctionB;';
const defaultRemoved = '/* common-shake removed: exports.default = */ void testFunctionA;';

const assertFound = (str, shaken) => {
    if (str.indexOf(shaken) === -1) {
        throw new Error(`${shaken} not found`);
    }
}
const assertNotFound = (str, shaken) => {
    const lines = str.split('\n');
    const i = lines.indexOf(shaken);
    const found =  i !== -1;
    if (found) {
        const err = new Error(`${shaken} found at line ${i}`)
        err.i = i;
        throw new Error(err);
    }
}

const buildTestSuite = {
    context,
    'import-B': {
        async 'should not shake off the function'({ files: { importB } }) {
            const res = await build([importB])
            assertNotFound(res, bRemoved);
        },
        async 'should shake off default'({ files: { importB } }) {
            const res = await build([importB])
            assertFound(res, defaultRemoved);
        },
        async 'should shake off other methods'({ files: { importB } }) {
            const res = await build([importB])
            assertFound(res, cRemoved);
        },
    },
    'import-default': {
        async 'should not shake off default'({ files: { importDefault } }) {
            const res = await build([importDefault])
            assertNotFound(res, defaultRemoved);
        },
        async 'should shake off other methods'({ files: { importDefault } }) {
            const res = await build([importDefault])
            assertFound(res, bRemoved);
        },
    }
}

module.exports = buildTestSuite
