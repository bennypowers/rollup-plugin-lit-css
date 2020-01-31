const { createFilter } = require('rollup-pluginutils');
const { processString } = require('uglifycss');
const { resolve } = require('path');

const importDeclaration = 'import { css } from \'lit-element\';';

/**
 * Imports css as lit-element `css`-tagged constructible style sheets.
 * @param  {Object} [options={}]
 * @return {Object}
 */
module.exports = function css({ include = /\.css$/i, exclude, uglify = false } = {}) {
  const filter = createFilter(include, exclude);
  return {
    name: 'lit-css',

    load(id) {
      if (filter(id)) this.addWatchFile(resolve(id))
    },

    transform(css, id) {
      if (id.slice(-4) !== '.css') return null;
      if (!filter(id)) return null;
      const cssContent = !uglify ? css :
        processString(css, typeof uglify === 'object' ? uglify : undefined);
      const output = `css\`${cssContent}\`;`;
      const code = `${importDeclaration}\nexport default ${output}; `;
      const map = { mappings: '' };
      return { code, map };
    },
  };
}
