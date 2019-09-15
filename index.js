const { createFilter } = require('rollup-pluginutils');
const { processString } = require('uglifycss');
const path = require('path');

const importDeclaration = 'import { css } from \'lit-element\';';

/**
 * Imports css as lit-element `css`-tagged constructible style sheets.
 * @param  {Object} [options={}]
 * @return {Object}
 */
module.exports = function css({ include = /\.css$/i, exclude, uglify = false } = {}) {
  const filter = createFilter(include, exclude);

  const cssModules = new Map()

  return {
    name: 'lit-css',

    transform(css, id) {
      if (id.slice(-4) !== '.css') return null;
      if (!filter(id)) return null;
      // cache the name of the module without extension in case of name collisions
      cssModules.set(path.basename(id).replace('.css', ''), id)
      const cssContent = !uglify ? css :
        processString(css, typeof uglify === 'object' ? uglify : undefined);
      const output = `css\`${cssContent}\`;`;
      const code = `${importDeclaration}\nexport default ${output}; `;
      const map = { mappings: '' };
      return { code, map };
    },

    renderChunk(code, chunk) {
      const { facadeModuleId: id } = chunk;
      // Check the modulename cache for collisions
      if (cssModules.has(path.basename(id).replace('.js', ''))) {
        chunk.fileName = chunk.fileName.replace(/\d\.js/g, '.js');
        chunk.name = chunk.name.replace('2.js', '.js');
        return null;
      } else if (id.endsWith('.css')) {
        chunk.fileName = chunk.fileName.replace('.js', '.css.js');
        chunk.name = chunk.name.replace('.js', '.css.js');
        return { code, map: chunk.map }
      } else {
        return null
      }
    },

  };
}
