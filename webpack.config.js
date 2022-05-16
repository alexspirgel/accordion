const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const packageData = require('./package.json');

module.exports = [
	{
		name: 'Accordion',
		entry: './src/accordion.js',
		target: 'web',
		output: {
			library: 'Accordion',
			libraryTarget: 'var',
			filename: 'accordion.js',
			path: path.resolve(__dirname, './dist')
		},
		plugins: [
			new webpack.BannerPlugin({
				banner: `accordion v${packageData.version}\nhttps://github.com/alexspirgel/accordion`
			})
		],
		optimization: {
			minimize: false
		},
		watch: true
	},
	{
		name: 'Accordion',
		entry: './src/accordion.js',
		target: 'web',
		output: {
			library: 'Accordion',
			libraryTarget: 'var',
			filename: 'accordion.min.js',
			path: path.resolve(__dirname, './dist')
		},
		plugins: [
			new webpack.BannerPlugin({
				banner: `accordion v${packageData.version}\nhttps://github.com/alexspirgel/accordion`
			})
		],
		optimization: {
			minimize: true,
			minimizer: [
				new TerserPlugin({
					extractComments: false,
					terserOptions: {
						keep_classnames: true
					}
				})
			]
		},
		watch: true
	}
];