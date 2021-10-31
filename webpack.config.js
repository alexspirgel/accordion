const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const accordionPackageData = require('./package.json');

module.exports = [
	{
		mode: 'production',
		name: 'Accordion',
		entry: './src/index.js',
		target: 'web',
		output: {
			library: 'Accordion',
			libraryTarget: 'var',
			filename: 'accordion.js',
			path: path.resolve(__dirname, './dist')
		},
		plugins: [
			new webpack.BannerPlugin({
				banner: `accordion v${accordionPackageData.version}\nhttps://github.com/alexspirgel/accordion`
			})
		],
		optimization: {
			minimize: false
		},
		watch: true
	},
	{
		mode: 'production',
		name: 'Accordion',
		entry: './src/index.js',
		target: 'web',
		output: {
			library: 'Accordion',
			libraryTarget: 'var',
			filename: 'accordion.min.js',
			path: path.resolve(__dirname, './dist')
		},
		plugins: [
			new webpack.BannerPlugin({
				banner: `accordion v${accordionPackageData.version}\nhttps://github.com/alexspirgel/accordion`
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