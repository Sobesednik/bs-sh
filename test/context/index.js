const { resolve } = require('path')

const files = {
  importB: resolve(__dirname, '../../project/import-B.test.js'),
  importDefault: resolve(__dirname, '../../project/import-default.test.js'),
}

function Context () {
  this.files = files
}

module.exports = Context
