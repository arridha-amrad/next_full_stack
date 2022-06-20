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
      {todos
        ?.sort((a, b) => b.id - a.id)
        .map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
    </ListGroup>
  );
};

export default FetchTodos;
