A common theme shared across Mobify's platform documentation. This theme should
be used for all new documentation going forward. It currently is used for the
following projects:

* [Progressive Web SDK](https://github.com/mobify/progressive-web-sdk)

# Requirements
- Node ^6.9.x [LTS](https://github.com/nodejs/LTS#lts-schedule)
- npm ^3.10.8

# Setup
Add as an npm dependency to your project, `npm i` and...?

# Google Search/SEO

We use a Google Custom Search Engine to power our docs search. For admin
access login as support@mobify.me to https://cse.google.com/cse/ and select
either "Docs Theme Prod" or "Docs Theme Dev" (for local/staging). Credentials
are in LastPass's `Shared-Product` folder.

docs.mobify.com has been added to [Google Search Console](https://www.google.com/webmasters/).
For any investigation around SEO and to do a Fetch As Google you'll want
to start here. Login with the same support@mobify.me account.

# Things you should do to make your docs awesome
^^^ Not sure this belongs here but... I wanna have this written down somewhere
and this seems good enough for right this second.

* We support the following metadata in your `_data.json`, use it!
   * `title` - Short and descriptive, bonus points for terminology that somebody
   would search for.
   * `description` - One to two sentences about this page. May be used in google
   search results or when a page is shared in slack/social media.
   * `crawlPriority` - The priority of this doc relative to other docs on our site
   when it comes to web crawlers. `0.5` is the default. Details can be found in the
   [sitemaps spec](https://www.sitemaps.org/protocol.html#xmlTagDefinitions).



