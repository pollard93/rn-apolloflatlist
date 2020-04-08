const SyncAssetsPlugin = require('./SyncAssetsPlugin');
const production = require('./webpack.prod.config');

/**
 * Merge production config and add SyncAssetsPlugin
 */
module.exports = {
  ...production,
  mode: 'production',
  plugins: [
    new SyncAssetsPlugin({ options: true }),
  ],
};
