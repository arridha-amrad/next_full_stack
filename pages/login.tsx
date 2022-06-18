import Link from "next/link";
import { useRouter } from "next/router";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import useForm from "../utils/useForm";
import axiosInstance from "../utils/axiosInterceptor";
import { ILoginResponse } from "../dto";
import { setToken } from "../utils/token";
import { useSWRConfig } from "swr";

const Login = () => {
   const { mutate } = useSWRConfig();
   const router = useRouter();
   const loginAction = async () => {
      try {
         setIsLoading(true);
         const { data } = await axiosInstance.post<ILoginResponse>("/login", state);
         setToken(data.accessToken);
         router.push("/swr/todos");
      } catch (err: any) {
         console.log(err);
         setAlert({
            type: "danger",
            message: err.data,
         });
      } finally {
         setIsLoading(true);
      }
   };
   const { alert, handleChange, handleSubmit, setAlert, state, isLoading, setIsLoading } = useForm(
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
