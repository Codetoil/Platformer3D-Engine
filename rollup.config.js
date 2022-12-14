import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

export default {
  input: "ts/main.ts",

  output: {
    file: "dist/index.js",
    format: "iife",
  },

  plugins: [
    nodeResolve(),
    typescript({
      exclude: "node_modules/**",
    }),
  ],
};
