import { useRouter } from "next/router";
import { Button } from "react-bootstrap";
import { useSWRConfig } from "swr";
import axiosInstance from "../../utils/axiosInterceptor";

const Logout = () => {
   const { cache } = useSWRConfig();
   const router = useRouter();

   const setLogout = async () => {
      await axiosInstance.get("/users/logout");
      cache.delete("/todos");
      cache.delete("/users/me");
      router.push("/login");
   };

   return <Button onClick={setLogout}>Logout</Button>;
};

export default Logout;
