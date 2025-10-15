import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "react/index": "react/index.ts",
  },
  dts: true,
  format: ["esm", "cjs"],
  sourcemap: true,
  clean: true,
  treeshake: true,
  target: "es2020",
  outDir: "dist",
  skipNodeModulesBundle: true,
  splitting: false,
  bundle: true,
  external: [
    "@coral-xyz/anchor",
    "@solana/web3.js",
    "@solana/spl-token",
    "react",
    "react-dom",
  ],
});
