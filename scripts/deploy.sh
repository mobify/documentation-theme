#!/bin/bash

# Identifies the path that the script is in (http://stackoverflow.com/a/246128/11807)
# We expect this to end up in $ROOT/node_modules/.bin/
MYPATH=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
ROOT="$MYPATH/../.."
WWW_ROOT="$ROOT/docs/www"

ENVIRONMENT="staging" # or production
VERSION=""
DOCS_DIR=""
PROJECT=""

function usage() {
    echo "usage: $0 -e (production|staging) -v version -p (progressive-web|amp-sdk)"
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
    s3_operation sync $1 $2 --delete --size-only
}

while getopts e:v:p: opt; do
    case $opt in
        e)
            if [[ "$OPTARG" != "production" && "$OPTARG" != "staging" ]]; then
                echo "Error: Unsupported environment ('-e') option: $OPTARG"
                usage
                exit 1
            fi
            ENVIRONMENT="$OPTARG"
            ;;
        v)
            VERSION="$OPTARG"
            ;;
        p)
            if [[ "$OPTARG" != "progressive-web" && "$OPTARG" != "amp-sdk" ]]; then
                echo "#rror: Unsupported project ('-p') option: $OPTARG"
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

if [[ "$ENVIRONMENT" == "" || "$VERSION" == "" || "$PROJECT" == "" ]]; then
    usage
    exit 1
fi

DOCS_DIR="$WWW_ROOT/latest"
ASSET_DIR="$WWW_ROOT/assets"
THEME_DIR="$WWW_ROOT/theme"

if [ "$ENVIRONMENT" == "staging" ]; then
    S3_BUCKET="docs-staging.mobify.com"
    URL="docs-staging.mobify.com"
elif [ "$ENVIRONMENT" = "production" ]; then
    S3_BUCKET="docs.mobify.com"
    URL="docs.mobify.com"
fi

if [[ ! -d "$DOCS_DIR" ]]; then
    echo "** ERROR **"
    echo "  No documentation exists at $DOCS_DIR."
    exit 1
fi

echo "Deploying ${PROJECT} docs to: s3://${S3_BUCKET}/${PROJECT}/${VERSION}"

# TODO: Comment out before merge
read -p "DEV MODE: Please verify the above is correct and press [Enter]..."

set -e # Abort script if `aws` returns a non-zero exit code
s3_operation cp "$WWW_ROOT/index.html" "s3://${S3_BUCKET}/${PROJECT}/index.html"
s3_operation cp "$WWW_ROOT/404.html" "s3://${S3_BUCKET}/${PROJECT}/404.html"

# AWS is just an object store and does not support anything like symbollic links.
# We must sync to both the version # + latest
s3_sync "$DOCS_DIR"  "s3://${S3_BUCKET}/${PROJECT}/${VERSION}"
s3_sync "$DOCS_DIR"  "s3://${S3_BUCKET}/${PROJECT}/latest"

# TODO jason - does this need to change... I think we want assets to be versioned (now? future?)
s3_sync "$ASSET_DIR" "s3://${S3_BUCKET}/${PROJECT}/assets"
s3_sync "$THEME_DIR" "s3://${S3_BUCKET}/${PROJECT}/theme"

echo ""
echo "Documentation available at: http://${URL}/${PROJECT}/${VERSION} AND http://${URL}/${PROJECT}/latest"
