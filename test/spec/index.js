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
    if (str.indexOf(shaken) !== -1) {
        throw new Error(`${shaken} found`);
    }
}

const buildTestSuite = {
    context,
    'should be a function'() {
        assert.equal(typeof build, 'function')
    },
    async 'should shake off default'({ files: { importB } }) {
        const res = await build([importB])
        assertFound(res, defaultRemoved);
    },
    async 'should shake off other methods'({ files: { importB } }) {
        const res = await build([importB])
        assertFound(res, cRemoved);
    },
    default: {
        async 'should not shake off default'({ files: { importDefault } }) {
            const res = await build([importDefault])
            assertNotFound(res, defaultRemoved);
        },
        async 'should not shake off other methods'({ files: { importDefault } }) {
            const res = await build([importDefault])
            assertFound(res, bRemoved);
        },
    }
}

module.exports = buildTestSuite
