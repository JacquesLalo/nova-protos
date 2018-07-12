/* global __dirname */

const path = require('path')

module.exports = {
    mode: 'development',
    entry: {
        bloomaway: './bloomaway/js/bloomaway.ts',
        audioXR: './audioXR/js/audioXR.js',
        mecaFlu: './meca-flu/js/meca-flu.js',
        infiniteGallery: './infinite-gallery/js/infinite-gallery.ts',
    },
    devtool: 'source-map',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'builds')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ],

    },
    resolve: {
        extensions: [ '.ts', '.js' ]
    },
}
