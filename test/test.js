import test from 'tape';
import { rollup } from 'rollup';
import litcss from '../index';
import alias from '@rollup/plugin-alias'

const basicCssText = `html {
  display: block;
}
`

const expected = text => `import { css } from 'lit-element';

var basic = css\`${text}\`;

export { basic as style };
`;

test('lit-css generates a basic style', async function(assert) {
  const bundle = await rollup({
    input: './test/basic.js',
    plugins: [litcss()]
  });
  const { output: [{ code }] } = await bundle.generate({ format: 'es' });
  assert.equal(code, expected(basicCssText))

  assert.end();
})


test('lit-css generates an uglified style', async function(assert) {
  const bundle = await rollup({
    input: './test/basic.js',
    plugins: [litcss({ uglify: true })]
  });
  const { output: [{ code }] } = await bundle.generate({ format: 'es' });
  assert.equal(code, expected(basicCssText.replace(/ |\n|;/g, "")))

  assert.end();
})

test('imports from a bare specifier', async function(assert) {
  const bundle = await rollup({
    input: './test/bare.js',
    plugins: [
      // mock bare specifier
      alias({ entries: { 'styles/basic.css': './basic.css' } }),
      litcss()
    ]
  });
  const { output: [{ code }] } = await bundle.generate({ format: 'es' });
  assert.equal(code, expected(basicCssText))

  assert.end();
})
