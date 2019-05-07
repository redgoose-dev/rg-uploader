const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = (env, options) => {
  const isDev = options.mode === 'development';
  let config = {
    mode: isDev ? options.mode : 'production',
    module: {
      rules: [
        {
          test: /\.s?css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: isDev,
              },
            },
            'css-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.(eot|ttf|woff|woff2)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                publicPath: './',
                name: '[name].[ext]',
                limit: 10000,
              }
            }
          ]
        },
      ],
    },
    plugins: [],
    optimization: {},
  };

  if (isDev)
  {
    /**
     * development
     */
    config.entry = {
      app: ['./dev/index.js'],
    };
    config.output = {
      publicPath: '/',
      filename: '[name].js',
      chunkFilename: '[name].js',
    };
    config.devtool = 'inline-source-map';
    config.devServer = {
      hot: true,
      host: '0.0.0.0',
      port: options.port || 3000,
      contentBase: path.resolve(__dirname, '.cache/dist'),
      stats: {
        color: true,
      },
      before: require('./upload/script-node'),
      historyApiFallback: true,
      noInfo: true,
    };
    config.module.rules = Object.assign([], config.module.rules, {
      test: /\.html$/,
      use: [
        {
          loader: "html-loader",
          options: {
            minimize: false
          }
        }
      ]
    });
    config.plugins = [
      new HtmlWebPackPlugin({
        template: './dev/index.html',
        showErrors: true,
      }),
      new MiniCssExtractPlugin({ filename: 'rg-uploader.css' }),
    ];
  }
  else
  {
    /**
     * production
     */
    config.entry = {
      'rg-uploader': ['./src/rg-uploader.js'],
    };
    config.output = {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: './',
      library: 'RG_Uploader',
      libraryTarget: 'umd',
      libraryExport: 'default',
    };
    config.externals = {
      jquery: 'jQuery',
    };
    config.plugins = [
      new MiniCssExtractPlugin({ filename: 'rg-uploader.css' }),
    ];
    config.optimization = {
      minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    };
  }

  return config;
};
