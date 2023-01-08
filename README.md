# gh-reader

Get files from Github in Javascript

This is a simple wrapper around `fetch` which gets file or directory
listings from GitHub via anonymous API calls. There's reasonable
HTTP caching in GitHub already (60s on any directory or file listing)
and the ratelimit is 60 calls (i.e. fresh / cache miss) per hour.

The returned File objects can have their text/json/etc content downloaded
from the corresponding raw.githubusercontent site.

Example:

```js
const repo = new Repo("don-patterson/gh-reader");
const srcFiles = await repo.ls("src");
// and `srcFiles` looks like:
[
  File({name: "api.js", type: "file", path: "src/api.js", ...}),
  File({name: "index.js", type: "file", path: "src/index.js", ...}),
  ...
]

const content = await srcFiles[0].download();
// `download` gets text by default
```
