import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { Container, Navbar } from "react-bootstrap";
import useSWR from "swr";
import MySpinner from "../components/MySpinner";
import { IUser } from "../context/IContext";
import axiosInstance, {
  getAccTokenAfterRefresh,
  getRefTokenAfterRefresh,
  setRefToken,
  setToken,
} from "../utils/axiosInterceptor";
import { accTokenCookieSetter, refTokenCookieSetter } from "../utils/cookieSetter";
import requireAuthentication from "../utils/requireAuth";
import Login from "./login";

interface Props {
  user: IUser;
  refToken: string;
}

const fetcher = (url: string) => {
  axiosInstance
    .get(url)
    .then(({ data }) => data)
    .catch((err) => console.log(err));
};

const Home = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  // const { data, error } = useSWR("/api/users/me", fetcher, { suspense: true });
  // console.log("data of swr : ", data);

  // const fetchUser = async (signal: AbortSignal) => {
  //   try {
  //     const { data } = await axiosInstance.get("/api/users/me", { signal });
  //     setUser(data.user);
  //   } catch (err: any) {
  //     console.log(err.response);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   const controller = new AbortController();
  //   fetchUser(controller.signal);
  //   return () => {
  //     controller.abort();
  //   };
  // }, []);
  // if (loading) {
  //   return <MySpinner />;
  // }
  // if (!loading && !user) {
  //   return <Login />;
  // }
  return user ? (
    <div>
      <Navbar bg="light">
        <Container>
          <Navbar.Brand href="#home">{user.username}</Navbar.Brand>
        </Container>
      </Navbar>
    </div>
  ) : (
    <p>no user</p>
  );
};

export default Home;

// export const getServerSideProps = requireAuthentication(async (context) => {
//   const { req, res } = context;
//   const { accToken, refToken } = req.cookies;
//   setToken(accToken);
//   setRefToken(refToken);

//   // const { data } = await axiosInstance.get("/api/users/me");

//   // if (getRefTokenAfterRefresh() !== "") {
//   //   const accTokenCookie = accTokenCookieSetter(getAccTokenAfterRefresh());
//   //   const refTokenCookie = refTokenCookieSetter(getRefTokenAfterRefresh());
//   //   res.setHeader("Set-Cookie", [accTokenCookie, refTokenCookie]);
//   // }
//   return {
//     props: {},
//   };
// });
