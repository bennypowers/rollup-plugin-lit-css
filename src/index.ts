import { createFilter } from 'rollup-pluginutils';
import { processString, UglifyCSSOptions } from 'uglifycss';
import { resolve } from 'path';
import type { Plugin } from 'rollup';
import stringToTemplateLiteral from 'string-to-template-literal';

export interface LitCSSOptions {
  include?: RegExp | string[];
  exclude?: RegExp | string[];
  uglify?: boolean | UglifyCSSOptions;
  import?: string;
  tag?: string;
}

function transform(css: string, specifier: string, tag: string): string {
  return `import {${tag}} from '${specifier}';export default ${tag}${stringToTemplateLiteral(css)}`;
}

/**
 * Imports css as lit-element `css`-tagged constructible style sheets.
 */
export default function css(options: LitCSSOptions = {}): Plugin {
  const {
    exclude,
    include = /\.css$/i,
    uglify = false,
    import: specifier = 'lit-element',
    tag = 'css',
  } = options;

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
      const code = transform(cssContent, specifier, tag);
      return { code, map: { mappings: '' } };
    },
  };
}
