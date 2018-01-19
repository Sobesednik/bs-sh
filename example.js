const { resolve } = require('path')
const { createWritable, write } = require('wrote')
const build = require('.');

const path = resolve(__dirname, 'build.js');
const entry = resolve(__dirname, './project/import-default.test.js');

(async () => {
  const res = await build([entry])
  console.log(res);
  const ws = await createWritable(path)
  await write(ws, res)
})();