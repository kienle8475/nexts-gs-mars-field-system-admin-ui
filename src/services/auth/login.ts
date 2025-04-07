import { axiosApi } from "@/libs/axios";
import { MutationConfig } from "@/libs/react-query";
import { IUser } from "@/types/model";
import { useMutation } from "react-query";

type HttpRequestAuthLoginParams = {
  username: string;
  password: string;
};

type AuthLoginRequestBody = {
  username: string;
  password: string;
};

type AuthLoginResponseData = {
  data: {
    token: string;
    user: IUser;
  };
};

const httpRequestAuthLogin = async (
  params: HttpRequestAuthLoginParams,
): Promise<AuthLoginResponseData> => {
  const body: AuthLoginRequestBody = {
    username: params.username,
    password: params.password,
  };

  try {
    const res = await axiosApi.post(`/auth/login?context=admin`, body, {
      withCredentials: true,
      timeout: 30000,
    });
    return res;
  } catch (error) {
    throw error;
  }
};

type MutationFnType = typeof httpRequestAuthLogin;

type MutationOptions = {
  config?: MutationConfig<MutationFnType>;
};

const useMutationAuthLogin = ({ config }: MutationOptions = {}) => {
  return useMutation({
    mutationFn: httpRequestAuthLogin,
    ...config,
  });
};

export { httpRequestAuthLogin, useMutationAuthLogin };
export type { AuthLoginResponseData };
