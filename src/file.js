class File {
  constructor({type, name, path, html_url, download_url}) {
    this.type = type;
    this.path = path;
    this.name = name;
    this.html_url = html_url;
    this.download_url = download_url;
  }

  async download(format = "text") {
    const response = await fetch(this.download_url);
    if (!response.ok) {
      console.error("Failed to fetch url:", this.download_url);
      return null;
    }
    return response[format]();
  }

  get edit_url() {
    // html_url looks like: "https://github.com/{owner}/{repo}/blob/{branch}/{path}"
    // edit_url looks like: "https://github.com/{owner}/{repo}/edit/{branch}/{path}"
    const parts = this.html_url.split("/");
    parts[5] = "edit";
    return parts.join("/");
  }
}

export {File};
