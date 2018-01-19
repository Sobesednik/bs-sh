const assert = require('assert')
const context = require('../context/')
const bsSh = require('../../src/')

const bsShTestSuite = {
    context,
    'should be a function': () => {
        assert.equal(typeof bsSh, 'function')
    },
    'should call package without error': () => {
        assert.doesNotThrow(() => {
            bsSh()
        })
    },
}

module.exports = bsShTestSuite
