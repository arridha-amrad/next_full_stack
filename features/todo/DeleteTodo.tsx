import { Todo } from "@prisma/client";
import { FC } from "react";
import { Button } from "react-bootstrap";
import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../utils/axiosInterceptor";

interface IProps {
  todoId: string;
}

const DeleteTodo: FC<IProps> = ({ todoId }) => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    async (todoId: string) => {
      await axiosInstance.delete(`/todos/${todoId}`);
    },
    {
      onMutate: () => {
        queryClient.cancelQueries();
      },
      onSuccess: () => {
        queryClient.setQueryData<{ todos: Todo[] }>("todos", (old) => {
          return {
            ...old,
            todos: old!.todos.filter((todo) => todo.id !== parseInt(todoId)),
          };
        });
      },
    }
  );
  const deleteTodo = () => {
    mutate(todoId);
  };
  return (
    <Button variant="danger" onClick={deleteTodo}>
      Del
    </Button>
  );
};

export default DeleteTodo;
