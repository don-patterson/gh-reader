import {beforeEach, describe, expect, jest, it} from "@jest/globals";
import {Repo} from "./api";
import {File} from "./file";

global.fetch = jest.fn();

const mockFetch = ({json = "", ok = true} = {}) => {
  global.fetch.mockReturnValueOnce(
    Promise.resolve({
      ok,
      headers: new Map([["x-ratelimit-remaining", 10]]),
      json: () => Promise.resolve(json),
    })
  );
};

const file = name => new File({name});

describe("api", () => {
  let repo;

  beforeEach(() => {
    global.fetch.mockReset();
    repo = new Repo("user/repo");
  });

  it("can return a single file response", async () => {
    const fakeFile = file("file1");
    mockFetch({json: fakeFile});

    const response = await repo.ls("path/to/file1");

    expect(repo.limits).toEqual({remaining: 10});
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.github.com/repos/user/repo/contents/path/to/file1"
    );
    expect(response).toEqual(fakeFile);
  });

  it("can return a directory listing", async () => {
    const fakeFiles = [file("file1"), file("file2")];
    mockFetch({json: fakeFiles});

    const response = await repo.ls("path/to/directory");

    expect(repo.limits).toEqual({remaining: 10});
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.github.com/repos/user/repo/contents/path/to/directory"
    );
    expect(response).toEqual(fakeFiles);
  });

  it("returns null on error", async () => {
    mockFetch({ok: false});
    const response = await repo.ls("failure");
    expect(response).toBeNull();
  });
});
