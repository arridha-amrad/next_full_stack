import { FC } from "react";
import { Container, Navbar } from "react-bootstrap";
import { IUser } from "../context/IContext";
import axiosInstance, {
  getAccTokenAfterRefresh,
  getRefTokenAfterRefresh,
  setRefToken,
  setToken,
} from "../utils/axiosInterceptor";
import { accTokenCookieSetter, refTokenCookieSetter } from "../utils/cookieSetter";
import requireAuthentication from "../utils/requireAuth";

interface Props {
  user: IUser;
  refToken: string;
}

const Home: FC<Props> = ({ user }) => {
  return (
    <div>
      <Navbar bg="light">
        <Container>
          <Navbar.Brand href="#home">{user.username}</Navbar.Brand>
        </Container>
      </Navbar>
    </div>
  );
};

export default Home;

export const getServerSideProps = requireAuthentication(async (context) => {
  const { req, res } = context;
  const { accToken, refToken } = req.cookies;
  setToken(accToken);
  setRefToken(refToken);

  const { data } = await axiosInstance.get("/api/users/me");

  if (getRefTokenAfterRefresh() !== "") {
    const accTokenCookie = accTokenCookieSetter(getAccTokenAfterRefresh());
    const refTokenCookie = refTokenCookieSetter(getRefTokenAfterRefresh());
    res.setHeader("Set-Cookie", [accTokenCookie, refTokenCookie]);
  }
  return {
    props: {
      user: data.user,
    },
  };
});
