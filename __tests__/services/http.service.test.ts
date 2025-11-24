import { describe, it, expect, beforeEach, vi } from "vitest";
import { createHttpService } from "@/src/services/http.service";

describe("HttpService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  describe("createHttpService", () => {
    it("should create an http service instance", () => {
      const service = createHttpService();

      expect(service).toHaveProperty("get");
      expect(service).toHaveProperty("post");
      expect(service).toHaveProperty("put");
      expect(service).toHaveProperty("patch");
      expect(service).toHaveProperty("delete");
    });

    it("should use provided baseURL", async () => {
      const mockResponse = { data: "test" };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ "content-type": "application/json" }),
      });

      const service = createHttpService({ baseURL: "https://api.example.com" });
      await service.get("/users");

      expect(fetch).toHaveBeenCalledWith(
        "https://api.example.com/users",
        expect.objectContaining({
          method: "GET",
        })
      );
    });

    it("should merge default headers with custom headers", async () => {
      const mockResponse = { data: "test" };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ "content-type": "application/json" }),
      });

      const service = createHttpService({
        headers: { Authorization: "Bearer token" },
      });

      await service.get("https://api.example.com/users", {
        headers: { "X-Custom": "value" },
      });

      expect(fetch).toHaveBeenCalledWith(
        "https://api.example.com/users",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer token",
            "X-Custom": "value",
          }),
        })
      );
    });
  });

  describe("GET request", () => {
    it("should make a GET request and return JSON data", async () => {
      const mockData = { id: 1, name: "John" };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockData,
        headers: new Headers({ "content-type": "application/json" }),
      });

      const service = createHttpService();
      const result = await service.get("https://api.example.com/users/1");

      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith(
        "https://api.example.com/users/1",
        expect.objectContaining({
          method: "GET",
        })
      );
    });

    it("should append query parameters", async () => {
      const mockData = { results: [] };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockData,
        headers: new Headers({ "content-type": "application/json" }),
      });

      const service = createHttpService();
      await service.get("https://api.example.com/users", {
        params: { page: "1", limit: "10" },
      });

      expect(fetch).toHaveBeenCalledWith(
        "https://api.example.com/users?page=1&limit=10",
        expect.anything()
      );
    });
  });

  describe("POST request", () => {
    it("should make a POST request with data", async () => {
      const postData = { name: "John", email: "john@example.com" };
      const mockResponse = { id: 1, ...postData };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ "content-type": "application/json" }),
      });

      const service = createHttpService();
      const result = await service.post(
        "https://api.example.com/users",
        postData
      );

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        "https://api.example.com/users",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(postData),
        })
      );
    });
  });

  describe("PUT request", () => {
    it("should make a PUT request with data", async () => {
      const putData = { name: "Jane" };
      const mockResponse = { id: 1, ...putData };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ "content-type": "application/json" }),
      });

      const service = createHttpService();
      const result = await service.put(
        "https://api.example.com/users/1",
        putData
      );

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        "https://api.example.com/users/1",
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify(putData),
        })
      );
    });
  });

  describe("PATCH request", () => {
    it("should make a PATCH request with data", async () => {
      const patchData = { name: "Jane" };
      const mockResponse = { id: 1, name: "Jane", email: "jane@example.com" };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ "content-type": "application/json" }),
      });

      const service = createHttpService();
      const result = await service.patch(
        "https://api.example.com/users/1",
        patchData
      );

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        "https://api.example.com/users/1",
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify(patchData),
        })
      );
    });
  });

  describe("DELETE request", () => {
    it("should make a DELETE request", async () => {
      const mockResponse = { success: true };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ "content-type": "application/json" }),
      });

      const service = createHttpService();
      const result = await service.delete("https://api.example.com/users/1");

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        "https://api.example.com/users/1",
        expect.objectContaining({
          method: "DELETE",
        })
      );
    });
  });

  describe("Error handling", () => {
    it("should throw an error when response is not ok", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      const service = createHttpService();

      await expect(
        service.get("https://api.example.com/users/999")
      ).rejects.toThrow("HTTP Error: 404 Not Found");
    });

    it("should handle timeout", async () => {
      global.fetch = vi.fn().mockImplementation(
        (_url, options) =>
          new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              resolve({ ok: true, json: async () => ({}) });
            }, 100);

            options?.signal?.addEventListener("abort", () => {
              clearTimeout(timeout);
              reject(
                new DOMException("The operation was aborted", "AbortError")
              );
            });
          })
      );

      const service = createHttpService({ timeout: 50 });

      await expect(service.get("https://api.example.com/slow")).rejects.toThrow(
        "Request timeout after 50ms"
      );
    });

    it("should handle non-JSON responses", async () => {
      const textResponse = "Plain text response";
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: async () => textResponse,
        headers: new Headers({ "content-type": "text/plain" }),
      });

      const service = createHttpService();
      const result = await service.get("https://api.example.com/text");

      expect(result).toBe(textResponse);
    });
  });
});
