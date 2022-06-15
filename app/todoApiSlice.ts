import { Todo } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const todoApi = createApi({
  reducerPath: "todoAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/",
  }),
  tagTypes: ["Todos"],
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], void>({
      query: () => "todos",
      transformResponse: (response: { todos: Todo[] }, meta, arg) =>
        response.todos,
      providesTags: (result) =>
        // is result available?
        result
          ? // successful query
            [
              ...result.map(({ id }) => ({ type: "Todos", id } as const)),
              { type: "Todos", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Todos', id: 'LIST' }` is invalidated
            [{ type: "Todos", id: "LIST" }],
    }),
    getTodoById: builder.query<Todo, string>({
      query: (id: string) => `todos/${id}`,
      transformResponse: (response: { todo: Todo }, meta, arg) => response.todo,
    }),
    createTodo: builder.mutation<Todo, string>({
      query: (title: string) => ({
        url: "todos",
        method: "POST",
        body: {
          title,
        },
      }),
      invalidatesTags: [{ type: "Todos", id: "LIST" }],
    }),
    deletePost: builder.mutation<boolean, string>({
      query: (id: string) => ({
        url: `todos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Todos", id }],
    }),
    updatePost: builder.mutation<void, Pick<Todo, "id"> & Partial<Todo>>({
      query: ({ id, ...patch }) => ({
        url: `todos/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Todos", id }],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useGetTodoByIdQuery,
  useCreateTodoMutation,
  useDeletePostMutation,
  useUpdatePostMutation,
} = todoApi;
