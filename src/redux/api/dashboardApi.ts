import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";
import {
  BarResponse,
  LineResponse,
  PieResponse,
  StatsResponse,
} from "../../types/api-types";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}/api/v1`,
  }),

  endpoints: (builder) => ({
    stats: builder.query<StatsResponse, string>({
      query: (id) => ({
        url: `/dashboard/stats?id=${id}`,
      }),
      keepUnusedDataFor: 0,
    }),
    pie: builder.query<PieResponse, string>({
      query: (id) => ({
        url: `/dashboard/pie?id=${id}`,
      }),
      keepUnusedDataFor: 0,
    }),
    bar: builder.query<BarResponse, string>({
      query: (id) => ({
        url: `/dashboard/bar?id=${id}`,
      }),
      keepUnusedDataFor: 0,
    }),
    line: builder.query<LineResponse, string>({
      query: (id) => ({
        url: `/dashboard/line?id=${id}`,
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useStatsQuery, usePieQuery, useBarQuery, useLineQuery } =
  dashboardApi;
