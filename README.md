<div align="center">
  <a href="https://www.npmjs.com/package/dotenv-webpack" target="_blank">
    <img alt="npm" src="https://img.shields.io/npm/v/karma-webpack-livereload.svg?maxAge=0&style=flat" />
  </a>
  <a href="https://github.com/sprilukin/karma-webpack-livereload/actions/workflows/lint.yml" target="_blank">
    <img alt="Lint" src="https://github.com/sprilukin/karma-webpack-livereload/actions/workflows/lint.yml/badge.svg" />
  </a>
  <a href="https://david-dm.org/sprilukin/karma-webpack-livereload" target="_blank">
    <img alt="Dependency Status" src="https://david-dm.org/sprilukin/karma-webpack-livereload.svg" />
  </a>
  <a href="https://david-dm.org/sprilukin/karma-webpack-livereload?type=dev" target="_blank">
    <img alt="devDependency Status" src="https://david-dm.org/sprilukin/karma-webpack-livereload/dev-status.svg" />
  </a>

  <h1>
    <img width="35" height="35" style="padding-top: 7px" src="https://worldvectorlogo.com/logos/karma.svg" alt="karma" />
    <img width="30" height="30" src="https://webpack.js.org/assets/icon-square-big.svg" alt="webpack">
    karma-webpack-livereload
  </h1>
  <p>Livereload extension for <code>karma-webpack 5.x.x</code> plugin which is useful for different html reporters like <code>karma-jasmine-html-reporter</code></p>
</div>

## Install
- npm 
  ```shell
  npm i -D karma-webpack karma-webpack-livereload
  ```

- yarn 
  ```shell
  yarn add -D karma-webpack karma-webpack-livereload
  ```

## Usage

Here is the sample karma configuration which uses `jasmine` and `karma-jasmine-html-reporter`
but any other reporters which works in a browser should work.

**karma.conf.js**:
```js
module.exports = (config) => {
  config.set({
    frameworks: ['jasmine', 'webpack'], // webpack framework is required
    
    plugins: [
        "karma-jasmine",
        "karma-jasmine-html-reporter", // add some html reporters
        "karma-webpack",  // karma-webpack plugin is required
        "karma-webpack-livereload" // this is our livereload plugin which is also required
    ],

    files: [
      { pattern: 'test/**/*.test.js', watched: false }
    ],

    preprocessors: {
      // webpack and webpack-livereload are required
      // and should be added in this order
      'test/**/*.test.js': [ 'webpack', 'webpack-livereload' ]
    },

    // add some html reporters
    reporters: ['kjhtml'],

    // karma-webpack-livereload plugin will be automatically disabled 
    // if singleRun == true
    // singleRun: true,
    
    webpackLivereload: {
      // forces our karma-webpack-livereload plugin to be enabled/disabled.
      // could be omitted as plugin is enabled by default
      enabled: true, 
      
      // if this property is passed - karma-webpack-livereload plugin will be enabled
      // only if reporters in karma.conf contains any of reporters mentioned in this property
      reporters: ['kjhtml']
    },
    
    webpack: {
      // webpack configuration
    },
  });
}
```

Since `karma-webpack-livereload` based on `karma-webpack` plugin, please
also read `karma-webpack` plugin [documentation](https://github.com/ryanclark/karma-webpack)

### How it works

This plugin is a `karma` preprocessor which works in conjunction with `karma-webpak` plugin.
It enhances the way how `karma-webpack` utilizes `webpack`: in addition to the standard 
webpack compiler creation, this plugin starts `webpack-dev-server` which has embedded livereload capabilities.

### Sample
`./sample` folder in the source code contains minimal example which demonstrates how this plugin works:

In order to test this sample follow these steps:
- checkout source code: `git clone git@github.com:sprilukin/karma-webpack-livereload.git`
- execute:
  ```shell
  cd karma-webpack-livereload/sample
  npm install
  npm run test
  ```
- open the following url in the browser: [http://localhost:9876/]()
- try to edit `karma-webpack-livereload/sample/src/moduleToTest.tests.js` and do simple change:
  ```js
  //expect(moduleToTest(1, 1)).toBe(2);   // <--- original code
  expect(moduleToTest(1, 2)).toBe(2);   // <--- modified code  
  ```
- ensure that the browser page refreshed automatically and shows failed test result:

![demo](./livereload.gif)
