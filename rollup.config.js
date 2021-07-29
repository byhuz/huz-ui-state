import { readdirSync } from "fs";
import path from "path";
import babel from "rollup-plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import external from "rollup-plugin-peer-deps-external";
import replace from "@rollup/plugin-replace";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

const EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".json"];

const getChunks = (URI) =>
  readdirSync(path.resolve(URI))
    .filter((x) => x.includes(".js"))
    .reduce((a, c) => ({ ...a, [c.replace(".js", "")]: `src/${c}` }), {});

const env = process.env.NODE_ENV;

const commonPlugins = (config) => [
  external({
    includeDependencies: config.includeDependencies,
  }),
  resolve({
    extensions: EXTENSIONS,
    preferBuiltins: true,
    dedupe: ["react", "react-dom", "redux", "react-redux"],
  }),
  commonjs({
    include: /node_modules/,
  }),
  babel({
    babelrc: false,
    presets: [["@babel/preset-env", { modules: false }], "@babel/preset-react"],
    extensions: EXTENSIONS,
    exclude: "node_modules/**",
    plugins: [["@babel/plugin-transform-runtime"]],
    runtimeHelpers: true,
  }),
  replace({ "process.env.NODE_ENV": JSON.stringify(env),preventAssignment:true }),
  terser(),
];

export default [
  {
    input: `src/index.js`,
    output: {
      esModule: false,
      dir: "dist/iife",
      format: "iife",
      name: "HuzUIState",
      exports: "named",
      globals: {
        react: "React",
        "react-dom": "ReactDOM",
        redux: "Redux",
        "react-redux": "ReactRedux"
      },
    },
    plugins: commonPlugins({ includeDependencies: false }),
    external: ["react", "react-dom", "redux", "react-redux"],
  },
  {
    input: getChunks(`src`),
    output: [
      {
        dir: `dist/esm`,
        format: "esm",
        exports: "named",
        sourcemap: false,
      },
      {
        dir: `dist/cjs`,
        format: "cjs",
        exports: "named",
        sourcemap: false,
      },
    ],
    plugins: commonPlugins({ includeDependencies: true }),
    external: ["react", "react-dom", "redux", "react-redux"],
  },
];
