import {BaseQueryApi, BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError} from '@reduxjs/toolkit/query/react'
import {API_URL} from '../config'
import { LoginDto } from '../models/dto/LoginDto'
import Order from '../models/Order'
import { Course } from '../models/Course'
import { Link } from '../models/Link'
import { Role } from '../models/Role'
import { Admin } from '../models/Admin'
import { adminClosed } from '../redux/adminSlice'


const baseQuery: any = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers) => {
      const token = localStorage.getItem("access_token")

      if (token) {
          headers.set("Authorization", `Bearer ${token}`)
      }
  
      return headers
  },
  credentials: "include"
})

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError> 
    = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: {}) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
        const refreshResult = await baseQuery({url: "/admin/refresh", method: 'POST'}, api, extraOptions); 

        if (refreshResult.data) {
            localStorage.setItem("access_token", refreshResult.data.accessToken)
            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(baseApi.util.resetApiState())
            api.dispatch(adminClosed())
            localStorage.removeItem("access_token")
        }
    }

    return result
}

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Orders', 'Courses', 'Links', 'Admins'],
    endpoints: (builder) => ({
        login: builder.mutation<{accessToken: string, admin: any}, LoginDto>({
            query: (data) => ({
                url: '/admin/login',
                method: 'POST',
                body: data
            })
        }),
        register: builder.mutation<void, LoginDto>({
            query: (data) => ({
                url: '/admin/register',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Admins']
        }),
        changePassword: builder.mutation<void, {oldPassword: string, newPassword: string}>({
            query: (data) => ({
                url: '/admin/change-password',
                method: 'POST',
                body: data
            })
        }),
        removeAdmin: builder.mutation<void, number>({
            query: (id) => ({
                url: '/admin/'+id,
                method: 'DELETE'
            }),
            invalidatesTags: ['Admins', 'Links', 'Orders']
        }),
        getAdmins: builder.query<Admin[], void>({
            query: () => "admin",
            providesTags: ['Admins']
        }),
        getAdminOrders: builder.query<Order[], void>({
            query: () => '/orders/admin',
            providesTags: ['Orders']
        }),
        getOrders: builder.query<Order[], void>({
            query: () => '/orders/all',
            providesTags: ['Orders']
        }),
        getLinks: builder.query<Link[], void>({
            query: () => 'links',
            providesTags: ['Links']
        }),
        getAllLinks: builder.query<Link[], void>({
            query: () => 'links/all',
            providesTags: ['Links']
        }),
        generateLink: builder.mutation<{link: string}, { courseId: number, monthsArray: number[] }>({
            query: (data) => ({
                url: '/links',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Links']
        }),
        getCourses: builder.query<Course[], void>({
            query: () => "courses",
            providesTags: ['Courses']
        }),
        addCourse: builder.mutation<Course, Course>({
            query: (data) => ({
                url: "courses",
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Courses']
        }),
        updateCourse: builder.mutation<void, Course>({
            query: (data) => ({
                url: "courses",
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Courses']
        }),
        deleteCourse: builder.mutation<void, number>({
            query: (id) => ({
                url: `courses/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Courses']
        }),
        getRoles: builder.query<Role[], void>({
            query: () => "roles",
        })
    }),
})

export const {useGetOrdersQuery, useDeleteCourseMutation, useChangePasswordMutation, useGetAdminOrdersQuery, useUpdateCourseMutation, useRemoveAdminMutation, useGetAdminsQuery, useGetRolesQuery, useGetAllLinksQuery, useGetLinksQuery, useGetCoursesQuery, useRegisterMutation, useGenerateLinkMutation, useAddCourseMutation, useLoginMutation} = baseApi