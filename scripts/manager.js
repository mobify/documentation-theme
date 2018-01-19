#!/usr/bin/env node

const commander = require('commander');
const exec = require('child_process').execSync
const harp = require('harp')
const path = require('path')
const copy = require('./copy.js')
const generateComponentsList = require('./generate-components-list.js')
const createSymlink = require('./create-version-link.js')

commander
    .command('preview <dir>')
    .description('preview the docs')
    .option('-p, --port [port]', 'optional port number', 9000)
    .action((dir, cmd) => {
        const docsPath = dir.split('/');
        const harpRoot = docsPath[docsPath.indexOf('public') - 1] || '';
        const docsDir = path.resolve(process.cwd(), harpRoot);

        generateComponentsList(() => {
            copy(dir).then(() => {
                harp.server(docsDir, { port: cmd.port }, function(){
                    var hostUrl = "http://localhost" + cmd.port + "/"
                    console.log("Your server is listening at " + hostUrl)
                  })
            })
        })

    })

commander
    .command('compile <dir>')
    .description('compile the docs')
    .action((dir) => {
        const docsPath = dir.split('/');
        const harpRoot = docsPath[docsPath.indexOf('public') - 1] || '';
        const docsDir = path.resolve(process.cwd(), harpRoot);

        generateComponentsList(() => {
            copy(dir).then(() => {
                harp.compile(docsDir, function(){
                    console.log("Docs compile successful")
                  })
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
        const docsPath = dir.split('/');
        const harpRoot = docsPath[docsPath.indexOf('public') - 1] || '';
        const docsDir = path.resolve(process.cwd(), harpRoot);

        generateComponentsList(() => {
            copy(dir).then(() => {
                const symLinkPath = docsPath.slice(0, docsPath.indexOf('public') + 1).join('/')
                createSymlink('latest', symLinkPath, cmd.version, () => {
                    harp.compile(docsDir, function(err){
                        if (err) {
                            console.error(JSON.stringify(err))
                            process.exit(1)
                        }
                        console.log("Docs compile successful")
                        console.log("TODO: Failed to deploy")
                        // exec(`./node_modules/documentation-theme/scripts/deploy.sh -p ${cmd.project} -e ${cmd.env}`)
                      })
                })
            })
        })
    })

commander.parse(process.argv)