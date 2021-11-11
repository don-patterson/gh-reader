# gh-reader

Get files from Github in Javascript

This is a simple wrapper around `fetch` which gets and caches responses
from anonymous GitHub API calls. If there's any interest, I could make
it a little more robust and/or configurable.

Example:

```js
const repo = new Repo("deek80/gh-reader");
const srcFiles = await repo.ls("src");
// and `srcFiles` looks like:
[
  {name: "api.js", download_url: "...", type: "file"},
  {name: "index.js", download_url: "...", type: "file"},
  ...
]
```
