const HtmlWebPackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {

	context: __dirname,

	entry: {
		index: `./src/development.js`,
	},

	output: {
		publicPath: '/',
		filename: '[name].js',
		chunkFilename: '[name].js',
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
							name: '[name].[ext]'
						}
					}
				]
			},
		]
	},

	plugins: [
		new HtmlWebPackPlugin({
			template: "./src/development.html"
		}),
		new ExtractTextPlugin({ filename: 'style.css' }),
	],

	devServer: {
		open: false,
		port: 4000,
		historyApiFallback: true,
		noInfo: true,
		before: require('./upload/script-node'),
	}

};