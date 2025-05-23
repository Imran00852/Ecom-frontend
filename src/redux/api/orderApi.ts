import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";
import {
  AllOrdersResponse,
  MessageResponse,
  NewOrderRequest,
  OrderDetailsResponse,
  UpdateOrderRequest,
} from "../../types/api-types";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}/api/v1`,
  }),
  tagTypes: ["Orders"],
  endpoints: (builder) => ({

    newOrder: builder.mutation<MessageResponse, NewOrderRequest>({
      query: (order) => ({
        url: "/orders/new",
        method: "POST",
        body: order,
      }),
      invalidatesTags: ["Orders"],
    }),

    updateOrder: builder.mutation<MessageResponse, UpdateOrderRequest>({
      query: ({ userId, orderId }) => ({
        url: `/orders/${orderId}?id=${userId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Orders"],
    }),

    deleteOrder: builder.mutation<MessageResponse, UpdateOrderRequest>({
      query: ({ userId, orderId }) => ({
        url: `/orders/${orderId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orders"],
    }),

    myOrder: builder.query<AllOrdersResponse, string>({
      query: (id) => ({
        url: `/orders/my?id=${id}`,
      }),
      providesTags: ["Orders"],
    }),

    allOrders: builder.query<AllOrdersResponse, string>({
      query: (id) => ({
        url: `/orders/all?id=${id}`,
      }),
      providesTags: ["Orders"],
    }),

    orderDetails: builder.query<OrderDetailsResponse, string>({
      query: (id) => ({
        url: `/orders/${id}`,
      }),
      providesTags: ["Orders"],
    }),
    
  }),
});

export const {
  useNewOrderMutation,
  useMyOrderQuery,
  useAllOrdersQuery,
  useOrderDetailsQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderApi;
