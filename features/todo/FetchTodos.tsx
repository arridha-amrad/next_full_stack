import { ListGroup } from "react-bootstrap";
import TodoItem from "../../components/TodoItem";
import { useGetTodosQuery } from "./todoApiSlice";

const FetchTodos = () => {
  const { data } = useGetTodosQuery();
  return (
    <ListGroup>
      {data?.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ListGroup>
  );
};

export default FetchTodos;
