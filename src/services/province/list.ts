import { axiosApi } from "@/libs/axios";
import { ExtractFnReturnType, QueryConfig } from "@/libs/react-query";
import { IProvince } from "@/types/model";
import { useQuery } from "react-query";

type HttpRequestProvincesListParams = {
  token: any;
};

type ProvincesListResponseData = {
  data: IProvince[];
};

const httpRequestProvincesList = async (
  params: HttpRequestProvincesListParams,
): Promise<ProvincesListResponseData> => {
  try {
    const res = await axiosApi.get(`/province/list`, {
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

type QueryFnType = typeof httpRequestProvincesList;

type QueryOptions = {
  params: HttpRequestProvincesListParams;
  config?: QueryConfig<QueryFnType>;
};

const useQueryProvincesList = ({ params, config }: QueryOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    queryKey: ["query/province/list", params],
    queryFn: () => httpRequestProvincesList(params),
    retry: true,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    ...config,
  });
};

export { httpRequestProvincesList, useQueryProvincesList };
export type { ProvincesListResponseData };
