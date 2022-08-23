import fetch from "jest-fetch-mock";
import { getDomain, getCurrentIp } from "./main";

fetch.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
});

describe("getCurrentIp", () => {
  it("should return an ip", async () => {
    fetch.mockResponseOnce(JSON.stringify({ ip: "1.2.3.4" }));
    const ip = await getCurrentIp();
    expect(ip).toBe("1.2.3.4");
  });
});

describe("getDomain", () => {
  it("should throw error if domain is not provided", () => {
    expect(() => getDomain("")).toThrowError("Domain is required");
  });
  it("should throw error if domain does not end with .com", () => {
    expect(() => getDomain("test.fr")).toThrowError(
      "Domain must end with .com"
    );
  });
  it("should return domain with _com if domain ends with .com", () => {
    expect(getDomain("test.com")).toBe("test_com");
  });
});
