import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';

const plugins = [resolve(), commonjs()];

const external = Object.keys(Object.assign({}, pkg.peerDependencies, pkg.dependencies));

const output = [{ file: pkg.main, format: 'cjs' }];

export default [
  /**
   * Node.js Build
   */
  {
    input: 'index.node.js',
    output,
    plugins,
    external,
  },
];
