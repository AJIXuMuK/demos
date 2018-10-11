'use strict';

const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

// Merge custom loader to web pack configuration

const VueLoaderPlugin = require('vue-loader/lib/plugin');
const vuePlugin = new VueLoaderPlugin();


const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const forkTsPlugin = new ForkTsCheckerWebpackPlugin({
    vue: true,
    tslint: true,
    formatter: 'codeframe',
    checkSyntacticErrors: false
});


build.configureWebpack.mergeConfig({

    additionalConfiguration: (generatedConfiguration) => {

        const loadersConfigs = [{
            test: /\.vue$/, // vue
            use: [{
                loader: 'vue-loader'
            }]
        }, {
            resourceQuery: /vue&type=script&lang=ts/, // typescript
            loader: 'ts-loader',
            options: {
                appendTsSuffixTo: [/\.vue$/],
                transpileOnly: true
            }
        }, {
            resourceQuery: /vue&type=style.*&lang=scss/, // scss
            use: [{
                    loader: require.resolve('@microsoft/loader-load-themed-styles'),
                    options: {
                        async: true
                    }
                },
                {
                    loader: 'css-loader',
                    options: {
                        modules: true,
                        localIdentName: '[local]_[sha1:hash:hex:8]'
                    }
                },
                'sass-loader'
            ]
        }];

        generatedConfiguration.plugins.push(vuePlugin);
        
        generatedConfiguration.plugins.push(forkTsPlugin);
        
        generatedConfiguration.module.rules.push(...loadersConfigs);

        return generatedConfiguration;

    }

});

// marker to check if custom watch is already registered
// used to prevent watch bubbling
let customWatchRegistered = false;

let watchVueFiles = build.subTask('watch-vue-files', function (gulp, buildOptions, done) {
    // register watch only on first run
    if (!customWatchRegistered) {

        // on change of *.vue files
        gulp.watch('./src/**/*.vue', event => {
            // copy empty index.ts onto itself to launch build procees
            gulp.src('./src/index.ts')
                .pipe(gulp.dest('./src/'));
        });

        // after watch is registered don't register again
        customWatchRegistered = true;

    }

    done();
});

build.rig.addPreBuildTask(watchVueFiles);


build.initialize(gulp);