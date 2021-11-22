import {beforeEach, describe, expect, jest, it} from "@jest/globals";
import {File} from "./file";

global.fetch = jest.fn();

const mockFetch = (ok = true) => {
  global.fetch.mockReturnValueOnce(
    Promise.resolve({
      ok,
      json: () => Promise.resolve("json content"),
      text: () => Promise.resolve("text content"),
    })
  );
};

describe("file", () => {
  let file;

  beforeEach(() => {
    global.fetch.mockReset();
    file = new File({
      type: "file",
      path: "some/path",
      name: "My File.txt",
      html_url: "https://github.com/owner/repo/blob/branch/html_url",
      download_url: "download_url",
    });
  });

  it("calculates edit_url correctly", () => {
    expect(file.edit_url).toBe(
      "https://github.com/owner/repo/edit/branch/html_url"
    );
  });

  it("can download text", async () => {
    mockFetch();
    const contents = await file.download();
    expect(contents).toBe("text content");
  });

  it("can download json", async () => {
    mockFetch();
    const contents = await file.download("json");
    expect(contents).toBe("json content");
  });

  it("returns null on download error", async () => {
    mockFetch(false);
    const contents = await file.download("json");
    expect(contents).toBeNull();
  });
});
