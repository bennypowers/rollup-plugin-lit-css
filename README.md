# rollup-plugin-lit-css
Rollup plugin to import css files as lit-element tagged css objects.

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
