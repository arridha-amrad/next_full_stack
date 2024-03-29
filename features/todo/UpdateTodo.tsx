import { Todo } from "@prisma/client";
import { FC, useState } from "react";
import { Button, Form, FormControl, Modal } from "react-bootstrap";
import { useSWRConfig } from "swr";
import axiosInstance from "../../utils/axiosInterceptor";
import useForm from "../../utils/useForm";

interface IProps {
   todo: Todo;
}

const UpdateTodo: FC<IProps> = ({ todo }) => {
   const { mutate } = useSWRConfig();
   const [isShow, setIsShow] = useState(false);
   const updateTodo = async () => {
      setIsShow(false);
      await axiosInstance.put(`/todos/${todo.id}`, state);
      mutate("/todos");
   };
   const { handleChange, setState, state } = useForm(
      {
         ...todo,
      },
      updateTodo
   );
   return (
      <>
         <Button variant="success" onClick={() => setIsShow(true)}>
            Edit
         </Button>
         <Modal show={isShow} onHide={() => setIsShow(false)}>
            <Modal.Header closeButton>
               <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body className=" d-flex flex-column gap-2">
               <FormControl
                  name="title"
                  onChange={handleChange}
                  placeholder="Todo title"
                  value={state?.title}
               />
               <div>
                  <Form.Check
                     onChange={(e) =>
                        setState({
                           ...state,
                           isComplete: e.target.checked,
                        })
                     }
                     type="checkbox"
                     label="Is Complete"
                     checked={state.isComplete}
                  />
               </div>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={() => setIsShow(false)}>
                  Close
               </Button>
               <Button variant="primary" onClick={updateTodo}>
                  Update
               </Button>
            </Modal.Footer>
         </Modal>
      </>
   );
};

export default UpdateTodo;
