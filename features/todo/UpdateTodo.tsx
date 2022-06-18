import { Todo } from "@prisma/client";
import { FC, useState } from "react";
import { Button, Form, FormControl, Modal } from "react-bootstrap";
import MySpinner from "../../components/MySpinner";
import useForm from "../../utils/useForm";
import { useUpdateTodoMutation } from "./todoApiSlice";

interface IProps {
   todo: Todo;
}

const UpdateTodo: FC<IProps> = ({ todo }) => {
   const [isShow, setIsShow] = useState(false);
   const [editTodo, { isLoading }] = useUpdateTodoMutation();
   const updateTodo = async () => {
      await editTodo({
         id: state.id,
         title: state.title,
         isComplete: state.isComplete,
      });
      setIsShow(false);
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
                  {isLoading ? <MySpinner /> : "Update"}
               </Button>
            </Modal.Footer>
         </Modal>
      </>
   );
};

export default UpdateTodo;
