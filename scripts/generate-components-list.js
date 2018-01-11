#!/usr/bin/env node

const fs = require('fs')
const glob = require('glob')
const path = require('path')

const componentList = []
const componentsPath = path.join('src', 'components')
const folders = glob.sync(path.resolve(`${componentsPath}/*`))

const formatComponentName = (component) => {
    const lastSlash = component.lastIndexOf('/')
    const removedDir = component.slice(lastSlash + 1)
    const firstCharRegex = /\b([a-z])/g
    const capitalized = removedDir.replace(firstCharRegex, (x) => x.toUpperCase())
    return capitalized.replace(/-/g, '')
}

folders.forEach((folder) => {
    const reactComponents = glob.sync(path.resolve(folder, '*.jsx'))

    if (reactComponents.length === 0) {
        const designComponents = glob.sync(path.resolve(folder, 'DESIGN_README.md'))
        designComponents.forEach((designComponent) => {
            designComponent = designComponent.replace(/\/?DESIGN_README.md/, '')
            componentList.push(formatComponentName(designComponent))
        })
    } else {
        if (glob.sync(path.resolve(folder, 'README.md')).length > 0) {
            reactComponents.forEach((reactComponent) => {
                reactComponent = reactComponent.replace(/\/?index.jsx/, '')
                reactComponent = reactComponent.replace('.jsx', '')
                componentList.push(formatComponentName(reactComponent))
            })
        }
    }
})

const componentsJSON = JSON.stringify({
    _excludeFromMenu: true,
    _componentsList: componentList
})

fs.writeFile(path.join('docs', 'public', 'dev', 'components', '_data.json'),
    componentsJSON,
    {},
    (e) => {
        if (e) {
            console.error('Failed to generate components list')
            console.error(e)
            process.exit(1)
        } else {
            console.log('Successfully generated components JSON data')
        }
    })
