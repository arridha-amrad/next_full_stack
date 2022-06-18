import Link from "next/link";
import { useRouter } from "next/router";
import { ListGroupItem } from "react-bootstrap";
import { useGetTodoByIdQuery } from "../../features/todo/todoApiSlice";

const TodoDetail = () => {
   const router = useRouter();
   const id = router.query.id as string | undefined;
   const { data } = useGetTodoByIdQuery(id!, {
      skip: typeof id === "undefined",
   });
   return (
      <div>
         <Link href={"/rtkq/todos"}>
            <h1>Todos</h1>
         </Link>
         <div className=" d-flex justify-content-center mt-4">
            <ListGroupItem>
               <div>id : {data?.id}</div>
               <div>title : {data?.title}</div>
               <div>isComplete : {data?.isComplete ? "Complete" : "Not Complete"}</div>
            </ListGroupItem>
         </div>
      </div>
   );
};

export default TodoDetail;
