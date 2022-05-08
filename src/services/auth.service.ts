import { httpClient } from "../util/http/api";
import { AxiosResponse } from "axios";
import { SignInData } from "contexts/AuthContext";

const resourceURL: string = "/api/auth";

type AuthResponse = {
  token: string;
  user: Object;
};

export const useAuthService = () => {
  const loginAuthService = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> =
      await httpClient.post<SignInData>(resourceURL, email, password);
    return response.data;
  };

  const userInfoService = async (user: User): Promise<User> => {
    const response: AxiosResponse<User> = await httpClient.post<SignInData>(
      resourceURL,
      user
    );
    return response.data;
  };

  return {
    loginAuthService,
    userInfoService,
  };
};
