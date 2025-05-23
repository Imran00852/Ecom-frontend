import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";
import {
  AllUsersResponse,
  DeleteUserRequest,
  MessageResponse,
  UserResponse,
} from "../../types/api-types";
import { User } from "../../types/types";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}/api/v1`,
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    login: builder.mutation<MessageResponse, User>({
      query: (user) => ({
        url: "/users/new",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation<MessageResponse, DeleteUserRequest>({
      query: ({ userId, adminUserId }) => ({
        url: `/users/${userId}?id=${adminUserId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    allUsers: builder.query<AllUsersResponse, string>({
      query: (id) => ({
        url: `/users/all?id=${id}`,
      }),
      providesTags: ["User"],
    }),
    getUser: builder.query<UserResponse, string>({
      query: (id) => ({
        url: `/users/${id}`,
      }),
      providesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetUserQuery,
  useDeleteUserMutation,
  useAllUsersQuery,
} = userApi;
