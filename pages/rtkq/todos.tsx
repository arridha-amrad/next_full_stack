import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MySpinner from "../../components/MySpinner";
import { useGetUserQuery } from "../../features/auth/authApiSlice";
import Logout from "../../features/auth/Logout";
import AddTodo from "../../features/todo/AddTodo";
import FetchTodos from "../../features/todo/FetchTodos";
import { useGetTodosQuery } from "../../features/todo/todoApiSlice";
import requireAuthentication from "../../utils/requireAuth";

const Todos = () => {
   const [waitUser, setIsWaitUser] = useState(true);
   const { data: user, isFetching, isLoading } = useGetUserQuery();
   const { data: todos = [], isLoading: isLoadingTodos } = useGetTodosQuery(undefined, {
      skip: waitUser,
   });
   const router = useRouter();
   useEffect(() => {
      if (!isFetching && !isLoading && !user) {
         router.replace("/login");
      }
      if (user) {
         setIsWaitUser(false);
      }
   }, [user]);
   return (
      <div className=" d-flex justify-content-center">
         <div
            style={{ width: "500px" }}
            className=" d-flex justify-content-center mt-4 flex-column gap-2"
         >
            <div className=" d-flex justify-content-between align-items-center">
               {isLoading ? (
                  <MySpinner />
               ) : (
                  <Link href="/rtkq/user">
                     <h1>{user?.username}</h1>
                  </Link>
               )}
               <Logout />
            </div>
            <AddTodo />
            {isLoadingTodos ? <MySpinner /> : <FetchTodos todos={todos} />}
         </div>
      </div>
   );
};

export default Todos;

export const getServerSideProps = requireAuthentication(async (_) => {
   return {
      props: {},
   };
});
