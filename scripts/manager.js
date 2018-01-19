#!/usr/bin/env node

const commander = require('commander');
const exec = require('child_process').execSync
const harp = require('harp')
const path = require('path')

const { logAndExit, remove, docsDirInfo } = require('./utils.js')
const copy = require('./copy.js')
const generateComponentsList = require('./generate-components-list.js')
const createSymlink = require('./create-version-link.js')

const BUILD_FOLDER_NAME = 'www'

// Helper method since these two functions occur together
const copyAndGenerate = (dir) => {
    const docsDir = docsDirInfo(dir)

    return generateComponentsList()
        .then(() => copy(docsDir.absPath))
        .then(() => docsDir)
}

commander
    .command('preview <dir>')
    .description('preview the docs')
    .option('-p, --port [port]', 'optional port number', 9000)
    .action((dir, cmd) => {
        copyAndGenerate(dir).then((docsDir) => {
            harp.server(docsDir.absRoot, { port: cmd.port }, () => {
                var hostUrl = "http://localhost:" + cmd.port + "/"
                console.log("Your server is listening at " + hostUrl)
            })
        })
    })

commander
    .command('compile <dir>')
    .description('compile the docs')
    .action((dir) => {
        const docsDir = docsDirInfo(dir)
        const buildFolder = path.join(docsDir.absRoot, BUILD_FOLDER_NAME)

        copyAndGenerate(dir)
            .then(() => remove(buildFolder))
            .then(() => {
                console.log(`Starting Harp compilation of documentation at ${docsDir.absRoot}`)
                harp.compile(docsDir.absRoot, () => {
                    console.log('Docs compilation successful')
                })
            })
    })

commander
    .command('deploy <dir>')
    .description('deploy the docs')
    .option('-v, --version <version>', 'version number')
    .option('-p, --project <project>', /^(progressive-web|amp-sdk)$/)
    .option('-e, --env [env]', 'environment', /^(testing|staging|production)$/, 'testing')
    .action((dir, cmd) => {
        const docsDir = docsDirInfo(dir)
        const buildFolder = path.join(docsDir.absRoot, BUILD_FOLDER_NAME)

        copyAndGenerate(dir)
            .then(() => remove(buildFolder))
            .then(() => {
                const split = docsDir.split
                const linkPath = path.join(split.slice(0, split.indexOf(docsDir.version)))
                return createSymLink(cmd.version, linkPath)
            })
            .then(() => {
                harp.compile(docsDir.absRoot, function (err) {
                    if (err) {
                        console.log('Failed to compile documentation:')
                        console.error(JSON.stringify(err), null, 2)
                        process.exit(1)
                    }
                    console.log('Docs compile successful')
                })
            })
            // TODO: Deploy to S3
            .catch(logAndExit())
    })

commander.parse(process.argv)
