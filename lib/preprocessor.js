const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const webpackControllerIsAbsentWarning = [
    'karma-webpack-livereload plugin should work in conjunction with karma-webpack plugin.',
    'Please read documentation about how to set up this plugin.'
];

function isEnabled({webpackLivereload = {}, reporters}) {
  const {enabled = true, reporters: livereloadReporters} = webpackLivereload;
  return enabled && !reporters || (reporters || []).some((reporter) => livereloadReporters.indexOf(reporter) > -1)
}

function getBundleFunc(config) {
  return function _bundle() {
    // Inside this function "this" context is bound to config.__karmaWebpackController

    this.isActive = true;

    return new Promise((resolve) => {
      // Should disable watch otherwise webpack will complain
      this.webpackOptions.watch = false;

      this.compiler = webpack(this.webpackOptions);
      const PORT = config.port + 1;
      const HOST = config.hostname;

      const server = new WebpackDevServer(this.compiler, {
        host: HOST,
        publicPath: "/",
        port: PORT,
        writeToDisk: true
      });

      this.compiler.hooks.done.tap('KW_Controller', (stats) => {
        this.handleBuildResult('', stats, resolve);
      });
      this.compiler.hooks.failed.tap('KW_Controller', (err) => {
        this.handleBuildResult(err);
      });

      server.listen(PORT, HOST, (err) => {
        err && console.error(err)
      })

      this.setupExitHandler(server);
    });
  }
}

function preprocessor(config, logger) {
  const log = logger.create('karma-webpack-livereload');
  const isSingleRun = config.singleRun;
  const enabled = isEnabled(config);

  if (enabled) {
    if (isSingleRun) {
      log.info('karma-webpack-livereload disabled because singleRun == true');
    } else if (!config.__karmaWebpackController) {
      webpackControllerIsAbsentWarning.forEach((msg) => log.warn(msg));
    } else if (!config.__karmaWebpackController._isLivereload) {
      log.info('Updating karma-webpack config to enable livereload');
      config.__karmaWebpackController._bundle = getBundleFunc(config);
      config.__karmaWebpackController._isLivereload = true;
    }
  } else {
    log.debug(`karma-webpack-livereload disabled. config: ${JSON.stringify(config.webpackLivereload || {})}`)
  }

  return function processFile(content, file, done) {
    done(null, content);
  };
}

preprocessor.$inject = ['config', 'logger'];

module.exports = preprocessor;
