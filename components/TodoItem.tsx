import { Todo } from "@prisma/client";
import Link from "next/link";
import { FC } from "react";
import { ListGroupItem } from "react-bootstrap";
import DeleteTodo from "../features/todo/DeleteTodo";
import UpdateTodo from "../features/todo/UpdateTodo";

interface IProps {
   todo: Todo;
}

const TodoItem: FC<IProps> = ({ todo }) => {
   return (
      <ListGroupItem key={todo.id} className="d-flex">
         <div className="d-flex flex-column flex-grow-1">
            <Link href={`/rtkq/${todo.id}`}>
               <div>{todo.title}</div>
            </Link>
            <div>isComplete ? {todo.isComplete ? "Yes" : "No"}</div>
         </div>
         <div className="d-flex gap-2">
            <UpdateTodo todo={todo} />
            <DeleteTodo todoId={todo.id.toString()} />
         </div>
      </ListGroupItem>
   );
};

export default TodoItem;
