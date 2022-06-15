import Link from "next/link";
import { useRouter } from "next/router";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import useForm from "../utils/useForm";
import { useLoginMutation } from "../app/authApiSlice";
import { setToken } from "../features/authSlice";
import { useAppDispatch } from "../app/hooks";

const Login = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const loginAction = async () => {
    try {
      const data = await login(state).unwrap();
      if (data.accessToken) {
        dispatch(setToken({ accessToken: data.accessToken }));
        router.push("/rtkq/todos");
      }
    } catch (err: any) {
      console.log(err);
      setAlert({
        type: "danger",
        message: err.response.data,
      });
    }
  };
  const { alert, handleChange, handleSubmit, setAlert, setIsLoading, state } =
    useForm(
      {
        identity: "",
        password: "",
      },
      loginAction
    );
  return (
    <div className="d-flex align-items-center justify-content-center m-3 flex-column">
      {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
      <form onSubmit={handleSubmit}>
        <Form.Floating className="mb-3">
          <Form.Control
            name="identity"
            value={state.identity}
            onChange={handleChange}
            placeholder="identity"
          />
          <label>Username</label>
        </Form.Floating>
        <Form.Floating className="mb-3">
          <Form.Control
            name="password"
            value={state.password}
            onChange={handleChange}
            type="password"
            placeholder="p assword"
          />
          <label>Password</label>
        </Form.Floating>
        <Button type="submit" disabled={isLoading} className="w-100">
          {isLoading ? <Spinner animation="border" /> : "Login"}
        </Button>
        <Link href="/register">
          <small>Register</small>
        </Link>
      </form>
    </div>
  );
};

export default Login;
