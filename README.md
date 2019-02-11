# rollup-plugin-lit-css
Rollup plugin to import css files as lit-element tagged css objects.

## Do I Need This?

No. This is an optional package who's sole purpose is to make it easier to write CSS-in-CSS while working on lit-element projects. You can just as easily write your CSS in some '`styles.css.js`' modules a la:
```js
import { css } from 'lit-element';
export default css`:host { display: block; }`;
```
And this may actually be preferred.

Hopefully this package will become quickly obsolete when the [CSS Modules Proposal](https://github.com/w3c/webcomponents/issues/759) (or something like it) is accepted and implemented.

In the mean time, enjoy importing your CSS into your component files.

## Usage

```js
import config from './rollup.config.rest.js'
import litcss from 'rollup-plugin-lit-css';

export default {
  ...config,
  plugins: [
    litcss({ include, exclude, uglify })
  ]
}
```

## Options

|Name|Accepts|Default|
|-----|-----|-----|
|`include`|Array of glob of files to include.|`['**/*.css']`|
|`exclude`|Array of glob of files to exclude. |`undefined`|
|`uglify`|Boolean or Object of [uglifycss](https://www.npmjs.com/package/uglifycss#api) options.|`false`|
