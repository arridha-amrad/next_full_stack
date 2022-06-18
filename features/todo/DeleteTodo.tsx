import { FC } from "react";
import { Button } from "react-bootstrap";
import { useDeleteTodoMutation } from "./todoApiSlice";

interface IProps {
   todoId: string;
}

const DeleteTodo: FC<IProps> = ({ todoId }) => {
   const [deleteTodoById] = useDeleteTodoMutation();
   const deleteTodo = () => {
      deleteTodoById(todoId);
   };
   return (
      <Button variant="danger" onClick={deleteTodo}>
         Del
      </Button>
   );
};

export default DeleteTodo;
