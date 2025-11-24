import { createTorreService } from "@/src/services";
import type {
  SearchOpportunitiesRequest,
  SearchOpportunitiesParams,
} from "@/src/services";

// Create an instance of the Torre service
const torreService = createTorreService();

// Example 1: Basic search for Designer opportunities
async function searchDesignerJobs() {
  const request: SearchOpportunitiesRequest = {
    and: [
      {
        keywords: {
          term: "Designer",
          locale: "en",
        },
      },
      {
        status: {
          code: "open",
        },
      },
    ],
  };

  const params: SearchOpportunitiesParams = {
    currency: "USD",
    periodicity: "hourly",
    lang: "en",
    size: 10,
    contextFeature: "job_feed",
  };

  try {
    const response = await torreService.searchOpportunities(request, params);
    console.log(`Found ${response.total} opportunities`);
    console.log("Results:", response.results);
    return response;
  } catch (error) {
    console.error("Error searching opportunities:", error);
    throw error;
  }
}

// Example 2: Advanced search with multiple filters
async function searchSeniorDesignerJobs() {
  const request: SearchOpportunitiesRequest = {
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
  };

  const params: SearchOpportunitiesParams = {
    currency: "USD",
    size: 20,
    lang: "en",
  };

  const response = await torreService.searchOpportunities(request, params);
  return response;
}

// Example 3: Search with OR conditions
async function searchMultipleRoles() {
  const request: SearchOpportunitiesRequest = {
    or: [
      {
        keywords: {
          term: "Frontend Developer",
        },
      },
      {
        keywords: {
          term: "Full Stack Developer",
        },
      },
      {
        keywords: {
          term: "Backend Developer",
        },
      },
    ],
    and: [
      {
        status: {
          code: "open",
        },
      },
    ],
  };

  const response = await torreService.searchOpportunities(request, {
    size: 15,
    currency: "USD",
  });

  return response;
}

// Example 4: Pagination - fetch next page
async function searchWithPagination(offset: number = 0, size: number = 10) {
  const request: SearchOpportunitiesRequest = {
    and: [
      {
        keywords: {
          term: "Software Engineer",
        },
      },
      {
        status: {
          code: "open",
        },
      },
    ],
  };

  const params: SearchOpportunitiesParams = {
    size,
    offset,
    currency: "USD",
    lang: "en",
  };

  const response = await torreService.searchOpportunities(request, params);

  console.log(`Page ${Math.floor(offset / size) + 1}:`);
  console.log(
    `Showing ${response.results.length} of ${response.total} total results`
  );

  return response;
}

// Example 5: Exclude certain terms
async function searchExcludingTerms() {
  const request: SearchOpportunitiesRequest = {
    and: [
      {
        keywords: {
          term: "Developer",
        },
      },
      {
        status: {
          code: "open",
        },
      },
    ],
    not: [
      {
        keywords: {
          term: "Junior",
        },
      },
      {
        keywords: {
          term: "Intern",
        },
      },
    ],
  };

  const response = await torreService.searchOpportunities(request, {
    size: 10,
    currency: "USD",
  });

  return response;
}

// Example 6: Search by specific skill proficiency
async function searchBySkillLevel() {
  const request: SearchOpportunitiesRequest = {
    and: [
      {
        "skill/role": {
          text: "React",
          proficiency: "expert",
        },
      },
      {
        "skill/role": {
          text: "TypeScript",
          proficiency: "advanced",
        },
      },
      {
        status: {
          code: "open",
        },
      },
    ],
  };

  const response = await torreService.searchOpportunities(request, {
    size: 10,
    currency: "USD",
    periodicity: "monthly",
  });

  return response;
}

// Example 7: Process and filter results
async function findRemoteOpportunitiesOnly() {
  const request: SearchOpportunitiesRequest = {
    and: [
      {
        keywords: {
          term: "Software Engineer",
        },
      },
      {
        status: {
          code: "open",
        },
      },
    ],
  };

  const response = await torreService.searchOpportunities(request, {
    size: 50,
  });

  // Filter for remote opportunities
  const remoteOpportunities = response.results.filter(
    (opp) => opp.remote === true
  );

  console.log(
    `Found ${remoteOpportunities.length} remote opportunities out of ${response.results.length}`
  );

  return remoteOpportunities;
}

// Export all examples
export {
  torreService,
  searchDesignerJobs,
  searchSeniorDesignerJobs,
  searchMultipleRoles,
  searchWithPagination,
  searchExcludingTerms,
  searchBySkillLevel,
  findRemoteOpportunitiesOnly,
};
