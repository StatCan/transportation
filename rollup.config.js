import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";

const plugins = [
  resolve(),
  commonjs(),
  babel()
];
const entrypoints = [];

for (const section of ["air", "modes", "road", "rail"]) {
  entrypoints.push({
    input: `src/${section}/index.js`,
    output: {
      file: `dist/src/${section}.js`,
      format: "iife"
    },
    plugins
  });
}

export default entrypoints;
