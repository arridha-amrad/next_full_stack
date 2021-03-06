import { GetServerSideProps, GetServerSidePropsContext } from "next";

const requireAuthentication = (gssp: GetServerSideProps) => {
  return async (context: GetServerSidePropsContext) => {
    const { req } = context;

    const token = req.cookies.refToken;
    if (!token) {
      // Redirect to login page
      return {
        redirect: {
          destination: "/login",
          state: "login required",
          statusCode: 302,
        },
      };
    }

    return gssp(context);
  };
};

export default requireAuthentication;
