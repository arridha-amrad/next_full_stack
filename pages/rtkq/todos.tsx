import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import {
  Button,
  Form,
  FormControl,
  ListGroup,
  ListGroupItem,
  Modal,
} from "react-bootstrap";
import {
  useGetUserQuery,
  useLogoutMutation,
  userApi,
} from "../../app/authApiSlice";
import { useAppDispatch } from "../../app/hooks";
import {
  todoApi,
  useCreateTodoMutation,
  useDeletePostMutation,
  useGetTodosQuery,
  useUpdatePostMutation,
} from "../../app/todoApiSlice";
import MySpinner from "../../components/MySpinner";
import { logout } from "../../features/authSlice";
import requireAuthentication from "../../utils/requireAuth";

const Todos = () => {
  const { data, isLoading } = useGetTodosQuery();
  const { data: user } = useGetUserQuery();
  const [isShow, setIsShow] = useState(false);
  const [selectTodoTitle, setSelectTodoTitle] = useState("");
  const [selectTodoId, setSelectTodoId] = useState(0);
  const [selectTodoComplete, setSelectTodoComplete] = useState(false);

  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();

  const [performLogout] = useLogoutMutation();

  const dispatch = useAppDispatch();

  const router = useRouter();

  if (isLoading) {
    return <MySpinner />;
  }

  const update = () => {
    updatePost({
      id: selectTodoId,
      title: selectTodoTitle,
      isComplete: selectTodoComplete,
    });
    setIsShow(false);
  };

  const setLogout = async () => {
    router.push("/login");
    await performLogout();
    dispatch(userApi.util.resetApiState());
    dispatch(todoApi.util.resetApiState());
    dispatch(logout());
  };

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
            <Button onClick={setLogout}>Logout</Button>
          </div>
          <TodoForm />
          <ListGroup>
            {data?.map((todo) => (
              <ListGroupItem key={todo.id} className="d-flex">
                <div className="d-flex flex-column flex-grow-1">
                  <Link href={`/rtkq/${todo.id}`}>
                    <div>{todo.title}</div>
                  </Link>
                  <div>isComplete ? {todo.isComplete ? "Yes" : "No"}</div>
                </div>
                <Button
                  onClick={() => {
                    setIsShow(true);
                    setSelectTodoId(todo.id);
                    setSelectTodoTitle(todo.title);
                    setSelectTodoComplete(todo.isComplete);
                  }}
                >
                  {isUpdating || isLoading ? <MySpinner /> : "Update"}
                </Button>
                <Button
                  onClick={() => deletePost(todo.id.toString())}
                  variant="danger"
                >
                  {isDeleting ? <MySpinner /> : "Del"}
                </Button>
              </ListGroupItem>
            ))}
          </ListGroup>
        </div>
      </div>
      <Modal show={isShow} onHide={() => setIsShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body className=" d-flex flex-column gap-2">
          <FormControl
            name="selectTodoTitle"
            onChange={(e) => setSelectTodoTitle(e.target.value)}
            placeholder="Todo title"
            value={selectTodoTitle}
          />
          <div>
            <Form.Check
              onChange={(e) => setSelectTodoComplete((prev) => !prev)}
              type="checkbox"
              label="Is Complete"
              checked={selectTodoComplete}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={update}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Todos;

const TodoForm = () => {
  const [title, setTitle] = useState("");
  const [createTodo, { isLoading }] = useCreateTodoMutation();
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createTodo(title);
  };
  return (
    <form onSubmit={handleSubmit} className="d-flex gap-2">
      <FormControl
        name="title"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        placeholder="Todo Title"
      />
      <Button type="submit">{isLoading ? "Loading..." : "Submit"}</Button>
    </form>
  );
};

export const getServerSideProps = requireAuthentication(async (context) => {
  return {
    props: {},
  };
});
