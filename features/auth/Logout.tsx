import { useRouter } from "next/router";
import { Button } from "react-bootstrap";
import { useAppDispatch } from "../../app/hooks";
import { useLogoutMutation } from "./authApiSlice";
import { logout } from "./authSlice";

const Logout = () => {
   const [performLogout] = useLogoutMutation();
   const dispatch = useAppDispatch();
   const router = useRouter();

   const setLogout = async () => {
      await performLogout();
      dispatch(logout());
      router.push("/login");
   };

   return <Button onClick={setLogout}>Logout</Button>;
};

export default Logout;
