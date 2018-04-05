const HtmlWebPackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ConcatPlugin = require('webpack-concat-plugin');


module.exports = {

	context: __dirname,

	entry: {
		'rg-uploader': './src/production.js',
	},

	output: {
		publicPath: './',
		filename: '[name].js',
		library: 'RG_Uploader',
		libraryTarget: 'umd',
		libraryExport: 'default'
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: "html-loader",
						options: {
							minimize: false
						}
					}
				]
			},
			{
				test: /\.s?css$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: {
								minimize: true,
								alias: {},
							},
						},
						'sass-loader'
					]
				}),
			},
			{
				test: /\.(eot|ttf|woff|woff2)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							publicPath: './',
							name: 'assets/[name].[ext]'
						}
					}
				]
			},
		]
	},

	externals: {
		jquery: 'jQuery',
	},

	plugins: [
		new HtmlWebPackPlugin({
			template: "./src/production.html"
		}),
		new ExtractTextPlugin({ filename: 'rg-uploader.css' }),
		new ConcatPlugin({
			name: 'rg-uploader',
			uglify: false,
			sourceMap: false,
			outputPath: '',
			fileName: '[name].plugin.js',
			filesToConcat: ['./src/plugins/*.plugin.*'],
			attributes: { async: true },
		}),
	]

};