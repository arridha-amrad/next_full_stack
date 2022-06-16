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
    router.push("/login");
    await performLogout();
    dispatch(logout());
  };

  return <Button onClick={setLogout}>Logout</Button>;
};

export default Logout;
