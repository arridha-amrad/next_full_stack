import { Todo } from "@prisma/client";
import { FormEvent, useState } from "react";
import { Button, FormControl } from "react-bootstrap";
import { useSWRConfig } from "swr";
import MySpinner from "../../components/MySpinner";
import axiosInstance from "../../utils/axiosInterceptor";

const AddTodo = () => {
   const [title, setTitle] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const { mutate } = useSWRConfig();
   const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      try {
         mutate("/todos", async (data: { todos: Todo[] }) => {
            const { data: result } = await axiosInstance.post("/todos", { title });
            data.todos.push(result.todo);
            return data;
         });
      } catch (err) {
         console.log(err);
      } finally {
         setIsLoading(false);
      }
   };
   return (
      <form onSubmit={handleSubmit} className="d-flex gap-2">
         <FormControl
            name="title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            placeholder="Todo Title"
         />
         <Button type="submit">{isLoading ? <MySpinner /> : "Submit"}</Button>
      </form>
   );
};

export default AddTodo;
