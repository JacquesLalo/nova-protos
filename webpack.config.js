/* global __dirname */

const path = require('path')

module.exports = {
    mode: 'development',
    entry: {
        bloomaway: './bloomaway/js/bloomaway.ts',
        bloomaway_aframe: './bloomaway/js/bloomaway_aframe.tsx',
        audioXR: './audioXR/js/audioXR.ts',
        mecaFlu: './meca-flu/js/meca-flu.js',
        nfl: './nfl/js/nfl.ts',
        infiniteGallery: './infinite-gallery/js/infinite-gallery.ts',
        kartell: './kartell/js/kartell.tsx',
        musicXR: './musicXR/js/musicXR.tsx',
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
