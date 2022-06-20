import Link from "next/link";
import { useRouter } from "next/router";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import useForm from "../utils/useForm";
import { useMutation } from "react-query";
import { ILoginDTO } from "./api/login";
import axiosInstance from "../utils/axiosInterceptor";
import { setToken } from "../utils/token";

const Login = () => {
  const router = useRouter();
  const { mutate, isLoading } = useMutation(async (dto: ILoginDTO) => {
    try {
      const { data } = await axiosInstance.post("/login", dto);
      return data;
    } catch (err: any) {
      throw new Error(err);
    }
  });
  const loginAction = async () => {
    try {
      mutate(state, {
        onSuccess(data) {
          setToken(data.accessToken);
          router.push("/rq/todos");
        },
      });
    } catch (err: any) {
      console.log(err);
      setAlert({
        type: "danger",
        message: err.data,
      });
    }
  };
  const { alert, handleChange, handleSubmit, setAlert, state } = useForm(
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
