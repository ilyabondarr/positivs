const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const filename = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

const optimization = () => {
    const configObj = {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                }
            }
        }
    };

    if (isProd) {
        configObj.minimizer = [
            new CssMinimizerPlugin(),
            new TerserWebpackPlugin()
        ];
    }
    return configObj;
};

const plugins = () => {
    const basePlugins = [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/pages/index.html'),
            filename: 'index.html',
            minify: isProd ? {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true
            } : false
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: `./css/${filename('css')}`
        })
    ];
    
    if (isProd) {
        basePlugins.push(
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminMinify,
                    options: {
                        plugins: [
                            ["gifsicle", { interlaced: true }],
                            ["jpegtran", { progressive: true }],
                            ["optipng", { optimizationLevel: 5 }],
                            [
                                "svgo",
                                {
                                    plugins: [
                                        {
                                            removeViewBox: false
                                        }
                                    ]
                                }
                            ]
                        ]
                    }
                }
            })
        );
    }

    return basePlugins;
};

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: isDev ? 'development' : 'production',
    entry: './js/index.js',
    output: {
        filename: `./js/${filename('js')}`,
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: `./images/${filename('[ext]')}`,
        publicPath: ''
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist'),
        },
        historyApiFallback: true,
        open: true,
        compress: true,
        hot: true,
        port: 3000,
        watchFiles: ['src/**/*']
    },
    optimization: optimization(),
    plugins: plugins(),
    devtool: isDev ? 'eval-source-map' : false,
    module: {
        rules: [
            {
                test: /\.html$/,
                use: 'html-loader'
            },
            {
                test: /\.css$/i,
                use: [
                    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    isDev ? 'style-loader' : {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: (resourcePath, context) => {
                                return path.relative(path.dirname(resourcePath), context) + '/';
                            },
                        }
                    },
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.(jpg|png|svg|jpeg|gif|webp)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name].[hash][ext]'
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name].[hash][ext]'
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.scss', '.css'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@assets': path.resolve(__dirname, 'src/assets'),
            '@styles': path.resolve(__dirname, 'src/assets/style'),
            '@images': path.resolve(__dirname, 'src/assets/images'),
            '@fonts': path.resolve(__dirname, 'src/assets/fonts'),
            '@fonts-converted': path.resolve(__dirname, 'src/assets/fonts/converted')
        }
    }
};