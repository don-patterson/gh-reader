import {Cache} from "./cache";
const cache = new Cache();
const limits = {
  limit: 0,
  remaining: 0,
  reset: 0,
  used: 0,
};

const _updateLimits = headers => {
  /*
   * Rate limit headers from github are like:
   *   x-ratelimit-limit: 60
   *   x-ratelimit-remaining: 59
   *   x-ratelimit-reset: 1635430325
   *   x-ratelimit-resource: core
   *   x-ratelimit-used: 1
   */
  limits.limit = headers.get("x-ratelimit-limit");
  limits.remaining = headers.get("x-ratelimit-remaining");
  limits.reset = headers.get("x-ratelimit-reset");
  limits.used = headers.get("x-ratelimit-used");
};

const _fetch = async url => {
  const response = await fetch(url);
  if (!response.ok) {
    console.error("Failed to fetch url:", url);
    return null;
  }

  _updateLimits(response.headers);
  return await response.json();
};

const getContents = async (user, repo, path = "") => {
  const url = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;
  const response = await cache.get(url, _fetch);
  return {limits, response};
};

export {getContents};
