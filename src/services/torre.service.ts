import { createHttpService, HttpService } from "./http.service";

export type Fluency =
  | "basic"
  | "conversational"
  | "fluent"
  | "fully-fluent"
  | "native";
export type Proficiency =
  | "novice"
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert"
  | "master";
export type Currency = "USD" | "EUR" | "GBP" | "ARS" | "COP" | "MXN" | "BRL";
export type Periodicity = "hourly" | "daily" | "weekly" | "monthly" | "yearly";
export type StatusCode = "open" | "closed" | "draft";

export interface KeywordsFilter {
  keywords: {
    term: string;
    locale?: string;
  };
}

export interface LanguageFilter {
  language: {
    term: string;
    fluency: Fluency;
  };
}

export interface SkillRoleFilter {
  "skill/role": {
    text: string;
    proficiency: Proficiency;
  };
}

export interface StatusFilter {
  status: {
    code: StatusCode;
  };
}

export type SearchFilter =
  | KeywordsFilter
  | LanguageFilter
  | SkillRoleFilter
  | StatusFilter;

export interface SearchOpportunitiesRequest {
  and?: SearchFilter[];
  or?: SearchFilter[];
  not?: SearchFilter[];
}

export interface SearchOpportunitiesParams {
  currency?: Currency;
  periodicity?: Periodicity;
  lang?: string;
  size?: number;
  contextFeature?: string;
  offset?: number;
  aggregate?: boolean;
}

export interface Opportunity {
  id: string;
  objective?: string;
  type?: string;
  organizations?: Array<{
    id: string;
    name: string;
    picture?: string;
  }>;
  locations?: string[];
  remote?: boolean;
  compensation?: {
    minAmount?: number;
    maxAmount?: number;
    currency?: string;
    periodicity?: string;
  };
  skills?: Array<{
    name: string;
    proficiency?: string;
  }>;
  members?: Array<{
    username: string;
    name: string;
    picture?: string;
  }>;
  deadline?: string;
  status?: string;
  attachments?: Array<{
    address: string;
  }>;
}

export interface SearchOpportunitiesResponse {
  total: number;
  offset: number;
  size: number;
  aggregators?: Record<string, unknown>;
  results: Opportunity[];
}

export interface TorreService {
  searchOpportunities: (
    request: SearchOpportunitiesRequest,
    params?: SearchOpportunitiesParams
  ) => Promise<SearchOpportunitiesResponse>;
}

export function createTorreService(): TorreService {
  const httpService: HttpService = createHttpService({
    baseURL: "https://search.torre.co",
    headers: {
      "Content-Type": "application/json",
    },
  });

  function buildSearchParams(
    params?: SearchOpportunitiesParams
  ): Record<string, string> {
    if (!params) {
      return {};
    }

    const queryParams: Record<string, string> = {};

    if (params.currency) queryParams.currency = params.currency;
    if (params.periodicity) queryParams.periodicity = params.periodicity;
    if (params.lang) queryParams.lang = params.lang;
    if (params.size !== undefined) queryParams.size = params.size.toString();
    if (params.contextFeature)
      queryParams.contextFeature = params.contextFeature;
    if (params.offset !== undefined)
      queryParams.offset = params.offset.toString();
    if (params.aggregate !== undefined)
      queryParams.aggregate = params.aggregate.toString();

    return queryParams;
  }

  async function searchOpportunities(
    request: SearchOpportunitiesRequest,
    params?: SearchOpportunitiesParams
  ): Promise<SearchOpportunitiesResponse> {
    const queryParams = buildSearchParams(params);

    return httpService.post<SearchOpportunitiesResponse>(
      "/opportunities/_search",
      request,
      {
        params: queryParams,
      }
    );
  }

  return {
    searchOpportunities,
  };
}
