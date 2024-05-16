import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export function providesList<
  R extends { id: string | number }[],
  T extends string,
>(resultsWithIds: R | undefined, tagType: T) {
  return resultsWithIds
    ? [
        { type: tagType, id: "LIST" },
        ...resultsWithIds.map(({ id }) => ({ type: tagType, id })),
      ]
    : [{ type: tagType, id: "LIST" }];
}

// NOTE: Return TYPE, QueryParam TYPE
export const API = createApi({
  reducerPath: "api",
  refetchOnReconnect: true,
  keepUnusedDataFor: 1200,
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL ?? "http://localhost:10000",
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  tagTypes: ["Tasks"],

  endpoints: () => ({}),
});
