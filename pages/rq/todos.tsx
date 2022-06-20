import axios from "axios";
import Link from "next/link";
import { useQuery } from "react-query";
import MySpinner from "../../components/MySpinner";
import Logout from "../../features/auth/Logout";
import AddTodo from "../../features/todo/AddTodo";
import FetchTodos from "../../features/todo/FetchTodos";
import { IUser } from "../../types";
import axiosInstance from "../../utils/axiosInterceptor";
import requireAuthentication from "../../utils/requireAuth";

const fetchTodos = async () => {
  return axiosInstance
    .get("/todos")
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err);
    });
};

const fetchUser = async () => {
  try {
    const { data } = await axiosInstance.get("/users/me");
    return data;
  } catch (err: any) {
    console.log(err);
    throw new Error(err);
  }
};

const Todos = () => {
  const { data: user, isLoading } = useQuery(["auth"], fetchUser, {
    select: (data) => data.user as IUser,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { data: todos, isLoading: isLoadingTodos } = useQuery(["todos"], fetchTodos, {
    enabled: !!user,
    select: (data) => data.todos,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

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
