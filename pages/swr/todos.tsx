import { Todo } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import MySpinner from "../../components/MySpinner";
import Logout from "../../features/auth/Logout";
import AddTodo from "../../features/todo/AddTodo";
import FetchTodos from "../../features/todo/FetchTodos";
import { fetcher } from "../../utils/fetcher";
import requireAuthentication from "../../utils/requireAuth";
import { IMeResponse } from "../api/users/me";

const Todos = () => {
   const [isLoading, setIsLoading] = useState(false);
   const [isLoadingTodos, setIsLoadingTodos] = useState(false);
   const { data, error } = useSWR<IMeResponse>("/users/me", fetcher, {
      revalidateOnFocus: false,
      revalidateIfStale: false,
   });

   const { data: result, error: todosError } = useSWR<{ todos: Todo[] }>(
      data?.user ? "/todos" : null,
      fetcher
   );

   const router = useRouter();

   useEffect(() => {
      if (!data && !error) {
         setIsLoading(true);
      }
      if (data || error) {
         setIsLoading(false);
      }
   }, [data, error]);

   useEffect(() => {
      if (result?.todos.length === 0 && !error) {
         setIsLoadingTodos(true);
      }
      if (result?.todos.length! >= 0 || todosError) {
         setIsLoadingTodos(false);
      }
   }, [result, todosError]);

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
                  <Link href="/swr/user">
                     <h1>{data?.user.username}</h1>
                  </Link>
               )}
               <Logout />
            </div>
            <AddTodo />
            {isLoadingTodos ? <MySpinner /> : <FetchTodos todos={result?.todos ?? []} />}
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
