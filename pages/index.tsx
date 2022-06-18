import { useRouter } from "next/router";
import { Button } from "react-bootstrap";

const Home = () => {
   const router = useRouter();
   return (
      <div className="d-flex justify-content-center mt-5 gap-2 flex-column">
         <Button onClick={() => router.push("/rtkq/todos")}>RTK Query App</Button>
         <Button onClick={() => router.push("/swr/todos")}>SWR with Context App</Button>
      </div>
   );
};

export default Home;
