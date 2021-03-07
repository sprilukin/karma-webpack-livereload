module.exports = function (config) {
    config.set({
        frameworks: ['jasmine', 'webpack'],

        files: [
            {pattern: 'src/*.tests.js', watched: false}
        ],

        reporters: ['kjhtml'],

        preprocessors: {
            'src/*.tests.js': ['webpack', 'webpack-livereload']
        },

        webpackLivereload: {
            enabled: true,
            reporters: ['kjhtml']
        },

        webpack: {},

        plugins: [
            "karma-jasmine",
            "karma-jasmine-html-reporter",
            "karma-webpack",
            "karma-webpack-livereload"
        ]
    });
};