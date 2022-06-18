import { FC, TransitionFunction, TransitionStartFunction, useState } from "react";
import { Button } from "react-bootstrap";
import { useSWRConfig } from "swr";
import MySpinner from "../../components/MySpinner";
import axiosInstance from "../../utils/axiosInterceptor";

interface IProps {
   todoId: string;
}

const DeleteTodo: FC<IProps> = ({ todoId }) => {
   const [isLoading, setIsLoading] = useState(false);
   const { mutate } = useSWRConfig();
   const deleteTodo = async () => {
      try {
         setIsLoading(true);
         await axiosInstance.delete(`/todos/${todoId}`);
         mutate("/todos");
      } catch (err) {
         console.log(err);
      } finally {
         setIsLoading(false);
      }
   };
   return (
      <Button variant="danger" onClick={deleteTodo}>
         {isLoading ? <MySpinner /> : "Del"}
      </Button>
   );
};

export default DeleteTodo;
