module.exports = {
	watch: true,
	devtool: 'eval',
	resolve: {
		modulesDirectories: ['src/js'],
		extensions: ['', '.js']
	},
	output: {
		filename: 'rg-uploader.pkgd.js'
	},
	externals: {
		'jquery': '$'
	},
	module: {
		loaders: [
			{
				test: /\.(js)$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					presets: ['babel-preset-es2015']
				}
			}
		]
	}
};