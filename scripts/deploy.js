const { exec } = require('child_process')

const getBucket = (env) => env === 'production' ? 'docs.mobify.com' : `docs-${env}.mobify.com`
const getUrl = (env) => {
    // Testing environment doesn't have a domain name set
    if (env === 'testing') return `docs-${env}.mobify.com.s3-website-us-east-1.amazonaws.com`

    return `https://${getBucket(env)}`
}

const deploy = (folder, project, env) => {
    const projectName = project !== 'docs-hub' ? project : ''
    const s3Bucket = getBucket(env)
    const s3Location = `${s3Bucket}/${projectName}`

    console.log(`Deploying "${project}" documentation to ${env} environment (s3://${s3Location})`)

    return new Promise((resolve) => {
        exec(
            `aws s3 sync --size-only \
            --acl public-read \
            --cache-control 'public,max-age=300' \
            --exclude "*" \
            --include "*.css" \
            --include "*.scss" \
            --include "*.html" \
            --include "*.xml" \
            --include "*.js" \
            --include "*.json" \
            --include "*.png" \
            --include "*.jpg" \
            --include "*.jpeg" \
            --include "*.gif" \
            --include "*.svg" \
            --include "*.ico" \
            --include "*.woff" \
            --include "*.otf" \
            --include "*.ttf" \
            ${folder} s3://${s3Location}`,
            (e, stdout, stderr) => {
                if (e) {
                    console.log(stderr);
                    console.error(e);
                    process.exit(1);
                }

                console.log('Deployment successful')
                console.log(`Documentation available at: ${getUrl(env)}/${projectName}`)
                resolve()
            }
        )
    })
}

module.exports = deploy
