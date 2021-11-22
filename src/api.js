import {File} from "./file";

const GITHUB_URL = "https://api.github.com";

class Repo {
  constructor(location) {
    this.location = location;
    this.limits = {
      limit: 0,
      remaining: 0,
      reset: 0,
      used: 0,
    };

    this._callApi = this._callApi.bind(this);
    this._updateLimits = this._updateLimits.bind(this);
  }

  async _callApi(url) {
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Failed to fetch url:", url);
      return null;
    }

    this._updateLimits(response.headers);
    return await response.json();
  }

  _updateLimits(headers) {
    /*
     * Rate limit headers from github are like:
     *   x-ratelimit-limit: 60
     *   x-ratelimit-remaining: 59
     *   x-ratelimit-reset: 1635430325
     *   x-ratelimit-resource: core
     *   x-ratelimit-used: 1
     */
    this.limits.limit = headers.get("x-ratelimit-limit");
    this.limits.remaining = headers.get("x-ratelimit-remaining");
    this.limits.reset = headers.get("x-ratelimit-reset");
    this.limits.used = headers.get("x-ratelimit-used");
  }

  async ls(path) {
    const contents = await this._callApi(
      `${GITHUB_URL}/repos/${this.location}/contents/${path}`
    );

    if (contents === null) {
      return null;
    }

    if (Array.isArray(contents)) {
      return contents.map(file => new File(file));
    }

    return new File(contents);
  }
}

export {Repo};
