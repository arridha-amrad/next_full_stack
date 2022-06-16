import Link from "next/link";
import { useGetUserQuery } from "../../features/auth/authApiSlice";
import Logout from "../../features/auth/Logout";
import AddTodo from "../../features/todo/AddTodo";
import FetchTodos from "../../features/todo/FetchTodos";
import requireAuthentication from "../../utils/requireAuth";

const Todos = () => {
  const { data: user } = useGetUserQuery();
  return (
    <>
      <div className=" d-flex justify-content-center">
        <div
          style={{ width: "500px" }}
          className=" d-flex justify-content-center mt-4 flex-column gap-2"
        >
          <div className=" d-flex justify-content-between align-items-center">
            <Link href="/rtkq/user">
              <h1>{user?.username}</h1>
            </Link>
            <Logout />
          </div>
          <AddTodo />
          <FetchTodos />
        </div>
      </div>
    </>
  );
};

export default Todos;

export const getServerSideProps = requireAuthentication(async (context) => {
  return {
    props: {},
  };
});
