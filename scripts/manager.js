#!/usr/bin/env node

const commander = require('commander')
const exec = require('child_process').execSync
const harp = require('harp')
const path = require('path')

const { logAndExit, remove, docsDirInfo } = require('./utils.js')
const copy = require('./copy.js')
const generateComponentsList = require('./generate-components-list.js')
const createSymlink = require('./create-version-link.js')
const deploy = require('./deploy.js')

const BUILD_FOLDER_NAME = 'www'

// Helper method since these two functions occur together
const copyAndGenerate = (dir) => {
    const docsDir = docsDirInfo(dir)

    return generateComponentsList()
        .then(() => copy(docsDir.absPath))
        .catch(logAndExit('Error while copying theme files:'))
        .then(() => docsDir)
        .catch(logAndExit('Error while creating component list:'))
}

const compileStep = (dir) => {
    const docsDir = docsDirInfo(dir)
    const buildFolder = path.join(docsDir.absRoot, BUILD_FOLDER_NAME)

    return new Promise((resolve) => {
        return copyAndGenerate(dir)
            .then(() => remove(buildFolder))
            .then(() => {
                console.log(`Starting Harp compilation of documentation at ${docsDir.absRoot}`)
                harp.compile(docsDir.absRoot, () => {
                    console.log('Docs compilation successful')
                    resolve(docsDir)
                })
            })
            .catch(logAndExit('Error during compilation:'))
    })
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
    .action((dir) => compileStep)

commander
    .command('deploy <dir>')
    .description('deploy the docs')
    .option('-v, --version [ver]', 'project version number')
    .option('-p, --project <project>', /^(progressive-web|amp-sdk|docs-hub)$/)
    .option('-e, --env [env]', 'environment', /^(testing|staging|production)$/, 'testing')
    .action((dir, cmd) => {
        const docsDir = docsDirInfo(dir)
        const buildFolder = path.join(docsDir.absRoot, BUILD_FOLDER_NAME)

        const prom = Promise.resolve()

        if (cmd.vers) {
            let symlinkPath
            prom
                .then(() => createSymlink(cmd.vers, docsDir))
                .catch(logAndExit('Error during symlink creation:'))
                .then((s) => {
                    symlinkPath = s
                    return compileStep(dir)
                })
                .then(() => remove(symlinkPath))
        } else {
            prom.then(() => compileStep(dir))
        }

            prom
                .then(() => deploy(buildFolder, cmd.project, cmd.ver, cmd.env))
                .catch(logAndExit('Error during deployment:'))
    })

commander.parse(process.argv)
