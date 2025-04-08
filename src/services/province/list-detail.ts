import { axiosApi } from "@/libs/axios";
import { ExtractFnReturnType, QueryConfig } from "@/libs/react-query";
import { ProvinceDetails } from "@/types/extend";
import { useQuery } from "react-query";

type HttpRequestProvincesListDetailsParams = {
  token: any;
};

type ProvincesListDetailsResponseData = {
  data: ProvinceDetails[];
};

const httpRequestProvincesListDetails = async (): Promise<ProvincesListDetailsResponseData> => {
  try {
    const res = await axiosSecondApi.get(`/config/province/list-detail`, {
    });
    return res;
  } catch (error) {
    throw error;
  }
};

type QueryFnType = typeof httpRequestProvincesListDetails;

type QueryOptions = {
  params: HttpRequestProvincesListDetailsParams;
  config?: QueryConfig<QueryFnType>;
};

const useQueryProvincesListDetails = ({ params, config }: QueryOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    queryKey: ["query/config/province/list-detail", params],
    queryFn: () => httpRequestProvincesListDetails(),
    retry: true,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    ...config,
  });
};

export { httpRequestProvincesListDetails, useQueryProvincesListDetails };
export type { ProvincesListDetailsResponseData };
