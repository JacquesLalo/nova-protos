/**
 * @fileOverview
 * @name sceneData.js
 * @author Nova Media LLC
 * @license TBD

 This file contains a description of Bloomaway scenes so they are easily importable from a Bloomaway object
 */
// King
const king = {
    name: 'king/scene',
    options: {
        scale: {
            x: 2,
            y: 2,
            z: 2,
        },
        position: {
            x: 4,
            y: 0,
            z: -15
        },
    },
}

// Archi
const archi = {
    name: 'archi/scene',
    options: {
        scale: {
            x: 0.1,
            y: 0.1,
            z: 0.1,
        },
        position: {
            x: -100,
            y: -10,
            z: 10
        },
    },
}
const scenes = {
    king,
    archi,
}
