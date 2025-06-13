import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";
import {
  AllCouponsResponse,
  BarResponse,
  DeleteCouponRequest,
  LineResponse,
  NewCouponRequest,
  NewCouponResponse,
  PieResponse,
  SingleCouponRequest,
  SingleCouponResponse,
  StatsResponse,
  UpdateCouponRequest,
  UpdateCouponResponse,
} from "../../types/api-types";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}/api/v1`,
  }),
  tagTypes: ["Coupon"],

  endpoints: (builder) => ({
    newCoupon: builder.mutation<NewCouponResponse, NewCouponRequest>({
      query: ({ id, code, amount }) => ({
        url: `/payment/coupon/new?id=${id}`,
        method: "POST",
        body: { code, amount },
      }),
      invalidatesTags: ["Coupon"],
    }),
    updateCoupon: builder.mutation<UpdateCouponResponse, UpdateCouponRequest>({
      query: ({ couponId, adminId, code, amount }) => ({
        url: `/payment/coupon/${couponId}?id=${adminId}`,
        method: "PUT",
        body: { code, amount },
      }),
      invalidatesTags: ["Coupon"],
    }),
    deleteCoupon: builder.mutation<UpdateCouponResponse, DeleteCouponRequest>({
      query: ({ couponId, adminId }) => ({
        url: `/payment/coupon/${couponId}?id=${adminId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Coupon"],
    }),
    getSingleCoupon: builder.query<SingleCouponResponse, SingleCouponRequest>({
      query: ({ adminId, couponId }) => ({
        url: `/payment/coupon/${couponId}?id=${adminId}`,
      }),
      providesTags: ["Coupon"],
    }),
    getAllCoupons: builder.query<AllCouponsResponse, string>({
      query: (id) => ({
        url: `/payment/coupon/all?id=${id}`,
      }),
      providesTags: ["Coupon"],
    }),
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

export const {
  useStatsQuery,
  usePieQuery,
  useBarQuery,
  useLineQuery,
  useGetAllCouponsQuery,
  useGetSingleCouponQuery,
  useNewCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = dashboardApi;
