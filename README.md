A common theme shared across Mobify's platform documentation. This theme should
be used for all new documentation going forward. It currently is used for the
following projects:

* [Progressive Web SDK](https://github.com/mobify/progressive-web-sdk)
* [Amp SDK](https://github.com/mobify/mobify-amp-sdk)
* [Docs Hub](https://github.com/mobify/documentation-hub)

# Requirements
- Node ^8.9.x [LTS](https://github.com/nodejs/LTS#lts-schedule)
- npm ^5.5.x

# Setup
The theme is distributed via the [@mobify/documentation-theme](https://www.npmjs.com/package/@mobify/documentation-theme)
npm package. Add as an npm dependency to your project, `npm i` and then make
use of shared templates, mixins, and scripts in your project. Check out one of
the other projects to see how it should be used.

# Developing
The theme itself is not "runnable". The only way to do development on the theme
and be able to quickly test your changes is by using it in another project via
`npm link`.

```bash
git clone git@github.com:mobify/documentation-theme.git
cd documentation-theme
npm i
npm link
cd ../<project-that-uses-theme>
npm link @mobify/documentation-theme
npm run docs:dev
```

# Release
The release is currently done manually. Follow these steps:
1. Cut a release branch from `develop` called `release-vX.Y.Z`
2. Increment the version number in `package.json` and commit that change to the release branch.
3. `npm login`
4. `npm publish`
5. Merge `release-vX.Y.Z` to `master` (no PR review required).
6. Tag a release on GitHub and add a couple notes about what has changed.
7. Merge `master` to `develop` (no PR review required).

# Google Search/SEO

We use a Google Custom Search Engine to power our docs search. For admin
access login as support@mobify.me to https://cse.google.com/cse/ and select
either "Docs Theme Prod" or "Docs Theme Dev" (for local/staging). Credentials
are in LastPass's `Shared-Product` folder.

docs.mobify.com has been added to [Google Search Console](https://www.google.com/webmasters/).
For any investigation around SEO and to do a Fetch As Google you'll want
to start here. Login with the same support@mobify.me account.

## Meta Tags

We support the following metadata in your `_data.json`. These improve our SEO
and make our links look nice when they are posted on Slack or social media.
Please use them!

* `title` - Short and descriptive, bonus points for terminology that somebody
would search for.
* `intro` - One to two sentences about this page. This is used as the `description` meta
tag and may be used in google search results or when a page is shared in slack/social media.
* `crawlPriority` - The priority of this doc relative to other docs on our site
when it comes to web crawlers. `0.5` is the default. Details can be found in the
[sitemaps spec](https://www.sitemaps.org/protocol.html#xmlTagDefinitions).
