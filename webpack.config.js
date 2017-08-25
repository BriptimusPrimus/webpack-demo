const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');

const glob = require('glob');

const parts = require('./webpack.parts');

const PATHS = {
	app: path.join(__dirname, 'app'),
	build: path.join(__dirname, 'build'),
	style: glob.sync('./app/**/*.css'),
};

const commonConfig = merge([
	{
		// Entries have to resolve to files! They rely on Node
		// convention by default so if a directory contains *index.js*,
		// it resolves to that.
		entry: {
			app: PATHS.app,
			style: PATHS.style,
		},
		output: {
			path: PATHS.build,
			filename: '[name].js',
		},
		plugins: [
			new HtmlWebpackPlugin({
				title: 'Webpack demo',
			}),
		],
	},
	parts.lintJavaScript({ include: PATHS.app }),
	parts.lintCSS({ include: PATHS.app }),
	parts.loadFonts({
		options: {
			name: '[name][ext]',
		}
	}),
]);

const productionConfig = merge([
	parts.extractCSS({
		use: ['css-loader', parts.autoprefix()]
	}),
	parts.purifyCSS({
		paths: glob.sync(`${PATHS.app}/**/*.js`, { nodir: true }),
	}),
	parts.loadImages({
		options: {
			limit: 15000,
			name: '[name].[ext]',
		},
	}),
]);

const developmentConfig = merge([
	parts.devServer({
		// Customize host/port here if needed
		host: process.env.HOST,
		port: process.env.PORT,
	}),
	parts.loadCSS(),
	parts.loadImages(),
]);

const developmentConfigBK = () => {
	const config = {
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
		module: {
			rules: [
				{
					test: /\.js$/,
					enforce: 'pre',

					loader: 'eslint-loader',
					options: {
						emitWarning: true,
					},
				},
			],
		},
		plugins: [
			// Ignore node_modules so CPU usage with poll
			// watching drops significantly
			new webpack.WatchIgnorePlugin([
				path.join(__dirname, 'node_modules'),
			]),
			new webpack.LoaderOptionsPlugin({
				options: {
					eslint: {
						// Fail only on errors
						failOnWarning: false,
						failOnError: true,

						// Toggle autofix
						fix: false,

						// Output to Jenkins compatible XML
						outputReport: {
							filePath: 'checkstyle.xml',
							formatter: require('eslint/lib/formatters/checkstyle'),
						},
					},
				},
			}),
		],
	};

	Object.assign(config.plugins, commonConfig.plugins);

	return Object.assign(
		{},
		commonConfig,
		config
	);
};

module.exports = (env) => {
	if (env === 'production') {
		return merge(commonConfig, productionConfig);
	}

	return merge(commonConfig, developmentConfig);
};