import { Todo } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const todoApi = createApi({
  reducerPath: "todoAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/",
  }),
  tagTypes: ["Todos", "Todo"],
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], void>({
      query: () => "todos",
      transformResponse: (response: { todos: Todo[] }, meta, arg) =>
        response.todos,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Todos", id } as const)),
              { type: "Todos", id: "LIST" },
            ]
          : [{ type: "Todos", id: "LIST" }],
    }),
    getTodoById: builder.query<Todo, string>({
      query: (id: string) => `todos/${id}`,
      transformResponse: (response: { todo: Todo }, meta, arg) => response.todo,
      providesTags: ["Todo"],
    }),
    createTodo: builder.mutation<Todo, string>({
      query: (title: string) => ({
        url: "todos",
        method: "POST",
        body: {
          title,
        },
      }),
      transformResponse: (response: { todo: Todo }) => response.todo,
      // invalidatesTags: [{ type: "Todos", id: "LIST" }],
      async onQueryStarted(title, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            todoApi.util.updateQueryData("getTodos", undefined, (todos) => {
              todos.push(data);
            })
          );
        } catch {}
      },
    }),
    deleteTodo: builder.mutation<Todo, string>({
      query: (id: string) => ({
        url: `todos/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: { todo: Todo }) => response.todo,
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const result = dispatch(
          todoApi.util.updateQueryData("getTodos", undefined, (todos) => {
            return todos.filter((todo) => todo.id !== Number(id));
          })
        );
        try {
          await queryFulfilled;
        } catch (err) {
          result.undo();
        }
      },
      // invalidatesTags: (result, error, id) => [{ type: "Todos", id: "LIST" }],
    }),
    updateTodo: builder.mutation<Todo, Pick<Todo, "id"> & Partial<Todo>>({
      query: ({ id, ...patch }) => ({
        url: `todos/${id}`,
        method: "PUT",
        body: patch,
      }),
      transformResponse: (response: { todo: Todo }) => response.todo,
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        console.log("======patch : ", patch);
        try {
          const { data } = await queryFulfilled;
          dispatch(
            todoApi.util.updateQueryData("getTodos", undefined, (todos) => {
              const index = todos.findIndex((todo) => todo.id === id);
              todos[index] = data;
              return todos;
            })
          );
        } catch {}
      },
    }),
  }),
});

export const {
  useGetTodosQuery,
  useGetTodoByIdQuery,
  useCreateTodoMutation,
  useDeleteTodoMutation,
  useUpdateTodoMutation,
} = todoApi;
