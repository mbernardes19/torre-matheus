import type { Opportunity } from "@/src/services";
import Image from "next/image";

interface SearchResultItemProps {
  opportunity: Opportunity;
}

export function SearchResultItem({ opportunity }: SearchResultItemProps) {
  const organizationName =
    opportunity.organizations?.[0]?.name || "Unknown Company";
  const organizationLogo = opportunity.organizations?.[0]?.picture;
  const hasCompensation =
    opportunity.compensation?.minAmount || opportunity.compensation?.maxAmount;

  const formatCompensation = () => {
    if (!hasCompensation) return null;

    const { minAmount, maxAmount, currency, periodicity } =
      opportunity.compensation!;
    const currencySymbol = currency === "USD" ? "$" : currency;

    if (minAmount && maxAmount) {
      return `${currencySymbol}${minAmount.toLocaleString()} - ${currencySymbol}${maxAmount.toLocaleString()}${
        periodicity ? `/${periodicity}` : ""
      }`;
    } else if (minAmount) {
      return `${currencySymbol}${minAmount.toLocaleString()}+${
        periodicity ? `/${periodicity}` : ""
      }`;
    } else if (maxAmount) {
      return `Up to ${currencySymbol}${maxAmount.toLocaleString()}${
        periodicity ? `/${periodicity}` : ""
      }`;
    }
    return null;
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      <div className="flex gap-4">
        {/* Company Logo */}
        {organizationLogo ? (
          <div className="flex-shrink-0">
            <Image
              src={organizationLogo}
              alt={organizationName}
              width={48}
              height={48}
              className="h-12 w-12 rounded-lg object-cover"
            />
          </div>
        ) : (
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Company */}
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
              {opportunity.objective || "Untitled Position"}
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {organizationName}
            </p>
          </div>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-3 text-sm text-zinc-600 dark:text-zinc-400">
            {/* Location */}
            {opportunity.remote ? (
              <div className="flex items-center gap-1">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Remote</span>
              </div>
            ) : opportunity.locations && opportunity.locations.length > 0 ? (
              <div className="flex items-center gap-1">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{opportunity.locations[0]}</span>
              </div>
            ) : null}

            {/* Compensation */}
            {hasCompensation && (
              <div className="flex items-center gap-1">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{formatCompensation()}</span>
              </div>
            )}

            {/* Commitment */}
            {opportunity.commitment && (
              <div className="flex items-center gap-1">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="capitalize">
                  {opportunity.commitment.replace("-", " ")}
                </span>
              </div>
            )}
          </div>

          {/* Skills */}
          {opportunity.skills && opportunity.skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {opportunity.skills.slice(0, 5).map((skill, index) => (
                <span
                  key={index}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  {skill.name}
                </span>
              ))}
              {opportunity.skills.length > 5 && (
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  +{opportunity.skills.length - 5} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
