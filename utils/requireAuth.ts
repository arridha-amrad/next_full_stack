import { GetServerSideProps, GetServerSidePropsContext } from "next";

const requireAuthentication = (gssp: GetServerSideProps) => {
  return async (context: GetServerSidePropsContext) => {
    const { req } = context;
    console.log("===============req auth curr ref token : ", req.cookies.refToken);

    const token = req.cookies.refToken;
    if (!token) {
      // Redirect to login page
      return {
        redirect: {
          destination: "/login",
          statusCode: 302,
        },
      };
    }

    return gssp(context);
  };
};

export default requireAuthentication;
