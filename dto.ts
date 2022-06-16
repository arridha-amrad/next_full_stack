import { IUser } from "./context/IContext";

export interface ILoginResponse {
  user: IUser;
  accessToken: string;
}
