import {beforeEach, describe, expect, jest, it} from "@jest/globals";
import {getContents} from "./api";

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
  beforeEach(() => {
    global.fetch.mockReset();
  });

  it("mock success works", async () => {
    mockFetch({json: "success"});
    const {limits, response} = await getContents("user", "repo", "success");
    expect(limits).toEqual({remaining: 10});
    expect(response).toBe("success");
  });

  it("mock failure works", async () => {
    mockFetch({ok: false});
    const {response} = await getContents("user", "repo", "error");
    expect(response).toBeNull();
  });
});
