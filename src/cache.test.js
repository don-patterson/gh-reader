import {beforeEach, describe, expect, jest, it} from "@jest/globals";
import {Cache} from "./cache";

describe("cache", () => {
  let cache, fetchNew;

  beforeEach(() => {
    fetchNew = jest.fn(() => "default!");
    cache = new Cache({maxSize: 3, defaultFetch: fetchNew});
    cache.set("a", 1);
    cache.set("b", 2);
    cache.set("c", 3);
  });

  it("initializes as expected", () => {
    expect(cache).not.toBeNull();
    expect(cache.maxSize).toBe(3);
    expect(cache.expiryMinutes).toBe(15);
  });

  it("actually remembers the values", async () => {
    expect(await cache.get("b")).toBe(2);
  });

  it("removes the oldest values when you surpass maxSize", async () => {
    cache.set("d", 4);
    expect(cache.items.size).toBe(3);
    expect(await cache.get("a")).toBe("default!");
  });

  it("calls the fetch function on cache miss", async () => {
    await cache.get("z");
    expect(fetchNew).toHaveBeenCalledWith("z");
  });

  it("can override the fetch function", async () => {
    const myCustomFetch = jest.fn();
    await cache.get("z", myCustomFetch);
    expect(myCustomFetch).toHaveBeenCalledWith("z");
    expect(fetchNew).not.toHaveBeenCalled();
  });

  it("does not call the fetch function on cache hit", async () => {
    await cache.get("a");
    expect(fetchNew).not.toHaveBeenCalled();
  });

  it("calls the fetch function when keys expire", async () => {
    cache.expiryMinutes = -1;
    await cache.get("a");
    expect(fetchNew).toHaveBeenCalledWith("a");
  });
});
