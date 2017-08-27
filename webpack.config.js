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
		},
	}),
	parts.loadJavaScript({ include: PATHS.app }),
]);

const productionConfig = merge([
	{
		performance: {
			hints: 'warning', // 'error' or false are valid too
			maxEntrypointSize: 100000, // in bytes
			maxAssetSize: 450000, //in bytes
		},
	},
	parts.clean(PATHS.build),
	parts.minifyJavascript(),
	parts.minifyCSS({
		options: {
			discardComments: {
				removeAll: true,
			},
			// Run cssnano in safe mode to avoid
			// potentially unsafe transformations.
			safe: true,
		},
	}),
	parts.generateSourceMaps({ type: 'source-map' }),
	parts.extractCSS({
		use: ['css-loader', parts.autoprefix()],
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
	parts.extractBundles([
		{
			name: 'vendor',

			minChunks: ({ resource }) => (
				resource &&
				resource.indexOf('node_modules') >= 0 &&
				resource.match(/\.js$/)
			),
		},
	]),
	parts.attachRevision(),
]);

const developmentConfig = merge([
	{
		output: {
			devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]',
		},
	},
	parts.generateSourceMaps({ type: 'cheap-module-eval-source-map' }),

	parts.devServer({
		// Customize host/port here if needed
		host: process.env.HOST,
		port: process.env.PORT,
	}),
	parts.loadCSS(),
	parts.loadImages(),
]);

module.exports = (env) => {
	if (env === 'production') {
		return merge(commonConfig, productionConfig);
	}

	return merge(commonConfig, developmentConfig);
};