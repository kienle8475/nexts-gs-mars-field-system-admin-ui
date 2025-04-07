import { axiosApi } from "@/libs/axios";
import { ExtractFnReturnType, QueryConfig } from "@/libs/react-query";
import { IUser } from "@/types/model";
import { useQuery } from "react-query";

type HttpRequestMeVerifyParams = {
  token: any;
};

type VerifyMeResponseData = {
  data: IUser;
};

const httpRequestMeVerify = async (
  params: HttpRequestMeVerifyParams,
): Promise<VerifyMeResponseData> => {
  try {
    const res = await axiosApi.get(`/auth/verify`, {
      headers: {
        Authorization: "Bearer " + params.token,
      },
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

type QueryFnType = typeof httpRequestMeVerify;

type QueryOptions = {
  params: HttpRequestMeVerifyParams;
  config?: QueryConfig<QueryFnType>;
};

const useQueryMeVerify = ({ params, config }: QueryOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    queryKey: ["query/auth/verify", params],
    queryFn: () => httpRequestMeVerify(params),
    retry: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    ...config,
  });
};

export { httpRequestMeVerify, useQueryMeVerify };
export type { VerifyMeResponseData };
