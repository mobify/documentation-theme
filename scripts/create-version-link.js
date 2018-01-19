const fs = require('fs-extra')
const path = require('path')

const logAndExit = require('./utils.js').logAndExit

/**
 * @param {string} target - The folder to create a symlink to, normally "latest"
 * @param {string} linkPath - The full path (including name) where the symlink should be made
 */
const symlink = (target, linkPath) => {
    return fs
        .symlink(target, linkPath, 'dir')
        .then(() => {
            console.log(`Created symlink to ${target} at ${dir}.`)
        })
        .catch(logAndExit('Failed to create symlink:'))
}

module.exports = symlink
