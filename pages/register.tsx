import { Alert, Button, Form } from "react-bootstrap";
import useForm from "../utils/useForm";
import { useRouter } from "next/router";
import Link from "next/link";
import MySpinner from "../components/MySpinner";
import axiosInstance from "../utils/axiosInterceptor";
import { IRegisterDTO } from "./api/register";
import { useMutation } from "react-query";
import { setToken } from "../utils/token";

const Register = () => {
  const router = useRouter();
  const { mutate, isLoading } = useMutation(async (dto: IRegisterDTO) => {
    try {
      const { data } = await axiosInstance.post("/register", dto);
      return data;
    } catch (err: any) {
      throw new Error(err);
    }
  });
  const register = async () => {
    try {
      mutate(state, {
        onSuccess(data) {
          setToken(data.accessToken);
          router.push("/rq/todos");
        },
      });
    } catch (err: any) {
      console.log(err);
    }
  };
  const { alert, handleChange, handleSubmit, setAlert, state } = useForm(
    {
      email: "",
      username: "",
      password: "",
    },
    register
  );
  return (
    <div className="d-flex align-items-center justify-content-center m-3 flex-column">
      {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
      <form onSubmit={handleSubmit}>
        <Form.Floating className="mb-3">
          <Form.Control
            name="email"
            value={state.email}
            onChange={handleChange}
            id="floatingInputCustom"
            type="email"
            placeholder="email"
          />
          <label htmlFor="floatingInputCustom">Email address</label>
        </Form.Floating>

        <Form.Floating className="mb-3">
          <Form.Control
            name="username"
            value={state.username}
            onChange={handleChange}
            placeholder="username"
          />
          <label>Username</label>
        </Form.Floating>
        <Form.Floating className="mb-3">
          <Form.Control
            name="password"
            value={state.password}
            onChange={handleChange}
            type="password"
            placeholder="password"
          />
          <label>Password</label>
        </Form.Floating>
        <Button type="submit" disabled={isLoading} className="w-100">
          {isLoading ? <MySpinner /> : "Register"}
        </Button>
        <Link href="/login">
          <small>login</small>
        </Link>
      </form>
    </div>
  );
};

export default Register;
