const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');

exports.devServer = ({ host, port } = {}) => ({
    devServer: {
        // overlay: true is equivalent
        overlay: {
            errors: true,
            warnings: true,
        },
        
        // Enable history API fallback so HTML5 History API based
        // routing works. Good for complex setups.
        historyApiFallback: true,
        
        // Display only errors to reduce the amount of output.
        stats: 'errors-only',
        
        watchOptions: {
            // Delay the rebuild after the first change
            aggregateTimeout: 300,

            // Poll using interval (in ms, accepts boolean too)
            poll: 1000,
        },
        
        // Parse host and port from env to allow customization.
        //
        // If you use Docker, Vagrant or Cloud9, set
        // host: options.host || '0.0.0.0';
        //
        // 0.0.0.0 is available to all network devices
        // unlike default `localhost`.
        host: process.env.HOST, // Defaults to `localhost`
        port: process.env.PORT, // Defaults to 8080        
    },
});

exports.lintJavaScript = ({ include, exclude, options}) => ({
    module: {
        rules: [
            {
                test: /\.js$/,
                include,
                exclude,
                enforce: 'pre',

                loader: 'eslint-loader',
                options,
            }
        ],
    },
});

exports.loadCSS = ({ include, exclude } = {}) => ({
    module: {
        rules: [
            {
                test: /\.css$/,
                include,
                exclude,

                use: ['style-loader', 'css-loader'],
            },
        ],
    },
});

exports.extractCSS = ({ include, exclude, use }) => {
    // Output extracted CSS to a file
    const plugin = new ExtractTextPlugin({
        filename: '[name].css',
    });

    return {
        module: {
            rules: [
                {
                    test: /\.css$/,
                    include,
                    exclude,

                    use: plugin.extract({
                        use,
                        fallback: 'style-loader',
                    }),
                },
            ],
        },
        plugins: [ plugin ],
    };
};

exports.autoprefix = () => ({
    loader: 'postcss-loader',
    options: {
        plugins: () => ([
            require('autoprefixer')(),
        ]),
    },
});

exports.purifyCSS = ({ paths }) => ({
    plugins: [
        new PurifyCSSPlugin({ paths }),
    ],
});

exports.lintCSS = ({ include, exclude }) => ({
    module: {
        rules: [
            {
                test: /\.css$/,
                include,
                exclude,
                enforce: 'pre',

                loader: 'postcss-loader',
                options: {
                    plugins: () => ([
                        require('stylelint')(),
                    ]),
                },
            },
        ],
    },
});

exports.loadImages = ({ include, exclude, options } = {}) => ({
    module: {
        rules: [
            {
                test: /\.(png|jpg|svg)$/,
                include,
                exclude,

                use: {
                    loader: 'url-loader',
                    options,
                },
            },
        ],
    },
});

exports.loadFonts = ({ include, exclude, options } = {}) => ({
    module: {
        rules: [
            {
                // Capture eot, ttf, woff, and woff2
                test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                include,
                exclude,

                use: {
                    loader: 'file-loader',
                    options,
                },
            },
        ],
    },
});