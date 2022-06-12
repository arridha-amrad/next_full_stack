import { Alert, Button, Form, Spinner } from "react-bootstrap";
import useForm from "../utils/useForm";
import axiosInstance from "../utils/axiosInterceptor";
import { useRouter } from "next/router";
import { useAppContext } from "../context/appContext";
import Link from "next/link";

const Register = () => {
   const { dispatch } = useAppContext();
   const router = useRouter();
   const register = async () => {
      try {
         setIsLoading(true);
         const { data } = await axiosInstance.post("/api/register", state);
         dispatch({ type: "SET_USER", payload: data.user });
         router.push("/");
      } catch (err: any) {
         console.log(err);
         setAlert({
            type: "danger",
            message: err.response.data.message,
         });
      } finally {
         setIsLoading(false);
      }
   };
   const { alert, handleChange, handleSubmit, isLoading, setIsLoading, setAlert, state } = useForm(
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
               {isLoading ? <Spinner animation="border" /> : "Register"}
            </Button>
            <Link href="/login">
               <small>login</small>
            </Link>
         </form>
      </div>
   );
};

export default Register;
