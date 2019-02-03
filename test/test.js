import test from 'tape';
import { rollup } from 'rollup';
import litcss from '../';

test('lit-css generates a basic style', async function(assert) {
  const expected = `import { css } from 'lit-element';

var basic = css\`html {
  display: block;
}
\`;

export { basic as style };
`
  const bundle = await rollup({
    input: './test/basic.js',
    plugins: [litcss()]
  });
  const { output: [{ code }] } = await bundle.generate({ format: 'es' });
  assert.equal(code, expected)

  assert.end();
})


test('lit-css generates an uglified style', async function(assert) {
  const expected = `import { css } from 'lit-element';

var basic = css\`html{display:block}\`;

export { basic as style };
`
  const bundle = await rollup({
    input: './test/basic.js',
    plugins: [litcss({ uglify: true })]
  });
  const { output: [{ code }] } = await bundle.generate({ format: 'es' });
  assert.equal(code, expected)

  assert.end();
})
