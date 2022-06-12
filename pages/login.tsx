import Link from "next/link";
import { useRouter } from "next/router";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { useAppContext } from "../context/appContext";
import axiosInstance from "../utils/axiosInterceptor";
import useForm from "../utils/useForm";

const Login = () => {
   const { dispatch } = useAppContext();
   const router = useRouter();
   const login = async () => {
      try {
         setIsLoading(true);
         const { data } = await axiosInstance.post("/api/login", state);
         dispatch({ type: "SET_USER", payload: data.user });
         router.push("/");
      } catch (err: any) {
         console.log(err);
         setAlert({
            type: "danger",
            message: err.response.data,
         });
      } finally {
         setIsLoading(false);
      }
   };
   const { alert, handleChange, handleSubmit, isLoading, setAlert, setIsLoading, state } = useForm(
      {
         identity: "",
         password: "",
      },
      login
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
                  placeholder="password"
               />
               <label>Password</label>
            </Form.Floating>
            <Button type="submit" disabled={isLoading} className="w-100">
               {isLoading ? <Spinner animation="border" /> : "Register"}
            </Button>
            <Link href="/register">
               <small>Register</small>
            </Link>
         </form>
      </div>
   );
};

export default Login;
