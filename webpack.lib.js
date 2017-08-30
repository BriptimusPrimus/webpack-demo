const path = require('path');
const merge = require('webpack-merge');

const parts = require('./webpack.parts');
const HappyPack = require('happypack');

const PATHS = {
	lib: path.join(__dirname, 'lib'),
	build: path.join(__dirname, 'dist'),
};

const commonConfig = merge([
	{
		entry: {
			lib: PATHS.lib,
		},
		output: {
			path: PATHS.build,
			library: 'Demo',
			libraryTarget: 'umd', // Support for CommonJS, AMD, and globals
		},
		plugins: [
			new HappyPack({
				loaders: [
					// Capture Babel loader
					'babel-loader',
				],
			}),
		],
	},
	parts.attachRevision(),
	parts.generateSourceMaps({ type: 'source-map' }),
	parts.loadJavaScript({ include: PATHS.lib }),1,
]);

const libraryConfig = merge([
	commonConfig,
	{
		output: {
			filename: '[name].js',
		},
	},
	parts.clean(PATHS.build),
	parts.lintJavaScript({ incllude: PATHS.lib }),
]);

const libraryMinConfig = merge([
	commonConfig,
	{
		output: {
			filename: '[name].min.js',
		},
	},
	parts.minifyJavascript(),
]);

module.exports = [
	libraryConfig,
	libraryMinConfig,
];
