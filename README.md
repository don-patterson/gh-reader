# gh-reader
Get files from Github in Javascript

This is a simple wrapper around `fetch` which gets and caches responses
from anonymous GitHub API calls. If there's any interest, I could make
it a little more robust and/or configurable.

Example:
```js
const srcContents = await getContents("deek80", "gh-reader", "src");
# srcContents looks like:
# {
#   limits: {
#     limit: "60"
#     remaining: "59"
#     reset: "1636122806"
#     used: "1"
#   },
#   response: [
#    {name: "api.js", download_url: "...", type: "file"},
#    ...
#  ]
# }
