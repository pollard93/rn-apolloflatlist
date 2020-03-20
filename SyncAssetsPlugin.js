const util = require('util');
const childProcess = require('child_process');
const packageJson = require('./package.json');

const exec = util.promisify(childProcess.exec);

/**
 * Yarn has an issue with clearing caches for tgz files, to send the updates to the example app properly you must clear the entire yarn cache
 * Installing the module to the example as `file:../` is not a good option as it copies the entire example folder recursively
 * `yarn link` is not an option as the metro bundler cannot follow symlinks
 *
 * This plugin rsyncs the recently compiles dist folder into the examples node module for development
 */
class SyncAssetsPlugin {
  // eslint-disable-next-line class-methods-use-this
  apply(compiler) {
    compiler.hooks.done.tap('Syncing Assets', async () => {
      await exec(`rsync -a ./dist ./example/node_modules/${packageJson.name}`);
    });
  }
}

module.exports = SyncAssetsPlugin;
