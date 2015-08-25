/*eslint-env node */
// Karma configuration
// Generated on Mon Aug 24 2015 12:45:47 GMT+0100 (BST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],


    // list of files / patterns to load in the browser
    files: [
      // PhantomJS 1.9 does not support ES5
      'jspm_packages/**/es-shims/**/es5-shim.min.js',

      // JSPM
      { pattern: 'jspm_packages/!(system).js', included: false},
      'jspm_packages/system.js',
      { pattern: 'jspm_packages/**/*', included: false },
      'config.js',

      // Tests are loaded by JSPM
      'test/runner.js',
      { pattern: 'test/**/*.test.js', included: false },

      // Source is loaded and transpiled by JSPM
      { pattern: 'src/**/*', included: false }
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
