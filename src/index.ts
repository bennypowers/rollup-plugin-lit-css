import { createFilter } from 'rollup-pluginutils';
import { processString, UglifyCSSOptions } from 'uglifycss';
import { resolve } from 'path';
import type { Plugin } from 'rollup';
import stringToTemplateLiteral from 'string-to-template-literal';

export interface LitCSSOptions {
  include?: RegExp | string[];
  exclude?: RegExp | string[];
  uglify?: boolean | UglifyCSSOptions;
}

function transform(css: string): string {
  return `import { css } from 'lit-element';export default css${stringToTemplateLiteral(css)}`;
}

/**
 * Imports css as lit-element `css`-tagged constructible style sheets.
 */
export default function css({ include = /\.css$/i, exclude, uglify = false }: LitCSSOptions = {}): Plugin {
  const filter = createFilter(include, exclude);
  return {
    name: 'lit-css',

    load(id): null {
      if (filter(id)) this.addWatchFile(resolve(id))
      return null;
    },

    transform(css, id) {
      if (id.slice(-4) !== '.css') return null;
      if (!filter(id)) return null;
      const uglifyOptions = typeof uglify === 'object' ? uglify : undefined
      const cssContent = !uglify ? css : processString(css, uglifyOptions);
      const code = transform(cssContent);
      return { code, map: { mappings: '' } };
    },
  };
}
