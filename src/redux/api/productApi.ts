import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";
import {
  AllProductsResponse,
  AllReviewsResponse,
  CategoriesResponse,
  DeleteProductRequest,
  DeleteReviewRequest,
  MessageResponse,
  NewProductRequest,
  NewReviewRequest,
  ProductDetailsResponse,
  SearchProductsQuery,
  SearchProductsResponse,
  UpdateProductRequest,
} from "../../types/api-types";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}/api/v1`,
  }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    latestProducts: builder.query<AllProductsResponse, string>({
      query: () => ({
        url: "/products/latest",
      }),
      providesTags: ["Product"],
    }),
    allProducts: builder.query<AllProductsResponse, string>({
      query: (id) => ({
        url: `/products/admin-products?id=${id}`,
      }),
      providesTags: ["Product"],
    }),
    categories: builder.query<CategoriesResponse, string>({
      query: () => ({
        url: `/products/categories`,
      }),
      providesTags: ["Product"],
    }),
    searchProducts: builder.query<SearchProductsResponse, SearchProductsQuery>({
      query: ({ price, page, category, sort, search }) => {
        let base = `/products/all?search=${search}&page=${page}`;
        if (price) base += `&price=${price}`;
        if (category) base += `&category=${category}`;
        if (sort) base += `&sort=${sort}`;
        return base;
      },
      providesTags: ["Product"],
    }),
    productDetails: builder.query<ProductDetailsResponse, string>({
      query: (id) => ({
        url: `/products/${id}`,
      }),
      providesTags: ["Product"],
    }),
    newProduct: builder.mutation<MessageResponse, NewProductRequest>({
      query: ({ formData, id }) => ({
        url: `/products/new?id=${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation<MessageResponse, UpdateProductRequest>({
      query: ({ formData, userId, productId }) => ({
        url: `/products/${productId}?id=${userId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation<MessageResponse, DeleteProductRequest>({
      query: ({ userId, productId }) => ({
        url: `/products/${productId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    //product reviews
    allReviewsOfProduct: builder.query<AllReviewsResponse, string>({
      query: (productId) => ({
        url: `/products/review/${productId}`,
      }),
      providesTags: ["Product"],
    }),
    newReview: builder.mutation<MessageResponse, NewReviewRequest>({
      query: ({ userId, productId, comment, rating }) => ({
        url: `/products/review/new/${productId}?id=${userId}`,
        method: "POST",
        body: { comment, rating },
      }),
      invalidatesTags: ["Product"],
    }),
    deleteReview: builder.mutation<MessageResponse, DeleteReviewRequest>({
      query: ({ reviewId, userId }) => ({
        url: `/products/review/${reviewId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useLatestProductsQuery,
  useAllProductsQuery,
  useCategoriesQuery,
  useSearchProductsQuery,
  useNewProductMutation,
  useProductDetailsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useAllReviewsOfProductQuery,
  useNewReviewMutation,
  useDeleteReviewMutation,
} = productApi;
