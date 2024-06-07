// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config")
const path = require("node:path")

const projectRoot = __dirname
const monorepoRoot = path.resolve(projectRoot, "../..")

/** @type {import("expo/metro-config").MetroConfig} */
const config = getDefaultConfig(__dirname)

config.watchFolders = [projectRoot, path.resolve(monorepoRoot, "packages")]

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
]

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
})

module.exports = config
