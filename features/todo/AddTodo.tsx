import { Todo } from "@prisma/client";
import { FormEvent, useState } from "react";
import { Button, FormControl } from "react-bootstrap";
import { useMutation, useQueryClient } from "react-query";
import MySpinner from "../../components/MySpinner";
import axiosInstance from "../../utils/axiosInterceptor";

const AddTodo = () => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");

  const { mutate, isLoading } = useMutation(
    async (title: string) => {
      try {
        const { data } = await axiosInstance.post<{ todo: Todo }>("/todos", { title });
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    {
      onMutate: () => {
        queryClient.cancelQueries("todos");
      },
      onSuccess(data) {
        queryClient.setQueryData<{ todos: Todo[] }>("todos", (old) => {
          return {
            ...old,
            todos: [data!.todo, ...old!.todos],
          };
        });
      },
    }
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutate(title);
  };
  return (
    <form onSubmit={handleSubmit} className="d-flex gap-2">
      <FormControl
        name="title"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        placeholder="Todo Title"
      />
      <Button type="submit">{isLoading ? <MySpinner /> : "Add"}</Button>
    </form>
  );
};

export default AddTodo;
