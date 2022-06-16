import { ChangeEvent, FormEvent, useState } from "react";
import { IAlert } from "../types";

const useForm = <T>(initialState: T, submitAction: () => Promise<void>) => {
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<IAlert | null>(null);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submitAction();
  };
  return {
    state,
    setState,
    isLoading,
    setIsLoading,
    handleChange,
    handleSubmit,
    alert,
    setAlert,
  };
};

export default useForm;
