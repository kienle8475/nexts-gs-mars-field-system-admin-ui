import { axiosApi } from "@/libs/axios";
import { MutationConfig } from "@/libs/react-query";
import { useMutation } from "react-query";

type HttpRequestProvinceCreateParams = {
  token: any;
  name: string;
};

type ProvinceCreateRequestBody = {
  name: string;
};

type ProvinceCreateResponseData = {
  data: {
    success: boolean;
  };
};

const httpRequestProvinceCreate = async (
  params: HttpRequestProvinceCreateParams,
): Promise<ProvinceCreateResponseData> => {
  const body: ProvinceCreateRequestBody = {
    name: params.name,
  };

  try {
    const res = await axiosApi.post(`/province/new`, body, {
      headers: {
        Authorization: "Bearer " + params.token,
      },
      withCredentials: true,
      timeout: 30000,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

type MutationFnType = typeof httpRequestProvinceCreate;

type MutationOptions = {
  config?: MutationConfig<MutationFnType>;
};

const useMutationProvinceCreate = ({ config }: MutationOptions = {}) => {
  return useMutation({
    mutationFn: httpRequestProvinceCreate,
    ...config,
  });
};

export { httpRequestProvinceCreate, useMutationProvinceCreate };
export type { ProvinceCreateResponseData };
