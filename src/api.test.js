import {beforeEach, describe, expect, jest, it} from "@jest/globals";
import {Repo} from "./api";

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

describe("api", () => {
  let repo;

  beforeEach(() => {
    global.fetch.mockReset();
    repo = new Repo("user/repo");
  });

  it("successful fetch returns response", async () => {
    mockFetch({json: "success"});
    const response = await repo.ls("directory");
    expect(repo.limits).toEqual({remaining: 10});
    expect(response).toBe("success");
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.github.com/repos/user/repo/contents/directory"
    );
  });

  it("failed fetch returns null", async () => {
    mockFetch({ok: false});
    const response = await repo.ls("failure");
    expect(response).toBeNull();
  });
});
