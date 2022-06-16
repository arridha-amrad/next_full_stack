import { useGetUserQuery } from "../../features/auth/authApiSlice";

const User = () => {
  const { data } = useGetUserQuery();
  return <h1>{data?.username}</h1>;
};

export default User;
