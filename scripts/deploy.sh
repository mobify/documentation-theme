#!/bin/bash

# Identifies the path that the script is in (http://stackoverflow.com/a/246128/11807)
# We expect this to end up in $ROOT/node_modules/.bin/
MYPATH=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
ROOT="$MYPATH/../.."
WWW_ROOT="$ROOT/docs/www"

ENVIRONMENT="testing" # or production
PROJECT=""

function usage() {
    echo "usage: $0 -e (production|staging|testing) -p (progressive-web|amp-sdk)"
}

function s3_operation() {
    OP=$1; shift
    SOURCE=$1; shift
    TARGET=$1; shift

    aws s3 $OP "$SOURCE" "$TARGET" \
        $@ \
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
        --include "*.ttf"
}

function s3_sync() {
    # s3_operation sync $1 $2 --delete --size-only
    s3_operation sync $1 $2 --size-only
}

while getopts e:p: opt; do
    case $opt in
        e)
            if [[ "$OPTARG" != "production" && "$OPTARG" != "staging" && "$OPTARG" != "testing" ]]; then
                echo "Error: Unsupported environment ('-e') option: $OPTARG"
                usage
                exit 1
            fi
            ENVIRONMENT="$OPTARG"
            ;;
        p)
            if [[ "$OPTARG" != "progressive-web" && "$OPTARG" != "amp-sdk" ]]; then
                echo "Error: Unsupported project ('-p') option: $OPTARG"
                usage
                exit 1
            fi
            PROJECT="$OPTARG"
            ;;
        *)
            echo "Error: Unsupported option: $opt"
            usage
            exit 1
    esac
done

if [[ "$ENVIRONMENT" == "" || "$PROJECT" == "" ]]; then
    usage
    exit 1
fi

if [ "$ENVIRONMENT" == "testing" ]; then
    S3_BUCKET="docs-testing.mobify.com"
    URL="docs-testing.mobify.com"
elif [ "$ENVIRONMENT" == "staging" ]; then
    S3_BUCKET="docs-staging.mobify.com"
    URL="docs-staging.mobify.com"
elif [ "$ENVIRONMENT" = "production" ]; then
    S3_BUCKET="docs.mobify.com"
    URL="docs.mobify.com"
fi

if [[ ! -d "$WWW_ROOT" ]]; then
    echo "** ERROR **"
    echo "  No documentation exists at $WWW_ROOT."
    exit 1
fi

echo "Deploying ${PROJECT} docs to: s3://${S3_BUCKET}/${PROJECT}"

# TODO: Comment out before merge
# read -p "DEV MODE: Please verify the above is correct and press [Enter]..."

set -e # Abort script if `aws` returns a non-zero exit code
s3_sync "$WWW_ROOT" "s3://${S3_BUCKET}/${PROJECT}"

echo ""
echo "Documentation available at: http://${URL}/${PROJECT}"
