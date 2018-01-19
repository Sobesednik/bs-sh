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
