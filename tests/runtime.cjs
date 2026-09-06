const { rollup } = require('rollup');
const Module = require('module');
const path = require('path');
const root = path.resolve(__dirname, '..');

module.exports = async function runtime() {
  const exports = [
    'storage.js', 'content-scripts/src/modules/options/timeline.js',
    'content-scripts/src/modules/options/customCss.js', 'content-scripts/src/modules/options/interface.js',
    'content-scripts/src/modules/initialize.js', 'content-scripts/src/modules/features/static.js',
    'content-scripts/src/modules/utilities/other-styles.js',
  ].map(file => `export * from ${JSON.stringify(path.join(root,file))};`).join('\n');
  const bundle = await rollup({ input: 'test-entry', plugins: [{
    name:'test-entry', resolveId(id) { if (id === 'test-entry') return id; },
    load(id) { if (id === 'test-entry') return exports + `
      export {default as selectors} from ${JSON.stringify(path.join(root,'content-scripts/src/selectors.js'))};
      export {default as isMutationSkippable} from ${JSON.stringify(path.join(root,'content-scripts/src/modules/utilities/isMutationSkippable.js'))};
      export {default as addStyles} from ${JSON.stringify(path.join(root,'content-scripts/src/modules/utilities/addStyles.js'))};`; }
  }] });
  const { output } = await bundle.generate({format:'cjs'});
  await bundle.close();
  const module = new Module(path.join(__dirname,'runtime.generated.cjs'));
  module.paths = Module._nodeModulePaths(root);
  module._compile(output[0].code,path.join(__dirname,"runtime.generated.cjs"));
  return module.exports;
};
