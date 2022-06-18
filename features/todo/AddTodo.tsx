import { FormEvent, useState } from "react";
import { Button, FormControl } from "react-bootstrap";
import MySpinner from "../../components/MySpinner";
import { useCreateTodoMutation } from "./todoApiSlice";

const AddTodo = () => {
   const [title, setTitle] = useState("");
   const [createTodo, { isLoading }] = useCreateTodoMutation();
   const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      createTodo(title);
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
