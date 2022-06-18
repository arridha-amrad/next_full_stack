import { useRouter } from "next/router";
import { Button } from "react-bootstrap";

const Home = () => {
   const router = useRouter();
   return (
      <div className="d-flex justify-content-center mt-5">
         <Button onClick={() => router.push("/rtkq/todos")}>RTK Query App</Button>
      </div>
   );
};

export default Home;
