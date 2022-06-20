import { useRouter } from "next/router";
import { Button } from "react-bootstrap";
import { useMutation, useQueryClient } from "react-query";
import MySpinner from "../../components/MySpinner";
import axiosInstance from "../../utils/axiosInterceptor";

const Logout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    async () => {
      await axiosInstance.post("/users/logout");
    },
    {
      onMutate: () => {
        queryClient.cancelQueries("todos");
        queryClient.removeQueries("todos");
        queryClient.removeQueries("auth");
      },
    }
  );
  const setLogout = async () => {
    router.push("/login");
    mutate();
  };

  return <Button onClick={setLogout}>{isLoading ? <MySpinner /> : "Logout"}</Button>;
};

export default Logout;
