import { describe, it, expect, beforeEach, vi } from "vitest";
import { createTorreService } from "@/src/services/torre.service";

describe("TorreService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  describe("createTorreService", () => {
    it("should create a torre service instance", () => {
      const service = createTorreService();

      expect(service).toHaveProperty("searchOpportunities");
      expect(typeof service.searchOpportunities).toBe("function");
    });
  });

  describe("searchOpportunities", () => {
    it("should search opportunities with basic request", async () => {
      const mockResponse = {
        total: 1,
        offset: 0,
        size: 10,
        results: [
          {
            id: "1",
            objective: "Designer",
            type: "job",
            organizations: [{ id: "org1", name: "Test Company" }],
            locations: ["Remote"],
            remote: true,
          },
        ],
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ "content-type": "application/json" }),
      });

      const service = createTorreService();
      const result = await service.searchOpportunities({
        and: [
          {
            keywords: {
              term: "Designer",
              locale: "en",
            },
          },
        ],
      });

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        "https://search.torre.co/opportunities/_search",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            and: [
              {
                keywords: {
                  term: "Designer",
                  locale: "en",
                },
              },
            ],
          }),
        })
      );
    });

    it("should search opportunities with query parameters", async () => {
      const mockResponse = {
        total: 5,
        offset: 0,
        size: 10,
        results: [],
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ "content-type": "application/json" }),
      });

      const service = createTorreService();
      await service.searchOpportunities(
        {
          and: [
            {
              keywords: {
                term: "Developer",
              },
            },
          ],
        },
        {
          currency: "USD",
          periodicity: "hourly",
          lang: "en",
          size: 10,
          contextFeature: "job_feed",
        }
      );

      expect(fetch).toHaveBeenCalledWith(
        "https://search.torre.co/opportunities/_search?currency=USD&periodicity=hourly&lang=en&size=10&contextFeature=job_feed",
        expect.anything()
      );
    });

    it("should search opportunities with complex filters", async () => {
      const mockResponse = {
        total: 2,
        offset: 0,
        size: 10,
        results: [
          {
            id: "1",
            objective: "Senior Designer",
            skills: [
              { name: "Design systems", proficiency: "expert" },
              { name: "Product design", proficiency: "expert" },
            ],
          },
        ],
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ "content-type": "application/json" }),
      });

      const service = createTorreService();
      const result = await service.searchOpportunities({
        and: [
          {
            keywords: {
              term: "Designer",
              locale: "en",
            },
          },
          {
            language: {
              term: "English",
              fluency: "fully-fluent",
            },
          },
          {
            "skill/role": {
              text: "Design systems",
              proficiency: "expert",
            },
          },
          {
            "skill/role": {
              text: "Product design",
              proficiency: "expert",
            },
          },
          {
            status: {
              code: "open",
            },
          },
        ],
      });

      expect(result).toEqual(mockResponse);
      expect(result.results).toHaveLength(1);
      expect(result.results[0].objective).toBe("Senior Designer");
    });

    it("should handle pagination with offset parameter", async () => {
      const mockResponse = {
        total: 100,
        offset: 20,
        size: 10,
        results: [],
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ "content-type": "application/json" }),
      });

      const service = createTorreService();
      await service.searchOpportunities(
        {
          and: [
            {
              keywords: {
                term: "Engineer",
              },
            },
          ],
        },
        {
          size: 10,
          offset: 20,
        }
      );

      expect(fetch).toHaveBeenCalledWith(
        "https://search.torre.co/opportunities/_search?size=10&offset=20",
        expect.anything()
      );
    });

    it("should handle OR filters", async () => {
      const mockResponse = {
        total: 3,
        offset: 0,
        size: 10,
        results: [],
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ "content-type": "application/json" }),
      });

      const service = createTorreService();
      await service.searchOpportunities({
        or: [
          {
            keywords: {
              term: "Designer",
            },
          },
          {
            keywords: {
              term: "Developer",
            },
          },
        ],
      });

      expect(fetch).toHaveBeenCalledWith(
        "https://search.torre.co/opportunities/_search",
        expect.objectContaining({
          body: JSON.stringify({
            or: [
              { keywords: { term: "Designer" } },
              { keywords: { term: "Developer" } },
            ],
          }),
        })
      );
    });

    it("should handle NOT filters", async () => {
      const mockResponse = {
        total: 10,
        offset: 0,
        size: 10,
        results: [],
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ "content-type": "application/json" }),
      });

      const service = createTorreService();
      await service.searchOpportunities({
        and: [
          {
            keywords: {
              term: "Engineer",
            },
          },
        ],
        not: [
          {
            keywords: {
              term: "Junior",
            },
          },
        ],
      });

      expect(fetch).toHaveBeenCalledWith(
        "https://search.torre.co/opportunities/_search",
        expect.objectContaining({
          body: JSON.stringify({
            and: [{ keywords: { term: "Engineer" } }],
            not: [{ keywords: { term: "Junior" } }],
          }),
        })
      );
    });

    it("should include locale field in keywords filter when provided", async () => {
      const mockResponse = {
        total: 1,
        offset: 0,
        size: 10,
        results: [],
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ "content-type": "application/json" }),
      });

      const service = createTorreService();
      await service.searchOpportunities({
        and: [
          {
            keywords: {
              term: "Developer",
              locale: "es",
            },
          },
        ],
      });

      expect(fetch).toHaveBeenCalledWith(
        "https://search.torre.co/opportunities/_search",
        expect.objectContaining({
          body: expect.stringContaining('"locale":"es"'),
        })
      );

      const callArgs = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      const body = JSON.parse(callArgs[1].body);
      expect(body.and[0].keywords).toHaveProperty("locale");
      expect(body.and[0].keywords.locale).toBe("es");
    });

    it("should verify all keywords filters have locale field", async () => {
      const mockResponse = {
        total: 1,
        offset: 0,
        size: 10,
        results: [],
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ "content-type": "application/json" }),
      });

      const service = createTorreService();
      await service.searchOpportunities({
        and: [
          {
            keywords: {
              term: "Frontend",
              locale: "en",
            },
          },
        ],
        or: [
          {
            keywords: {
              term: "React",
              locale: "en",
            },
          },
          {
            keywords: {
              term: "Vue",
              locale: "en",
            },
          },
        ],
      });

      const callArgs = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      const body = JSON.parse(callArgs[1].body);

      // Check AND filters
      expect(body.and[0].keywords).toHaveProperty("locale");
      expect(body.and[0].keywords.locale).toBe("en");

      // Check OR filters
      expect(body.or[0].keywords).toHaveProperty("locale");
      expect(body.or[0].keywords.locale).toBe("en");
      expect(body.or[1].keywords).toHaveProperty("locale");
      expect(body.or[1].keywords.locale).toBe("en");
    });
  });
});
