/* global __dirname */

const path = require('path')

module.exports = {
    mode: 'development',
    entry: {
        bloomaway: './bloomaway/js/bloomaway.js',
        audioXR: './audioXR/js/audioXR.js',
        mecaFlu: './meca-flu/js/meca-flu.js',
        infiniteGallery: './infinite-gallery/js/infinite-gallery.js',
    },
    devtool: 'source-map',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'builds')
    }
}
