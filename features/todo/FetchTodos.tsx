import { Todo } from "@prisma/client";
import { FC } from "react";
import { ListGroup } from "react-bootstrap";
import TodoItem from "../../components/TodoItem";

interface IProps {
   todos: Todo[];
}
const FetchTodos: FC<IProps> = ({ todos }) => {
   return (
      <ListGroup>
         {todos.length === 0 && <p>You have no todo</p>}
         {todos?.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
         ))}
      </ListGroup>
   );
};

export default FetchTodos;
