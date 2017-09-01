const path = require('path');
const merge = require('webpack-merge');
const HappyPack = require('happypack');

const parts = require('./webpack.parts');

const PATHS = {
	build: path.join(__dirname, 'static'),
	ssrDemo: path.join(__dirname, 'app', 'ssr.js'),
};

module.exports = merge([
	{
		entry: {
			index: PATHS.ssrDemo,
		},
		output: {
			path: PATHS.build,
			filename: '[name].js',
			libraryTarget: 'umd',
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
	parts.loadJavaScript({ include: PATHS.ssrDemo }),
]);