import { FC, useEffect } from "react";
import { Container, Navbar } from "react-bootstrap";
import { IUser } from "../context/IContext";
import axiosInstance, { setRefToken } from "../utils/axiosInterceptor";
import fetcherSSR from "../utils/fetcherSSR";
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
   setRefToken(req.cookies.refToken);
   // const result = await fetcherSSR<IUser>(req, res, "/api/users/me");
   const { data } = await axiosInstance.get("/api/users/me", {
      headers: {
         cookie: req.cookies.accToken,
      },
   });
   return {
      props: {
         user: data.user,
      },
   };
});
