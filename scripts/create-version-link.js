const fs = require('fs-extra')
const path = require('path')

const logAndExit = require('./utils.js').logAndExit

/**
 * @param {string} newVersion - The new version number for this deployment
 * @param {object} docsDir - The object from Utils.docsDirInfo
 
 * @returns {string} - The absolute path to the created symlink, for removal after compilation
 */
const symlink = (newVersion, docsDir) => {
    const split = docsDir.split
    const linkLocation = split.slice(0, split.indexOf(docsDir.version))
    const linkPath = path.join(...linkLocation, newVersion)

    console.log(`Creating symlink to ${docsDir.version} at ${linkPath}`)
    return fs
        .symlink(docsDir.version, linkPath, 'dir')
        .then(() => {
            console.log(`Symlink successful`)
            return path.resolve(linkPath)
        })
        .catch(logAndExit('Failed to create symlink:'))
}

module.exports = symlink
