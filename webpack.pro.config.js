const ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports = {

	context: __dirname,

	entry: {
		RG_Uploader: `./src/pro.js`,
	},

	output: {
		publicPath: '/',
		filename: 'rg-uploader.js',
		library: '[name]',
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
		new ExtractTextPlugin({ filename: 'rg-uploader.css' }),
	]

};